import uniqBy from 'lodash.uniqby'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLazyQuery } from '@apollo/react-hooks'

import { PlacesPage } from '../../components/PlacesPage/PlacesPage'

import { buildPath, findAddressQuery, findCoordinatesQuery, findPlacesQuery, findMorePlacesQuery } from '../../graphql'
import { useGeoLocation } from '../../hooks'
import { Coords, FindAddressData, FindCoordsData, FindPlacesData, FormValues } from '../../types'
import { mapPlace, sleep, sortPlaces } from '../../utils'

function PlacesPageContainer(): JSX.Element {
  const initialFormValues: FormValues = { address: '', distance: 500 }
  const useFormOptions = { defaultValues: initialFormValues }

  const useFormReturn = useForm(useFormOptions)
  const geoLocation = useGeoLocation()
  const [currCoords, setCurrCoords] = useState<Coords | undefined>(undefined)
  const [prevAddress, setPrevAddress] = useState<string | undefined>(undefined)
  const [prevDistance, setPrevDistance] = useState<number | undefined>(undefined)
  const [findAddress, findAddressData] = useLazyQuery<FindAddressData>(findAddressQuery)
  const [findCoordinates, findCoordsData] = useLazyQuery<FindCoordsData>(findCoordinatesQuery)
  const [findPlaces, findPlacesData] = useLazyQuery<FindPlacesData>(findPlacesQuery)

  const { getValues, handleSubmit, setValue } = useFormReturn
  const foundAddressByCoords = findAddressData.data?.findAddress.results?.[0]
  const foundAddressByAddress = findCoordsData.data?.findCoordinates.results?.[0]
  const foundPlaces = findPlacesData.data?.findPlaces.results || []

  const cursor = findPlacesData.data?.findPlaces.cursor
  const loading = findPlacesData.loading || findCoordsData.loading || findAddressData.loading
  const error = !!(findPlacesData.error || findCoordsData.error || findAddressData.error)

  const onFindCoordinates = useCallback((values: FormValues): void => {
    const { address, distance } = values
    const addressChanged = address !== prevAddress
    const distanceChanged = distance !== prevDistance

    if (currCoords && !addressChanged) {
      return distanceChanged ? onFindPlaces(currCoords, distance) : undefined
    }

    const pathFunction = buildPath('/find-address', true)
    const options = { variables: { address, pathFunction } }

    setPrevAddress(address)
    setPrevDistance(distance)
    setCurrCoords(undefined)
    findCoordinates(options)
  }, [])

  const onFindPlaces = useCallback(
    (coords: Coords, distance: number): void => {
      const options = {
        variables: {
          keyword: 'coffee',
          latitude: coords.latitude,
          longitude: coords.longitude,
          pathFunction: buildPath('/find-places'),
          radius: distance,
          type: 'cafe',
        },
      }

      setPrevDistance(distance)
      findPlaces(options)
    },
    [currCoords, prevDistance],
  )

  const onSearchMorePlaces = useCallback(async () => {
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
  }, [cursor])

  useEffect(() => {
    if (!geoLocation) return
    const options = {
      variables: {
        latitude: geoLocation.latitude,
        longitude: geoLocation.longitude,
        pathFunction: buildPath('/find-address'),
      },
    }
    setCurrCoords(geoLocation)
    findAddress(options)
  }, [geoLocation])

  useEffect(() => {
    if (foundAddressByAddress) {
      const { address, location } = foundAddressByAddress
      const { distance } = getValues()
      setCurrCoords(location)
      setValue('address', address)
      onFindPlaces(location, distance)
    }
  }, [foundAddressByAddress])

  useEffect(() => {
    if (foundAddressByCoords) {
      const { address, location } = foundAddressByCoords
      const { distance } = getValues()
      setCurrCoords(location)
      setValue('address', address)
      onFindPlaces(location, distance)
    }
  }, [foundAddressByCoords])

  useEffect(() => {
    onSearchMorePlaces()
  }, [cursor, onSearchMorePlaces])

  const mappedPlaces = currCoords
    ? uniqBy(foundPlaces, x => x.name)
        .filter(x => x.status === 'OPERATIONAL')
        .map(mapPlace(currCoords))
        .sort(sortPlaces)
    : []

  return (
    <PlacesPage
      coords={currCoords}
      fetchState={{ loading, error }}
      onSearch={handleSubmit(onFindCoordinates)}
      places={mappedPlaces}
      useFormReturn={useFormReturn}
    />
  )
}

export { PlacesPageContainer }
