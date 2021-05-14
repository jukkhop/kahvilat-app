import { Address, Place } from '../types'

const address: Address = {
  address: 'Telakkakatu 6, 00150 Helsinki, Suomi',
  id: 'ChIJeU3PtysKkkYR948uyfnAMX4',
  location: { latitude: 60.15855180000001, longitude: 24.9323386 },
}

const place: Place = {
  address: 'Fredrikinkatu 19, Helsinki',
  icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/cafe-71.png',
  id: 'ChIJgUCiJ7YLkkYRj6mOfjUbO5c',
  location: { latitude: 60.1611124, longitude: 24.9417875 },
  name: 'Brooklyn Cafe',
  openNow: false,
  rating: 4.5,
  status: 'OPERATIONAL',
  types: ['cafe', 'food', 'point_of_interest', 'establishment'],
}

export { address, place }
