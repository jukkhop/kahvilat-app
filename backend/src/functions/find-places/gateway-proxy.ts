import {
  APIGatewayProxyEvent as ProxyEvent,
  APIGatewayProxyEventQueryStringParameters as QueryStringParameters,
  APIGatewayProxyResult as ProxyResult,
} from 'aws-lambda'

import { FunctionHandlerBase, GatewayProxyBase } from '../index'
import { Config, FindPlacesParams, ValidationSchema } from '../../types'

class GatewayProxy extends GatewayProxyBase {
  private handler: FunctionHandlerBase

  constructor(config: Config, handler: FunctionHandlerBase) {
    super(config)
    this.handler = handler
  }

  async process(event: ProxyEvent): Promise<ProxyResult> {
    const queryParams = event.queryStringParameters || {}
    const validationResult = this.validate(event, GatewayProxy.schema(queryParams))

    if (validationResult.type === 'error') {
      return validationResult.response
    }

    const { cursor, keyword, latitude, longitude, radius, type } = queryParams as Record<string, string>

    const fnParams: FindPlacesParams = queryParams.cursor
      ? { cursor }
      : {
          keyword,
          latitude: Number(latitude),
          longitude: Number(longitude),
          radius: Number(radius),
          type,
        }

    return this.handler.handle(fnParams).then((result) => this.convert(result))
  }

  private static schema(queryParams: QueryStringParameters): ValidationSchema {
    return queryParams.cursor
      ? { cursor: 'string' }
      : {
          keyword: 'string',
          latitude: 'number',
          longitude: 'number',
          radius: 'number',
          type: 'string',
        }
  }
}

export default GatewayProxy
