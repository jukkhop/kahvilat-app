import AsyncRedisClient from '../clients/async-redis-client'
import { DAY_IN_SECONDS } from '../constants'

class CacheBase {
  private client: AsyncRedisClient

  constructor(host?: string, port?: number, client?: AsyncRedisClient) {
    this.client = client || new AsyncRedisClient(host, port)
  }

  async get(key: string): Promise<string | undefined> {
    return (await this.client.get(key)) || undefined
  }

  async set(key: string, value: string, durationSecs: number = DAY_IN_SECONDS): Promise<void> {
    await this.client.set(key, value)
    await this.client.expire(key, durationSecs)
  }

  async delete(key: string): Promise<void> {
    await this.client.delete(key)
  }
}

export default CacheBase
