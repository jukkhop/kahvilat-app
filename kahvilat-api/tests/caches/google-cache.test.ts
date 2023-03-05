import { config } from '../test/data/config'
import * as GoogleTestData from '../test/data/google'

import { GoogleCache } from '../../src/caches'
import { FindAddressesParams, FindPlacesParams } from '../../src/types/api'
import { Address, Place, ResponseError, ResponseSuccess } from '../../src/types/google'

const fetch = jest.fn()

const client = {
  delete: jest.fn(),
  expire: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
}

describe('GoogleCache', () => {
  let cache: GoogleCache

  beforeEach(() => {
    cache = new GoogleCache(config, client as any)
  })

  afterEach(() => {
    Object.values(client).forEach((fn) => fn.mockReset())
  })

  describe('findAddresses', () => {
    const address = 'Mannerheimintie 1'
    const latitude = 60.1653
    const longitude = 24.9397

    const params1: FindAddressesParams = { address }
    const params2: FindAddressesParams = { latitude, longitude }

    const cacheKey1 = `find-addresses?address=${address}`
    const cacheKey2 = `find-addresses?latitude=${latitude}&longitude=${longitude}`

    const successResponse: ResponseSuccess<Address> = {
      type: 'success',
      results: [GoogleTestData.address1],
    }

    const errorResponse: ResponseError = {
      type: 'error',
      message: 'Something failed',
    }

    it('should return a cached response, if present (using address)', async () => {
      client.get.mockResolvedValueOnce(JSON.stringify(successResponse))
      const response = await cache.findAddresses(params1, fetch)
      expect(response).toEqual(successResponse)
      expect(client.get).toHaveBeenCalledWith(cacheKey1)
      expect(fetch).not.toHaveBeenCalled()
    })

    it('should return a cached response, if present (using coordinates)', async () => {
      client.get.mockResolvedValueOnce(JSON.stringify(successResponse))
      const response = await cache.findAddresses(params2, fetch)
      expect(response).toEqual(successResponse)
      expect(client.get).toHaveBeenCalledWith(cacheKey2)
      expect(fetch).not.toHaveBeenCalled()
    })

    it('should fetch if there is no cached response', async () => {
      fetch.mockResolvedValueOnce(successResponse)
      const response = await cache.findAddresses(params1, fetch)
      expect(response).toEqual(successResponse)
      expect(fetch).toHaveBeenCalled()
    })

    it('should cache a successful fetch response', async () => {
      fetch.mockResolvedValueOnce(successResponse)
      await cache.findAddresses(params1, fetch)
      expect(fetch).toHaveBeenCalled()
      expect(client.set).toHaveBeenCalledWith(cacheKey1, JSON.stringify(successResponse))
    })

    it('should set an expiration time of one day for the cached value', async () => {
      fetch.mockResolvedValueOnce(successResponse)
      await cache.findAddresses(params1, fetch)
      expect(fetch).toHaveBeenCalled()
      expect(client.expire).toHaveBeenCalledWith(cacheKey1, 86400)
    })

    it('should not cache an erroneous fetch response', async () => {
      fetch.mockResolvedValueOnce(errorResponse)
      await cache.findAddresses(params1, fetch)
      expect(fetch).toHaveBeenCalled()
      expect(client.set).not.toHaveBeenCalled()
    })
  })

  describe('findPlaces', () => {
    const keyword = 'coffee'
    const latitude = 60.1653
    const longitude = 24.9397
    const radius = 500
    const type = 'cafe'
    const cursor = 'some-cursor'

    const params1: FindPlacesParams = { keyword, latitude, longitude, radius, type }
    const params2: FindPlacesParams = { cursor }

    const cacheKey1 = `find-places?keyword=${keyword}&latitude=${latitude}&longitude=${longitude}&radius=${radius}&type=${type}`
    const cacheKey2 = `find-places?cursor=${cursor}`

    const successResponse: ResponseSuccess<Place> = {
      type: 'success',
      results: [GoogleTestData.place1],
      cursor: 'some-cursor',
    }

    const errorResponse = {
      type: 'error',
      error: 'Something failed',
    }

    it('should return a cached response, if present', async () => {
      client.get.mockResolvedValueOnce(JSON.stringify(successResponse))
      const response = await cache.findPlaces(params1, fetch)
      expect(response).toEqual(successResponse)
      expect(client.get).toHaveBeenCalledWith(cacheKey1)
      expect(fetch).not.toHaveBeenCalled()
    })

    it('should return a cached response, if present (using cursor)', async () => {
      client.get.mockResolvedValueOnce(JSON.stringify(successResponse))
      const response = await cache.findPlaces(params2, fetch)
      expect(response).toEqual(successResponse)
      expect(client.get).toHaveBeenCalledWith(cacheKey2)
      expect(fetch).not.toHaveBeenCalled()
    })

    it('should fetch if there is no cached response', async () => {
      fetch.mockResolvedValueOnce(successResponse)
      const response = await cache.findPlaces(params1, fetch)
      expect(response).toEqual(successResponse)
      expect(fetch).toHaveBeenCalled()
    })

    it('should cache a successful fetch response', async () => {
      fetch.mockResolvedValueOnce(successResponse)
      await cache.findPlaces(params1, fetch)
      expect(fetch).toHaveBeenCalled()
      expect(client.set).toHaveBeenCalledWith(cacheKey1, JSON.stringify(successResponse))
    })

    it('should set an expiration time of one minute for the cached value', async () => {
      fetch.mockResolvedValueOnce(successResponse)
      await cache.findPlaces(params1, fetch)
      expect(fetch).toHaveBeenCalled()
      expect(client.expire).toHaveBeenCalledWith(cacheKey1, 60)
    })

    it('should not cache an erroneous fetch response', async () => {
      fetch.mockResolvedValueOnce(errorResponse)
      await cache.findPlaces(params1, fetch)
      expect(fetch).toHaveBeenCalled()
      expect(client.set).not.toHaveBeenCalled()
    })
  })
})
