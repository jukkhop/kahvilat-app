import { Button, Slider, TextField, ThemeProvider, Typography } from '@mui/material'
import { LoadScript } from '@react-google-maps/api'
import fp from 'lodash/fp'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import styled from 'styled-components'

import { PlacesList } from './components/PlacesList'
import { PlacesMap } from './components/PlacesMap'

import { Layout } from '../../components/Layout'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { initConfig } from '../../config'
import { useGeoLocation, useLazyFetch } from '../../hooks'
import { getAddressesRequest } from '../../requests/addresses'
import { getPlacesRequest } from '../../requests/places'
import { theme } from '../../constants/theme'
import { Location } from '../../types/api'
import { GetAddressesParams, GetAddressesResponse } from '../../types/api/address'
import { GetPlacesParams, GetPlacesResponse, Place } from '../../types/api/place'
import { FormValues, PlacesListItem } from '../../types/ui'
import { createPlaceItem, showDistance, wait } from '../../utils'

export function PlacesPage(): JSX.Element {
  const useFormReturn = useForm<FormValues>({ defaultValues: formDefaults })
  const geoLocation = useGeoLocation()
  const [currentLocation, setCurrentLocation] = useState<Location | undefined>(undefined)
  const [prevAddress, setPrevAddress] = useState<string | undefined>(undefined)
  const [prevDistance, setPrevDistance] = useState<number | undefined>(undefined)
  const [placeItems, setPlaceItems] = useState<PlacesListItem[]>([])

  const getAddressesFetch = useLazyFetch<GetAddressesResponse>()
  const getPlacesFetch = useLazyFetch<GetPlacesResponse>()

  const { control, formState, handleSubmit, getValues, setValue } = useFormReturn
  const formValues = getValues()
  const config = initConfig()

  const loading = getAddressesFetch.state === 'loading' || getPlacesFetch.state === 'loading'
  const error = getAddressesFetch.state === 'error' || getPlacesFetch.state === 'error'

  const onFindAddress = useCallback(
    (params: GetAddressesParams) => {
      if (getAddressesFetch.state === 'idle') {
        getAddressesFetch.fetch(...getAddressesRequest(params))
      }
    },
    [getAddressesFetch],
  )

  const onGetPlaces = useCallback(
    (location: Location, distance: number) => {
      const params: GetPlacesParams = {
        keyword: 'coffee',
        latitude: location.latitude.toString(),
        longitude: location.longitude.toString(),
        radius: distance.toString(),
        type: 'cafe',
      }

      if (getPlacesFetch.state === 'idle') {
        setPlaceItems([])
        getPlacesFetch.fetch(...getPlacesRequest(params))
      }
    },
    [getPlacesFetch],
  )

  const onFormSubmit = useCallback(
    (values: FormValues) => {
      const { address, distance } = values
      const addressChanged = address !== prevAddress
      const distanceChanged = distance !== prevDistance

      if (addressChanged) setPrevAddress(address)
      if (distanceChanged) setPrevDistance(distance)

      if (currentLocation && !addressChanged) {
        if (distanceChanged) onGetPlaces(currentLocation, distance)
        return
      }

      const params: GetAddressesParams = {
        address,
      }

      if (getAddressesFetch.state === 'idle') {
        getAddressesFetch.fetch(...getAddressesRequest(params))
      }
    },
    [currentLocation, getAddressesFetch, onGetPlaces, prevAddress, prevDistance],
  )

  useEffect(() => {
    if (geoLocation) {
      const params: GetAddressesParams = {
        latitude: geoLocation.latitude.toString(),
        longitude: geoLocation.longitude.toString(),
      }

      onFindAddress(params)
      setCurrentLocation(geoLocation)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoLocation])

  useEffect(() => {
    if (getAddressesFetch.state === 'success') {
      getAddressesFetch.reset()
    }

    if (getAddressesFetch.state === 'success' && getAddressesFetch.data.items.length) {
      const { address, location } = getAddressesFetch.data.items[0]
      const { distance } = getValues()

      setValue('address', address)
      setCurrentLocation(location)

      if (formState.isSubmitted) {
        onGetPlaces(location, distance)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAddressesFetch])

  useEffect(() => {
    if (getPlacesFetch.state === 'success') {
      getPlacesFetch.reset()
    }

    if (getPlacesFetch.state === 'success' && currentLocation) {
      const newPlaceItems = fp.flow(
        fp.filter((x: Place) => x.status === 'OPERATIONAL'),
        fp.map(createPlaceItem(currentLocation)),
        fp.concat(placeItems),
        fp.orderBy(['openNow', 'rating', 'distance'], ['desc', 'desc', 'asc']),
        fp.uniqBy((x: PlacesListItem) => x.name),
      )(getPlacesFetch.data.items)

      setPlaceItems(newPlaceItems)
    }

    if (getPlacesFetch.state === 'idle' && getPlacesFetch.data) {
      const { cursor } = getPlacesFetch.data

      if (cursor) {
        wait(2000).then(() => getPlacesFetch.fetch(...getPlacesRequest({ cursor })))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getPlacesFetch])

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <Form onSubmit={handleSubmit(onFormSubmit)}>
          <Fields>
            <Field id="address-field">
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
            <Field id="distance-field">
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

          if (formValues.address && !formState.isSubmitted) {
            return <Message>Klikkaa &quot;ETSI KAHVILAT&quot; aloittaaksesi.</Message>
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

          if (formState.isSubmitted && placeItems.length === 0) {
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

const formDefaults: FormValues = {
  address: '',
  distance: 500,
}

const distanceSliderMarks = [250, 500, 750, 1000, 1250, 1500].map((metres) => ({
  value: metres,
  label: showDistance(metres),
}))
