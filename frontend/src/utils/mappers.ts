import { getDistance } from 'geolib'
import { Common, Coords, Place } from '../types'

function mapPlace(from: Coords) {
  return (place: Common.Place): Place => {
    return {
      address: place.address,
      coords: place.location,
      distance: getDistance(from, place.location, 100),
      icon: place.icon,
      name: place.name,
      openNow: place.openNow,
      rating: place.rating,
    }
  }
}

export { mapPlace }
