/* eslint-disable @typescript-eslint/ban-ts-ignore */

import { APIGatewayProxyEvent } from 'aws-lambda'
import fetch from 'node-fetch'
import redis from 'redis-mock'

import { helper as handler } from './find-address'
import Cache from '../cache'
import AsyncRedisClient from '../clients/async-redis-client'
import GoogleClient from '../clients/google-client'

const { Response } = jest.requireActual('node-fetch')
jest.mock('node-fetch', jest.fn)

let cache: Cache
let googleClient: GoogleClient
let fetchFn: jest.MockedFunction<typeof fetch>
let cacheGet: jest.SpyInstance<Promise<string | undefined>, [string]>
let cacheSet: jest.SpyInstance<Promise<void>, [string, string, (number | undefined)?]>

const baseUrl = 'https://maps.googleapis.com/maps/api'

// @ts-ignore
const validEvent: APIGatewayProxyEvent = {
  queryStringParameters: {
    latitude: 'foo',
    longitude: 'bar',
  },
}

beforeEach(() => {
  // @ts-ignore
  const redisClient = new AsyncRedisClient(undefined, undefined, redis.createClient())

  cache = new Cache(undefined, undefined, redisClient)
  googleClient = new GoogleClient('some-api-key', 'some-lang')
  fetchFn = fetch as jest.MockedFunction<typeof fetch>
  cacheGet = jest.spyOn(Cache.prototype, 'get')
  cacheSet = jest.spyOn(Cache.prototype, 'set')

  cache.delete('find-address?latitude=foo&longitude=bar')
  fetchFn.mockClear()
  cacheGet.mockClear()
  cacheSet.mockClear()
})

it('should call Google API with the provided parameters and return valid data', async () => {
  const expectedCacheKey = 'find-address?latitude=foo&longitude=bar'
  const expectedUrl = `${baseUrl}/geocode/json?key=some-api-key&language=some-lang&latlng=foo,bar`
  const expectedBody = JSON.stringify({
    results: [{ name: 'some-cafeteria' }],
  })
  const expectedHeaders = {
    'Access-Control-Allow-Origin': '',
    'Access-Control-Allow-Credentials': true,
  }
  fetchFn.mockResolvedValueOnce(new Response(expectedBody, { status: 200 }))
  const { statusCode, headers = {}, body } = await handler(validEvent, cache, googleClient)
  expect(cacheGet).toHaveBeenCalledWith(expectedCacheKey)
  expect(cacheGet).toHaveReturnedWith(Promise.resolve(undefined))
  expect(cacheSet).toHaveBeenCalledWith(expectedCacheKey, expectedBody, 86400)
  expect(fetchFn).toHaveBeenCalledWith(expectedUrl)
  expect(statusCode).toBe(200)
  expect(headers).toEqual(expectedHeaders)
  expect(body).toBe(expectedBody)
})

it('should return a cached response, if present', async () => {
  const expectedCacheKey = 'find-address?latitude=foo&longitude=bar'
  const expectedBody = JSON.stringify({
    results: [{ name: 'some-cafeteria' }],
  })
  await cache.set(expectedCacheKey, expectedBody)
  const { statusCode, body } = await handler(validEvent, cache, googleClient)
  expect(cacheGet).toHaveBeenCalledWith(expectedCacheKey)
  expect(cacheGet).toHaveReturnedWith(Promise.resolve(expectedBody))
  expect(fetchFn).not.toHaveBeenCalled()
  expect(statusCode).toBe(200)
  expect(body).toBe(expectedBody)
})

it('should throw if not given all required parameters', async () => {
  // @ts-ignore
  const invalidEvent: APIGatewayProxyEvent = {
    queryStringParameters: {
      latitude: 'foo',
    },
  }
  const promise = handler(invalidEvent, cache, googleClient)
  expect(promise).toEqual(Promise.reject('Missing query string parameter: longitude'))
  expect(fetchFn).not.toHaveBeenCalled()
})

it('should return an error if Google API call fails', async () => {
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
