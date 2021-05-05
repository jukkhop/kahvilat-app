import { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult } from 'aws-lambda'

import { FunctionHandlerBase, GatewayProxyBase } from '../../bases'
import { FindPlacesParams, Config, ValidationSchema } from '../../types'

class GatewayProxy extends GatewayProxyBase {
  private handler: FunctionHandlerBase

  constructor(config: Config, handler: FunctionHandlerBase) {
    super(config)
    this.handler = handler
  }

  async process(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const queryParams = event.queryStringParameters || {}
    const validationResult = this.validate(event, GatewayProxy.schema(queryParams))

    if (validationResult.state === 'error') {
      return validationResult.response
    }

    const { cursor, keyword, latitude, longitude, radius, type } = queryParams as Record<string, string>

    // prettier-ignore
    const fnParams: FindPlacesParams = queryParams.cursor
      ? { cursor }
      : { keyword, latitude: Number(latitude), longitude: Number(longitude), radius: Number(radius), type }

    // prettier-ignore
    return this.handler
      .handle(fnParams)
      .then(result => this.convert(result))
  }

  private static schema(queryParams: APIGatewayProxyEventQueryStringParameters): ValidationSchema {
    return queryParams.cursor
      ? { cursor: 'string' }
      : { keyword: 'string', latitude: 'number', longitude: 'number', radius: 'number', type: 'string' }
  }
}

export default GatewayProxy
