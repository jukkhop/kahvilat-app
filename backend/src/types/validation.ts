import { APIGatewayProxyResult } from 'aws-lambda'

type ValidationResult = ValidationSuccessResult | ValidationErrorResult

type ValidationSuccessResult = {
  state: 'success'
}

type ValidationErrorResult = {
  state: 'error'
  response: APIGatewayProxyResult
}

export type { ValidationResult, ValidationSuccessResult, ValidationErrorResult }
