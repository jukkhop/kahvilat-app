import { GoogleAddress, GooglePlace } from './types'

const address1: GoogleAddress = {
  address_components: [
    { long_name: '12', short_name: '12', types: ['street_number'] },
    { long_name: 'Fredrikinkatu', short_name: 'Fredrikinkatu', types: ['route'] },
    { long_name: 'Helsinki', short_name: 'HKI', types: ['locality', 'political'] },
    { long_name: 'Suomi', short_name: 'FI', types: ['country', 'political'] },
    { long_name: '00120', short_name: '00120', types: ['postal_code'] },
  ],
  formatted_address: 'Fredrikinkatu 12, 00120 Helsinki, Suomi',
  geometry: {
    bounds: {
      northeast: { lat: 60.1610875, lng: 24.9417562 },
      southwest: { lat: 60.1607163, lng: 24.9412294 },
    },
    location: { lat: 60.160855, lng: 24.941458 },
    location_type: 'ROOFTOP',
    viewport: {
      northeast: { lat: 60.16225088029151, lng: 24.9428417802915 },
      southwest: { lat: 60.1595529197085, lng: 24.9401438197085 },
    },
  },
  place_id: 'ChIJD5l4L7YLkkYRhhXiW_iyw0g',
  types: ['premise'],
}

const place1: GooglePlace = {
  business_status: 'OPERATIONAL',
  geometry: {
    location: { lat: 60.1611124, lng: 24.9417875 },
    viewport: {
      northeast: { lat: 60.16243152989271, lng: 24.94304767989272 },
      southwest: { lat: 60.15973187010727, lng: 24.94034802010728 },
    },
  },
  icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/cafe-71.png',
  name: 'Brooklyn Cafe',
  opening_hours: { open_now: false },
  photos: [],
  place_id: 'ChIJgUCiJ7YLkkYRj6mOfjUbO5c',
  plus_code: { compound_code: '5W6R+CP Helsinki', global_code: '9GG65W6R+CP' },
  price_level: 2,
  rating: 4.5,
  reference: 'ChIJgUCiJ7YLkkYRj6mOfjUbO5c',
  scope: 'GOOGLE',
  types: ['cafe', 'food', 'point_of_interest', 'establishment'],
  user_ratings_total: 477,
  vicinity: 'Fredrikinkatu 19, Helsinki',
}

const place2: GooglePlace = {
  business_status: 'OPERATIONAL',
  geometry: {
    location: { lat: 60.1628425, lng: 24.9390518 },
    viewport: {
      northeast: { lat: 60.16418332989273, lng: 24.94037522989272 },
      southwest: { lat: 60.16148367010729, lng: 24.93767557010728 },
    },
  },
  icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/cafe-71.png',
  name: 'Andante Coffee',
  opening_hours: { open_now: true },
  photos: [],
  place_id: 'ChIJQXtfHcoLkkYR-3kHocIeOSs',
  plus_code: { compound_code: '5W7Q+4J Helsinki', global_code: '9GG65W7Q+4J' },
  price_level: 2,
  rating: 4.4,
  reference: 'ChIJQXtfHcoLkkYR-3kHocIeOSs',
  scope: 'GOOGLE',
  types: ['cafe', 'food', 'point_of_interest', 'establishment'],
  user_ratings_total: 247,
  vicinity: 'Fredrikinkatu 20, Helsinki',
}

const place3: GooglePlace = {
  business_status: 'OPERATIONAL',
  geometry: {
    location: { lat: 60.15850560000001, lng: 24.9341024 },
    viewport: {
      northeast: { lat: 60.15981217989273, lng: 24.93548072989272 },
      southwest: { lat: 60.15711252010728, lng: 24.93278107010728 },
    },
  },
  icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/cafe-71.png',
  name: 'Kaffa Roastery',
  opening_hours: { open_now: true },
  photos: [],
  place_id: 'ChIJx7csnrYLkkYRHu4tXVZYXP0',
  plus_code: { compound_code: '5W5M+CJ Helsinki', global_code: '9GG65W5M+CJ' },
  price_level: 2,
  rating: 4.7,
  reference: 'ChIJx7csnrYLkkYRHu4tXVZYXP0',
  scope: 'GOOGLE',
  types: ['cafe', 'bar', 'food', 'point_of_interest', 'store', 'establishment'],
  user_ratings_total: 257,
  vicinity: 'Pursimiehenkatu 29, Helsinki',
}

export { address1, place1, place2, place3 }
