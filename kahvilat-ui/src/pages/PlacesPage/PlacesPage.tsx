import { Button, Slider, TextField, ThemeProvider, Typography } from '@mui/material'
import { LoadScript } from '@react-google-maps/api'
import uniqBy from 'lodash.uniqby'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import styled from 'styled-components'

import { Layout } from '../../components/Layout'
import { PlacesList } from './components/PlacesList'
import { PlacesMap } from './components/PlacesMap'

import { initConfig } from '../../config'
import { useGeoLocation, useLazyFetch } from '../../hooks'
import { findAddressesRequest } from '../../requests/address'
import { findPlacesRequest } from '../../requests/places'
import { theme } from '../../theme'
import { FindAddressesParams, FindAddressesResult, FindPlacesParams, FindPlacesResult, Location } from '../../types/api'
import { FormValues, PlacesListItem } from '../../types/ui'
import { createPlaceItem, showDistance, sortPlaceItems, wait } from '../../utils'
import { LoadingSpinner } from '../../components/LoadingSpinner'

function PlacesPage(): JSX.Element {
  const useFormReturn = useForm<FormValues>({ defaultValues: formDefaultValues })
  const geoLocation = useGeoLocation()
  const [currentLocation, setCurrentLocation] = useState<Location | undefined>(undefined)
  const [prevAddress, setPrevAddress] = useState<string | undefined>(undefined)
  const [prevDistance, setPrevDistance] = useState<number | undefined>(undefined)
  const [placeItems, setPlaceItems] = useState<PlacesListItem[]>([])

  const findAddressesFetch = useLazyFetch<FindAddressesResult>()
  const findPlacesFetch = useLazyFetch<FindPlacesResult>()

  const { control, formState, handleSubmit, getValues, setValue } = useFormReturn
  const formValues = getValues()
  const config = initConfig()

  const loading = findAddressesFetch.state === 'loading' || findPlacesFetch.state === 'loading'
  const error = findAddressesFetch.state === 'error' || findPlacesFetch.state === 'error'

  const onFindPlaces = useCallback(
    (location: Location, distance: number) => {
      const params: FindPlacesParams = {
        keyword: 'coffee',
        latitude: location.latitude,
        longitude: location.longitude,
        radius: distance,
        type: 'cafe',
      }

      if (findPlacesFetch.state === 'idle') {
        setPlaceItems([])
        findPlacesFetch.fetch(...findPlacesRequest(params))
      }
    },
    [findPlacesFetch],
  )

  const onFindAddressByAddress = useCallback(
    (values: FormValues) => {
      const { address, distance } = values
      const addressChanged = address !== prevAddress
      const distanceChanged = distance !== prevDistance

      if (addressChanged) setPrevAddress(address)
      if (distanceChanged) setPrevDistance(distance)

      if (currentLocation && !addressChanged) {
        if (distanceChanged) onFindPlaces(currentLocation, distance)
        return
      }

      const params: FindAddressesParams = {
        address,
      }

      if (findAddressesFetch.state === 'idle') {
        findAddressesFetch.fetch(...findAddressesRequest(params))
      }
    },
    [currentLocation, findAddressesFetch, onFindPlaces, prevAddress, prevDistance],
  )

  const onFindAddressByCoords = useCallback(
    (params: FindAddressesParams) => {
      if (findAddressesFetch.state === 'idle') {
        findAddressesFetch.fetch(...findAddressesRequest(params))
      }
    },
    [findAddressesFetch],
  )

  useEffect(() => {
    if (geoLocation) {
      const params: FindAddressesParams = {
        latitude: geoLocation.latitude,
        longitude: geoLocation.longitude,
      }

      onFindAddressByCoords(params)
      setCurrentLocation(geoLocation)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoLocation])

  useEffect(() => {
    if (findAddressesFetch.state === 'success' && findAddressesFetch.data.results.length) {
      const { address, location } = findAddressesFetch.data.results[0]
      const { distance } = getValues()

      findAddressesFetch.reset()

      setValue('address', address)
      setCurrentLocation(location)
      onFindPlaces(location, distance)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [findAddressesFetch])

  useEffect(() => {
    if (findPlacesFetch.state === 'success') {
      const { results } = findPlacesFetch.data

      const newItems = currentLocation
        ? uniqBy(results, (x) => x.name)
            .filter((x) => x.status === 'OPERATIONAL')
            .map(createPlaceItem(currentLocation))
        : []

      setPlaceItems(placeItems.concat(newItems).sort(sortPlaceItems))

      findPlacesFetch.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [findPlacesFetch])

  useEffect(() => {
    if (findPlacesFetch.state === 'idle' && findPlacesFetch.data) {
      const { cursor } = findPlacesFetch.data

      if (cursor) {
        wait(2000).then(() => findPlacesFetch.fetch(...findPlacesRequest({ cursor })))
      }
    }
  }, [findPlacesFetch])

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <Form onSubmit={handleSubmit(onFindAddressByAddress)}>
          <Fields>
            <Field>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    autoFocus
                    color="primary"
                    fullWidth
                    id={field.name}
                    label="Osoite"
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    placeholder="Syötä katuosoite"
                    required
                    value={field.value}
                  />
                )}
              />
            </Field>
            <Field>
              <Typography id="label-for-distance" gutterBottom>
                Etäisyys
              </Typography>
              <Controller
                name="distance"
                control={control}
                render={({ field }) => (
                  <Slider
                    aria-labelledby="label-for-distance"
                    color="primary"
                    marks={distanceSliderMarks}
                    max={1600}
                    min={150}
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={(_: any, value: number | number[]) => {
                      if (typeof value === 'number') setValue('distance', value)
                    }}
                    step={50}
                    value={field.value}
                    valueLabelDisplay="on"
                  />
                )}
              />
            </Field>
          </Fields>
          <Button
            color="primary"
            disabled={loading}
            fullWidth
            style={{ margin: '1rem 0' }}
            type="submit"
            variant="contained"
          >
            Etsi kahvilat
          </Button>
        </Form>
      </ThemeProvider>
      <LoadScript googleMapsApiKey={config.google.apiKey}>
        {(() => {
          if (!formValues.address && !formState.isSubmitted) {
            return <Message>Anna osoite ja klikkaa &quot;ETSI KAHVILAT&quot; aloittaaksesi.</Message>
          }

          if (loading && placeItems.length === 0) {
            return (
              <LoadingSpinnerBlock>
                <LoadingSpinner />
              </LoadingSpinnerBlock>
            )
          }

          if (error) {
            return <Message>Haussa tapahtui virhe.</Message>
          }

          if (!formValues.address || !currentLocation) {
            return <Message>Antamaasi osoitetta ei löytynyt. Tarkista oikeinkirjoitus.</Message>
          }

          if (placeItems.length === 0) {
            return <Message>Valitettavasti kahviloita ei löytynyt. Kokeile nostaa etäisyyttä.</Message>
          }

          return (
            <div>
              <PlacesMapBlock>
                <PlacesMap center={currentLocation} places={placeItems} />
              </PlacesMapBlock>

              <PlacesList places={placeItems} />

              {loading && (
                <LoadingSpinnerBlock>
                  <LoadingSpinner />
                </LoadingSpinnerBlock>
              )}
            </div>
          )
        })()}
      </LoadScript>
    </Layout>
  )
}

const Form = styled.form`
  font-family: Source Sans Pro;
  margin: 0 auto;
  max-width: 350px;
  min-width: 350px;

  @media (max-width: 375px) {
    min-width: unset;
  }
`

const Fields = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  max-width: 450px;

  @media (max-width: 450px) {
    max-width: 100%;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
`

const Field = styled.div`
  width: 100%;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
`

const PlacesMapBlock = styled.div`
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  margin-top: 1.5rem;

  @media (max-width: 425px) {
    margin-left: 0.25rem;
    margin-right: 0.25rem;
  }
`

const Message = styled.p`
  color: rgba(1, 1, 1, 0.85);
  font-size: 1rem;
  margin-top: 5rem;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
`

const LoadingSpinnerBlock = styled.div`
  display: flex;
  justify-content: center;
  font-size: 1.5rem;
  margin-top: 1rem;
`

const formDefaultValues: FormValues = {
  address: '',
  distance: 500,
}

const distanceSliderMarks = [250, 500, 750, 1000, 1250, 1500].map((metres) => ({
  value: metres,
  label: showDistance(metres),
}))

export { PlacesPage }
