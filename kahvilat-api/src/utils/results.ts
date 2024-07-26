import HttpStatus from 'http-status'

import { Config } from '../types/config'
import { Results } from '../types/context'
import { LambdaResult as Result } from '../types/lambda'
import { ValidationError } from '../types/validation'

const Authorization = 'Authorization'
const AccessControlAllowOrigin = 'Access-Control-Allow-Origin'
const AccessControlAllowHeaders = 'Access-Control-Allow-Headers'
const AccessControlAllowMethods = 'Access-Control-Allow-Methods'
const ContentType = 'Content-Type'

const Delete = 'DELETE'
const Get = 'GET'
const Patch = 'PATCH'
const Post = 'POST'
const Put = 'PUT'
const Options = 'OPTIONS'

const OK = HttpStatus['200_MESSAGE']
const BadRequest = HttpStatus['400_MESSAGE']
const NotFound = HttpStatus['404_MESSAGE']
const InternalError = HttpStatus['500_MESSAGE']
const BadGateway = HttpStatus['502_MESSAGE']

export const initResults = (config: Config): Results => {
  const origin = ['local'].includes(config.cicd.stage) ? '*' : config.ui.baseUrl.origin

  const baseResult: Result = {
    statusCode: HttpStatus.OK,
    headers: {
      [AccessControlAllowOrigin]: origin,
      [ContentType]: 'application/json',
    },
    body: JSON.stringify({ message: OK }),
  }

  const options = (): Result => ({
    ...baseResult,
    headers: {
      ...(baseResult.headers ?? {}),
      [AccessControlAllowHeaders]: [Authorization, ContentType].join(','),
      [AccessControlAllowMethods]: [Delete, Get, Patch, Post, Put, Options].join(','),
    },
    body: JSON.stringify({ message: OK }),
  })

  const badGateway = (message?: string): Result => ({
    ...baseResult,
    statusCode: HttpStatus.BAD_GATEWAY,
    body: JSON.stringify({ message: message ?? BadGateway }),
  })

  const badRequest = (message?: string): Result => ({
    ...baseResult,
    statusCode: HttpStatus.BAD_REQUEST,
    body: JSON.stringify({ message: message ?? BadRequest }),
  })

  const internalError = (message?: string): Result => ({
    ...baseResult,
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    body: JSON.stringify({ message: message ?? InternalError }),
  })

  const json = (body: any): Result => ({
    ...baseResult,
    body: JSON.stringify(body),
  })

  const notFound = (message?: string): Result => ({
    ...baseResult,
    statusCode: HttpStatus.NOT_FOUND,
    body: JSON.stringify({ message: message ?? NotFound }),
  })

  const validationError = (errors: ValidationError[]): Result => ({
    ...baseResult,
    statusCode: HttpStatus.BAD_REQUEST,
    body: JSON.stringify({ errors }),
  })

  const results: Results = {
    badGateway,
    badRequest,
    internalError,
    json,
    notFound,
    options,
    validationError,
  }

  return results
}
