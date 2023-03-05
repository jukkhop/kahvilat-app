/* eslint-disable no-shadow */

import {
  APIGatewayProxyEvent as ProxyEvent,
  APIGatewayProxyEventQueryStringParameters as QueryParameters,
  APIGatewayProxyResult as ProxyResult,
} from 'aws-lambda'

const enum HttpStatus {
  OK = 200,
  BadRequest = 400,
  InternalError = 500,
  BadGateway = 502,
}

export type { ProxyEvent, ProxyResult, QueryParameters }
export { HttpStatus }
