import uniqBy from 'lodash.uniqby'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLazyQuery } from '@apollo/react-hooks'

import { PlacesPage } from '../../components/PlacesPage/PlacesPage'

import { DEFAULT_DISTANCE } from '../../constants'
import { buildPath, findAddressQuery, findCoordinatesQuery, findPlacesQuery, findMorePlacesQuery } from '../../graphql'
import { useGeoLocation } from '../../hooks'
import { Coords, FindAddressData, FindCoordsData, FindPlacesData, FormValues } from '../../types/'
import { mapPlace, sleep, sortPlaces } from '../../utils'

function PlacesPageContainer(): JSX.Element {
  const { formState, getValues, handleSubmit, register, setValue } = useForm()
  const [userCoords, setUserCoords] = useState<Coords | undefined>(undefined)
  const [prevAddress, setPrevAddress] = useState<string | undefined>(undefined)
  const [prevDistance, setPrevDistance] = useState<number | undefined>(undefined)
  const [findAddress, findAddressData] = useLazyQuery<FindAddressData>(findAddressQuery)
  const [findCoordinates, findCoordsData] = useLazyQuery<FindCoordsData>(findCoordinatesQuery)
  const [findPlaces, findPlacesData] = useLazyQuery<FindPlacesData>(findPlacesQuery)
  const geoLocation = useGeoLocation()

  const foundAddressByCoords = findAddressData.data?.findAddress.results?.[0]
  const foundAddressByAddress = findCoordsData.data?.findCoordinates.results?.[0]
  const foundPlaces = findPlacesData.data?.findPlaces.results || []

  const cursor = findPlacesData.data?.findPlaces.cursor
  const loading = findPlacesData.loading || findCoordsData.loading || findAddressData.loading
  const error = findPlacesData.error || findCoordsData.error || findAddressData.error

  function onFindCoordinates(values: FormValues): void {
    const { address, distance } = values
    const addressChanged = address !== prevAddress
    const distanceChanged = distance !== prevDistance

    if (userCoords && !addressChanged) {
      return distanceChanged ? onFindPlaces(distance) : undefined
    }

    const options = {
      variables: {
        address,
        pathFunction: buildPath('/find-address'),
      },
    }

    setUserCoords(undefined)
    setPrevAddress(address)
    setPrevDistance(distance)
    findCoordinates(options)
  }

  function onFindPlaces(distance?: number): void {
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
      query: findMorePlacesQuery,
      variables: {
        cursor,
        pathFunction: buildPath('/find-places'),
      },
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
    if (!geoLocation) return
    const options = {
      variables: {
        latitude: geoLocation.latitude,
        longitude: geoLocation.longitude,
        pathFunction: buildPath('/find-address'),
      },
    }
    setUserCoords(geoLocation)
    findAddress(options)
  }, [geoLocation])

  useEffect(() => {
    if (foundAddressByAddress) {
      const { latitude, longitude } = foundAddressByAddress.location
      setUserCoords({ latitude, longitude })
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
        .filter(x => x.status === 'OPERATIONAL')
        .map(mapPlace(userCoords))
        .sort(sortPlaces)
    : []

  function onAddressChange(event: any) {
    setValue('address', event.target.value)
  }

  function onDistanceChange(_: unknown, value: number | number[]) {
    setValue('distance', value)
  }

  return (
    <PlacesPage
      address={foundAddressByCoords?.address || foundAddressByAddress?.address}
      coords={userCoords}
      defaultDistance={DEFAULT_DISTANCE}
      error={!!error}
      isSubmitted={formState.isSubmitted}
      loading={loading}
      onAddressChange={onAddressChange}
      onDistanceChange={onDistanceChange}
      onSearch={handleSubmit(onFindCoordinates)}
      places={mappedPlaces}
    />
  )
}

export { PlacesPageContainer }
