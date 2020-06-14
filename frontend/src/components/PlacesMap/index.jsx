import { arrayOf, number, shape } from 'prop-types'
import React from 'react'
// import styled from 'styled-components'
import { GoogleMap, /* InfoWindow, */ Marker } from '@react-google-maps/api'

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

// const InfoWindowText = styled.span`
//   font-family: Montserrat;
//   font-size: 0.65rem;
//   font-weight: 600;
//   user-select: none;
// `

function PlacesMap({ coords, places }) {
  const onLoad = React.useCallback(
    map => {
      const bounds = new window.google.maps.LatLngBounds()
      bounds.extend({ lat: coords.latitude, lng: coords.longitude })
      places.forEach(place => bounds.extend(place))
      map.fitBounds(bounds)
    },
    [coords, places],
  )

  return (
    <GoogleMap
      center={{ lat: coords.latitude, lng: coords.longitude }}
      mapContainerStyle={containerStyle}
      onLoad={onLoad}
      options={options}
      zoom={2}
    >
      {places.map(({ id, lat, lng /* name */ }) => (
        <Marker key={id} position={{ lat, lng }}>
          {/* <InfoWindow>
            <InfoWindowText>{name}</InfoWindowText>
          </InfoWindow> */}
        </Marker>
      ))}
      <></>
    </GoogleMap>
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
