import { Place } from '../types/'

function sortPlaces(a: Place, b: Place): number {
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

export { sortPlaces }
