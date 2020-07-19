import {
  arrayOf,
  bool,
  func,
  object,
  oneOfType,
  shape,
  string,
  number,
} from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import {
  Button,
  Slider,
  TextField,
  ThemeProvider,
  Typography,
} from '@material-ui/core'
import { LoadScript } from '@react-google-maps/api'

import PlacesComponent from '../PlacesComponent'
import PlacesMap from '../PlacesMap'
import Layout from '../SiteLayout'
import theme from '../../theme'

const Form = styled.form`
  font-family: Source Sans Pro;
  margin: 0 auto;
  max-width: 350px;
  min-width: 350px;

  @media (max-width: 350px) {
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
    max-width: calc(100% - 1.5rem);
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

function PlacesPage({
  address,
  coords,
  defaultDistance,
  inputErrors,
  loading,
  onDistanceChange,
  onSearch,
  places,
  register,
  searchError,
}) {
  const { REACT_APP_GOOGLE_API_KEY } = process.env
  const hasInputErrors = Object.keys(inputErrors).length > 0

  const convertDistance = metres => {
    if (metres !== 1000) return `${metres} m`
    return `${metres / 1000} km`
  }

  const marks = [250, 500, 750, 1000, 1250, 1500].map(metres => ({
    value: metres,
    label: `${convertDistance(metres)}`,
  }))

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <Form onSubmit={onSearch}>
          <Fields>
            <Field style={{ display: 'none' }}>
              <input
                defaultValue={coords ? coords.latitude : undefined}
                id="latitude"
                name="latitude"
                ref={register}
                type="hidden"
              />
            </Field>
            <Field style={{ display: 'none' }}>
              <input
                defaultValue={coords ? coords.longitude : undefined}
                id="longitude"
                name="longitude"
                ref={register}
                type="hidden"
              />
            </Field>
            <Field>
              <TextField
                color="primary"
                defaultValue={address}
                fullWidth
                id="address"
                inputRef={register({ required: true })}
                key={`textfield-address-${address}`}
                label="Osoite"
                name="address"
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
                label="Etäisyys"
                marks={marks}
                max={1600}
                min={150}
                name="distance"
                onChange={onDistanceChange}
                step={50}
                type="number"
                valueLabelDisplay="on"
              />
            </Field>
          </Fields>
          <Button
            color="primary"
            disabled={hasInputErrors || loading}
            fullWidth
            style={{ margin: '1rem 0' }}
            type="submit"
            variant="contained"
          >
            Etsi kahvilat
          </Button>
        </Form>
      </ThemeProvider>
      <LoadScript googleMapsApiKey={REACT_APP_GOOGLE_API_KEY}>
        {(() => {
          if (loading) {
            return <Message>Ladataan...</Message>
          }
          if (searchError) {
            return <Message>Haussa tapahtui virhe.</Message>
          }
          if (coords && places.length > 0) {
            return (
              <div>
                <PlacesMapWrapper>
                  <PlacesMap coords={coords} places={places} />
                </PlacesMapWrapper>
                <PlacesComponent places={places} />
              </div>
            )
          }
          if (coords && places.length === 0) {
            return (
              <Message>
                Valitettavasti kahviloita ei löytynyt. Voit kokeilla kasvattaa
                etäisyyttä.
              </Message>
            )
          }
          return (
            <Message>Klikkaa &quot;ETSI KAHVILAT&quot; aloittaksesi.</Message>
          )
        })()}
      </LoadScript>
    </Layout>
  )
}

PlacesPage.propTypes = {
  address: string,
  coords: shape({}),
  defaultDistance: number.isRequired,
  inputErrors: shape({}),
  loading: bool.isRequired,
  onDistanceChange: func.isRequired,
  onSearch: func.isRequired,
  places: arrayOf(shape({})),
  register: func.isRequired,
  searchError: oneOfType([shape({}), object, string]),
}

PlacesPage.defaultProps = {
  address: null,
  coords: null,
  inputErrors: {},
  places: [],
  searchError: null,
}

export default PlacesPage
