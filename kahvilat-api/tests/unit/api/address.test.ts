import _ from 'lodash'

import { AddressApi } from '../../../src/api'
import { CacheError } from '../../../src/caches'
import { ClientError } from '../../../src/clients'
import { LambdaEvent } from '../../../src/types'
import { GetAddressesParams, GetAddressesResponse } from '../../../src/types/api'
import * as Google from '../../../src/types/google'
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

describe('AddressApi', () => {
  let impl: AddressApi

  beforeEach(() => {
    impl = new AddressApi(coerce(testContext))
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getAddresses', () => {
    const query: GetAddressesParams = {
      ...ApiTestData.getAddressesParams1,
    }

    const event: LambdaEvent = {
      ...LambdaTestData.nullEvent,
      httpMethod: 'GET',
      path: '/address',
      queryStringParameters: coerce(query),
      multiValueQueryStringParameters: toMultiParams(coerce(query)),
    }

    const mockedResponse: Google.Response<Google.Address> = {
      results: [GoogleTestData.address1, GoogleTestData.address2],
    }

    const expectedResponse: GetAddressesResponse = {
      items: [ApiTestData.address1, ApiTestData.address2],
    }

    const clientError = new ClientError('Some client error')
    const cacheError = new CacheError('Some cache error')

    it('returns fetched addresses', async () => {
      googleCache.getAddresses.mockImplementation((params, clientFn) => clientFn(params))
      googleClient.getAddresses.mockResolvedValue(success(mockedResponse))

      await impl.getAddresses(event)

      expect(googleCache.getAddresses).toHaveBeenCalledWith(query, any(Function))
      expect(googleClient.getAddresses).toHaveBeenCalledWith(query)
      expect(results.json).toHaveBeenCalledWith(expectedResponse)
    })

    it('returns cached addresses', async () => {
      googleCache.getAddresses.mockResolvedValue(success(mockedResponse))

      await impl.getAddresses(event)

      expect(googleCache.getAddresses).toHaveBeenCalledWith(query, any(Function))
      expect(googleClient.getAddresses).not.toHaveBeenCalled()
      expect(results.json).toHaveBeenCalledWith(expectedResponse)
    })

    it('returns bad request on invalid parameters', async () => {
      const invalidParams = _.omit(ApiTestData.getAddressesParams2, 'longitude')
      const invalidEvent: LambdaEvent = {
        ...event,
        queryStringParameters: coerce(invalidParams),
        multiValueQueryStringParameters: toMultiParams(coerce(invalidParams)),
      }

      await impl.getAddresses(invalidEvent)

      expect(googleCache.getAddresses).not.toHaveBeenCalled()
      expect(googleClient.getAddresses).not.toHaveBeenCalled()
      expect(results.validationError).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            message: "must have required property 'longitude'",
          }),
        ]),
      )
    })

    it('returns bad gateway on client error', async () => {
      googleCache.getAddresses.mockImplementation((params, clientFn) => clientFn(params))
      googleClient.getAddresses.mockResolvedValue(failure(clientError))

      await impl.getAddresses(event)

      expect(googleCache.getAddresses).toHaveBeenCalledWith(query, any(Function))
      expect(googleClient.getAddresses).toHaveBeenCalledWith(query)
      expect(logger.error).toHaveBeenCalledWith(`Error getting addresses: ${clientError.message}`)
      expect(results.badGateway).toHaveBeenCalledWith(clientError.message)
    })

    it('returns internal error on cache error', async () => {
      googleCache.getAddresses.mockResolvedValue(failure(cacheError))

      await impl.getAddresses(event)

      expect(googleCache.getAddresses).toHaveBeenCalledWith(query, any(Function))
      expect(googleClient.getAddresses).not.toHaveBeenCalled()
      expect(logger.error).toHaveBeenCalledWith(`Error getting addresses: ${cacheError.message}`)
      expect(results.internalError).toHaveBeenCalledWith(cacheError.message)
    })
  })
})
