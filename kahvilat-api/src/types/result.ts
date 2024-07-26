export type Result<TValue, TError> = Success<TValue> | Failure<TError>

export type Success<TValue> = {
  ok: true
  value: TValue
}

export type Failure<TError> = {
  ok: false
  error: TError
}
