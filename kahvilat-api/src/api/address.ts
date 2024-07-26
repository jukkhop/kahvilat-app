import { CacheError } from '../caches'
import { ClientError } from '../clients'
import { GetAddressesParams, GetAddressesResponse } from '../types/api/address'
import { LambdaEvent, LambdaResult } from '../types/lambda'
import { validateGetAddressesParams } from '../validation/address'
import { convertAddress } from '../utils/google'
import { ApiBase } from './base'

export class AddressApi extends ApiBase {
  async getAddresses(event: LambdaEvent): Promise<LambdaResult> {
    const { caches, clients, logger, results } = this
    const { googleCache } = caches
    const { googleClient } = clients

    const paramsRaw = event.queryStringParameters as GetAddressesParams
    const paramsResult = validateGetAddressesParams(paramsRaw)

    if (!paramsResult.ok) {
      return results.validationError(paramsResult.error)
    }

    const params = paramsResult.value
    const addresses = await googleCache.getAddresses(params, () => googleClient.getAddresses(params))

    if (!addresses.ok) {
      logger.error(`Error getting addresses: ${addresses.error.message}`)

      if (addresses.error instanceof ClientError) {
        return results.badGateway(addresses.error.message)
      }

      if (addresses.error instanceof CacheError) {
        return results.internalError(addresses.error.message)
      }

      throw Error(`Unexpected error type: ${addresses.error}`)
    }

    const response: GetAddressesResponse = {
      cursor: addresses.value.next_page_token,
      items: addresses.value.results.map(convertAddress),
    }

    return results.json(response)
  }
}
