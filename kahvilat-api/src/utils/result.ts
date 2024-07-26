import { Failure, Result, Success } from '../types/result'

export function success<TValue>(value: TValue): Success<TValue> {
  return {
    ok: true,
    value,
  }
}

export function failure<TError>(error: TError): Failure<TError> {
  return {
    ok: false,
    error,
  }
}

export function unwrap<TValue, TError>(value: Result<TValue, TError>): TValue {
  if (!value.ok) {
    throw Error(`Attempted to unwrap failure, expected success`)
  }
  return value.value
}

export function unwrapE<TValue, TError>(value: Result<TValue, TError>): TError {
  if (value.ok) {
    throw Error(`Attempted to unwrap success, expected failure`)
  }
  return value.error
}
