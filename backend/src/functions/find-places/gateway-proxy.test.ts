import { APIGatewayProxyEvent } from 'aws-lambda'

import FunctionHandler from './function-handler'
import GatewayProxy from './gateway-proxy'
import { testConfig, testPlace } from '../../fixtures'
import { FindPlacesParams, FunctionResult, GoogleResponse, Place } from '../../types'

const fnParams: FindPlacesParams = {
  keyword: 'coffee',
  latitude: 60.16,
  longitude: 24.93,
  radius: 500,
  type: 'cafe',
}

// @ts-ignore
const validEvent: APIGatewayProxyEvent = {
  queryStringParameters: {
    keyword: fnParams.keyword,
    latitude: fnParams.latitude.toString(),
    longitude: fnParams.longitude.toString(),
    radius: fnParams.radius.toString(),
    type: fnParams.type,
  },
}

// @ts-ignore
const invalidEvent1: APIGatewayProxyEvent = {
  queryStringParameters: {
    longitude: fnParams.longitude.toString(),
    radius: fnParams.radius.toString(),
    type: fnParams.type,
  },
}

// @ts-ignore
const invalidEvent2: APIGatewayProxyEvent = {
  queryStringParameters: {
    keyword: fnParams.keyword,
    latitude: 'not-a-number',
    longitude: fnParams.longitude.toString(),
    radius: fnParams.radius.toString(),
    type: fnParams.type,
  },
}

const successResult: FunctionResult<GoogleResponse<Place>> = {
  state: 'success',
  data: { state: 'success', results: [testPlace], cursor: 'some-cursor' },
}

const errorResult: FunctionResult<GoogleResponse<Place>> = {
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

it('returns HTTP 400 with error for missing query string parameters', async () => {
  const { statusCode, body } = await proxy.process(invalidEvent1)
  expect(statusCode).toEqual(400)
  expect(body).toEqual('{"error":"Missing query string parameter: keyword, Missing query string parameter: latitude"}')
})

it('returns HTTP 400 with error for invalid query string parameters', async () => {
  const { statusCode, body } = await proxy.process(invalidEvent2)
  expect(statusCode).toEqual(400)
  expect(body).toEqual('{"error":"Invalid type for query string parameter: latitude"}')
})

it('returns HTTP 200 with data when the function is handled successfully', async () => {
  handleFn.mockResolvedValueOnce(successResult)
  const { statusCode, body } = await proxy.process(validEvent)
  expect(statusCode).toEqual(200)
  expect(JSON.parse(body)).toEqual(successResult.data)
  expect(handleFn).toHaveBeenCalledWith(fnParams)
})

it('returns HTTP 502 with error when the function is not handled successfully', async () => {
  handleFn.mockResolvedValueOnce(errorResult)
  const { statusCode, body } = await proxy.process(validEvent)
  expect(statusCode).toEqual(502)
  expect(body).toEqual('{"error":"Something failed"}')
  expect(handleFn).toHaveBeenCalledWith(fnParams)
})
