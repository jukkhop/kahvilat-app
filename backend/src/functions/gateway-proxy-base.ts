/* eslint-disable class-methods-use-this */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { Config, FunctionResult, ValidationResult, ValidationSchema } from '../types'

class GatewayProxyBase {
  protected config: Config

  constructor(config: Config) {
    this.config = config
  }

  validate(event: APIGatewayProxyEvent, schema: ValidationSchema): ValidationResult {
    const queryParams = event.queryStringParameters || {}

    const missingErrors = Object.keys(schema)
      .filter((key) => !Object.keys(queryParams).includes(key))
      .map((key) => new Error(`Missing query string parameter: ${key}`))

    const typeErrors = Object.entries(schema)
      .filter(([key, type]) => {
        const value = queryParams[key]
        if (value === undefined) return true
        switch (type) {
          case 'string':
            return typeof value !== 'string'
          case 'number':
            return Number.isNaN(parseFloat(value))
          default:
            return true
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(([key, _]) => {
        return new Error(`Invalid type for query string parameter: ${key}`)
      })

    const errors = missingErrors.length > 0 ? missingErrors : typeErrors

    switch (errors.length) {
      case 0:
        return { type: 'success' }
      default:
        return { type: 'error', response: this.mkErrorResponse(400, errors) }
    }
  }

  convert(result: FunctionResult<any>): APIGatewayProxyResult {
    switch (result.type) {
      case 'success':
        return this.mkResponse(200, JSON.stringify(result.data))
      case 'error':
        return this.mkErrorResponse(502, result.errors)
      default:
        throw new Error('Invalid case')
    }
  }

  private mkResponse(status: number, body: string): APIGatewayProxyResult {
    return {
      statusCode: status,
      headers: this.mkHeaders(),
      body,
    }
  }

  private mkErrorResponse(status: number, errors: Error[]): APIGatewayProxyResult {
    const error = errors.map((x) => x.message).join(', ')
    const body = JSON.stringify({ error })
    return this.mkResponse(status, body)
  }

  private mkHeaders(): Record<string, boolean | number | string> {
    const { config } = this
    const origin = config.stage === 'local' ? '*' : config.frontend.url

    return {
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': origin,
    }
  }
}

export default GatewayProxyBase
