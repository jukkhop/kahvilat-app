import * as ApiTestData from '../../test/data/api'
import * as GoogleTestData from '../../test/data/google'

import FunctionHandler from '../../../src/functions/find-addresses/function-handler'
import { FindAddressesParams, FindAddressesResult } from '../../../src/types/api'
import { FunctionResult } from '../../../src/types/function'
import * as Google from '../../../src/types/google'

const params: FindAddressesParams = {
  latitude: 60.1653,
  longitude: 24.9397,
}

const successResult: FunctionResult<FindAddressesResult> = {
  type: 'success',
  data: { results: [ApiTestData.address1] },
}

const errorResult: FunctionResult<FindAddressesResult> = {
  type: 'error',
  error: new Error('Third party API call failed with error: Something failed'),
}

const clientSuccessResp: Google.Response<Google.Address> = {
  type: 'success',
  results: [GoogleTestData.address1],
}

const clientErrorResp: Google.Response<Google.Address> = {
  type: 'error',
  message: 'Something failed',
}

const cache = {
  findAddresses: jest.fn(),
}

describe('FunctionHandler', () => {
  let impl: FunctionHandler

  beforeEach(() => {
    impl = new FunctionHandler(cache as any, {} as any)
  })

  afterEach(() => {
    cache.findAddresses.mockReset()
  })

  it('should fetch data and return a successful result', async () => {
    cache.findAddresses.mockResolvedValueOnce(clientSuccessResp)
    const result = await impl.handle(params)
    expect(result).toEqual(successResult)
    expect(cache.findAddresses).toHaveBeenCalledWith(params, expect.any(Function))
  })

  it('should return an error result if data cannot be fetched', async () => {
    cache.findAddresses.mockResolvedValueOnce(clientErrorResp)
    const result = await impl.handle(params)
    expect(result).toEqual(errorResult)
  })
})
