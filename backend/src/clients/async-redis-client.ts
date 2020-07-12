import redis, { RedisClient } from 'redis'
import { promisify } from 'util'

class AsyncRedisClient {
  public client: RedisClient

  private getPromisified: (arg1: string) => Promise<string>
  private setPromisified: (arg1: string, arg2: string) => Promise<unknown>
  private expirePromisified: (arg1: string, arg2: number) => Promise<number>
  private deletePromisified: (arg1: string) => Promise<unknown>

  constructor(host?: string, port?: number, client?: RedisClient) {
    this.client = client || redis.createClient({ host, port })
    this.getPromisified = promisify(this.client.get).bind(this.client)
    this.setPromisified = promisify(this.client.set).bind(this.client)
    this.expirePromisified = promisify(this.client.expire).bind(this.client)
    this.deletePromisified = promisify(this.client.del).bind(this.client)
  }

  async get(key: string): Promise<string | null> {
    return await this.getPromisified(key)
  }

  async set(key: string, value: string): Promise<unknown> {
    return await this.setPromisified(key, value)
  }

  async expire(key: string, seconds: number): Promise<number> {
    return await this.expirePromisified(key, seconds)
  }

  async delete(key: string): Promise<unknown> {
    return await this.deletePromisified(key)
  }
}

export default AsyncRedisClient
