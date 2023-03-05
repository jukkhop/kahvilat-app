import FunctionHandler from './function-handler'
import GatewayProxy from './gateway-proxy'

import { GoogleCache } from '../../caches'
import { GoogleClient } from '../../clients'
import { initConfig } from '../../config'
import { ProxyEvent, ProxyResult } from '../../types/proxy'

async function invoke(event: ProxyEvent): Promise<ProxyResult> {
  const config = initConfig()
  const cache = new GoogleCache(config)
  const client = new GoogleClient(config)
  const handler = new FunctionHandler(cache, client)
  const proxy = new GatewayProxy(config, handler)

  return proxy.processEvent(event)
}

export { invoke }
