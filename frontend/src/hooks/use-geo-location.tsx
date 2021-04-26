import { useState, useEffect } from 'react'
import { Coords } from '../types'

function useGeoLocation(): Coords | undefined {
  const [location, setLocation] = useState<Coords | undefined>(undefined)

  useEffect(() => {
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords
        setLocation({ latitude: latitude.toString(), longitude: longitude.toString() })
      })
    }
  }, [])

  return location
}

export { useGeoLocation }
