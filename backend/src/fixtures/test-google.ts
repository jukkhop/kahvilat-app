import { GoogleAddress, GooglePlace } from '../types'

const address: GoogleAddress = {
  address_components: [
    { long_name: '6', short_name: '6', types: ['street_number'] },
    { long_name: 'Telakkakatu', short_name: 'Telakkakatu', types: ['route'] },
    { long_name: 'Helsinki', short_name: 'HKI', types: ['locality', 'political'] },
    { long_name: 'Suomi', short_name: 'FI', types: ['country', 'political'] },
    { long_name: '00150', short_name: '00150', types: ['postal_code'] },
  ],
  formatted_address: 'Telakkakatu 6, 00150 Helsinki, Suomi',
  geometry: {
    location: { lat: 60.15855180000001, lng: 24.9323386 },
    location_type: 'ROOFTOP',
    viewport: {
      northeast: { lat: 60.15990078029151, lng: 24.9336875802915 },
      southwest: { lat: 60.15720281970849, lng: 24.93098961970849 },
    },
  },
  place_id: 'ChIJeU3PtysKkkYR948uyfnAMX4',
  plus_code: {
    compound_code: '5W5J+CW Helsinki, Suomi',
    global_code: '9GG65W5J+CW',
  },
  types: ['establishment', 'point_of_interest'],
}

const place: GooglePlace = {
  business_status: 'OPERATIONAL',
  geometry: {
    location: { lat: 60.1611124, lng: 24.9417875 },
    viewport: {
      northeast: { lat: 60.16243152989271, lng: 24.94304767989272 },
      southwest: { lat: 60.15973187010727, lng: 24.94034802010728 },
    },
  },
  icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/cafe-71.png',
  id: '4ed1c053cd3806efbba2786cc74e20af94df9d4c',
  name: 'Brooklyn Cafe',
  opening_hours: { open_now: false },
  photos: [],
  place_id: 'ChIJgUCiJ7YLkkYRj6mOfjUbO5c',
  plus_code: {
    compound_code: '5W6R+CP Helsinki',
    global_code: '9GG65W6R+CP',
  },
  price_level: 2,
  rating: 4.5,
  reference: 'ChIJgUCiJ7YLkkYRj6mOfjUbO5c',
  scope: 'GOOGLE',
  types: ['cafe', 'food', 'point_of_interest', 'establishment'],
  user_ratings_total: 477,
  vicinity: 'Fredrikinkatu 19, Helsinki',
}

export { address, place }
