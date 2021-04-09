import get from 'lodash.get'
import uniqBy from 'lodash.uniqby'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLazyQuery } from '@apollo/react-hooks'

import PlacesPage from '../../components/PlacesPage'
import { DEFAULT_DISTANCE } from '../../constants'
import {
  buildPath,
  FIND_ADDRESS,
  FIND_COORDINATES,
  SEARCH_PLACES,
  SEARCH_MORE_PLACES,
} from '../../graphql'
import { Coords, FormValues, PlaceDto } from '../../types/'
import { mapPlace, sleep, sortPlaces } from '../../utils'

function PlacesPageContainer(): JSX.Element {
  const { getValues, handleSubmit, register, setValue } = useForm()
  const [userCoords, setUserCoords] = useState<Coords | undefined>(undefined)
  const [prevAddress, setPrevAddress] = useState<string | undefined>(undefined)
  const [prevDistance, setPrevDistance] = useState<number | undefined>(undefined)
  const [findAddress, findAddressData] = useLazyQuery(FIND_ADDRESS)
  const [findCoordinates, findCoordinatesData] = useLazyQuery(FIND_COORDINATES)
  const [searchPlaces, searchPlacesData] = useLazyQuery(SEARCH_PLACES)

  const foundAddress = get(findAddressData, 'data.findAddress.results[0].address')
  // prettier-ignore
  const foundCoords = get(findCoordinatesData, 'data.findCoordinates.results[0].geometry.location') as Coords | undefined

  const places = get(searchPlacesData, 'data.searchPlaces.results', []) as PlaceDto[]
  const cursor = get(searchPlacesData, 'data.searchPlaces.cursor') as string | undefined

  const loading = searchPlacesData.loading || findCoordinatesData.loading || findAddressData.loading
  const error = searchPlacesData.error || findCoordinatesData.error || findAddressData.error

  const onFindCoordinates = (values: FormValues) => {
    const { address, distance, latitude, longitude } = values
    const addressChanged = address !== prevAddress
    const distanceChanged = distance !== prevDistance

    if (!addressChanged && !distanceChanged) {
      return
    }

    if (!addressChanged && distanceChanged) {
      return onSearchPlaces(latitude, longitude, distance)
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

  const onSearchPlaces = (latitude: string, longitude: string, distance?: number) => {
    if (!userCoords) return

    const options = {
      variables: {
        keyword: 'coffee',
        latitude,
        longitude,
        pathFunction: buildPath('/find-places'),
        radius: distance || DEFAULT_DISTANCE,
        type: 'cafe',
      },
    }

    setPrevDistance(distance)
    searchPlaces(options)
  }

  const onSearchMorePlaces = async () => {
    if (!cursor || !searchPlacesData.fetchMore) {
      return Promise.resolve()
    }

    await sleep(2000)

    return searchPlacesData.fetchMore({
      query: SEARCH_MORE_PLACES,
      variables: {
        cursor,
        pathFunction: buildPath('/find-places'),
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const previousEntry = previousResult.searchPlaces
        const { cursor: newCursor, results: newResults } = fetchMoreResult.searchMorePlaces
        return {
          searchPlaces: {
            cursor: newCursor,
            results: [...newResults, ...previousEntry.results],
            __typename: previousEntry.__typename,
          },
        }
      },
    })
  }

  const memoizedOnSearchPlaces = useCallback(onSearchPlaces, [userCoords, prevDistance])
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
    if (foundCoords) {
      setUserCoords(foundCoords)
    }
  }, [foundCoords])

  useEffect(() => {
    if (!userCoords) return
    const { distance } = getValues()
    memoizedOnSearchPlaces(userCoords.latitude, userCoords.longitude, distance)
  }, [getValues, userCoords, memoizedOnSearchPlaces])

  useEffect(() => {
    memoizedOnSearchMorePlaces()
  }, [cursor, memoizedOnSearchMorePlaces])

  useEffect(() => {
    register('distance')
    setValue('distance', DEFAULT_DISTANCE)
  }, [register, setValue])

  const mappedPlaces = userCoords
    ? uniqBy(places, x => x.name)
        .filter((x: PlaceDto) => x.businessStatus === 'OPERATIONAL')
        .map(mapPlace(userCoords))
        .sort(sortPlaces)
    : []

  const onDistanceChange = (_: unknown, value: number) => {
    setValue('distance', value)
  }

  return (
    <PlacesPage
      address={foundAddress}
      coords={userCoords}
      defaultDistance={DEFAULT_DISTANCE}
      loading={loading}
      onDistanceChange={onDistanceChange}
      onSearch={handleSubmit(onFindCoordinates)}
      places={mappedPlaces}
      register={register}
      searchError={error ? true : false}
    />
  )
}

export default PlacesPageContainer
