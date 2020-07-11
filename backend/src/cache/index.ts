/* eslint-disable @typescript-eslint/ban-ts-ignore */

import redis from 'redis'
import { promisify } from 'util'
import { DAY_IN_SECONDS } from '../utils'

class Cache {
  private getPromisified: (arg1: string) => Promise<string>
  private setPromisified: (arg1: string, arg2: string) => Promise<unknown>
  private expirePromisified: (arg1: string, arg2: number) => Promise<number>
  private deletePromisified: (arg1: string) => Promise<unknown>

  constructor(host: string, port: number) {
    const client = redis.createClient({ host, port })
    this.getPromisified = promisify(client.get).bind(client)
    this.setPromisified = promisify(client.set).bind(client)
    this.expirePromisified = promisify(client.expire).bind(client)
    this.deletePromisified = promisify(client.del).bind(client)
  }

  async get(key: string): Promise<string | undefined> {
    return await this.getPromisified(key)
  }

  async set(key: string, value: string, durationSecs: number = DAY_IN_SECONDS): Promise<void> {
    await this.setPromisified(key, value)
    await this.expirePromisified(key, durationSecs)
  }

  async delete(key: string): Promise<void> {
    await this.deletePromisified(key)
  }
}

export default Cache
