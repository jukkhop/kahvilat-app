import { Address, GoogleAddress, GooglePlace, Place } from './types'

function transformAddress(address: GoogleAddress): Address {
  return {
    address: address.formatted_address,
    id: address.place_id,
    location: {
      latitude: address.geometry.location.lat,
      longitude: address.geometry.location.lng,
    },
  }
}

function transformPlace(place: GooglePlace): Place {
  return {
    address: place.vicinity,
    icon: place.icon,
    id: place.place_id,
    location: {
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
    },
    name: place.name,
    openNow: place.opening_hours?.open_now || false,
    rating: place.rating,
    status: place.business_status,
    types: place.types,
  }
}

export { transformAddress, transformPlace }
