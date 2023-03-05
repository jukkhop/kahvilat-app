import { Schema } from 'jsonschema'

type ValidationResult<T> = ValidationResultSuccess<T> | ValidationResultError

type ValidationResultSuccess<T> = {
  type: 'success'
  data: T
}

type ValidationResultError = {
  type: 'error'
  errors: ValidationError[]
}

type ValidationError = {
  field: string
  value: unknown
  type: string
  message: string
}

export type {
  // prettier-ignore
  Schema,
  ValidationError,
  ValidationResult,
  ValidationResultError,
  ValidationResultSuccess,
}
