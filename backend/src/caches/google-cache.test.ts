import redis from 'redis-mock'

import GoogleCache from './google-cache'
import { AsyncRedisClient } from '../clients'
import { testAddress, testConfig, testPlace } from '../fixtures'

const fetchFn = jest.fn()

let client: AsyncRedisClient
let cache: GoogleCache

beforeEach(() => {
  client = new AsyncRedisClient(undefined, undefined, redis.createClient())
  cache = new GoogleCache(testConfig, client)
  fetchFn.mockClear()
})

describe('findAddress', () => {
  const fnParams1 = { address: 'Mannerheimintie 1' }
  const fnParams2 = { latitude: 60.1653, longitude: 24.9397 }
  const { address } = fnParams1
  const { latitude, longitude } = fnParams2
  const cacheKey1 = `find-address?address=${address}`
  const cacheKey2 = `find-address?latitude=${latitude}&longitude=${longitude}`
  const successResponse = { state: 'success', results: [testAddress] }
  const errorResponse = { state: 'error', error: 'Something failed' }

  afterEach(async () => {
    await client.delete(cacheKey1)
    await client.delete(cacheKey2)
  })

  it('should return a cached response, if present (using address)', async () => {
    await client.set(cacheKey1, JSON.stringify(successResponse))
    const response = await cache.findAddress(fnParams1, fetchFn)
    expect(response).toEqual(successResponse)
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('should return a cached response, if present (using coordinates)', async () => {
    await client.set(cacheKey2, JSON.stringify(successResponse))
    const response = await cache.findAddress(fnParams2, fetchFn)
    expect(response).toEqual(successResponse)
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('should fetch if there is no cached response', async () => {
    fetchFn.mockResolvedValueOnce(successResponse)
    const response = await cache.findAddress(fnParams1, fetchFn)
    expect(response).toEqual(successResponse)
    expect(fetchFn).toHaveBeenCalled()
  })

  it('should cache a successful fetch response', async () => {
    fetchFn.mockResolvedValueOnce(successResponse)
    await cache.findAddress(fnParams1, fetchFn)
    const cachedJson = (await cache.get(cacheKey1)) as string
    const cachedResponse = JSON.parse(cachedJson)
    expect(cachedResponse).toEqual(successResponse)
    expect(fetchFn).toHaveBeenCalled()
  })

  it('should not cache an erroneous fetch response', async () => {
    fetchFn.mockResolvedValueOnce(errorResponse)
    await cache.findAddress(fnParams1, fetchFn)
    const cachedJson = await cache.get(cacheKey1)
    expect(cachedJson).toBeUndefined()
    expect(fetchFn).toHaveBeenCalled()
  })
})

describe('findPlaces', () => {
  const fnParams1 = { keyword: 'coffee', latitude: 60.1653, longitude: 24.9397, radius: 500, type: 'cafe' }
  const fnParams2 = { cursor: 'some-cursor' }
  const { keyword, latitude, longitude, radius, type } = fnParams1
  const { cursor } = fnParams2
  const cacheKey1 = `find-places?keyword=${keyword}&latitude=${latitude}&longitude=${longitude}&radius=${radius}&type=${type}`
  const cacheKey2 = `find-places?cursor=${cursor}`
  const successResponse = { state: 'success', results: [testPlace], cursor: 'some-cursor' }
  const errorResponse = { state: 'error', error: 'Something failed' }

  afterEach(async () => {
    await client.delete(cacheKey1)
    await client.delete(cacheKey2)
  })

  it('should return a cached response, if present', async () => {
    await client.set(cacheKey1, JSON.stringify(successResponse))
    const response = await cache.findPlaces(fnParams1, fetchFn)
    expect(response).toEqual(successResponse)
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('should return a cached response, if present (using cursor)', async () => {
    await client.set(cacheKey2, JSON.stringify(successResponse))
    const response = await cache.findPlaces(fnParams2, fetchFn)
    expect(response).toEqual(successResponse)
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('should fetch if there is no cached response', async () => {
    fetchFn.mockResolvedValueOnce(successResponse)
    const response = await cache.findPlaces(fnParams1, fetchFn)
    expect(response).toEqual(successResponse)
    expect(fetchFn).toHaveBeenCalled()
  })

  it('should cache a successful fetch response', async () => {
    fetchFn.mockResolvedValueOnce(successResponse)
    await cache.findPlaces(fnParams1, fetchFn)
    const cachedJson = (await cache.get(cacheKey1)) as string
    const cachedResponse = JSON.parse(cachedJson)
    expect(cachedResponse).toEqual(successResponse)
    expect(fetchFn).toHaveBeenCalled()
  })

  it('should not cache an erroneous fetch response', async () => {
    fetchFn.mockResolvedValueOnce(errorResponse)
    await cache.findPlaces(fnParams1, fetchFn)
    const cachedJson = await cache.get(cacheKey1)
    expect(cachedJson).toBeUndefined()
    expect(fetchFn).toHaveBeenCalled()
  })
})
