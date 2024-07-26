import { Place } from '../types/api'

export const place1: Place = {
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

export const place2: Place = {
  address: 'Fredrikinkatu 20, Helsinki',
  icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/cafe-71.png',
  id: 'ChIJQXtfHcoLkkYR-3kHocIeOSs',
  location: { latitude: 60.1628425, longitude: 24.9390518 },
  name: 'Andante Coffee',
  openNow: true,
  rating: 4.4,
  status: 'OPERATIONAL',
  types: ['cafe', 'food', 'point_of_interest', 'establishment'],
}
