import { FunctionHandlerBase } from '../index'
import { GoogleCache } from '../../caches'
import { GoogleClient } from '../../clients'
import { transformAddress } from '../../utils'
import { Address, FindAddressParams, FunctionResult, GoogleResponse } from '../../types'

class FunctionHandler extends FunctionHandlerBase {
  private cache: GoogleCache
  private client: GoogleClient

  constructor(cache: GoogleCache, client: GoogleClient) {
    super()
    this.cache = cache
    this.client = client
  }

  async handle(params: FindAddressParams): Promise<FunctionResult<GoogleResponse<Address>>> {
    const { cache, client } = this

    return cache
      .findAddress(params, () => client.findAddress(params))
      .then((response) => this.convert(response, transformAddress))
  }
}

export default FunctionHandler
