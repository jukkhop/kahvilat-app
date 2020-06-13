import { arrayOf, number, shape } from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from '@react-google-maps/api'

const containerStyle = {
  width: '100%',
  height: '400px',
}

const options = {
  backgroundColor: 'white',
  clickableIcons: false,
  controlSize: 27,
  fullscreenControl: false,
  mapTypeControl: false,
  rotateControl: false,
  streetViewControl: false,
}

const InfoWindowText = styled.span`
  font-family: Montserrat;
  font-size: 0.7rem;
  font-weight: 600;
  user-select: none;
`

function PlacesMap({ coords, places }) {
  const onLoad = React.useCallback(
    map => {
      const bounds = places.reduce(
        (acc, place) => acc.extend(place),
        new window.google.maps.LatLngBounds(),
      )
      map.fitBounds(bounds)
    },
    [places],
  )

  const { REACT_APP_GOOGLE_API_KEY } = process.env

  return (
    <LoadScript googleMapsApiKey={REACT_APP_GOOGLE_API_KEY}>
      <GoogleMap
        center={{ lat: coords.latitude, lng: coords.longitude }}
        mapContainerStyle={containerStyle}
        onLoad={onLoad}
        options={options}
        zoom={2}
      >
        {places.map(({ id, lat, lng, name }) => (
          <Marker key={id} position={{ lat, lng }} title={name}>
            <InfoWindow>
              <InfoWindowText>{name}</InfoWindowText>
            </InfoWindow>
          </Marker>
        ))}
        <></>
      </GoogleMap>
    </LoadScript>
  )
}

PlacesMap.propTypes = {
  coords: shape({
    latitude: number.isRequired,
    longitude: number.isRequired,
  }).isRequired,
  places: arrayOf(shape({})),
}

PlacesMap.defaultProps = {
  places: [],
}

export default PlacesMap
