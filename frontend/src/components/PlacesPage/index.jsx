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
import Layout from '../SiteLayout'

const Form = styled.form``
const Label = styled.label``
const Input = styled.input``
const Heading4 = styled.h4``

const Fields = styled.div`
  display: flex;
`

const Field = styled.span`
  &:not(:first-of-type) {
    margin-left: 0.5rem;
  }
`

const Button = styled.button`
  display: block;
  margin-top: 0.5rem;
  width: 100%;
  height: 35px;
`

const Message = styled.p`
  color: rgba(1, 1, 1, 0.8);
  font-size: 1.75rem;
  margin: 1rem auto;
  text-align: center;
`

const Places = styled.ul``
const Place = styled.li``

function PlacesPage({ data, error, loading, onSubmit, register }) {
  const places = (data.searchPlaces ? data.searchPlaces.data : []) || []
  return (
    <Layout>
      <Form onSubmit={onSubmit}>
        <Fields>
          <Field>
            <Label htmlFor="latitude">Latitude</Label>
            <Input id="latitude" name="latitude" ref={register} />
          </Field>
          <Field>
            <Label htmlFor="longitude">Longitude</Label>
            <Input id="longitude" name="longitude" ref={register} />
          </Field>
          <Field>
            <Label htmlFor="distance">Distance</Label>
            <Input id="distance" name="distance" ref={register} />
          </Field>
        </Fields>
        <Button type="submit">Search</Button>
      </Form>
      {(() => {
        if (loading) {
          return <Message>Loading...</Message>
        }
        if (error) {
          return <Message>Search error.</Message>
        }
        return (
          <Places>
            {places.map((place) => (
              <Place key={place.id}>
                <Heading4>{place.name}</Heading4>
              </Place>
            ))}
          </Places>
        )
      })()}
    </Layout>
  )
}

PlacesPage.propTypes = {
  data: oneOfType([arrayOf(shape({})), object]),
  error: string,
  loading: bool.isRequired,
  onSubmit: func.isRequired,
  register: func.isRequired,
}

PlacesPage.defaultProps = {
  data: [],
  error: null,
}

export default PlacesPage
