import * as CommonTestData from '../../test/data/common'
import * as GoogleTestData from '../../test/data/google'

import { GoogleCache } from '../../../src/caches'
import { AsyncRedisClient, GoogleClient } from '../../../src/clients'
import FunctionHandler from '../../../src/functions/find-address/function-handler'

import { Address, FindAddressParams, FunctionResult, GoogleAddress, GoogleResponse } from '../../../src/types'

const fnParams: FindAddressParams = { latitude: 60.1653, longitude: 24.9397 }
const clientSuccessResp: GoogleResponse<GoogleAddress> = { type: 'success', results: [GoogleTestData.address] }
const clientErrorResp: GoogleResponse<GoogleAddress> = { type: 'error', error: 'Something failed' }

const successResult: FunctionResult<GoogleResponse<Address>> = {
  type: 'success',
  data: { type: 'success', results: [CommonTestData.address] },
}

const errorResult: FunctionResult<GoogleResponse<Address>> = {
  type: 'error',
  errors: [new Error('Third party API call failed with error: Something failed')],
}

const redisFn = jest.fn()
const clientFn = jest.fn()

let handler: FunctionHandler
let cacheFn: jest.SpyInstance<Promise<any>, [queryParams: FindAddressParams, fetchFn: () => Promise<any>]>

jest.mock('../../../src/clients', () => ({
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
  const cache = new GoogleCache(CommonTestData.config, redisClient)
  const client = new GoogleClient(CommonTestData.config)

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
