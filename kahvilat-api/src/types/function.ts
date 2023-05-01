import { CacheError, ClientError } from './error'

type FunctionParams = Record<string, unknown>
type FunctionResult<T> = FunctionResultSuccess<T> | FunctionResultError

type FunctionResultSuccess<T> = {
  type: 'success'
  data: T
}

type FunctionResultError = {
  type: 'error'
  error: ClientError | CacheError
}

type FindAddressesByAddressFunctionParams = {
  address: string
}

type FindAddressesByCoordsFunctionParams = {
  latitude: number
  longitude: number
}

type FindAddressesFunctionParams = FindAddressesByAddressFunctionParams | FindAddressesByCoordsFunctionParams

export type { FunctionParams, FunctionResult, FunctionResultError, FunctionResultSuccess }
export type { FindAddressesByAddressFunctionParams, FindAddressesByCoordsFunctionParams, FindAddressesFunctionParams }
