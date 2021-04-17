import { Address } from '../types'

const address: Address = {
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

export default address
