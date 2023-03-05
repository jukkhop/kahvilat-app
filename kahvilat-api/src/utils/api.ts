import * as Api from '../types/api'
import * as Google from '../types/google'

function convertAddress(address: Google.Address): Api.Address {
  return {
    address: address.formatted_address,
    id: address.place_id,
    location: {
      latitude: address.geometry.location.lat,
      longitude: address.geometry.location.lng,
    },
  }
}

function convertPlace(place: Google.Place): Api.Place {
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

export { convertAddress, convertPlace }
