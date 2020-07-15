/* eslint-disable @typescript-eslint/ban-ts-ignore */

import redis from 'redis-mock'
import Cache from '.'
import AsyncRedisClient from '../clients/async-redis-client'

let cache: Cache
let getSpy: jest.SpyInstance<Promise<string | null>, [string]>
let setSpy: jest.SpyInstance<Promise<unknown>, [string, string]>
let expireSpy: jest.SpyInstance<Promise<number>, [string, number]>
let deleteSpy: jest.SpyInstance<Promise<unknown>, [string]>

beforeEach(() => {
  // @ts-ignore
  const client = new AsyncRedisClient(undefined, undefined, redis.createClient())

  cache = new Cache(undefined, undefined, client)
  getSpy = jest.spyOn(AsyncRedisClient.prototype, 'get')
  setSpy = jest.spyOn(AsyncRedisClient.prototype, 'set')
  expireSpy = jest.spyOn(AsyncRedisClient.prototype, 'expire')
  deleteSpy = jest.spyOn(AsyncRedisClient.prototype, 'delete')
})

it('should cache a given value, and return it', async () => {
  await cache.set('some-key', 'some-value')
  expect(setSpy).toHaveBeenCalledWith('some-key', 'some-value')
  expect(expireSpy).toHaveBeenCalledWith('some-key', 86400)
  const valueFromCache = await cache.get('some-key')
  expect(getSpy).toHaveBeenCalledWith('some-key')
  expect(valueFromCache).toBe('some-value')
})

it('should return undefined when given a key that has not been set', async () => {
  const valueFromCache = await cache.get('non-existing-key')
  expect(getSpy).toHaveBeenCalledWith('non-existing-key')
  expect(valueFromCache).toBeUndefined()
})

it('should cache a given value with the given expiration time', async () => {
  await cache.set('some-key', 'some-value', 100)
  expect(setSpy).toHaveBeenCalledWith('some-key', 'some-value')
  expect(expireSpy).toHaveBeenCalledWith('some-key', 100)
})

it('should expire a value after the specified amount of time', async () => {
  await cache.set('some-key', 'some-value', 1)
  expect(expireSpy).toHaveBeenCalledWith('some-key', 1)
  await new Promise((r) => setTimeout(r, 1100))
  const valueFromCache = await cache.get('some-key')
  expect(valueFromCache).toBeUndefined()
})

it('should delete a given value', async () => {
  await cache.set('some-key', 'some-value')
  await cache.delete('some-key')
  expect(deleteSpy).toHaveBeenCalledWith('some-key')
  const valueFromCache = await cache.get('some-key')
  expect(valueFromCache).toBeUndefined()
})
