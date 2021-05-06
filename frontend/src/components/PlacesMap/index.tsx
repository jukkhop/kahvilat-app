import React from 'react'
import { GoogleMap, Marker } from '@react-google-maps/api'

import { Place } from '../../types'

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
  coords: {
    latitude: number
    longitude: number
  }
  places: Place[]
}

function PlacesMap(props: Props): JSX.Element {
  const { coords, places } = props
  const latitude = Number(coords.latitude)
  const longitude = Number(coords.longitude)

  const onLoad = React.useCallback(
    map => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const bounds = new window.google.maps.LatLngBounds()
      bounds.extend({ lat: latitude, lng: longitude })
      places.forEach(place => bounds.extend(place))
      map.fitBounds(bounds)
    },
    [coords, places],
  )

  return (
    <GoogleMap
      center={{ lat: latitude, lng: longitude }}
      mapContainerStyle={containerStyle}
      onLoad={onLoad}
      options={options}
      zoom={2}
    >
      {places.map(({ name, lat, lng }) => (
        <Marker key={name} position={{ lat, lng }}>
          {/* <InfoWindow>
            <InfoWindowText>{name}</InfoWindowText>
          </InfoWindow> */}
        </Marker>
      ))}
    </GoogleMap>
  )
}

export default PlacesMap
