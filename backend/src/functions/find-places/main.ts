import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import FunctionHandler from './function-handler'
import GatewayProxy from './gateway-proxy'

import { GoogleCache } from '../../caches'
import { GoogleClient } from '../../clients'
import { getConfig } from '../../config'

async function invoke(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const config = getConfig()
  const cache = new GoogleCache(config)
  const client = new GoogleClient(config)
  const handler = new FunctionHandler(cache, client)
  const proxy = new GatewayProxy(config, handler)

  return proxy.process(event)
}

export { invoke }
