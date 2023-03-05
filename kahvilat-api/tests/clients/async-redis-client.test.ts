import redis, { RedisClient } from 'redis-mock'
import { AsyncRedisClient } from '../../src/clients'

let client: RedisClient
let asyncClient: AsyncRedisClient

describe('AsyncRedisClient', () => {
  const key = 'some-key'
  const value = 'some-value'

  beforeEach(() => {
    client = redis.createClient()

    jest.spyOn(client, 'set')
    jest.spyOn(client, 'get')
    jest.spyOn(client, 'del')
    jest.spyOn(client, 'expire')

    asyncClient = new AsyncRedisClient('some-host', 1000, client)
  })

  afterEach(async () => {
    client.del(key)
  })

  it('should cache a given value, and return it', async () => {
    await asyncClient.set(key, value)
    const valueFromCache = await asyncClient.get(key)
    expect(client.set).toHaveBeenCalledWith(key, value, expect.any(Function))
    expect(valueFromCache).toBe(value)
  })

  it('should return null when given a key that has not been set', async () => {
    const valueFromCache = await asyncClient.get(key)
    expect(client.get).toHaveBeenCalledWith(key, expect.any(Function))
    expect(valueFromCache).toBeNull()
  })

  it('should delete a given value', async () => {
    await asyncClient.set(key, value)
    await asyncClient.delete(key)
    const valueFromCache = await asyncClient.get(key)
    expect(client.del).toHaveBeenCalledWith(key, expect.any(Function))
    expect(valueFromCache).toBeNull()
  })

  it('should expire a value after the specified amount of seconds', async () => {
    await asyncClient.set(key, value)
    await asyncClient.expire(key, 1)
    await new Promise((resolve) => setTimeout(resolve, 1100))
    const valueFromCache = await asyncClient.get(key)
    expect(client.expire).toHaveBeenCalledWith(key, 1, expect.any(Function))
    expect(valueFromCache).toBeNull()
  })
})
