import React, { useCallback } from 'react'
import { GoogleMap, Marker } from '@react-google-maps/api'

import { Location } from '../../../types/api'
import { PlacesListItem } from '../../../types/ui'

interface Props {
  center: Location
  places: PlacesListItem[]
}

function PlacesMap(props: Props): JSX.Element {
  const { center, places } = props

  const onLoad = useCallback(
    (map: any) => {
      const bounds = new window.google.maps.LatLngBounds()
      bounds.extend({ lat: center.latitude, lng: center.longitude })
      places.forEach(({ coords }) => bounds.extend({ lat: coords.latitude, lng: coords.longitude }))
      map.fitBounds(bounds)
    },
    [center, places],
  )

  return (
    <GoogleMap
      center={{ lat: center.latitude, lng: center.longitude }}
      id="places-map"
      mapContainerStyle={mapContainerStyle}
      onLoad={onLoad}
      options={mapOptions}
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

const mapContainerStyle = {
  width: '100%',
  height: '400px',
}

const mapOptions = {
  backgroundColor: 'white',
  clickableIcons: false,
  controlSize: 27,
  fullscreenControl: false,
  mapTypeControl: false,
  rotateControl: false,
  streetViewControl: false,
}

export { PlacesMap }
