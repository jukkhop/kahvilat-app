import { FunctionHandlerBase } from '../index'

import { GoogleCache } from '../../caches'
import { GoogleClient } from '../../clients'
import { FindPlacesParams, FindPlacesResult } from '../../types/api'
import { FunctionResult } from '../../types/function'
import { convertPlace } from '../../utils/api'

class FunctionHandler extends FunctionHandlerBase<FindPlacesParams, FindPlacesResult> {
  private cache: GoogleCache
  private client: GoogleClient

  constructor(cache: GoogleCache, client: GoogleClient) {
    super()
    this.cache = cache
    this.client = client
  }

  async handle(params: FindPlacesParams): Promise<FunctionResult<FindPlacesResult>> {
    const { cache, client } = this

    const response = await cache.findPlaces(params, () => client.findPlaces(params))

    switch (response.type) {
      case 'success':
        return {
          type: 'success',
          data: {
            results: response.results.map(convertPlace),
            cursor: response.next_page_token,
          },
        }

      case 'error':
        return {
          type: 'error',
          error: response.error,
        }

      default:
        throw new Error()
    }
  }
}

export default FunctionHandler
