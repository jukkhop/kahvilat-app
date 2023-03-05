import qs from 'qs'

import { CacheBase } from './index'

import { AsyncRedisClient } from '../clients'
import { DAY_IN_SECONDS, MINUTE_IN_SECONDS } from '../constants/time'
import { FindAddressesParams, FindPlacesParams } from '../types/api'
import { Config } from '../types/config'
import { Address, Place, Response } from '../types/google'
import { CacheError } from '../types/error'

class GoogleCache extends CacheBase {
  constructor(config: Config, client?: AsyncRedisClient) {
    super(config.redis.host, config.redis.port, client)
  }

  async findAddresses(
    params: FindAddressesParams,
    fetch: () => Promise<Response<Address>>,
  ): Promise<Response<Address>> {
    return this.cachedFetch('find-addresses', params, DAY_IN_SECONDS, fetch)
  }

  async findPlaces(params: FindPlacesParams, fetch: () => Promise<Response<Place>>): Promise<Response<Place>> {
    return this.cachedFetch('find-places', params, MINUTE_IN_SECONDS, fetch)
  }

  private async cachedFetch<T>(
    endpoint: string,
    params: Record<string, any>,
    cacheExpireSecs: number,
    fetch: () => Promise<Response<T>>,
  ): Promise<Response<T>> {
    const queryString = qs.stringify(params, { encode: false })
    const cacheKey = `${endpoint}?${queryString}`

    try {
      const cachedResponse = await this.get(cacheKey)

      if (cachedResponse) {
        return JSON.parse(cachedResponse)
      }

      const fetchResponse = await fetch()

      if (fetchResponse.type === 'success') {
        this.set(cacheKey, JSON.stringify(fetchResponse), cacheExpireSecs)
      }

      return fetchResponse
    } catch (thrown: unknown) {
      const error = thrown as Error

      return {
        type: 'error',
        error: new CacheError(error.message),
      }
    }
  }
}

export default GoogleCache
