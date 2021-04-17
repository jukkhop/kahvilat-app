import redis from 'redis-mock'

import { cachedFetch } from '.'
import Cache from '../cache'
import AsyncRedisClient from '../clients/async-redis-client'

let cache: Cache
let redisClient: AsyncRedisClient
let fetchFn: jest.Mock<any, any>

beforeEach(() => {
  // @ts-ignore
  redisClient = new AsyncRedisClient(undefined, undefined, redis.createClient())
  cache = new Cache(undefined, undefined, redisClient)
  fetchFn = jest.fn()
})

describe('cachedFetch', () => {
  it('should return valid data', async () => {
    const expectedBody = JSON.stringify({ results: [] })
    fetchFn.mockImplementationOnce(() => Promise.resolve([200, expectedBody]))
    // prettier-ignore
    const [status, responseBody] = await cachedFetch(
      cache,
      'some-endpoint',
      { arg1: 'foo', arg2: 'bar' },
      () => fetchFn(),
    )
    expect(status).toBe(200)
    expect(responseBody).toEqual(expectedBody)
  })
})
