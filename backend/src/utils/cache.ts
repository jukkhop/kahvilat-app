import redis, { RedisClient } from 'redis'
import { promisify } from 'util'

const DAY_IN_SECONDS = 86400

function createClient(): RedisClient {
  const { REDIS_HOST = '', REDIS_PORT = '' } = process.env
  const client = redis.createClient({
    host: REDIS_HOST,
    port: Number(REDIS_PORT),
  })
  return client
}

async function get(client: RedisClient, key: string): Promise<string | undefined> {
  const get = promisify(client.get).bind(client)
  const value: string | null = await get(key)
  return value !== null ? value : undefined
}

async function set(client: RedisClient, key: string, value: string): Promise<void> {
  const set = promisify(client.set).bind(client)
  const expire = promisify(client.expire).bind(client)
  await set(key, value)
  await expire(key, DAY_IN_SECONDS)
}

export { createClient, get, set }
