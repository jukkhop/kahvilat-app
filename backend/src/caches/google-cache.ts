import qs from 'qs'

import { CacheBase } from '../bases'
import { AsyncRedisClient } from '../clients'
import { DAY_IN_SECONDS, MINUTE_IN_SECONDS } from '../constants'

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

  async findAddress(
    queryParams: FindAddressParams,
    fetchFn: () => Promise<Response<Address>>,
  ): Promise<Response<Address>> {
    return this.cachedFetch('find-address', queryParams, DAY_IN_SECONDS, fetchFn)
  }

  // prettier-ignore
  async findPlaces(
    queryParams: FindPlacesParams,
    fetchFn: () => Promise<Response<Place>>,
  ): Promise<Response<Place>> {
    return this.cachedFetch('find-places', queryParams, MINUTE_IN_SECONDS, fetchFn)
  }

  private async cachedFetch<T>(
    endpoint: string,
    queryParams: any,
    cacheExpireSecs: number,
    fetchFn: () => Promise<Response<T>>,
  ): Promise<Response<T>> {
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
