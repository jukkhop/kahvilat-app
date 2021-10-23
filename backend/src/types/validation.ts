import { APIGatewayProxyResult } from 'aws-lambda'

type ValidationResult = ValidationSuccessResult | ValidationErrorResult

type ValidationSuccessResult = {
  type: 'success'
}

type ValidationErrorResult = {
  type: 'error'
  response: APIGatewayProxyResult
}

type ValidationTypes = 'string' | 'number'
type ValidationSchema = Record<string, ValidationTypes>

export type { ValidationErrorResult, ValidationResult, ValidationSchema, ValidationSuccessResult }
