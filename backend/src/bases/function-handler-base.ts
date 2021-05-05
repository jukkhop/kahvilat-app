/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */

import {
  FunctionErrorResult,
  FunctionResult,
  FunctionSuccessResult,
  GoogleErrorResponse,
  GoogleResponse,
  GoogleSuccessResponse,
} from '../types'

abstract class FunctionHandlerBase {
  abstract handle(params: Record<string, any>): Promise<FunctionResult<any>>

  convert<T>(response: GoogleResponse<T>): FunctionResult<GoogleResponse<T>> {
    switch (response.state) {
      case 'success':
        return this.mkSuccessResult(response)
      case 'error':
        return this.mkErrorResult(response)
      default:
        throw new Error('Invalid case')
    }
  }

  private mkSuccessResult<T>(response: GoogleSuccessResponse<T>): FunctionSuccessResult<GoogleResponse<T>> {
    return {
      state: 'success',
      data: { state: 'success', results: response.results, cursor: response.cursor },
    }
  }

  private mkErrorResult(response: GoogleErrorResponse): FunctionErrorResult {
    const message = response.status
      ? `Third party API call failed with HTTP status ${response.status} and error: ${response.error}`
      : `Third party API call failed with error: ${response.error}`

    return {
      state: 'error',
      errors: [new Error(message)],
    }
  }
}

export default FunctionHandlerBase
