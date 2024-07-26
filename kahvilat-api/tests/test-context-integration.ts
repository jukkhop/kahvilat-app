import { GoogleCache } from '../src/caches'
import { GoogleClient } from '../src/clients/google'
import { Config } from '../src/types/config'
import { initResults } from '../src/utils/results'

const config: Config = {
  cicd: {
    stage: 'jest',
  },
  google: {
    apiKey: 'some-api-key',
    baseUrl: new URL('https://maps.googleapis.com/maps/api'),
    language: 'some-lang',
  },
  redis: {
    host: 'localhost',
    port: 6380,
  },
  ui: {
    baseUrl: new URL('http://localhost:3000'),
  },
}

const utils = {
  date: () => new Date(),
  fetch: jest.fn(),
}

const caches = {
  googleCache: new GoogleCache(config),
}

const clients = {
  googleClient: new GoogleClient(config, utils),
}

const logger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

const results = initResults(config)

export const testContext = {
  caches,
  clients,
  config,
  logger,
  results,
  utils,
}
