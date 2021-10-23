import qs from 'qs'

import { CacheBase } from './index'
import { AsyncRedisClient } from '../clients'
import { DAY_IN_SECONDS, MINUTE_IN_SECONDS } from '../constants/misc'

import {
  Config,
  FindAddressParams,
  FindPlacesParams,
  GoogleAddress as Address,
  GooglePlace as Place,
  GoogleResponse as Response,
} from '../types'

class GoogleCache extends CacheBase {
  constructor(config: Config, client?: AsyncRedisClient) {
    super(config.redis.host, config.redis.port, client)
  }

  async findAddress(params: FindAddressParams, fetch: () => Promise<Response<Address>>): Promise<Response<Address>> {
    return this.cachedFetch('find-address', params, DAY_IN_SECONDS, fetch)
  }

  async findPlaces(params: FindPlacesParams, fetch: () => Promise<Response<Place>>): Promise<Response<Place>> {
    return this.cachedFetch('find-places', params, MINUTE_IN_SECONDS, fetch)
  }

  private async cachedFetch<T>(
    endpoint: string,
    queryParams: any,
    cacheExpireSecs: number,
    fetch: () => Promise<Response<T>>,
  ): Promise<Response<T>> {
    const queryString = qs.stringify(queryParams, { encode: false })
    const cacheKey = `${endpoint}?${queryString}`
    const cachedResponse = await this.get(cacheKey)

    if (cachedResponse) {
      return JSON.parse(cachedResponse)
    }

    const fetchResponse = await fetch()

    if (fetchResponse.type === 'success') {
      this.set(cacheKey, JSON.stringify(fetchResponse), cacheExpireSecs)
    }

    return fetchResponse
  }
}

export default GoogleCache
