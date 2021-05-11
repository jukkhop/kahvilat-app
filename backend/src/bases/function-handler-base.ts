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

  convert<A, B>(response: GoogleResponse<A>, transform: (obj: A) => B): FunctionResult<GoogleResponse<B>> {
    switch (response.state) {
      case 'success':
        return this.mkSuccessResult(response, transform)
      case 'error':
        return this.mkErrorResult(response)
      default:
        throw new Error('Invalid case')
    }
  }

  private mkSuccessResult<A, B>(
    response: GoogleSuccessResponse<A>,
    transform: (obj: A) => B,
  ): FunctionSuccessResult<GoogleResponse<B>> {
    return {
      state: 'success',
      data: {
        state: 'success',
        results: response.results.map(transform),
        cursor: response.cursor,
      },
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
