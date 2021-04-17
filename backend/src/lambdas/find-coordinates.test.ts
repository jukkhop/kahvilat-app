import { APIGatewayProxyEvent } from 'aws-lambda'
import fetch from 'node-fetch'
import redis from 'redis-mock'

import { impl as handler } from './find-coordinates'
import Cache from '../cache'
import AsyncRedisClient from '../clients/async-redis-client'
import GoogleClient from '../clients/google-client'

jest.mock('node-fetch', jest.fn)

const { Response } = jest.requireActual('node-fetch')

// @ts-ignore
const validEvent: APIGatewayProxyEvent = {
  queryStringParameters: {
    address: 'foobar-12',
  },
}

const validBody = JSON.stringify({
  results: [
    {
      address_components: [
        { long_name: '7', short_name: '7', types: ['street_number'] },
        {
          long_name: 'Perämiehenkatu',
          short_name: 'Perämiehenkatu',
          types: ['route'],
        },
        {
          long_name: 'Helsinki',
          short_name: 'HKI',
          types: ['locality', 'political'],
        },
        {
          long_name: 'Suomi',
          short_name: 'FI',
          types: ['country', 'political'],
        },
        {
          long_name: '00150',
          short_name: '00150',
          types: ['postal_code'],
        },
      ],
      formatted_address: 'Perämiehenkatu 7, 00150 Helsinki, Suomi',
      geometry: {
        location: { lat: 60.1586976, lng: 24.9348757 },
        location_type: 'ROOFTOP',
        viewport: {
          northeast: { lat: 60.16004658029151, lng: 24.9362246802915 },
          southwest: { lat: 60.15734861970849, lng: 24.9335267197085 },
        },
      },
      place_id: 'ChIJ0duknbYLkkYRtYvMJcPqxmQ',
      plus_code: {
        compound_code: '5W5M+FX Helsinki, Suomi',
        global_code: '9GG65W5M+FX',
      },
      types: ['street_address'],
    },
  ],
})

const baseUrl = 'https://maps.googleapis.com/maps/api'
const cacheKey = 'find-coordinates?address=foobar-12'

let cache: Cache
let googleClient: GoogleClient
let fetchFn: jest.MockedFunction<typeof fetch>
let cacheGet: jest.SpyInstance<Promise<string | undefined>, [string]>
let cacheSet: jest.SpyInstance<Promise<void>, [string, string, (number | undefined)?]>
let findCoordinates: jest.SpyInstance<Promise<[number, any, string?]>, [string]>

beforeEach(() => {
  // @ts-ignore
  const redisClient = new AsyncRedisClient(undefined, undefined, redis.createClient())

  cache = new Cache(undefined, undefined, redisClient)
  googleClient = new GoogleClient('some-api-key', 'some-lang')
  fetchFn = fetch as jest.MockedFunction<typeof fetch>
  cacheGet = jest.spyOn(Cache.prototype, 'get')
  cacheSet = jest.spyOn(Cache.prototype, 'set')
  findCoordinates = jest.spyOn(GoogleClient.prototype, 'findCoordinates')

  cache.delete(cacheKey)
  fetchFn.mockClear()
  cacheGet.mockClear()
  cacheSet.mockClear()
  findCoordinates.mockClear()
})

it('should call Google API with the provided parameters and return valid data', async () => {
  const expectedUrl = `${baseUrl}/geocode/json?address=foobar-12&key=some-api-key&language=some-lang`
  const expectedHeaders = {
    'Access-Control-Allow-Origin': '',
    'Access-Control-Allow-Credentials': true,
  }
  fetchFn.mockResolvedValueOnce(new Response(validBody, { status: 200 }))
  const { statusCode, headers = {}, body } = await handler(validEvent, cache, googleClient)
  expect(findCoordinates).toHaveBeenCalledWith('foobar-12')
  expect(cacheGet).toHaveBeenCalledWith(cacheKey)
  expect(cacheGet).toHaveReturnedWith(Promise.resolve(undefined))
  expect(fetchFn).toHaveBeenCalledWith(expectedUrl)
  expect(cacheSet).toHaveBeenCalledWith(cacheKey, validBody, 86400)
  expect(statusCode).toBe(200)
  expect(headers).toEqual(expectedHeaders)
  expect(body).toBe(validBody)
})

it('should return a cached response, if present', async () => {
  await cache.set(cacheKey, validBody)
  const { statusCode, body } = await handler(validEvent, cache, googleClient)
  expect(cacheGet).toHaveBeenCalledWith(cacheKey)
  expect(cacheGet).toHaveReturnedWith(Promise.resolve(validBody))
  expect(fetchFn).not.toHaveBeenCalled()
  expect(statusCode).toBe(200)
  expect(body).toBe(validBody)
})

it('should return 400 Bad Request if not given all required parameters', async () => {
  // @ts-ignore
  const invalidEvent: APIGatewayProxyEvent = {}
  const expectedBody = JSON.stringify({ error: 'Missing query string parameter: address' })
  const { statusCode, body } = await handler(invalidEvent, cache, googleClient)
  expect(findCoordinates).not.toHaveBeenCalled()
  expect(statusCode).toBe(400)
  expect(body).toBe(expectedBody)
})

it('should return 502 Bad Gateway Error if Google API call fails with HTTP 5xx', async () => {
  const expectedBody = JSON.stringify({
    error: 'Third party API call failed with HTTP status 500 and content some-error',
  })
  fetchFn.mockResolvedValueOnce(new Response(JSON.stringify('some-error'), { status: 500 }))
  const { statusCode, body } = await handler(validEvent, cache, googleClient)
  expect(fetchFn).toHaveBeenCalled()
  expect(cacheSet).not.toHaveBeenCalled()
  expect(statusCode).toBe(502)
  expect(body).toBe(expectedBody)
})
