/* eslint-disable jest/no-commented-out-tests */

import FunctionHandler from './function-handler'
import { GoogleCache } from '../../caches'
import { AsyncRedisClient, GoogleClient } from '../../clients'
import { testConfig, testData, testGoogle } from '../../fixtures'
import { FindPlacesParams, FunctionResult, GooglePlace, GoogleResponse, Place } from '../../types'

const fnParams: FindPlacesParams = {
  keyword: 'coffee',
  latitude: 60.1653,
  longitude: 24.9397,
  radius: 500,
  type: 'cafe',
}

const clientSuccessResp: GoogleResponse<GooglePlace> = { state: 'success', results: [testGoogle.place] }
const clientErrorResp: GoogleResponse<GooglePlace> = { state: 'error', error: 'Something failed' }

const successResult: FunctionResult<GoogleResponse<Place>> = {
  state: 'success',
  data: { state: 'success', results: [testData.place] },
}

const errorResult: FunctionResult<GoogleResponse<Place>> = {
  state: 'error',
  errors: [new Error('Third party API call failed with error: Something failed')],
}

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
})

afterEach(() => {
  cacheFn.mockClear()
  clientFn.mockClear()
  redisFn.mockClear()
})

it('should fetch data and return a successful result', async () => {
  clientFn.mockResolvedValueOnce(clientSuccessResp)

  const result = await handler.handle(fnParams)

  expect(result).toEqual(successResult)
  expect(cacheFn).toHaveBeenCalledWith(fnParams, expect.any(Function))
  expect(cacheFn).toHaveReturnedWith(Promise.resolve(clientSuccessResp))
  expect(clientFn).toHaveBeenCalledWith(fnParams)
})

it('should return a cached response, if present', async () => {
  redisFn.mockResolvedValueOnce(JSON.stringify(clientSuccessResp))

  const result = await handler.handle(fnParams)

  expect(result).toEqual(successResult)
  expect(cacheFn).toHaveBeenCalledWith(fnParams, expect.any(Function))
  expect(cacheFn).toHaveReturnedWith(Promise.resolve(clientSuccessResp))
  expect(clientFn).not.toHaveBeenCalled()
})

it('should return an error result if data cannot be fetched', async () => {
  clientFn.mockResolvedValueOnce(clientErrorResp)
  const result = await handler.handle(fnParams)
  expect(result).toEqual(errorResult)
})

it('should return the cursor string from the Google Client response', async () => {
  clientFn.mockResolvedValueOnce({
    state: 'success',
    results: [testGoogle.place],
    cursor: 'some-cursor',
  })

  const result = await handler.handle(fnParams)

  expect(result).toEqual({
    state: 'success',
    data: { state: 'success', results: [testData.place], cursor: 'some-cursor' },
  })
})

it('should call Google Client with the cursor string, if given', async () => {
  clientFn.mockResolvedValueOnce(clientSuccessResp)

  const cursorParams = { cursor: 'foo' }
  const result = await handler.handle(cursorParams)

  expect(result).toEqual(successResult)
  expect(clientFn).toHaveBeenCalledWith(cursorParams)
})
