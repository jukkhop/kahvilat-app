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
      {places.map(({ distance, icon, name, openNow, rating, vicinity }) => (
        <PlaceComponent
          distance={distance}
          icon={icon}
          key={name}
          name={name}
          openNow={openNow}
          rating={rating}
          vicinity={vicinity}
        />
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
