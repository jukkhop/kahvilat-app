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
    const expectedResult = { results: [] }
    fetchFn.mockImplementationOnce(() => Promise.resolve([200, expectedResult]))
    // prettier-ignore
    const [status, responseJson] = await cachedFetch(
      cache,
      'some-endpoint',
      { arg1: 'foo', arg2: 'bar' },
      () => fetchFn(),
    )
    const response = JSON.parse(responseJson)
    expect(status).toBe(200)
    expect(response).toEqual(expectedResult)
  })
})
