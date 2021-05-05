import FunctionHandler from './function-handler'
import { GoogleCache } from '../../caches'
import { AsyncRedisClient, GoogleClient } from '../../clients'
import { testAddress, testConfig } from '../../fixtures'
import { Address, FindAddressParams, GoogleResponse } from '../../types'

const fnParams: FindAddressParams = { latitude: '60.165324', longitude: '24.939724' }
const successResponse: GoogleResponse<Address> = { state: 'success', results: [testAddress] }
const errorResponse: GoogleResponse<Address> = { state: 'error', error: 'Something failed' }

const redisFn = jest.fn()
const clientFn = jest.fn()

let handler: FunctionHandler
let cacheFn: jest.SpyInstance<Promise<any>, [queryParams: FindAddressParams, fetchFn: () => Promise<any>]>

jest.mock('../../clients', () => ({
  AsyncRedisClient: jest.fn(() => ({
    expire: jest.fn(),
    get: redisFn,
    set: jest.fn(),
  })),
  GoogleClient: jest.fn(() => ({
    findAddress: clientFn,
  })),
}))

beforeEach(() => {
  const redisClient = new AsyncRedisClient()
  const cache = new GoogleCache(testConfig, redisClient)
  const client = new GoogleClient(testConfig)

  handler = new FunctionHandler(cache, client)
  cacheFn = jest.spyOn(GoogleCache.prototype, 'findAddress')

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

  expect(cacheFn).toHaveBeenCalledWith(fnParams, expect.any(Function))
  expect(cacheFn).toHaveReturnedWith(Promise.resolve(undefined))
  expect(clientFn).toHaveBeenCalledWith(fnParams)
})
