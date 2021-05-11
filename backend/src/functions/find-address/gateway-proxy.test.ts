import { APIGatewayProxyEvent } from 'aws-lambda'

import FunctionHandler from './function-handler'
import GatewayProxy from './gateway-proxy'
import { testConfig, testData } from '../../fixtures'
import { Address, FindAddressParams, FunctionResult, GoogleResponse } from '../../types'

const fnParams1: FindAddressParams = { latitude: 60.16, longitude: 24.93 }
const fnParams2: FindAddressParams = { address: 'Mannerheimintie 1' }

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

const successResult: FunctionResult<GoogleResponse<Address>> = {
  state: 'success',
  data: { state: 'success', results: [testData.address], cursor: 'value' },
}

const errorResult: FunctionResult<GoogleResponse<Address>> = {
  state: 'error',
  errors: [new Error('Something failed')],
}

const handleFn = jest.fn()

jest.mock('./function-handler', () =>
  jest.fn(() => ({
    handle: handleFn,
  })),
)

let proxy: GatewayProxy

beforeEach(() => {
  // @ts-ignore
  proxy = new GatewayProxy(testConfig, new FunctionHandler(undefined, undefined))
})

afterEach(() => {
  handleFn.mockClear()
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
  handleFn.mockResolvedValueOnce(successResult)
  const { statusCode, body } = await proxy.process(validEvent1)
  expect(statusCode).toEqual(200)
  expect(JSON.parse(body)).toEqual(successResult.data)
  expect(handleFn).toHaveBeenCalledWith(fnParams1)
})

it('returns HTTP 200 with data when the function is handled successfully (case 2)', async () => {
  handleFn.mockResolvedValueOnce(successResult)
  const { statusCode, body } = await proxy.process(validEvent2)
  expect(statusCode).toEqual(200)
  expect(JSON.parse(body)).toEqual(successResult.data)
  expect(handleFn).toHaveBeenCalledWith(fnParams2)
})

it('returns HTTP 502 with error when the function is not handled successfully', async () => {
  handleFn.mockResolvedValueOnce(errorResult)
  const { statusCode, body } = await proxy.process(validEvent1)
  expect(statusCode).toEqual(502)
  expect(body).toEqual('{"error":"Something failed"}')
  expect(handleFn).toHaveBeenCalledWith(fnParams1)
})
