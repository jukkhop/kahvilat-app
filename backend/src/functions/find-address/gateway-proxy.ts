import {
  APIGatewayProxyEvent as ProxyEvent,
  APIGatewayProxyEventQueryStringParameters as QueryStringParameters,
  APIGatewayProxyResult as ProxyResult,
} from 'aws-lambda'

import { FunctionHandlerBase, GatewayProxyBase } from '../index'
import { Config, FindAddressParams, ValidationSchema } from '../../types'

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

    const { address, latitude, longitude } = queryParams as Record<string, string>

    const fnParams: FindAddressParams = queryParams.address
      ? { address }
      : { latitude: Number(latitude), longitude: Number(longitude) }

    return this.handler.handle(fnParams).then((result) => this.convert(result))
  }

  private static schema(queryParams: QueryStringParameters): ValidationSchema {
    return queryParams.address ? { address: 'string' } : { latitude: 'number', longitude: 'number' }
  }
}

export default GatewayProxy
