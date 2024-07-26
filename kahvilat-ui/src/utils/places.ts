import { getDistance } from 'geolib'
import { Location, Place } from '../types/api'
import { PlacesListItem } from '../types/ui'

export function createPlaceItem(from: Location) {
  return (place: Place): PlacesListItem => {
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
