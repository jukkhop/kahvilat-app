import { CacheResult, GoogleCache } from '../../../src/caches'
import { ClientError } from '../../../src/clients'
import { Address, Place, Response } from '../../../src/types/google'
import { urlEncode } from '../../../src/utils/url'

import { ApiTestData } from '../../data/api'
import { GoogleTestData } from '../../data/google'
import { config } from '../../test-context-unit'

describe('GoogleCache', () => {
  let impl: GoogleCache

  const redis = {
    isReady: true,
    expire: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
  }

  const fetch = jest.fn()

  beforeEach(() => {
    impl = new GoogleCache(config, redis as any)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getAddresses', () => {
    const params1 = ApiTestData.getAddressesParams1
    const params2 = ApiTestData.getAddressesParams2

    const { address } = params1
    const { latitude, longitude } = params2

    const cacheKey1 = `/addresses?address=${urlEncode(address!)}`
    const cacheKey2 = `/addresses?latitude=${latitude}&longitude=${longitude}`

    const googleResponse: Response<Address> = {
      results: [GoogleTestData.address1, GoogleTestData.address2],
    }

    const successResult: CacheResult<Response<Address>> = {
      ok: true,
      value: googleResponse,
    }

    const errorResult: CacheResult<Response<Address>> = {
      ok: false,
      error: new ClientError('Something failed'),
    }

    it('should return a cached response, if present (using address)', async () => {
      redis.get.mockResolvedValueOnce(JSON.stringify(googleResponse))
      const response = await impl.getAddresses(params1, fetch)
      expect(response).toEqual(successResult)
      expect(redis.get).toHaveBeenCalledWith(cacheKey1)
      expect(fetch).not.toHaveBeenCalled()
    })

    it('should return a cached response, if present (using coordinates)', async () => {
      redis.get.mockResolvedValueOnce(JSON.stringify(googleResponse))
      const response = await impl.getAddresses(params2, fetch)
      expect(response).toEqual(successResult)
      expect(redis.get).toHaveBeenCalledWith(cacheKey2)
      expect(fetch).not.toHaveBeenCalled()
    })

    it('should fetch if there is no cached response', async () => {
      redis.get.mockResolvedValueOnce(undefined)
      fetch.mockResolvedValueOnce(successResult)
      const response = await impl.getAddresses(params1, fetch)
      expect(response).toEqual(successResult)
      expect(redis.get).toHaveBeenCalledWith(cacheKey1)
      expect(fetch).toHaveBeenCalled()
    })

    it('should cache a successful fetch response', async () => {
      fetch.mockResolvedValueOnce(successResult)
      await impl.getAddresses(params1, fetch)
      expect(fetch).toHaveBeenCalled()
      expect(redis.set).toHaveBeenCalledWith(cacheKey1, JSON.stringify(googleResponse))
    })

    it('should set an expiration time of one day for the cached value', async () => {
      fetch.mockResolvedValueOnce(successResult)
      await impl.getAddresses(params1, fetch)
      expect(fetch).toHaveBeenCalled()
      expect(redis.expire).toHaveBeenCalledWith(cacheKey1, 86400)
    })

    it('should not cache an erroneous fetch response', async () => {
      fetch.mockResolvedValueOnce(errorResult)
      await impl.getAddresses(params1, fetch)
      expect(fetch).toHaveBeenCalled()
      expect(redis.set).not.toHaveBeenCalled()
    })
  })

  describe('getPlaces', () => {
    const params1 = ApiTestData.getPlacesParams1
    const params2 = ApiTestData.getPlacesParams2

    const { keyword, latitude, longitude, radius, type } = params1
    const { cursor } = params2

    const cacheKey1 = `/places?keyword=${keyword}&latitude=${latitude}&longitude=${longitude}&radius=${radius}&type=${type}`
    const cacheKey2 = `/places?cursor=${cursor}`

    const googleResponse: Response<Place> = {
      results: [GoogleTestData.place1, GoogleTestData.place2],
    }

    const successResult: CacheResult<Response<Place>> = {
      ok: true,
      value: googleResponse,
    }

    const errorResult: CacheResult<Response<Place>> = {
      ok: false,
      error: new ClientError('Something failed'),
    }

    it('should return a cached response, if present', async () => {
      redis.get.mockResolvedValueOnce(JSON.stringify(googleResponse))
      const response = await impl.getPlaces(params1, fetch)
      expect(response).toEqual(successResult)
      expect(redis.get).toHaveBeenCalledWith(cacheKey1)
      expect(fetch).not.toHaveBeenCalled()
    })

    it('should return a cached response, if present (using cursor)', async () => {
      redis.get.mockResolvedValueOnce(JSON.stringify(googleResponse))
      const response = await impl.getPlaces(params2, fetch)
      expect(response).toEqual(successResult)
      expect(redis.get).toHaveBeenCalledWith(cacheKey2)
      expect(fetch).not.toHaveBeenCalled()
    })

    it('should fetch if there is no cached response', async () => {
      fetch.mockResolvedValueOnce(successResult)
      const response = await impl.getPlaces(params1, fetch)
      expect(response).toEqual(successResult)
      expect(fetch).toHaveBeenCalled()
    })

    it('should cache a successful fetch response', async () => {
      fetch.mockResolvedValueOnce(successResult)
      await impl.getPlaces(params1, fetch)
      expect(fetch).toHaveBeenCalled()
      expect(redis.set).toHaveBeenCalledWith(cacheKey1, JSON.stringify(googleResponse))
    })

    it('should set an expiration time of one minute for the cached value', async () => {
      fetch.mockResolvedValueOnce(successResult)
      await impl.getPlaces(params1, fetch)
      expect(fetch).toHaveBeenCalled()
      expect(redis.expire).toHaveBeenCalledWith(cacheKey1, 60)
    })

    it('should not cache an erroneous fetch response', async () => {
      fetch.mockResolvedValueOnce(errorResult)
      await impl.getPlaces(params1, fetch)
      expect(fetch).toHaveBeenCalled()
      expect(redis.set).not.toHaveBeenCalled()
    })
  })
})
