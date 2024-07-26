import { RedisClientType } from 'redis'
import { URLSearchParams } from 'url'

import { ClientResult } from '../clients'
import { DAY_IN_SECONDS, MINUTE_IN_SECONDS } from '../constants/time'
import { GetAddressesParams, GetPlacesParams } from '../types/api'
import { Config } from '../types/config'
import { Address, Place, Response } from '../types/google'
import { failure, success } from '../utils/result'
import { CacheError, CacheResult } from './error'
import { CacheBase } from './index'

export class GoogleCache extends CacheBase {
  constructor(config: Config, client?: RedisClientType) {
    super(client ? { client } : config.redis)
  }

  async getAddresses(
    params: GetAddressesParams,
    fetch: () => Promise<ClientResult<Response<Address>>>,
  ): Promise<CacheResult<Response<Address>>> {
    return this.cachedFetch('/addresses', params, DAY_IN_SECONDS, fetch)
  }

  async getPlaces(
    params: GetPlacesParams,
    fetch: () => Promise<ClientResult<Response<Place>>>,
  ): Promise<CacheResult<Response<Place>>> {
    return this.cachedFetch('/places', params, MINUTE_IN_SECONDS, fetch)
  }

  private async cachedFetch<T>(
    endpoint: string,
    params: Record<string, any>,
    cacheExpireSecs: number,
    fetch: () => Promise<ClientResult<Response<T>>>,
  ): Promise<CacheResult<Response<T>>> {
    const queryParams = new URLSearchParams(params)
    const cacheKey = `${endpoint}?${queryParams.toString()}`

    try {
      const cachedResponse = await this.get(cacheKey)

      if (cachedResponse) {
        return success(JSON.parse(cachedResponse))
      }

      const fetchResult = await fetch()

      if (fetchResult.ok) {
        this.set(cacheKey, JSON.stringify(fetchResult.value), cacheExpireSecs)
      }

      return fetchResult
    } catch (error: any) {
      return failure(new CacheError(error.message))
    }
  }
}
