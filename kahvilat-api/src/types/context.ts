import { RequestInfo, RequestInit, Response } from 'node-fetch'

import { GoogleCache } from '../caches'
import { GoogleClient } from '../clients'
import { Logger } from '../logger'
import { Config } from './config'
import { LambdaResult as Result } from './lambda'
import { ValidationError } from './validation'

export type Caches = {
  googleCache: GoogleCache
}

export type Clients = {
  googleClient: GoogleClient
}

export type Context = {
  caches: Caches
  clients: Clients
  config: Config
  logger: Logger
  results: Results
  utils: Utils
}

export type Results = {
  badGateway: (message?: string) => Result
  badRequest: (message?: string) => Result
  internalError: (message?: string) => Result
  json: (body: any) => Result
  notFound: (message?: string) => Result
  options: () => Result
  validationError: (errors: ValidationError[]) => Result
}

export type Utils = {
  date: () => Date
  fetch: (url: RequestInfo, init?: RequestInit | undefined) => Promise<Response>
}
