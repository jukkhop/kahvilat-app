import { CacheError } from '../caches'
import { ClientError } from '../clients'
import { GetPlacesParams, GetPlacesResponse } from '../types/api/place'
import { LambdaEvent, LambdaResult } from '../types/lambda'
import { convertPlace } from '../utils/google'
import { validateGetPlacesParams } from '../validation/place'
import { ApiBase } from './base'

export class PlaceApi extends ApiBase {
  async getPlaces(event: LambdaEvent): Promise<LambdaResult> {
    const { caches, clients, logger, results } = this
    const { googleCache } = caches
    const { googleClient } = clients

    const paramsRaw = event.queryStringParameters as GetPlacesParams
    const paramsResult = validateGetPlacesParams(paramsRaw)

    if (!paramsResult.ok) {
      return results.validationError(paramsResult.error)
    }

    const params = paramsResult.value
    const places = await googleCache.getPlaces(params, () => googleClient.getPlaces(params))

    if (!places.ok) {
      logger.error(`Error getting places: ${places.error.message}`)

      if (places.error instanceof ClientError) {
        return results.badGateway(places.error.message)
      }

      if (places.error instanceof CacheError) {
        return results.internalError(places.error.message)
      }

      throw Error(`Unexpected error type: ${places.error}`)
    }

    const response: GetPlacesResponse = {
      cursor: places.value.next_page_token,
      items: places.value.results.map(convertPlace),
    }

    return results.json(response)
  }
}
