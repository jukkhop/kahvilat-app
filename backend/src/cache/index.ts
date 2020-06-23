/* eslint-disable @typescript-eslint/ban-ts-ignore */

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

async function get(client: RedisClient, key: string): Promise<string | null> {
  const get = promisify(client.get).bind(client)
  const value = await get(key)
  return value
}

async function set(
  client: RedisClient,
  key: string,
  value: string,
  durationSecs: number = DAY_IN_SECONDS,
): Promise<void> {
  const set = promisify(client.set).bind(client)
  const expire = promisify(client.expire).bind(client)
  await set(key, value)
  await expire(key, durationSecs)
}

async function del(client: RedisClient, key: string): Promise<void> {
  const del = promisify(client.del).bind(client)
  // @ts-ignore
  await del(key)
}

export { createClient, del, get, set }

//
