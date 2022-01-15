import React from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import styled from 'styled-components'
import { Button, Slider, TextField, ThemeProvider, Typography } from '@material-ui/core'
import { LoadScript } from '@react-google-maps/api'

import { PlacesList } from './PlacesList'
import { PlacesMap } from './PlacesMap'
import { Layout } from '../Layout'

import { getConfig } from '../../config'
import { theme } from '../../theme'
import { Coords, FormValues, Place } from '../../types'
import { convertDistance } from '../../utils'

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

const PlacesMapWrapper = styled.div`
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

const marks = [250, 500, 750, 1000, 1250, 1500].map(metres => ({
  value: metres,
  label: convertDistance(metres),
}))

type PlacesPageProps = {
  coords?: Coords
  fetchState: { loading: boolean; error: boolean }
  onSearch: () => Promise<any>
  places?: Place[]
  useFormReturn: UseFormReturn<FormValues>
}

function PlacesPage(props: PlacesPageProps): JSX.Element {
  const { coords, fetchState, onSearch, places = [], useFormReturn } = props
  const { control, formState, getValues, setValue } = useFormReturn

  const config = getConfig()
  const formValues = getValues()

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <Form onSubmit={onSearch}>
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
                    inputRef={field.ref}
                    label="Osoite"
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    placeholder="Syötä katuosoite"
                    required
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
                    marks={marks}
                    max={1600}
                    min={150}
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={(_: any, value: number | number[]) => {
                      if (typeof value === 'number') setValue('distance', value)
                    }}
                    ref={field.ref}
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
            disabled={fetchState.loading}
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
            return <Message>Klikkaa &quot;ETSI KAHVILAT&quot; aloittaaksesi.</Message>
          }
          if (fetchState.loading) {
            return <Message>Ladataan...</Message>
          }
          if (fetchState.error) {
            return <Message>Haussa tapahtui virhe.</Message>
          }
          if (!formValues.address || !coords) {
            return <Message>Antamaasi osoitetta ei löytynyt. Tarkista oikeinkirjoitus.</Message>
          }
          if (places.length === 0) {
            return <Message>Valitettavasti kahviloita ei löytynyt. Kokeile kasvattaa etäisyyttä.</Message>
          }
          return (
            <div>
              <PlacesMapWrapper>
                <PlacesMap center={coords} places={places} />
              </PlacesMapWrapper>
              <PlacesList places={places} />
            </div>
          )
        })()}
      </LoadScript>
    </Layout>
  )
}

export { PlacesPage }
