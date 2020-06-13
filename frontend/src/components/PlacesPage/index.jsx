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

import PlacesComponent from '../PlacesComponent'
import PlacesMap from '../PlacesMap'
import Layout from '../SiteLayout'

const Form = styled.form`
  font-family: Source Sans Pro;
  margin: 0 auto;
  max-width: 650px;
`

const Label = styled.label`
  font-size: 0.85rem;
  font-family: Source Sans Pro;
`

const Input = styled.input`
  font-family: Source Sans Pro;
  margin-left: 0.25rem;
  padding: 0.25rem 0.5rem;

  @media (max-width: 650px) {
    margin-left: 0rem;
    margin-top: 0.25rem;
    width: 100%;
  }
`

const Fields = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  @media (max-width: 680px) {
    align-items: flex-start;
    flex-direction: column;
    justify-content: flex-start;
  }
`

const Field = styled.span`
  display: block;

  &:not(:first-of-type) {
    margin-left: 0.75rem;
  }

  @media (max-width: 650px) {
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
    width: 100%;

    &:not(:first-of-type) {
      margin-left: 0rem;
    }
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
  height: 35px;
  letter-spacing: 1.5px;
  margin-top: 0.75rem;
  text-transform: uppercase;
  width: 100%;
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
  font-size: 0.85rem;
  margin-top: 5rem;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
`

function PlacesPage({ coords, error, loading, onSearch, places, register }) {
  return (
    <Layout>
      <Form onSubmit={onSearch}>
        <Fields>
          <Field>
            <Label htmlFor="latitude">Leveysaste</Label>
            <Input
              id="latitude"
              name="latitude"
              ref={register}
              defaultValue={coords ? coords.latitude : null}
            />
          </Field>
          <Field>
            <Label htmlFor="longitude">Pituusaste</Label>
            <Input
              id="longitude"
              name="longitude"
              ref={register}
              defaultValue={coords ? coords.longitude : null}
            />
          </Field>
          <Field>
            <Label htmlFor="distance">Etäisyys</Label>
            <Input
              id="distance"
              name="distance"
              ref={register}
              defaultValue="500"
            />
          </Field>
        </Fields>
        <Button type="submit">Hae kahvilat</Button>
      </Form>
      {(() => {
        if (loading) {
          return <Message>Ladataan...</Message>
        }
        if (error) {
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
        return <Message>Klikkaa &quot;HAE KAHVILAT&quot; aloittaksesi.</Message>
      })()}
    </Layout>
  )
}

PlacesPage.propTypes = {
  coords: shape({}),
  error: oneOfType([shape({}), object, string]),
  loading: bool.isRequired,
  onSearch: func.isRequired,
  places: arrayOf(shape({})),
  register: func.isRequired,
}

PlacesPage.defaultProps = {
  coords: null,
  error: null,
  places: [],
}

export default PlacesPage
