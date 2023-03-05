/* eslint-disable class-methods-use-this */

import { GatewayProxyBase } from '../index'

import { latitudeRegex, longitudeRegex } from '../../constants/regex'
import { string } from '../../constants/validation'
import { FindAddressesParams, FindAddressesQueryParams, FindAddressesResult } from '../../types/api'
import { ProxyEvent, ProxyResult } from '../../types/proxy'
import { Schema } from '../../types/validation'

class GatewayProxy extends GatewayProxyBase<FindAddressesQueryParams, FindAddressesParams, FindAddressesResult> {
  // prettier-ignore
  private validationSchema: Schema = {
    type: 'object',
    properties: {
      address: { ...string, minLength: 3 },
      latitude: { ...string, pattern: latitudeRegex },
      longitude: { ...string, pattern: longitudeRegex },
    },
    additionalProperties: false,
    oneOf: [
      { required: ['address'] },
      { required: ['latitude', 'longitude'] },
    ],
  }

  async processEvent(event: ProxyEvent): Promise<ProxyResult> {
    const queryParams = event.queryStringParameters ?? {}
    const validationResult = this.validate(queryParams, this.validationSchema)

    if (validationResult.type === 'error') {
      return this.validationError(validationResult.errors)
    }

    const fnParams = this.parseParams(validationResult.data)
    const fnResult = await this.handler.handle(fnParams)
    const proxyResult = this.convertResult(fnResult)

    return proxyResult
  }

  parseParams(data: FindAddressesQueryParams): FindAddressesParams {
    if ('address' in data) {
      return {
        address: data.address,
      }
    }

    if ('latitude' in data) {
      return {
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
      }
    }

    throw new Error()
  }
}

export default GatewayProxy
