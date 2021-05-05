import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { Config, FunctionResult, Headers, ValidationResult } from '../types'

class GatewayProxyBase {
  protected config: Config

  constructor(config: Config) {
    this.config = config
  }

  validate(event: APIGatewayProxyEvent, expectedParams: string[]): ValidationResult {
    const queryParams = (event.queryStringParameters || {}) as Record<string, string>

    const errors = expectedParams
      .filter(x => !Object.keys(queryParams).includes(x))
      .map(x => new Error(`Missing query string parameter: ${x}`))

    switch (errors.length) {
      case 0:
        return { state: 'success' }
      default:
        return { state: 'error', response: this.mkErrorResponse(400, errors) }
    }
  }

  convert(result: FunctionResult<any>): APIGatewayProxyResult {
    switch (result.state) {
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
    const error = errors.map(x => x.message).join(', ')
    const body = JSON.stringify({ error })
    return this.mkResponse(status, body)
  }

  private mkHeaders(): Headers {
    const { config } = this
    const origin = config.stage === 'local' ? '*' : config.frontend.url

    return {
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': origin,
    }
  }
}

export default GatewayProxyBase
