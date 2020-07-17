/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/camelcase */

import { APIGatewayProxyEvent } from 'aws-lambda'
import fetch from 'node-fetch'
import redis from 'redis-mock'

import { helper as handler } from './find-places'
import Cache from '../cache'
import AsyncRedisClient from '../clients/async-redis-client'
import GoogleClient from '../clients/google-client'

jest.mock('node-fetch', jest.fn)

const { Response } = jest.requireActual('node-fetch')

// @ts-ignore
const validEvent: APIGatewayProxyEvent = {
  queryStringParameters: {
    keyword: 'coffee',
    latitude: '60.165324',
    longitude: '24.939724',
    radius: '500',
    type: 'cafe',
  },
}

const validBody = JSON.stringify({
  results: [
    {
      business_status: 'OPERATIONAL',
      geometry: {
        location: { lat: 60.1611124, lng: 24.9417875 },
        viewport: {
          northeast: { lat: 60.16243152989271, lng: 24.94304767989272 },
          southwest: { lat: 60.15973187010727, lng: 24.94034802010728 },
        },
      },
      icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/cafe-71.png',
      id: '4ed1c053cd3806efbba2786cc74e20af94df9d4c',
      name: 'Brooklyn Cafe',
      opening_hours: { open_now: false },
      photos: [],
      place_id: 'ChIJgUCiJ7YLkkYRj6mOfjUbO5c',
      plus_code: {
        compound_code: '5W6R+CP Helsinki',
        global_code: '9GG65W6R+CP',
      },
      price_level: 2,
      rating: 4.5,
      reference: 'ChIJgUCiJ7YLkkYRj6mOfjUbO5c',
      scope: 'GOOGLE',
      types: ['cafe', 'food', 'point_of_interest', 'establishment'],
      user_ratings_total: 477,
      vicinity: 'Fredrikinkatu 19, Helsinki',
    },
  ],
})

const baseUrl = 'https://maps.googleapis.com/maps/api'
const cacheKey =
  'find-places?keyword=coffee&latitude=60.165324&longitude=24.939724&radius=500&type=cafe'

let cache: Cache
let googleClient: GoogleClient
let fetchFn: jest.MockedFunction<typeof fetch>
let cacheGet: jest.SpyInstance<Promise<string | undefined>, [string]>
let cacheSet: jest.SpyInstance<Promise<void>, [string, string, (number | undefined)?]>
let findPlaces: jest.SpyInstance<
  Promise<[number, any, (string | undefined)?]>,
  [
    (string | undefined)?,
    (string | undefined)?,
    (string | undefined)?,
    (string | undefined)?,
    (number | undefined)?,
    (string | undefined)?,
  ]
>

beforeEach(() => {
  // @ts-ignore
  const redisClient = new AsyncRedisClient(undefined, undefined, redis.createClient())

  cache = new Cache(undefined, undefined, redisClient)
  googleClient = new GoogleClient('some-api-key', 'some-lang')
  fetchFn = fetch as jest.MockedFunction<typeof fetch>
  cacheGet = jest.spyOn(Cache.prototype, 'get')
  cacheSet = jest.spyOn(Cache.prototype, 'set')
  findPlaces = jest.spyOn(GoogleClient.prototype, 'findPlaces')

  cache.delete(cacheKey)
  fetchFn.mockClear()
  cacheGet.mockClear()
  cacheSet.mockClear()
  findPlaces.mockClear()
})

it('should call Google API with the provided parameters and return valid data', async () => {
  const expectedUrl = `${baseUrl}/place/nearbysearch/json?key=some-api-key&keyword=coffee&location=60.165324,24.939724&radius=500&types=cafe`
  const expectedHeaders = {
    'Access-Control-Allow-Origin': '',
    'Access-Control-Allow-Credentials': true,
  }
  fetchFn.mockResolvedValueOnce(new Response(validBody, { status: 200 }))
  const { statusCode, headers = {}, body } = await handler(validEvent, cache, googleClient)
  expect(findPlaces).toHaveBeenCalled()
  expect(cacheGet).toHaveBeenCalledWith(cacheKey)
  expect(cacheGet).toHaveReturnedWith(Promise.resolve(undefined))
  expect(fetchFn).toHaveBeenCalledWith(expectedUrl)
  expect(cacheSet).toHaveBeenCalledWith(cacheKey, validBody, 60)
  expect(statusCode).toBe(200)
  expect(headers).toEqual(expectedHeaders)
  expect(body).toBe(validBody)
})

it('should return the cursor string from the Google API response, if given', async () => {
  const mockResponse = JSON.stringify({
    results: [],
    next_page_token: 'some-cursor',
  })
  const expectedBody = JSON.stringify({
    results: [],
    cursor: 'some-cursor',
  })
  fetchFn.mockResolvedValueOnce(new Response(mockResponse, { status: 200 }))
  const { statusCode, body } = await handler(validEvent, cache, googleClient)
  expect(statusCode).toBe(200)
  expect(body).toBe(expectedBody)
})

it('should call Google API with a cursor string, if given', async () => {
  // @ts-ignore
  const event: APIGatewayProxyEvent = {
    queryStringParameters: {
      cursor: 'some-cursor',
    },
  }
  const expectedUrl = `${baseUrl}/place/nearbysearch/json?key=some-api-key&pagetoken=some-cursor`
  fetchFn.mockResolvedValueOnce(new Response(validBody, { status: 200 }))
  const { statusCode, body } = await handler(event, cache, googleClient)
  expect(findPlaces).toHaveBeenCalled()
  expect(fetchFn).toHaveBeenCalledWith(expectedUrl)
  expect(statusCode).toBe(200)
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
    queryStringParameters: {
      keyword: 'coffee',
      latitude: '60.165324',
      longitude: '24.939724',
      radius: '500',
    },
  }
  const expectedBody = JSON.stringify({ error: 'Missing query string parameter: type' })
  const { statusCode, body } = await handler(invalidEvent, cache, googleClient)
  expect(findPlaces).not.toHaveBeenCalled()
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
