import { APIGatewayProxyResult } from 'aws-lambda'

type ValidationResult = ValidationSuccessResult | ValidationErrorResult

type ValidationSuccessResult = {
  state: 'success'
}

type ValidationErrorResult = {
  state: 'error'
  response: APIGatewayProxyResult
}

type ValidationTypes = 'string' | 'number'
type ValidationSchema = Record<string, ValidationTypes>

export type { ValidationErrorResult, ValidationResult, ValidationSchema, ValidationSuccessResult }
