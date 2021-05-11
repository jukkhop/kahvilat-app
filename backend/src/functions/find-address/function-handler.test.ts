import FunctionHandler from './function-handler'
import { GoogleCache } from '../../caches'
import { AsyncRedisClient, GoogleClient } from '../../clients'
import { testConfig, testData, testGoogle } from '../../fixtures'
import { Address, FindAddressParams, FunctionResult, GoogleAddress, GoogleResponse } from '../../types'

const fnParams: FindAddressParams = { latitude: 60.1653, longitude: 24.9397 }
const clientSuccessResp: GoogleResponse<GoogleAddress> = { state: 'success', results: [testGoogle.address] }
const clientErrorResp: GoogleResponse<GoogleAddress> = { state: 'error', error: 'Something failed' }

const successResult: FunctionResult<GoogleResponse<Address>> = {
  state: 'success',
  data: { state: 'success', results: [testData.address] },
}

const errorResult: FunctionResult<GoogleResponse<Address>> = {
  state: 'error',
  errors: [new Error('Third party API call failed with error: Something failed')],
}

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
