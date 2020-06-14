import {
  arrayOf,
  bool,
  func,
  object,
  oneOfType,
  shape,
  string,
} from 'prop-types'

import React from 'react'
import styled from 'styled-components'
import { LoadScript } from '@react-google-maps/api'

import PlacesComponent from '../PlacesComponent'
import PlacesMap from '../PlacesMap'
import Layout from '../SiteLayout'

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
  align-items: baseline;
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 0.55rem;
  margin-bottom: 0.55rem;

  @media (max-width: 450px) {
    flex-direction: column;
  }
`

const Label = styled.label`
  display: block;
  font-size: 1rem;
  font-family: Source Sans Pro;
  min-width: 100px;
`

const Input = styled.input`
  display: block;
  font-family: Source Sans Pro;
  font-size: 1rem;
  margin-left: 0.25rem;
  padding: 0.25rem 0.5rem;
  width: 100%;

  @media (max-width: 450px) {
    margin-left: 0rem;
    margin-top: 0.25rem;
  }
`

const Button = styled.button`
  background-color: #c8ad90;
  border-radius: 3px;
  border: none;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.25);
  color: white;
  cursor: pointer;
  display: block;
  font-family: Montserrat;
  font-weight: 600;
  font-size: 0.875rem;
  height: 35px;
  letter-spacing: 1.5px;
  margin-top: 1rem;
  text-transform: uppercase;
  width: 100%;

  &:disabled {
    background-color: lightgray;
    cursor: not-allowed;
  }
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
  inputErrors,
  loading,
  onSearch,
  places,
  register,
  searchError,
}) {
  const { REACT_APP_GOOGLE_API_KEY } = process.env
  const hasInputErrors = Object.keys(inputErrors).length > 0
  return (
    <Layout>
      <Form onSubmit={onSearch}>
        <Fields>
          <Field style={{ display: 'none' }}>
            <Input
              defaultValue={coords ? coords.latitude : null}
              id="latitude"
              name="latitude"
              ref={register}
              type="hidden"
            />
          </Field>
          <Field style={{ display: 'none' }}>
            <Input
              defaultValue={coords ? coords.longitude : null}
              id="longitude"
              name="longitude"
              ref={register}
              type="hidden"
            />
          </Field>
          <Field>
            <Label htmlFor="address">Osoite</Label>
            <Input
              defaultValue={address || null}
              id="address"
              name="address"
              ref={register({ required: true })}
            />
          </Field>
          <Field>
            <Label htmlFor="distance">Etäisyys</Label>
            <Input
              defaultValue="500"
              id="distance"
              name="distance"
              ref={register}
              type="number"
              step={100}
            />
          </Field>
        </Fields>
        <Button type="submit" disabled={hasInputErrors || loading}>
          Etsi kahvilat
        </Button>
      </Form>
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
  inputErrors: shape({}),
  loading: bool.isRequired,
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
