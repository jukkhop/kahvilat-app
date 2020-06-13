/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
/* eslint-disable react/jsx-curly-newline */

import { getDistance } from 'geolib'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLazyQuery } from '@apollo/react-hooks'

import PlacesPage from '../../components/PlacesPage'
import { buildPath, SEARCH_PLACES, SEARCH_MORE_PLACES } from '../../graphql'
import { sleep } from '../../utils'

function PlacesPageContainer() {
  const { register, handleSubmit, getValues } = useForm()
  const [searchPlaces, { loading, data, error, fetchMore }] = useLazyQuery(
    SEARCH_PLACES,
  )

  const [browserCoords, setBrowserCoords] = useState(null)

  const { latitude: browserLatitude, longitude: browserLongitude } = getValues()
  const { searchPlaces: entry } = data || {}
  const { cursor, places = [] } = entry || {}

  const onSearch = ({ latitude, longitude, distance }) => {
    const options = {
      variables: {
        location: [latitude.toString(), longitude.toString()].join(','),
        radius: distance,
        type: 'cafe',
        pathFunction: buildPath('/search-places'),
      },
    }
    searchPlaces(options)
  }

  const onSearchMore = async () => {
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

  const memoizedOnSearchMore = useCallback(onSearchMore, [cursor])

  useEffect(() => {
    memoizedOnSearchMore()
  }, [cursor, memoizedOnSearchMore])

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        setBrowserCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      })
    } else {
      // eslint-disable-next-line no-console
      console.log('Geolocation API is not available')
    }
  }, [])

  const sortedPlaces = places
    .filter(place => place.businessStatus === 'OPERATIONAL')
    .map(mapPlace(browserLatitude, browserLongitude))
    .sort(sortPlaces)

  return (
    <PlacesPage
      coords={browserCoords}
      error={error}
      loading={loading}
      onSearch={handleSubmit(onSearch)}
      places={sortedPlaces}
      register={register}
    />
  )
}

function mapPlace(browserLatitude, browserLongitude) {
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
      { latitude: browserLatitude, longitude: browserLongitude },
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
