import { Config } from '../types'

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

export default config
