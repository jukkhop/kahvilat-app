import { Address, Config, Place } from '../../../src/types'

const config: Config = {
  frontend: {
    url: 'http://localhost:3000',
  },
  google: {
    apiKey: 'some-api-key',
    baseUrl: 'https://maps.googleapis.com/maps/api',
    language: 'some-lang',
  },
  redis: {
    host: 'some-host',
    port: 1234,
  },
  stage: 'test',
}

export { config }

const address: Address = {
  address: 'Telakkakatu 6, 00150 Helsinki, Suomi',
  id: 'ChIJ8W5KFbQLkkYRSXUp2rrqSr4',
  location: { latitude: 60.1587165, longitude: 24.9317486 },
}

const place: Place = {
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

export { address, place }
