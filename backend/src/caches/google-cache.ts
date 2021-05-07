import qs from 'qs'

import { CacheBase } from '../bases'
import { AsyncRedisClient } from '../clients'
import { MINUTE_IN_SECONDS, DAY_IN_SECONDS } from '../constants'
import { Address, Config, FindAddressParams, FindPlacesParams, GoogleResponse, Place } from '../types'

class GoogleCache extends CacheBase {
  constructor(config: Config, client?: AsyncRedisClient) {
    super(config.redis.host, config.redis.port, client)
  }

  async findAddress(
    queryParams: FindAddressParams,
    fetchFn: () => Promise<GoogleResponse<Address>>,
  ): Promise<GoogleResponse<Address>> {
    return this.cachedFetch('find-address', queryParams, DAY_IN_SECONDS, fetchFn)
  }

  async findPlaces(
    queryParams: FindPlacesParams,
    fetchFn: () => Promise<GoogleResponse<Place>>,
  ): Promise<GoogleResponse<Place>> {
    return this.cachedFetch('find-places', queryParams, MINUTE_IN_SECONDS, fetchFn)
  }

  private async cachedFetch<T>(
    endpoint: string,
    queryParams: any,
    cacheExpireSecs: number,
    fetchFn: () => Promise<GoogleResponse<T>>,
  ): Promise<GoogleResponse<T>> {
    const queryString = qs.stringify(queryParams, { encode: false })
    const cacheKey = `${endpoint}?${queryString}`
    const cachedResponse = await this.get(cacheKey)

    if (cachedResponse) {
      return JSON.parse(cachedResponse)
    }

    const fetchResponse = await fetchFn()

    if (fetchResponse.state === 'success') {
      this.set(cacheKey, JSON.stringify(fetchResponse), cacheExpireSecs)
    }

    return fetchResponse
  }
}

export default GoogleCache
