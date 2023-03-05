import { getDistance } from 'geolib'
import { Location, Place } from '../types/api'
import { PlacesListItem } from '../types/ui'

function createPlaceItem(from: Location) {
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

function sortPlaceItems(a: PlacesListItem, b: PlacesListItem): number {
  if (a.openNow && !b.openNow) {
    return -1
  }
  if (!a.openNow && b.openNow) {
    return 1
  }
  if (a.rating > b.rating) {
    return -1
  }
  if (a.rating < b.rating) {
    return 1
  }
  if (a.distance < b.distance) {
    return -1
  }
  if (a.distance > b.distance) {
    return 1
  }
  return 0
}

export { createPlaceItem, sortPlaceItems }
