import OpenAPIBackend, { Document, Handler, Request } from 'openapi-backend'
import 'source-map-support/register'

import { AddressApi, PlaceApi } from './api'
import { initConfig } from './config'
import { initContext } from './context'
import { Logger } from './logger'
import openApiDocument from './specification/openapi.json'
import { OperationMethods } from './types/api/openapi'
import { Context } from './types/context'
import { LambdaEvent, LambdaResult } from './types/lambda'
import { mergeQueryParams } from './utils/lambda'
import { initResults } from './utils/results'

const backend = new OpenAPIBackend({
  definition: openApiDocument as Document,
  quick: true,
})

const commonHandlers: Record<string, Handler> = {
  notFound: (_, __, ctx: Context) => {
    return ctx.results.notFound()
  },
  validationFail: ({ validation }, _, ctx: Context) => {
    return ctx.results.validationError(validation.errors ?? [])
  },
}

const apiHandlers: Record<keyof OperationMethods, Handler> = {
  getHealth: (_, __, ctx: Context) => {
    return ctx.results.json({ status: 'OK' })
  },
  getAddresses: (_, event: LambdaEvent, ctx: Context) => {
    return new AddressApi(ctx).getAddresses(event)
  },
  getPlaces: (_, event: LambdaEvent, ctx: Context) => {
    return new PlaceApi(ctx).getPlaces(event)
  },
}

backend.register({
  ...commonHandlers,
  ...apiHandlers,
})

backend.init()

export const handler = async (event: LambdaEvent): Promise<LambdaResult> => {
  const config = initConfig()
  const logger = new Logger(config)
  const context = initContext(config, logger)
  const results = initResults(config)

  if (event.httpMethod === 'OPTIONS') {
    return results.options()
  }

  try {
    const request: Request = {
      method: event.httpMethod,
      path: event.path.replace(/^\/api/, ''),
      query: mergeQueryParams(event),
      body: event.body,
      headers: event.headers as any,
    }

    return backend.handleRequest(request, event, context)
  } catch (err: any) {
    logger.error(err.message)
    return results.internalError(err.message)
  }
}
