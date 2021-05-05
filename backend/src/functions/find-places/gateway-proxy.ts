import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { FunctionHandlerBase, GatewayProxyBase } from '../../bases'
import { FindPlacesParams, Config } from '../../types'

class GatewayProxy extends GatewayProxyBase {
  private handler: FunctionHandlerBase

  constructor(config: Config, handler: FunctionHandlerBase) {
    super(config)
    this.handler = handler
  }

  async process(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const queryParams = event.queryStringParameters || {}
    const expectedParams = queryParams.cursor ? ['cursor'] : ['keyword', 'latitude', 'longitude', 'radius', 'type']
    const validationResult = this.validate(event, expectedParams)

    if (validationResult.state === 'error') {
      return validationResult.response
    }

    const { cursor, keyword, latitude, longitude, radius, type } = queryParams as Record<string, string>

    // prettier-ignore
    const fnParams: FindPlacesParams = queryParams.cursor
      ? { cursor }
      : { keyword, latitude, longitude, radius: Number(radius), type }

    // prettier-ignore
    return this.handler
      .handle(fnParams)
      .then(result => this.convert(result))
  }
}

export default GatewayProxy
