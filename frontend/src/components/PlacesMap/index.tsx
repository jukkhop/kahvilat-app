import React from 'react'
import { GoogleMap, Marker } from '@react-google-maps/api'

import { Coords, Place } from '../../types'

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

interface Props {
  center: Coords
  places: Place[]
}

function PlacesMap(props: Props): JSX.Element {
  const { center, places } = props

  const onLoad = React.useCallback(
    map => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const bounds = new window.google.maps.LatLngBounds()
      bounds.extend({ lat: center.latitude, lng: center.longitude })
      places.forEach(place => bounds.extend({ lat: place.coords.latitude, lng: place.coords.longitude }))
      map.fitBounds(bounds)
    },
    [center, places],
  )

  return (
    <GoogleMap
      center={{ lat: center.latitude, lng: center.longitude }}
      mapContainerStyle={containerStyle}
      onLoad={onLoad}
      options={options}
      zoom={2}
    >
      {places.map(({ name, coords: { latitude, longitude } }) => (
        <Marker key={name} position={{ lat: latitude, lng: longitude }}>
          {/* <InfoWindow>
            <InfoWindowText>{name}</InfoWindowText>
          </InfoWindow> */}
        </Marker>
      ))}
    </GoogleMap>
  )
}

export default PlacesMap
