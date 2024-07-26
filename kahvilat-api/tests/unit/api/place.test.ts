import _ from 'lodash'

import { PlaceApi } from '../../../src/api'
import { CacheError } from '../../../src/caches'
import { ClientError } from '../../../src/clients'
import { GetPlacesParams, GetPlacesResponse } from '../../../src/types/api'
import * as Google from '../../../src/types/google'
import { LambdaEvent } from '../../../src/types/lambda'
import { failure, success } from '../../../src/utils/result'
import { coerce } from '../../../src/utils/types'

import { ApiTestData } from '../../data/api'
import { GoogleTestData } from '../../data/google'
import { LambdaTestData } from '../../data/lambda'
import { testContext } from '../../test-context-unit'
import { toMultiParams } from '../../utils/lambda'

const { caches, clients, logger, results } = testContext
const { googleCache } = caches
const { googleClient } = clients
const { any } = expect

describe('PlaceApi', () => {
  let impl: PlaceApi

  beforeEach(() => {
    impl = new PlaceApi(coerce(testContext))
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getPlaces', () => {
    const query: GetPlacesParams = {
      ...ApiTestData.getPlacesParams1,
    }

    const event: LambdaEvent = {
      ...LambdaTestData.nullEvent,
      httpMethod: 'GET',
      path: '/place',
      queryStringParameters: coerce(query),
      multiValueQueryStringParameters: toMultiParams(coerce(query)),
    }

    const mockedResponse: Google.Response<Google.Place> = {
      results: [GoogleTestData.place1, GoogleTestData.place2],
    }

    const expectedResponse: GetPlacesResponse = {
      items: [ApiTestData.place1, ApiTestData.place2],
    }

    const clientError = new ClientError('Some client error')
    const cacheError = new CacheError('Some cache error')

    it('returns fetched places', async () => {
      googleCache.getPlaces.mockImplementation((params, clientFn) => clientFn(params))
      googleClient.getPlaces.mockResolvedValue(success(mockedResponse))

      await impl.getPlaces(event)

      expect(googleCache.getPlaces).toHaveBeenCalledWith(query, any(Function))
      expect(googleClient.getPlaces).toHaveBeenCalledWith(query)
      expect(results.json).toHaveBeenCalledWith(expectedResponse)
    })

    it('returns cached places', async () => {
      googleCache.getPlaces.mockResolvedValue(success(mockedResponse))

      await impl.getPlaces(event)

      expect(googleCache.getPlaces).toHaveBeenCalledWith(query, any(Function))
      expect(googleClient.getPlaces).not.toHaveBeenCalled()
      expect(results.json).toHaveBeenCalledWith(expectedResponse)
    })

    it('returns bad request on invalid parameters', async () => {
      const invalidParams = _.omit(ApiTestData.getPlacesParams1, 'longitude')
      const invalidEvent: LambdaEvent = {
        ...event,
        queryStringParameters: coerce(invalidParams),
        multiValueQueryStringParameters: toMultiParams(coerce(invalidParams)),
      }

      await impl.getPlaces(invalidEvent)

      expect(googleCache.getPlaces).not.toHaveBeenCalled()
      expect(googleClient.getPlaces).not.toHaveBeenCalled()
      expect(results.validationError).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            message: "must have required property 'longitude'",
          }),
        ]),
      )
    })

    it('returns bad gateway on client error', async () => {
      googleCache.getPlaces.mockImplementation((params, clientFn) => clientFn(params))
      googleClient.getPlaces.mockResolvedValue(failure(clientError))

      await impl.getPlaces(event)

      expect(googleCache.getPlaces).toHaveBeenCalledWith(query, any(Function))
      expect(googleClient.getPlaces).toHaveBeenCalledWith(query)
      expect(logger.error).toHaveBeenCalledWith(`Error getting places: ${clientError.message}`)
      expect(results.badGateway).toHaveBeenCalledWith(clientError.message)
    })

    it('returns internal error on cache error', async () => {
      googleCache.getPlaces.mockResolvedValue(failure(cacheError))

      await impl.getPlaces(event)

      expect(googleCache.getPlaces).toHaveBeenCalledWith(query, any(Function))
      expect(googleClient.getPlaces).not.toHaveBeenCalled()
      expect(logger.error).toHaveBeenCalledWith(`Error getting places: ${cacheError.message}`)
      expect(results.internalError).toHaveBeenCalledWith(cacheError.message)
    })
  })
})
