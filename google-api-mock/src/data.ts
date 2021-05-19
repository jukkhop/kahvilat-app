import { GoogleAddress, GooglePlace } from './types'

const address1: GoogleAddress = {
  address_components: [
    { long_name: '22', short_name: '22', types: ['street_number'] },
    { long_name: 'Fredrikinkatu', short_name: 'Fredrikinkatu', types: ['route'] },
    { long_name: 'Helsinki', short_name: 'HKI', types: ['locality', 'political'] },
    { long_name: 'Suomi', short_name: 'FI', types: ['country', 'political'] },
    { long_name: '00120', short_name: '00120', types: ['postal_code'] },
  ],
  formatted_address: 'Fredrikinkatu 22, 00120 Helsinki, Suomi',
  geometry: {
    location: { lat: 60.1631932, lng: 24.93846 },
    location_type: 'ROOFTOP',
    viewport: {
      northeast: { lat: 60.16454218029151, lng: 24.9398089802915 },
      southwest: { lat: 60.16184421970849, lng: 24.9371110197085 },
    },
  },
  place_id: 'ChIJeaeDGcoLkkYRS6RluIAPJtM',
  plus_code: { compound_code: '5W7Q+79 Helsinki, Suomi', global_code: '9GG65W7Q+79' },
  types: ['street_address'],
}

const address2: GoogleAddress = {
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
    location: { lat: 60.16724860000001, lng: 24.9332438 },
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

const place4: GooglePlace = {
  business_status: 'OPERATIONAL',
  geometry: {
    location: { lat: 60.1585056, lng: 24.9341024 },
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

const place5: GooglePlace = {
  business_status: 'OPERATIONAL',
  geometry: {
    location: { lat: 60.1587096, lng: 24.9345428 },
    viewport: {
      northeast: { lat: 60.16006992989272, lng: 24.93596082989272 },
      southwest: { lat: 60.15737027010728, lng: 24.93326117010728 },
    },
  },
  icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/cafe-71.png',
  name: 'Moko Market Cafe',
  opening_hours: { open_now: true },
  photos: [],
  place_id: 'ChIJmSERnrYLkkYRAApeXry2wUk',
  plus_code: { compound_code: '5W5M+FR Helsinki', global_code: '9GG65W5M+FR' },
  price_level: 2,
  rating: 4.1,
  reference: 'ChIJmSERnrYLkkYRAApeXry2wUk',
  scope: 'GOOGLE',
  types: ['cafe', 'home_goods_store', 'restaurant', 'food', 'point_of_interest', 'store', 'establishment'],
  user_ratings_total: 148,
  vicinity: 'Perämiehenkatu 10, Helsinki',
}

const place6: GooglePlace = {
  business_status: 'OPERATIONAL',
  geometry: {
    location: { lat: 60.1581949, lng: 24.942709 },
    viewport: {
      northeast: { lat: 60.15950292989272, lng: 24.94406717989272 },
      southwest: { lat: 60.15680327010728, lng: 24.94136752010728 },
    },
  },
  icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/cafe-71.png',
  name: 'Café Kentauri',
  opening_hours: { open_now: true },
  photos: [],
  place_id: 'ChIJoS_dJvMLkkYRnzPd5hC-e3I',
  plus_code: { compound_code: '5W5V+73 Helsinki', global_code: '9GG65W5V+73' },
  rating: 4.5,
  reference: 'ChIJoS_dJvMLkkYRnzPd5hC-e3I',
  scope: 'GOOGLE',
  types: ['cafe', 'restaurant', 'food', 'point_of_interest', 'establishment'],
  user_ratings_total: 28,
  vicinity: 'Tehtaankatu 19, Helsinki',
}

export { address1, address2, place1, place2, place3, place4, place5, place6 }
