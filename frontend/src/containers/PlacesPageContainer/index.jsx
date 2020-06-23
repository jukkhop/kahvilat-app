/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */

import { getDistance } from 'geolib'
import get from 'lodash.get'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLazyQuery } from '@apollo/react-hooks'
import PlacesPage from '../../components/PlacesPage'
import {
  buildPath,
  FIND_ADDRESS,
  FIND_COORDINATES,
  SEARCH_PLACES,
  SEARCH_MORE_PLACES,
} from '../../graphql'
import { sleep } from '../../utils'

function PlacesPageContainer() {
  const { errors, getValues, handleSubmit, register } = useForm()
  const [userCoords, setUserCoords] = useState(null)
  const [prevAddress, setPrevAddress] = useState(null)
  const [findAddress, findAddressData] = useLazyQuery(FIND_ADDRESS)
  const [findCoordinates, findCoordinatesData] = useLazyQuery(FIND_COORDINATES)
  const [searchPlaces, searchPlacesData] = useLazyQuery(SEARCH_PLACES)

  const foundAddress = get(
    findAddressData,
    'data.findAddress.addresses[0].address',
  )
  const foundCoords = get(
    findCoordinatesData,
    'data.findCoordinates.addresses[0].geometry.location',
  )
  const places = get(searchPlacesData, 'data.searchPlaces.places', [])
  const cursor = get(searchPlacesData, 'data.searchPlaces.cursor')

  const loading =
    searchPlacesData.loading ||
    findCoordinatesData.loading ||
    findAddressData.loading

  const error =
    searchPlacesData.error || findCoordinatesData.error || findAddressData.error

  const { fetchMore } = searchPlacesData

  const onFindCoordinates = ({ address }) => {
    if (prevAddress === address) return
    const options = {
      variables: {
        address,
        pathFunction: buildPath('/find-coordinates'),
      },
    }
    setUserCoords(null)
    setPrevAddress(address)
    findCoordinates(options)
  }

  const onSearchPlaces = ({ longitude, latitude, distance }) => {
    if (!userCoords) return
    const options = {
      variables: {
        location: [latitude.toString(), longitude.toString()].join(','),
        pathFunction: buildPath('/search-places'),
        radius: distance,
        type: 'cafe',
      },
    }
    searchPlaces(options)
  }

  const onSearchMorePlaces = async () => {
    if (!cursor) return Promise.resolve()
    await sleep(2000)
    return fetchMore({
      query: SEARCH_MORE_PLACES,
      variables: {
        cursor,
        pathFunction: buildPath('/search-places'),
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const previousEntry = previousResult.searchPlaces
        const {
          cursor: newCursor,
          places: newPlaces,
        } = fetchMoreResult.searchMorePlaces
        return {
          searchPlaces: {
            cursor: newCursor,
            places: [...newPlaces, ...previousEntry.places],
            __typename: previousEntry.__typename,
          },
        }
      },
    })
  }

  const memoizedOnSearchPlaces = useCallback(onSearchPlaces, [userCoords])
  const memoizedOnSearchMorePlaces = useCallback(onSearchMorePlaces, [cursor])

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      const options = {
        variables: {
          latitude,
          longitude,
          pathFunction: buildPath('/find-address'),
        },
      }
      setUserCoords({ latitude, longitude })
      findAddress(options)
    })
  }, [findAddress])

  useEffect(() => {
    if (foundCoords) {
      setUserCoords({ latitude: foundCoords.lat, longitude: foundCoords.lng })
    }
  }, [foundCoords])

  useEffect(() => {
    if (!userCoords) return
    const { distance } = getValues()
    memoizedOnSearchPlaces({
      distance,
      latitude: userCoords.latitude,
      longitude: userCoords.longitude,
    })
  }, [getValues, userCoords, memoizedOnSearchPlaces])

  useEffect(() => {
    memoizedOnSearchMorePlaces()
  }, [cursor, memoizedOnSearchMorePlaces])

  const sortedPlaces = places
    .filter(place => place.businessStatus === 'OPERATIONAL')
    .map(userCoords ? mapPlace(userCoords) : x => x)
    .sort(sortPlaces)

  return (
    <PlacesPage
      address={foundAddress}
      coords={userCoords}
      inputErrors={errors}
      loading={loading}
      onSearch={handleSubmit(onFindCoordinates)}
      places={sortedPlaces}
      register={register}
      searchError={error}
    />
  )
}

function mapPlace({ latitude, longitude }) {
  return function _(place) {
    const {
      geometry: {
        location: { lat, lng },
      },
      openingHours,
      ...rest
    } = place

    const { openNow } = openingHours || {}

    const distance = getDistance(
      { latitude, longitude },
      { latitude: lat, longitude: lng },
      100,
    )

    return {
      distance,
      lat,
      lng,
      openNow,
      ...rest,
    }
  }
}

function sortPlaces(a, b) {
  if (a.openNow && !b.openNow) {
    return -1
  }
  if (!a.openNow && b.openNow) {
    return 1
  }
  if (a.rating > b.rating) {
    return -1
  }
  if (a.rating < b.rating) {
    return 1
  }
  return 0
}

export default PlacesPageContainer
