import { Address, Place } from '../../../src/types/google'

const address1: Address = {
  address_components: [
    { long_name: '6', short_name: '6', types: ['street_number'] },
    { long_name: 'Telakkakatu', short_name: 'Telakkakatu', types: ['route'] },
    { long_name: 'Helsinki', short_name: 'HKI', types: ['locality', 'political'] },
    { long_name: 'Suomi', short_name: 'FI', types: ['country', 'political'] },
    { long_name: '00150', short_name: '00150', types: ['postal_code'] },
  ],
  formatted_address: 'Telakkakatu 6, 00150 Helsinki, Suomi',
  geometry: {
    bounds: { northeast: { lat: 60.15883530000001, lng: 24.9319062 }, southwest: { lat: 60.1585668, lng: 24.9315268 } },
    location: { lat: 60.1587165, lng: 24.9317486 },
    location_type: 'ROOFTOP',
    viewport: {
      northeast: { lat: 60.16005003029151, lng: 24.9330654802915 },
      southwest: { lat: 60.15735206970849, lng: 24.9303675197085 },
    },
  },
  place_id: 'ChIJ8W5KFbQLkkYRSXUp2rrqSr4',
  types: ['premise'],
}

const place1: Place = {
  business_status: 'OPERATIONAL',
  geometry: {
    location: { lat: 60.1611124, lng: 24.9417875 },
    viewport: {
      northeast: { lat: 60.16243152989271, lng: 24.94304767989272 },
      southwest: { lat: 60.15973187010727, lng: 24.94034802010728 },
    },
  },
  icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/cafe-71.png',
  name: 'Brooklyn Cafe',
  opening_hours: { open_now: true },
  photos: [],
  place_id: 'ChIJgUCiJ7YLkkYRj6mOfjUbO5c',
  plus_code: { compound_code: '5W6R+CP Helsinki', global_code: '9GG65W6R+CP' },
  price_level: 2,
  rating: 4.5,
  reference: 'ChIJgUCiJ7YLkkYRj6mOfjUbO5c',
  scope: 'GOOGLE',
  types: ['cafe', 'food', 'point_of_interest', 'establishment'],
  user_ratings_total: 529,
  vicinity: 'Fredrikinkatu 19, Helsinki',
}

export { address1, place1 }
