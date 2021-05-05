import { APIGatewayProxyEvent } from 'aws-lambda'

import FunctionHandler from './function-handler'
import GatewayProxy from './gateway-proxy'
import { testAddress, testConfig } from '../../fixtures'
import { Address, FunctionResult, GoogleResponse } from '../../types'

// @ts-ignore
const validEvent1: APIGatewayProxyEvent = {
  queryStringParameters: { latitude: '59.0000', longitude: '28.0000' },
}

// @ts-ignore
const validEvent2: APIGatewayProxyEvent = {
  queryStringParameters: { address: 'Mannerheimintie 1' },
}

// @ts-ignore
const invalidEvent: APIGatewayProxyEvent = {
  queryStringParameters: { latitude: '59.0000', foobar: '28.0000' },
}

const successResult: FunctionResult<GoogleResponse<Address>> = {
  state: 'success',
  data: { state: 'success', results: [testAddress], cursor: 'value' },
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

// @ts-ignore
const handler = new FunctionHandler(undefined, undefined)

let proxy: GatewayProxy

beforeEach(() => {
  handleFn.mockClear()
  proxy = new GatewayProxy(testConfig, handler)
})

it('returns HTTP 400 with error for invalid query string parameters', async () => {
  const { statusCode, body } = await proxy.process(invalidEvent)
  expect(statusCode).toEqual(400)
  expect(body).toEqual('{"error":"Missing query string parameter: longitude"}')
})

it('returns HTTP 200 with data when the function is handled successfully (case 1)', async () => {
  handleFn.mockResolvedValueOnce(successResult)
  const { statusCode, body } = await proxy.process(validEvent1)
  expect(statusCode).toEqual(200)
  expect(JSON.parse(body)).toEqual(successResult.data)
})

it('returns HTTP 200 with data when the function is handled successfully (case 2)', async () => {
  handleFn.mockResolvedValueOnce(successResult)
  const { statusCode, body } = await proxy.process(validEvent2)
  expect(statusCode).toEqual(200)
  expect(JSON.parse(body)).toEqual(successResult.data)
})

it('returns HTTP 502 with error when the function is not handled successfully', async () => {
  handleFn.mockResolvedValueOnce(errorResult)
  const { statusCode, body } = await proxy.process(validEvent1)
  expect(statusCode).toEqual(502)
  expect(body).toEqual('{"error":"Something failed"}')
})
