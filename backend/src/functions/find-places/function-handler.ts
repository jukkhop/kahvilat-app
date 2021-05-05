import { FunctionHandlerBase } from '../../bases'
import { GoogleCache } from '../../caches'
import { GoogleClient } from '../../clients'
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

    // prettier-ignore
    return cache
      .findPlaces(params, () => client.findPlaces(params))
      .then(response => this.convert(response))
  }
}

export default FunctionHandler
