import { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult } from 'aws-lambda'

import { FunctionHandlerBase, GatewayProxyBase } from '../../bases'
import { FindAddressParams, Config, ValidationSchema } from '../../types'

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

    const fnParams = (event.queryStringParameters || {}) as FindAddressParams

    // prettier-ignore
    return this.handler
      .handle(fnParams)
      .then(result => this.convert(result))
  }

  private static schema(queryParams: APIGatewayProxyEventQueryStringParameters): ValidationSchema {
    // prettier-ignore
    return queryParams.address
      ? { 'address': 'string' }
      : { 'latitude': 'number', 'longitude': 'number' }
  }
}

export default GatewayProxy
