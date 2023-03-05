import React from 'react'
import styled from 'styled-components'

import { PlaceCard } from './PlaceCard'
import { PlacesListItem } from '../../../types/ui'

interface Props {
  places: PlacesListItem[]
}

function PlacesList(props: Props): JSX.Element {
  const { places } = props

  return (
    <Places id="places-list">
      {places.map(({ address, distance, icon, name, openNow, rating }) => (
        <PlaceCard
          address={address}
          distance={distance}
          icon={icon}
          key={name}
          name={name}
          openNow={openNow}
          rating={rating}
        />
      ))}
    </Places>
  )
}

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

export { PlacesList }
