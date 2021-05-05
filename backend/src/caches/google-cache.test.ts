import GoogleCache from './google-cache'
import { AsyncRedisClient } from '../clients'
import { testAddress, testConfig, testPlace } from '../fixtures'

const redisGetFn = jest.fn()
const redisSetFn = jest.fn()
const fetchFn = jest.fn()

let client: AsyncRedisClient
let cache: GoogleCache

jest.mock('../clients', () => ({
  AsyncRedisClient: jest.fn(() => ({
    expire: jest.fn(),
    get: redisGetFn,
    set: redisSetFn,
  })),
}))

beforeEach(() => {
  client = new AsyncRedisClient()
  cache = new GoogleCache(testConfig, client)

  redisGetFn.mockClear()
  redisSetFn.mockClear()
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

  it('should return a cached response, if present (using address)', async () => {
    redisGetFn.mockResolvedValueOnce(JSON.stringify(successResponse))
    const response = await cache.findAddress(fnParams1, fetchFn)
    expect(response).toEqual(successResponse)
    expect(redisGetFn).toHaveBeenCalledWith(cacheKey1)
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('should return a cached response, if present (using coordinates)', async () => {
    redisGetFn.mockResolvedValueOnce(JSON.stringify(successResponse))
    const response = await cache.findAddress(fnParams2, fetchFn)
    expect(response).toEqual(successResponse)
    expect(redisGetFn).toHaveBeenCalledWith(cacheKey2)
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
    expect(fetchFn).toHaveBeenCalled()
    expect(redisSetFn).toHaveBeenCalledWith(cacheKey1, JSON.stringify(successResponse))
  })

  it('should not cache an erroneous fetch response', async () => {
    fetchFn.mockResolvedValueOnce(errorResponse)
    await cache.findAddress(fnParams1, fetchFn)
    expect(fetchFn).toHaveBeenCalled()
    expect(redisSetFn).not.toHaveBeenCalled()
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

  it('should return a cached response, if present', async () => {
    redisGetFn.mockResolvedValueOnce(JSON.stringify(successResponse))
    const response = await cache.findPlaces(fnParams1, fetchFn)
    expect(response).toEqual(successResponse)
    expect(redisGetFn).toHaveBeenCalledWith(cacheKey1)
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('should return a cached response, if present (using cursor)', async () => {
    redisGetFn.mockResolvedValueOnce(JSON.stringify(successResponse))
    const response = await cache.findPlaces(fnParams2, fetchFn)
    expect(response).toEqual(successResponse)
    expect(redisGetFn).toHaveBeenCalledWith(cacheKey2)
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
    expect(fetchFn).toHaveBeenCalled()
    expect(redisSetFn).toHaveBeenCalledWith(cacheKey1, JSON.stringify(successResponse))
  })

  it('should not cache an erroneous fetch response', async () => {
    fetchFn.mockResolvedValueOnce(errorResponse)
    await cache.findPlaces(fnParams1, fetchFn)
    expect(fetchFn).toHaveBeenCalled()
    expect(redisSetFn).not.toHaveBeenCalled()
  })
})
