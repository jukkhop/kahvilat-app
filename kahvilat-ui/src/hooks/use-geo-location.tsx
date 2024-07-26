import { useState, useEffect } from 'react'
import { Location } from '../types/api'

export function useGeoLocation(): Location | undefined {
  const [location, setLocation] = useState<Location | undefined>(undefined)

  useEffect(() => {
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        setLocation({ latitude, longitude })
      })
    }
  }, [])

  return location
}
