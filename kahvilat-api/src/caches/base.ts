import { RedisClientType, RedisFlushModes, createClient } from 'redis'

export abstract class CacheBase {
  private client: RedisClientType

  constructor(options: CacheBase.Options) {
    if ('client' in options) {
      this.client = options.client
    }

    if ('host' in options) {
      this.client = createClient({ url: `redis://${options.host}:${options.port}` })
    }
  }

  async get(key: string): Promise<string | undefined> {
    return this.connectExec(async () => {
      const value = await this.client.get(key)
      return value ?? undefined
    })
  }

  async set(key: string, value: string, durationSecs: number): Promise<void> {
    await this.connectExec(async () => {
      await this.client.set(key, value)
      await this.client.expire(key, durationSecs)
    })
  }

  async flush(): Promise<void> {
    await this.connectExec(async () => {
      await this.client.flushAll(RedisFlushModes.SYNC)
    })
  }

  async close(): Promise<void> {
    if (this.client.isReady) {
      await this.client.quit()
    }
  }

  private async connectExec<T>(fn: () => Promise<T>): Promise<T> {
    if (!this.client.isReady) {
      await this.client.connect()
    }

    return fn()
  }
}

export namespace CacheBase {
  export type Options = { host: string; port: number } | { client: RedisClientType }
}
