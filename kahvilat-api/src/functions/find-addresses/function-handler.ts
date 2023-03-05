import { FunctionHandlerBase } from '../index'

import { GoogleCache } from '../../caches'
import { GoogleClient } from '../../clients'
import { FindAddressesParams, FindAddressesResult } from '../../types/api'
import { FunctionResult } from '../../types/function'
import { convertAddress } from '../../utils/api'

class FunctionHandler extends FunctionHandlerBase<FindAddressesParams, FindAddressesResult> {
  private cache: GoogleCache
  private client: GoogleClient

  constructor(cache: GoogleCache, client: GoogleClient) {
    super()
    this.cache = cache
    this.client = client
  }

  async handle(params: FindAddressesParams): Promise<FunctionResult<FindAddressesResult>> {
    const { cache, client } = this

    const response = await cache.findAddresses(params, () => client.findAddresses(params))

    switch (response.type) {
      case 'success':
        return {
          type: 'success',
          data: {
            results: response.results.map(convertAddress),
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
