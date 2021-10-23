import { FunctionHandlerBase } from '../index'
import { GoogleCache } from '../../caches'
import { GoogleClient } from '../../clients'
import { transformPlace } from '../../utils/common'
import { FindPlacesParams, FunctionResult, GoogleResponse, Place } from '../../types'

class FunctionHandler extends FunctionHandlerBase {
  private cache: GoogleCache
  private client: GoogleClient

  constructor(cache: GoogleCache, client: GoogleClient) {
    super()
    this.cache = cache
    this.client = client
  }

  async handle(params: FindPlacesParams): Promise<FunctionResult<GoogleResponse<Place>>> {
    const { cache, client } = this

    return cache
      .findPlaces(params, () => client.findPlaces(params))
      .then((response) => this.convert(response, transformPlace))
  }
}

export default FunctionHandler
