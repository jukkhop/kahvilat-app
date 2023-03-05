/* eslint-disable class-methods-use-this */

import * as JsonSchema from 'jsonschema'
import FunctionHandlerBase from './function-handler-base'

import { Config } from '../types/config'
import { CacheError, ClientError } from '../types/error'
import { FunctionResult } from '../types/function'
import { HttpStatus, ProxyEvent, ProxyResult } from '../types/proxy'
import { Schema, ValidationError, ValidationResult } from '../types/validation'
import { convertValidationError } from '../utils/validation'

abstract class GatewayProxyBase<TProxyParams, TFunctionParams, TFunctionResult> {
  protected config: Config
  protected handler: FunctionHandlerBase<TFunctionParams, TFunctionResult>
  protected validator: JsonSchema.Validator
  protected validationOptions: JsonSchema.Options

  abstract processEvent(event: ProxyEvent): Promise<ProxyResult>
  abstract parseParams(params: TProxyParams): TFunctionParams

  constructor(config: Config, handler: FunctionHandlerBase<TFunctionParams, TFunctionResult>) {
    this.config = config
    this.handler = handler
    this.validator = new JsonSchema.Validator()
    this.validationOptions = { nestedErrors: true }
  }

  protected validate(data: unknown, schema: Schema): ValidationResult<TProxyParams> {
    const result = this.validator.validate(data, schema, this.validationOptions)

    switch (result.valid) {
      case true:
        return {
          type: 'success',
          data: data as TProxyParams,
        }
      default:
        return {
          type: 'error',
          errors: result.errors.map(convertValidationError),
        }
    }
  }

  protected validationError(errors: ValidationError[]): ProxyResult {
    return this.json(HttpStatus.BadRequest, { errors })
  }

  protected convertResult(result: FunctionResult<TFunctionResult>): ProxyResult {
    switch (result.type) {
      case 'success':
        return this.json(HttpStatus.OK, result.data)

      case 'error': {
        if (result.error instanceof ClientError) {
          return this.error(HttpStatus.BadGateway, result.error)
        }

        if (result.error instanceof CacheError) {
          return this.error(HttpStatus.InternalError, result.error)
        }

        return this.error(HttpStatus.InternalError, result.error)
      }

      default:
        throw new Error()
    }
  }

  private json(status: HttpStatus, payload: unknown): ProxyResult {
    return {
      statusCode: status,
      headers: this.createHeaders('application/json'),
      body: JSON.stringify(payload),
    }
  }

  private error(status: HttpStatus, error: Error): ProxyResult {
    const payload = { message: error.message }
    return this.json(status, payload)
  }

  private createHeaders(contentType?: string): ProxyResult['headers'] {
    const { config } = this
    const origin = config.cicd.stage === 'local' ? '*' : config.ui.baseUrl.origin

    const headers = new Map<string, string | number | boolean>([
      ['Access-Control-Allow-Credentials', true],
      ['Access-Control-Allow-Origin', origin],
    ])

    if (contentType) {
      headers.set('Content-Type', contentType)
    }

    return Object.fromEntries(headers)
  }
}

export default GatewayProxyBase
