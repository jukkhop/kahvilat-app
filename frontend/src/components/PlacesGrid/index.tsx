import React from 'react'
import styled from 'styled-components'

import PlaceCard from '../PlaceCard'
import { Place } from '../../types'

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

interface Props {
  places: Place[]
}

function PlacesGrid(props: Props): JSX.Element {
  return (
    <Places>
      {props.places.map(({ distance, icon, name, openNow, rating, vicinity }) => (
        <PlaceCard
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

export default PlacesGrid
