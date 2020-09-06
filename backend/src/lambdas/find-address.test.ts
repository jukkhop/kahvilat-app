/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/camelcase */

import { APIGatewayProxyEvent } from 'aws-lambda'
import fetch from 'node-fetch'
import redis from 'redis-mock'

import { helper as handler } from './find-address'
import Cache from '../cache'
import AsyncRedisClient from '../clients/async-redis-client'
import GoogleClient from '../clients/google-client'

jest.mock('node-fetch', jest.fn)

const { Response } = jest.requireActual('node-fetch')

// @ts-ignore
const validEvent: APIGatewayProxyEvent = {
  queryStringParameters: {
    latitude: 'foo',
    longitude: 'bar',
  },
}

const validBody = JSON.stringify({
  results: [
    {
      address_components: [
        {
          long_name: '6',
          short_name: '6',
          types: ['street_number'],
        },
        {
          long_name: 'Telakkakatu',
          short_name: 'Telakkakatu',
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
    },
  ],
})

const baseUrl = 'https://maps.googleapis.com/maps/api'
const cacheKey = 'find-address?latitude=foo&longitude=bar'

let cache: Cache
let googleClient: GoogleClient
let fetchFn: jest.MockedFunction<typeof fetch>
let cacheGet: jest.SpyInstance<Promise<string | undefined>, [string]>
let cacheSet: jest.SpyInstance<Promise<void>, [string, string, (number | undefined)?]>
let findAddress: jest.SpyInstance<Promise<[number, any, (string | undefined)?]>, [string, string]>

beforeEach(() => {
  // @ts-ignore
  const redisClient = new AsyncRedisClient(undefined, undefined, redis.createClient())

  cache = new Cache(undefined, undefined, redisClient)
  googleClient = new GoogleClient('some-api-key', 'some-lang')
  fetchFn = fetch as jest.MockedFunction<typeof fetch>
  cacheGet = jest.spyOn(Cache.prototype, 'get')
  cacheSet = jest.spyOn(Cache.prototype, 'set')
  findAddress = jest.spyOn(GoogleClient.prototype, 'findAddress')

  cache.delete(cacheKey)
  fetchFn.mockClear()
  cacheGet.mockClear()
  cacheSet.mockClear()
  findAddress.mockClear()
})

it('should call Google API with the provided parameters and return valid data', async () => {
  const expectedUrl = `${baseUrl}/geocode/json?key=some-api-key&language=some-lang&latlng=foo,bar`
  const expectedHeaders = {
    'Access-Control-Allow-Origin': '',
    'Access-Control-Allow-Credentials': true,
  }
  fetchFn.mockResolvedValueOnce(new Response(validBody, { status: 200 }))
  const { statusCode, headers = {}, body } = await handler(validEvent, cache, googleClient)
  expect(findAddress).toHaveBeenCalledWith('foo', 'bar')
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
  const invalidEvent: APIGatewayProxyEvent = {
    queryStringParameters: { latitude: 'foo' },
  }
  const expectedBody = JSON.stringify({ error: 'Missing query string parameter: longitude' })
  const { statusCode, body } = await handler(invalidEvent, cache, googleClient)
  expect(findAddress).not.toHaveBeenCalled()
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