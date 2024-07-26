import { Config } from '../src/types/config'

export const config: Config = {
  cicd: {
    stage: 'jest',
  },
  google: {
    apiKey: 'google-api-key',
    baseUrl: new URL('https://google-base-url.com/api'),
    language: 'google-language',
  },
  redis: {
    host: 'redis-host',
    port: 0,
  },
  ui: {
    baseUrl: new URL('https://ui-base-url.com'),
  },
}

const googleCache = {
  getAddresses: jest.fn(),
  getPlaces: jest.fn(),
}

const googleClient = {
  getAddresses: jest.fn(),
  getPlaces: jest.fn(),
}

const caches = {
  googleCache,
}

const clients = {
  googleClient,
}

const logger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

const results = {
  badGateway: jest.fn(),
  badRequest: jest.fn(),
  internalError: jest.fn(),
  json: jest.fn(),
  notFound: jest.fn(),
  options: jest.fn(),
  validationError: jest.fn(),
}

const utils = {
  date: jest.fn(),
  fetch: jest.fn(),
}

export const testContext = {
  caches,
  clients,
  config,
  logger,
  results,
  utils,
}
