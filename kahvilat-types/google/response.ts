/* eslint-disable camelcase */

import { CacheError, ClientError } from '../error'

type Response<T> = ResponseSuccess<T> | ResponseError

type ResponseSuccess<T> = {
  type: 'success'
  results: T[]
  next_page_token?: string
}

type ResponseError = {
  type: 'error'
  error: ClientError | CacheError
}

export type { Response, ResponseError, ResponseSuccess }
