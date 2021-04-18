import React, { ChangeEventHandler } from 'react'
import styled from 'styled-components'
import { Button, Slider, TextField, ThemeProvider, Typography } from '@material-ui/core'
import { LoadScript } from '@react-google-maps/api'

import PlacesGrid from '../PlacesGrid'
import PlacesMap from '../PlacesMap'
import Layout from '../Layout'

import { getConfig } from '../../config'
import theme from '../../theme'
import { Coords, Place } from '../../types'
import { convertDistance } from '../../utils/converters'

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

interface Props {
  address?: string
  coords?: Coords
  defaultDistance: number
  error?: boolean
  inputErrors?: Record<string, string>
  loading: boolean
  onAddressChange: ChangeEventHandler<HTMLInputElement>
  onDistanceChange: (event: React.ChangeEvent<any>, value: number | number[]) => void
  onSearch: () => Promise<any>
  places?: Place[]
}

const config = getConfig()

const marks = [250, 500, 750, 1000, 1250, 1500].map(metres => ({
  value: metres,
  label: `${convertDistance(metres)}`,
}))

function PlacesPage(props: Props): JSX.Element {
  const {
    address,
    coords,
    defaultDistance,
    error,
    loading,
    onAddressChange,
    onDistanceChange,
    onSearch,
    places = [],
  } = props

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <Form onSubmit={onSearch}>
          <Fields>
            <Field>
              <TextField
                autoFocus
                color="primary"
                defaultValue={address}
                fullWidth
                id="address"
                key={`textfield-address-${address}`}
                label="Osoite"
                name="address"
                onChange={onAddressChange}
                placeholder="Syötä katuosoite"
                required
              />
            </Field>
            <Field>
              <Typography id="label-for-distance" gutterBottom>
                Etäisyys
              </Typography>
              <Slider
                aria-labelledby="label-for-distance"
                color="primary"
                defaultValue={defaultDistance}
                id="distance"
                marks={marks}
                max={1600}
                min={150}
                name="distance"
                onChange={onDistanceChange}
                step={50}
                valueLabelDisplay="on"
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
          if (!coords) {
            return <Message>Klikkaa &quot;ETSI KAHVILAT&quot; aloittaaksesi.</Message>
          }
          if (loading) {
            return <Message>Ladataan...</Message>
          }
          if (error) {
            return <Message>Haussa tapahtui virhe.</Message>
          }
          if (places.length === 0) {
            return <Message>Valitettavasti kahviloita ei löytynyt. Voit kokeilla kasvattaa etäisyyttä.</Message>
          }
          return (
            <div>
              <PlacesMapWrapper>
                <PlacesMap coords={coords} places={places} />
              </PlacesMapWrapper>
              <PlacesGrid places={places} />
            </div>
          )
        })()}
      </LoadScript>
    </Layout>
  )
}

export default PlacesPage
