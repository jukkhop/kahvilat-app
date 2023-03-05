/* eslint-disable class-methods-use-this */

import { GatewayProxyBase } from '../index'

import { placeTypeValues } from '../../constants/place'
import { latitudeRegex, longitudeRegex, radiusRegex } from '../../constants/regex'
import { string } from '../../constants/validation'
import { FindPlacesParams, FindPlacesQueryParams, FindPlacesResult } from '../../types/api'
import { ProxyEvent, ProxyResult } from '../../types/proxy'
import { Schema } from '../../types/validation'

class GatewayProxy extends GatewayProxyBase<FindPlacesQueryParams, FindPlacesParams, FindPlacesResult> {
  // prettier-ignore
  private validationSchema: Schema = {
    type: 'object',
    properties: {
      cursor: { ...string, minLength: 1 },
      keyword: { ...string, minLength: 3 },
      latitude: { ...string, pattern: latitudeRegex },
      longitude: { ...string, pattern: longitudeRegex },
      radius: { ...string, pattern: radiusRegex },
      type: { ...string, enum: placeTypeValues },
    },
    additionalProperties: false,
    oneOf: [
      { required: ['cursor'] },
      { required: ['keyword', 'latitude', 'longitude', 'radius', 'type'] },
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

  parseParams(data: FindPlacesQueryParams): FindPlacesParams {
    if ('cursor' in data) {
      return {
        cursor: data.cursor,
      }
    }

    if ('keyword' in data) {
      return {
        keyword: data.keyword,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        radius: Number(data.radius),
        type: data.type,
      }
    }

    throw new Error()
  }
}

export default GatewayProxy
