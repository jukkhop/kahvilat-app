/* eslint-disable @typescript-eslint/ban-ts-ignore */

import redis, { RedisClient } from 'redis-mock'
import AsyncRedisClient from './async-redis-client'

let client: RedisClient
let asyncClient: AsyncRedisClient

beforeEach(() => {
  client = redis.createClient()

  jest.spyOn(client, 'set')
  jest.spyOn(client, 'get')
  jest.spyOn(client, 'del')
  jest.spyOn(client, 'expire')

  // @ts-ignore
  asyncClient = new AsyncRedisClient('some-host', 1000, client)
})

it('should cache a given value, and return it', async () => {
  await asyncClient.set('some-key', 'some-value')
  const valueFromCache = await asyncClient.get('some-key')
  expect(client.set).toHaveBeenCalledWith('some-key', 'some-value', expect.any(Function))
  expect(valueFromCache).toBe('some-value')
})

it('should return null when given a key that has not been set', async () => {
  const valueFromCache = await asyncClient.get('non-existing-key')
  expect(client.get).toHaveBeenCalledWith('non-existing-key', expect.any(Function))
  expect(valueFromCache).toBeNull()
})

it('should delete a given value', async () => {
  await asyncClient.set('some-key', 'some-value')
  await asyncClient.delete('some-key')
  const valueFromCache = await asyncClient.get('some-key')
  expect(client.del).toHaveBeenCalledWith('some-key', expect.any(Function))
  expect(valueFromCache).toBeNull()
})

it('should expire a value after the specified amount of seconds', async () => {
  await asyncClient.set('some-key', 'some-value')
  await asyncClient.expire('some-key', 1)
  await new Promise(r => setTimeout(r, 1100))
  const valueFromCache = await asyncClient.get('some-key')
  expect(client.expire).toHaveBeenCalledWith('some-key', 1, expect.any(Function))
  expect(valueFromCache).toBeNull()
})
