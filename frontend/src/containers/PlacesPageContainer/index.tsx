/* eslint-disable @typescript-eslint/ban-ts-comment */

import uniqBy from 'lodash.uniqby'
import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLazyQuery } from '@apollo/react-hooks'

import PlacesPage from '../../components/PlacesPage'
import { DEFAULT_DISTANCE } from '../../constants'
import { FIND_ADDRESS, FIND_COORDINATES, FIND_PLACES, FIND_MORE_PLACES, buildPath } from '../../graphql'
import { Coords, FindAddressData, FindCoordsData, FindPlacesData, FormValues, PlaceDto } from '../../types/'
import { mapPlace, sleep, sortPlaces } from '../../utils'

function PlacesPageContainer(): JSX.Element {
  const { getValues, handleSubmit, register, setValue } = useForm()
  const [userCoords, setUserCoords] = useState<Coords | undefined>(undefined)
  const [prevAddress, setPrevAddress] = useState<string | undefined>(undefined)
  const [prevDistance, setPrevDistance] = useState<number | undefined>(undefined)
  const [findAddress, findAddressData] = useLazyQuery<FindAddressData>(FIND_ADDRESS)
  const [findCoordinates, findCoordsData] = useLazyQuery<FindCoordsData>(FIND_COORDINATES)
  const [findPlaces, findPlacesData] = useLazyQuery<FindPlacesData>(FIND_PLACES)

  const foundAddressByCoords = findAddressData.data?.findAddress.results?.[0]
  const foundAddressByAddress = findCoordsData.data?.findCoordinates.results?.[0]
  const foundPlaces = findPlacesData.data?.findPlaces.results || []

  const cursor = findPlacesData.data?.findPlaces.cursor
  const loading = findPlacesData.loading || findCoordsData.loading || findAddressData.loading
  const error = findPlacesData.error || findCoordsData.error || findAddressData.error

  function onFindCoordinates(values: FormValues) {
    const { address, distance } = values
    const addressChanged = address !== prevAddress
    const distanceChanged = distance !== prevDistance

    if (userCoords && !addressChanged && !distanceChanged) {
      return
    }

    if (userCoords && distanceChanged) {
      return onFindPlaces(distance)
    }

    const options = {
      variables: {
        address,
        pathFunction: buildPath('/find-coordinates'),
      },
    }

    setUserCoords(undefined)
    setPrevAddress(address)
    setPrevDistance(distance)
    findCoordinates(options)
  }

  function onFindPlaces(distance?: number) {
    if (!userCoords) return

    const options = {
      variables: {
        keyword: 'coffee',
        latitude: userCoords.latitude,
        longitude: userCoords.longitude,
        pathFunction: buildPath('/find-places'),
        radius: distance || DEFAULT_DISTANCE,
        type: 'cafe',
      },
    }

    setPrevDistance(distance)
    findPlaces(options)
  }

  async function onSearchMorePlaces() {
    if (!cursor || !findPlacesData.fetchMore) {
      return Promise.resolve()
    }

    await sleep(2000)

    return findPlacesData.fetchMore({
      query: FIND_MORE_PLACES,
      variables: {
        cursor,
        pathFunction: buildPath('/find-places'),
      },
      // @ts-ignore
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const previousEntry = previousResult.findPlaces
        const newCursor = fetchMoreResult?.findPlaces?.cursor
        const newResults = fetchMoreResult?.findPlaces?.results || []
        return {
          findPlaces: {
            cursor: newCursor,
            results: [...newResults, ...previousEntry.results],
            __typename: previousEntry.__typename,
          },
        }
      },
    })
  }

  const memoizedOnSearchPlaces = useCallback(onFindPlaces, [userCoords, prevDistance])
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
      setUserCoords({ latitude: latitude.toString(), longitude: longitude.toString() })
      findAddress(options)
    })
  }, [findAddress])

  useEffect(() => {
    if (foundAddressByAddress) {
      const { lat, lng } = foundAddressByAddress.geometry.location
      setUserCoords({ latitude: lat, longitude: lng })
    }
  }, [foundAddressByAddress])

  useEffect(() => {
    const { distance } = getValues()
    memoizedOnSearchPlaces(distance)
  }, [getValues, memoizedOnSearchPlaces])

  useEffect(() => {
    memoizedOnSearchMorePlaces()
  }, [cursor, memoizedOnSearchMorePlaces])

  useEffect(() => {
    register('address')
    register('distance')
    setValue('distance', DEFAULT_DISTANCE)
  }, [register, setValue])

  const mappedPlaces = userCoords
    ? uniqBy(foundPlaces, x => x.name)
        .filter((x: PlaceDto) => x.businessStatus === 'OPERATIONAL')
        .map(mapPlace(userCoords))
        .sort(sortPlaces)
    : []

  function onAddressChange(event: SyntheticEvent) {
    // @ts-ignore
    setValue('address', event.target.value)
  }

  function onDistanceChange(_: unknown, value: number | number[]) {
    setValue('distance', value)
  }

  return (
    <PlacesPage
      address={foundAddressByCoords?.address}
      coords={userCoords}
      defaultDistance={DEFAULT_DISTANCE}
      error={error ? true : false}
      loading={loading}
      onAddressChange={onAddressChange}
      onDistanceChange={onDistanceChange}
      onSearch={handleSubmit(onFindCoordinates)}
      places={mappedPlaces}
    />
  )
}

export default PlacesPageContainer
