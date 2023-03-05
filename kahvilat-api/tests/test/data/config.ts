import { Config } from '../../../src/types/config'

const config: Config = {
  cicd: {
    stage: 'test',
  },
  google: {
    apiKey: 'some-api-key',
    baseUrl: new URL('https://maps.googleapis.com/maps/api'),
    language: 'some-lang',
  },
  redis: {
    host: 'some-host',
    port: 1234,
  },
  ui: {
    url: new URL('http://localhost:3000'),
  },
}

export { config }
