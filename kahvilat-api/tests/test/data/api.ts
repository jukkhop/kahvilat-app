import { Address, Place } from '../../../src/types/api'

const address1: Address = {
  address: 'Telakkakatu 6, 00150 Helsinki, Suomi',
  id: 'ChIJ8W5KFbQLkkYRSXUp2rrqSr4',
  location: { latitude: 60.1587165, longitude: 24.9317486 },
}

const place1: Place = {
  address: 'Fredrikinkatu 19, Helsinki',
  icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/cafe-71.png',
  id: 'ChIJgUCiJ7YLkkYRj6mOfjUbO5c',
  location: { latitude: 60.1611124, longitude: 24.9417875 },
  name: 'Brooklyn Cafe',
  openNow: true,
  rating: 4.5,
  status: 'OPERATIONAL',
  types: ['cafe', 'food', 'point_of_interest', 'establishment'],
}

export { address1, place1 }
