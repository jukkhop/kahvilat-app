import { APIGatewayProxyEvent } from 'aws-lambda'

import * as CommonTestData from '../test/data/common'

import { GatewayProxyBase } from '../../src/functions'
import { ValidationErrorResult, ValidationSchema, ValidationSuccessResult } from '../../src/types'

let proxy: GatewayProxyBase

beforeEach(() => {
  proxy = new GatewayProxyBase(CommonTestData.config)
})

describe('validate', () => {
  it('accepts an event, given valid query string parameters', async () => {
    // @ts-ignore
    const validEvent: APIGatewayProxyEvent = {
      queryStringParameters: { foo: 'value', bar: 'value' },
    }

    const schema = { foo: 'string', bar: 'string' } as ValidationSchema
    const { type } = proxy.validate(validEvent, schema) as ValidationSuccessResult

    expect(type).toBe('success')
  })

  it('rejects and returns HTTP 400, given missing query string parameters', async () => {
    // @ts-ignore
    const invalidEvent: APIGatewayProxyEvent = {
      queryStringParameters: { foo: 'value' },
    }

    const schema = { foo: 'string', bar: 'string' } as ValidationSchema
    const { response } = proxy.validate(invalidEvent, schema) as ValidationErrorResult

    expect(response.statusCode).toEqual(400)
    expect(response.body).toEqual('{"error":"Missing query string parameter: bar"}')
  })

  it('rejects and returns HTTP 400, given invalid query string parameters', async () => {
    // @ts-ignore
    const invalidEvent: APIGatewayProxyEvent = {
      queryStringParameters: {
        foo: 'not-a-number',
      },
    }

    const schema = { foo: 'number' } as ValidationSchema
    const { response } = proxy.validate(invalidEvent, schema) as ValidationErrorResult

    expect(response.statusCode).toEqual(400)
    expect(response.body).toEqual('{"error":"Invalid type for query string parameter: foo"}')
  })
})

describe('convert', () => {
  it('returns HTTP 200 with data, given a successful function result', async () => {
    const result = proxy.convert({
      type: 'success',
      data: { foo: 'bar' },
    })

    expect(result.statusCode).toEqual(200)
    expect(result.body).toEqual('{"foo":"bar"}')
  })

  it('returns HTTP 502 with error, given an erroneous function result', async () => {
    const result = proxy.convert({
      type: 'error',
      errors: [new Error('Foo failed'), new Error('Bar failed')],
    })

    expect(result.statusCode).toEqual(502)
    expect(result.body).toEqual('{"error":"Foo failed, Bar failed"}')
  })

  it('includes the proper CORS headers to the response', async () => {
    const result = proxy.convert({
      type: 'success',
      data: { foo: 'bar' },
    })

    expect(result.headers).toEqual({
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': 'http://localhost:3000',
    })
  })
})
