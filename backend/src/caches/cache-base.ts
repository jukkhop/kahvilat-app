import AsyncRedisClient from '../clients/async-redis-client'

class CacheBase {
  private client: AsyncRedisClient

  constructor(host?: string, port?: number, client?: AsyncRedisClient) {
    this.client = client || new AsyncRedisClient(host, port)
  }

  async get(key: string): Promise<string | undefined> {
    return (await this.client.get(key)) || undefined
  }

  async set(key: string, value: string, durationSecs: number): Promise<void> {
    await this.client.set(key, value)
    await this.client.expire(key, durationSecs)
  }

  async delete(key: string): Promise<void> {
    await this.client.delete(key)
  }
}

export default CacheBase
