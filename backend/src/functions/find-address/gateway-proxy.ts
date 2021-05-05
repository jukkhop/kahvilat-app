import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { FunctionHandlerBase, GatewayProxyBase } from '../../bases'
import { FindAddressParams, Config } from '../../types'

class GatewayProxy extends GatewayProxyBase {
  private handler: FunctionHandlerBase

  constructor(config: Config, handler: FunctionHandlerBase) {
    super(config)
    this.handler = handler
  }

  async process(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const queryParams = event.queryStringParameters || {}
    const expectedParams = queryParams.address ? ['address'] : ['latitude', 'longitude']
    const validationResult = this.validate(event, expectedParams)

    if (validationResult.state === 'error') {
      return validationResult.response
    }

    const fnParams = (event.queryStringParameters || {}) as FindAddressParams

    // prettier-ignore
    return this.handler
      .handle(fnParams)
      .then(result => this.convert(result))
  }
}

export default GatewayProxy
