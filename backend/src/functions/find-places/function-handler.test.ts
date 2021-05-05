/* eslint-disable jest/no-commented-out-tests */

import FunctionHandler from './function-handler'
import { GoogleCache } from '../../caches'
import { AsyncRedisClient, GoogleClient } from '../../clients'
import { testConfig, testPlace } from '../../fixtures'
import { FindPlacesParams, GoogleResponse, Place } from '../../types'

const fnParams: FindPlacesParams = {
  keyword: 'coffee',
  latitude: '60.165324',
  longitude: '24.939724',
  radius: 500,
  type: 'cafe',
}

const successResponse: GoogleResponse<Place> = { state: 'success', results: [testPlace] }
const errorResponse: GoogleResponse<Place> = { state: 'error', error: 'Something failed' }

const redisFn = jest.fn()
const clientFn = jest.fn()

let handler: FunctionHandler
let cacheFn: jest.SpyInstance<Promise<any>, [queryParams: FindPlacesParams, fetchFn: () => Promise<any>]>

jest.mock('../../clients', () => ({
  AsyncRedisClient: jest.fn(() => ({
    expire: jest.fn(),
    get: redisFn,
    set: jest.fn(),
  })),
  GoogleClient: jest.fn(() => ({
    findPlaces: clientFn,
  })),
}))

beforeEach(() => {
  const redisClient = new AsyncRedisClient()
  const cache = new GoogleCache(testConfig, redisClient)
  const client = new GoogleClient(testConfig)

  handler = new FunctionHandler(cache, client)
  cacheFn = jest.spyOn(GoogleCache.prototype, 'findPlaces')

  redisFn.mockClear()
  clientFn.mockClear()
})

it('should fetch data and return a successful result', async () => {
  redisFn.mockResolvedValueOnce(undefined)
  clientFn.mockResolvedValueOnce(successResponse)

  const result = await handler.handle(fnParams)

  expect(result).toEqual({ state: 'success', data: successResponse })
  expect(cacheFn).toHaveBeenCalledWith(fnParams, expect.any(Function))
  expect(cacheFn).toHaveReturnedWith(Promise.resolve(undefined))
  expect(clientFn).toHaveBeenCalledWith(fnParams)
})

it('should return a cached response, if present', async () => {
  redisFn.mockResolvedValueOnce(JSON.stringify(successResponse))

  const result = await handler.handle(fnParams)

  expect(result).toEqual({ state: 'success', data: successResponse })
  expect(cacheFn).toHaveBeenCalledWith(fnParams, expect.any(Function))
  expect(cacheFn).toHaveReturnedWith(Promise.resolve(successResponse))
  expect(clientFn).not.toHaveBeenCalled()
})

it('should return an error result if data cannot be fetched', async () => {
  redisFn.mockResolvedValueOnce(undefined)
  clientFn.mockResolvedValueOnce(errorResponse)

  const result = await handler.handle(fnParams)

  expect(result).toEqual({
    state: 'error',
    errors: [new Error('Third party API call failed with error: Something failed')],
  })
})

it('should return the cursor string from the Google Client response', async () => {
  const cursorResponse: GoogleResponse<Place> = { state: 'success', results: [testPlace], cursor: 'foo' }

  redisFn.mockResolvedValueOnce(undefined)
  clientFn.mockResolvedValueOnce(cursorResponse)

  const result = await handler.handle(fnParams)
  expect(result).toEqual({ state: 'success', data: cursorResponse })
})

it('should call Google Client with the cursor string, if given', async () => {
  redisFn.mockResolvedValueOnce(undefined)
  clientFn.mockResolvedValueOnce(successResponse)

  const cursorParams = { cursor: 'foo' }
  const result = await handler.handle(cursorParams)

  expect(result).toEqual({ state: 'success', data: successResponse })
  expect(clientFn).toHaveBeenCalledWith(cursorParams)
})
