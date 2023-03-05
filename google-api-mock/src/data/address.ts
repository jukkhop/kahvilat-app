import { Address } from '../types/google'

const address1: Address = {
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

const address2: Address = {
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

export { address1, address2 }
