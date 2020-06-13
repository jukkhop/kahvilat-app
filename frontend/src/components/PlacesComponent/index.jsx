import { arrayOf, shape } from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import PlaceComponent from '../PlaceComponent'

const Places = styled.ul`
  align-items: flex-start;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-family: Source Sans Pro;
  list-style: none;
  padding-inline-start: 0;
  width: 100%;
`

function PlacesComponent({ places }) {
  return (
    <Places>
      {places.map(({ id, ...place }) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <PlaceComponent key={id} {...place} />
      ))}
    </Places>
  )
}

PlacesComponent.propTypes = {
  places: arrayOf(shape({})),
}

PlacesComponent.defaultProps = {
  places: [],
}

export default PlacesComponent
