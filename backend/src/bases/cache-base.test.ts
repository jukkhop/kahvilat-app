import Cache from './cache-base'
import { AsyncRedisClient } from '../clients'

const redisDelFn = jest.fn()
const redisExpFn = jest.fn()
const redisGetFn = jest.fn()
const redisSetFn = jest.fn()

let cache: Cache

jest.mock('../clients', () => ({
  AsyncRedisClient: jest.fn(() => ({
    delete: redisDelFn,
    expire: redisExpFn,
    get: redisGetFn,
    set: redisSetFn,
  })),
}))

beforeEach(() => {
  const client = new AsyncRedisClient()
  cache = new Cache(undefined, undefined, client)
})

afterEach(() => {
  redisDelFn.mockClear()
  redisExpFn.mockClear()
  redisGetFn.mockClear()
  redisSetFn.mockClear()
})

it('should cache a given value', async () => {
  await cache.set('some-key', 'some-value')
  expect(redisSetFn).toHaveBeenCalledWith('some-key', 'some-value')
  expect(redisExpFn).toHaveBeenCalledWith('some-key', 86400)
})

it('should cache a given value with the given expiratio time', async () => {
  await cache.set('some-key', 'some-value', 2000)
  expect(redisSetFn).toHaveBeenCalledWith('some-key', 'some-value')
  expect(redisExpFn).toHaveBeenCalledWith('some-key', 2000)
})

it('should return a cached value', async () => {
  redisGetFn.mockResolvedValueOnce('some-value')
  const valueFromCache = await cache.get('some-key')
  expect(redisGetFn).toHaveBeenCalledWith('some-key')
  expect(valueFromCache).toBe('some-value')
})

it('should return undefined when trying to get a non-existing key', async () => {
  const valueFromCache = await cache.get('non-existing-key')
  expect(redisGetFn).toHaveBeenCalledWith('non-existing-key')
  expect(valueFromCache).toBeUndefined()
})

it('should delete a given value', async () => {
  await cache.delete('some-key')
  expect(redisDelFn).toHaveBeenCalledWith('some-key')
})
