import HttpStatus from 'http-status'
import { FetchError, Response } from 'node-fetch'

import { handler } from '../../src/main'
import { GetAddressesParams, GetAddressesResponse } from '../../src/types/api/address'
import { Components } from '../../src/types/api/openapi'
import { GetPlacesParams, GetPlacesResponse } from '../../src/types/api/place'
import * as Google from '../../src/types/google'
import { LambdaEvent, LambdaResult } from '../../src/types/lambda'
import { coerce } from '../../src/utils/types'

import { ApiTestData } from '../data/api'
import { GoogleTestData } from '../data/google'
import { LambdaTestData } from '../data/lambda'
import { testContext } from '../test-context-integration'
import { toMultiParams } from '../utils/lambda'

const { caches, utils } = testContext
const { googleCache } = caches
const { fetch } = utils

jest.mock('../../src/config', () => ({
  initConfig: jest.fn(() => testContext.config),
}))

jest.mock('../../src/context', () => ({
  initContext: jest.fn(() => testContext),
}))

jest.mock('../../src/logger', () => ({
  Logger: jest.fn(() => testContext.logger),
}))

describe('handler', () => {
  beforeEach(async () => {
    await googleCache.flush()
  })

  afterEach(() => {
    fetch.mockReset()
  })

  afterAll(async () => {
    await googleCache.flush()
    await googleCache.close()
  })

  describe('OPTIONS /', () => {
    const event: LambdaEvent = {
      ...LambdaTestData.nullEvent,
      httpMethod: 'OPTIONS',
      path: '/',
    }

    it('returns OK with appropriate headers', async () => {
      const result = await handler(event)

      expect(result).toMatchObject<LambdaResult>({
        statusCode: HttpStatus.OK,
        headers: {
          'Access-Control-Allow-Headers': 'Authorization,Content-Type',
          'Access-Control-Allow-Methods': 'DELETE,GET,PATCH,POST,PUT,OPTIONS',
          'Access-Control-Allow-Origin': testContext.config.ui.baseUrl.origin,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: HttpStatus['200_MESSAGE'],
        }),
      })
    })
  })

  describe('GET /address', () => {
    const params: GetAddressesParams = {
      address: 'Katutie 12',
    }

    const event: LambdaEvent = {
      ...LambdaTestData.nullEvent,
      httpMethod: 'GET',
      path: '/address',
      queryStringParameters: coerce(params),
      multiValueQueryStringParameters: toMultiParams(coerce(params)),
    }

    it('returns a list of addresses', async () => {
      const fetchBody: Google.Response<Google.Address> = {
        results: [GoogleTestData.address1, GoogleTestData.address2],
      }

      const expectResponse: GetAddressesResponse = {
        items: [ApiTestData.address1, ApiTestData.address2],
      }

      fetch.mockResolvedValue(
        new Response(JSON.stringify(fetchBody), {
          status: HttpStatus.OK,
        }),
      )

      const result = await handler(event)

      expect(result).toMatchObject<LambdaResult>({
        statusCode: HttpStatus.OK,
        body: JSON.stringify(expectResponse),
      })
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    it('returns bad request when called with bad parameters', async () => {
      const invalidParams = {
        foo: 'bar',
      }

      const invalidEvent: LambdaEvent = {
        ...event,
        queryStringParameters: coerce(invalidParams),
        multiValueQueryStringParameters: toMultiParams(coerce(invalidParams)),
      }

      const result = await handler(invalidEvent)
      const body = JSON.parse(result.body) as Components.Responses.BadRequest
      const validationErrors = body.errors

      expect(result.statusCode).toBe(HttpStatus.BAD_REQUEST)
      expect(validationErrors).toBeInstanceOf(Array)
      expect(validationErrors).not.toHaveLength(0)
      expect(fetch).not.toHaveBeenCalled()
    })

    it('returns bad gateway when google api does not respond', async () => {
      const fetchError = new FetchError('Connection timed out', 'FetchError')
      const errorMessage = `Client operation failed with message: ${fetchError.message}`

      fetch.mockRejectedValue(fetchError)

      const result = await handler(event)

      expect(result).toMatchObject<LambdaResult>({
        statusCode: HttpStatus.BAD_GATEWAY,
        body: JSON.stringify({ message: errorMessage }),
      })
      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('GET /place', () => {
    const queryParams: GetPlacesParams = {
      keyword: 'coffee',
      latitude: '60.1550465',
      longitude: '24.8809926',
      radius: '750',
      type: 'cafe',
    }

    const event: LambdaEvent = {
      ...LambdaTestData.nullEvent,
      httpMethod: 'GET',
      path: '/place',
      queryStringParameters: coerce(queryParams),
      multiValueQueryStringParameters: toMultiParams(coerce(queryParams)),
    }

    it('returns a list of places', async () => {
      const fetchBody: Google.Response<Google.Place> = {
        results: [GoogleTestData.place1, GoogleTestData.place2],
      }

      const expectResponse: GetPlacesResponse = {
        items: [ApiTestData.place1, ApiTestData.place2],
      }

      fetch.mockResolvedValue(
        new Response(JSON.stringify(fetchBody), {
          status: HttpStatus.OK,
        }),
      )

      const result = await handler(event)

      expect(result).toMatchObject<LambdaResult>({
        statusCode: HttpStatus.OK,
        body: JSON.stringify(expectResponse),
      })
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    it('returns bad request when called with bad parameters', async () => {
      const invalidParams = {
        foo: 'bar',
      }

      const invalidEvent: LambdaEvent = {
        ...event,
        queryStringParameters: coerce(invalidParams),
        multiValueQueryStringParameters: toMultiParams(coerce(invalidParams)),
      }

      const result = await handler(invalidEvent)
      const body = JSON.parse(result.body) as Components.Responses.BadRequest
      const validationErrors = body.errors

      expect(result.statusCode).toBe(HttpStatus.BAD_REQUEST)
      expect(validationErrors).toBeInstanceOf(Array)
      expect(validationErrors).not.toHaveLength(0)
      expect(fetch).not.toHaveBeenCalled()
    })

    it('returns bad gateway when google api does not respond', async () => {
      const fetchError = new FetchError('Connection timed out', 'FetchError')
      const errorMessage = `Client operation failed with message: ${fetchError.message}`

      fetch.mockRejectedValue(fetchError)

      const result = await handler(event)

      expect(result).toMatchObject<LambdaResult>({
        statusCode: HttpStatus.BAD_GATEWAY,
        body: JSON.stringify({ message: errorMessage }),
      })
      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })
})
