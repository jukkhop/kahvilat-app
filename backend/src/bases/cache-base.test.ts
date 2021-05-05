import redis from 'redis-mock'
import Cache from './cache-base'
import AsyncRedisClient from '../clients/async-redis-client'

let cache: Cache
let getStub: jest.SpyInstance<Promise<string | null>, [string]>
let setStub: jest.SpyInstance<Promise<unknown>, [string, string]>
let expireStub: jest.SpyInstance<Promise<number>, [string, number]>
let deleteStub: jest.SpyInstance<Promise<unknown>, [string]>

beforeEach(() => {
  const client = new AsyncRedisClient(undefined, undefined, redis.createClient())

  cache = new Cache(undefined, undefined, client)
  getStub = jest.spyOn(AsyncRedisClient.prototype, 'get')
  setStub = jest.spyOn(AsyncRedisClient.prototype, 'set')
  expireStub = jest.spyOn(AsyncRedisClient.prototype, 'expire')
  deleteStub = jest.spyOn(AsyncRedisClient.prototype, 'delete')
})

it('should cache a given value, and return it', async () => {
  await cache.set('some-key', 'some-value')
  expect(setStub).toHaveBeenCalledWith('some-key', 'some-value')
  expect(expireStub).toHaveBeenCalledWith('some-key', 86400)
  const valueFromCache = await cache.get('some-key')
  expect(getStub).toHaveBeenCalledWith('some-key')
  expect(valueFromCache).toBe('some-value')
})

it('should return undefined when given a key that has not been set', async () => {
  const valueFromCache = await cache.get('non-existing-key')
  expect(getStub).toHaveBeenCalledWith('non-existing-key')
  expect(valueFromCache).toBeUndefined()
})

it('should cache a given value with the given expiration time', async () => {
  await cache.set('some-key', 'some-value', 100)
  expect(setStub).toHaveBeenCalledWith('some-key', 'some-value')
  expect(expireStub).toHaveBeenCalledWith('some-key', 100)
})

it('should expire a value after the specified amount of time', async () => {
  await cache.set('some-key', 'some-value', 1)
  expect(expireStub).toHaveBeenCalledWith('some-key', 1)
  await new Promise(r => setTimeout(r, 1100))
  const valueFromCache = await cache.get('some-key')
  expect(valueFromCache).toBeUndefined()
})

it('should delete a given value', async () => {
  await cache.set('some-key', 'some-value')
  await cache.delete('some-key')
  expect(deleteStub).toHaveBeenCalledWith('some-key')
  const valueFromCache = await cache.get('some-key')
  expect(valueFromCache).toBeUndefined()
})
