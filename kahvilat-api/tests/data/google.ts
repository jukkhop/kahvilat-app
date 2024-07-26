import { Address, Place } from '../../src/types/google'

export namespace GoogleTestData {
  export const address1: Address = {
    address_components: [
      { long_name: '6', short_name: '6', types: ['street_number'] },
      { long_name: 'Telakkakatu', short_name: 'Telakkakatu', types: ['route'] },
      { long_name: 'Helsinki', short_name: 'HKI', types: ['locality', 'political'] },
      { long_name: 'Suomi', short_name: 'FI', types: ['country', 'political'] },
      { long_name: '00150', short_name: '00150', types: ['postal_code'] },
    ],
    formatted_address: 'Telakkakatu 6, 00150 Helsinki, Suomi',
    geometry: {
      bounds: {
        northeast: { lat: 60.1588353, lng: 24.9319062 },
        southwest: { lat: 60.1585668, lng: 24.9315268 },
      },
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

  export const address2: Address = {
    address_components: [
      { long_name: '1', short_name: '1', types: ['street_number'] },
      { long_name: 'Perämiehenkatu', short_name: 'Perämiehenkatu', types: ['route'] },
      { long_name: 'Helsinki', short_name: 'HKI', types: ['locality', 'political'] },
      { long_name: 'Suomi', short_name: 'FI', types: ['country', 'political'] },
      { long_name: '00150', short_name: '00150', types: ['postal_code'] },
    ],
    formatted_address: 'Perämiehenkatu 1, 00150 Helsinki, Suomi',
    geometry: {
      location: { lat: 60.1580323, lng: 24.9352637 },
      location_type: 'ROOFTOP',
      viewport: {
        northeast: { lat: 60.1593812802915, lng: 24.9366126802915 },
        southwest: { lat: 60.15668331970849, lng: 24.9339147197085 },
      },
    },
    place_id: 'ChIJ2_hjubYLkkYRpYPfcRrfnXQ',
    plus_code: { compound_code: '5W5P+64 Helsinki, Suomi', global_code: '9GG65W5P+64' },
    types: ['street_address'],
  }

  export const place1: Place = {
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

  export const place2: Place = {
    business_status: 'OPERATIONAL',
    geometry: {
      location: { lat: 60.1672486, lng: 24.9332438 },
      viewport: {
        northeast: { lat: 60.16856112989272, lng: 24.93448612989272 },
        southwest: { lat: 60.16586147010727, lng: 24.93178647010728 },
      },
    },
    icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/cafe-71.png',
    name: 'Helkatti Cat Cafe',
    opening_hours: { open_now: true },
    photos: [],
    place_id: 'ChIJOa0PMcsLkkYRzE0zIaklq1Y',
    plus_code: { compound_code: '5W8M+V7 Helsinki', global_code: '9GG65W8M+V7' },
    price_level: 2,
    rating: 4.6,
    reference: 'ChIJOa0PMcsLkkYRzE0zIaklq1Y',
    scope: 'GOOGLE',
    types: ['cafe', 'restaurant', 'food', 'point_of_interest', 'store', 'establishment'],
    user_ratings_total: 817,
    vicinity: 'Fredrikinkatu 55, Helsinki',
  }
}
