import { APIGatewayProxyEvent } from 'aws-lambda'

import { config } from '../../test/data/config'
import * as ApiTestData from '../../test/data/api'
import * as GoogleTestData from '../../test/data/google'

import FunctionHandler from '../../../src/functions/find-addresses/function-handler'
import GatewayProxy from '../../../src/functions/find-addresses/gateway-proxy'

import { Address, FindAddressesParams } from '../../../src/types/api'
import { FunctionResult } from '../../../src/types/function'
import * as Google from '../../../src/types/google'

const fnParams1: FindAddressesParams = { latitude: 60.16, longitude: 24.93 }
const fnParams2: FindAddressesParams = { address: 'Mannerheimintie 1' }

// @ts-ignore
const validEvent1: APIGatewayProxyEvent = {
  queryStringParameters: {
    latitude: fnParams1.latitude.toString(),
    longitude: fnParams1.longitude.toString(),
  },
}

// @ts-ignore
const validEvent2: APIGatewayProxyEvent = {
  queryStringParameters: {
    address: fnParams2.address.toString(),
  },
}

// @ts-ignore
const invalidEvent1: APIGatewayProxyEvent = {
  queryStringParameters: {
    latitude: fnParams1.latitude.toString(),
  },
}

// @ts-ignore
const invalidEvent2: APIGatewayProxyEvent = {
  queryStringParameters: {
    latitude: fnParams1.latitude.toString(),
    longitude: 'not-a-number',
  },
}

const successResult: FunctionResult<Google.Response<Google.Address>> = {
  type: 'success',
  data: { type: 'success', results: [GoogleTestData.address1], cursor: 'value' },
}

const errorResult: FunctionResult<Google.Response<Google.Address>> = {
  type: 'error',
  error: new Error('Something failed'),
}

const handler = {
  handle: jest.fn(),
}

describe('GatewayProxy', () => {
  let proxy: GatewayProxy

  beforeEach(() => {
    proxy = new GatewayProxy(config, handler as any)
  })

  afterEach(() => {
    handler.handle.mockClear()
  })

  it('returns HTTP 400 with error for missing query string parameters', async () => {
    const { statusCode, body } = await proxy.process(invalidEvent1)
    expect(statusCode).toEqual(400)
    expect(body).toEqual('{"error":"Missing query string parameter: longitude"}')
  })

  it('returns HTTP 400 with error for invalid query string parameters', async () => {
    const { statusCode, body } = await proxy.process(invalidEvent2)
    expect(statusCode).toEqual(400)
    expect(body).toEqual('{"error":"Invalid type for query string parameter: longitude"}')
  })

  it('returns HTTP 200 with data when the function is handled successfully (case 1)', async () => {
    handler.handle.mockResolvedValueOnce(successResult)
    const { statusCode, body } = await proxy.process(validEvent1)
    expect(statusCode).toEqual(200)
    expect(JSON.parse(body)).toEqual(successResult.data)
    expect(handler.handle).toHaveBeenCalledWith(fnParams1)
  })

  it('returns HTTP 200 with data when the function is handled successfully (case 2)', async () => {
    handler.handle.mockResolvedValueOnce(successResult)
    const { statusCode, body } = await proxy.process(validEvent2)
    expect(statusCode).toEqual(200)
    expect(JSON.parse(body)).toEqual(successResult.data)
    expect(handler.handle).toHaveBeenCalledWith(fnParams2)
  })

  it('returns HTTP 502 with error when the function is not handled successfully', async () => {
    handler.handle.mockResolvedValueOnce(errorResult)
    const { statusCode, body } = await proxy.process(validEvent1)
    expect(statusCode).toEqual(502)
    expect(body).toEqual('{"error":"Something failed"}')
    expect(handler.handle).toHaveBeenCalledWith(fnParams1)
  })
})
