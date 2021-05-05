/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */

import FunctionHandlerBase from './function-handler-base'
import { FunctionResult, GoogleResponse } from '../types'

let handler: FunctionHandlerBase

class FunctionHandlerImpl extends FunctionHandlerBase {
  async handle(_params: any): Promise<FunctionResult<any>> {
    return Promise.resolve({ state: 'success', data: {} })
  }
}

beforeEach(() => {
  handler = new FunctionHandlerImpl()
})

it('converts to a successful result with a successful google response', async () => {
  const response: GoogleResponse<any> = {
    state: 'success',
    results: [{ foo: 'bar' }],
  }

  expect(handler.convert(response)).toEqual({
    state: 'success',
    data: response,
  })
})

it('converts to an error result with an erroneous google response', async () => {
  const response: GoogleResponse<any> = {
    state: 'error',
    error: 'Something failed',
  }

  expect(handler.convert(response)).toEqual({
    state: 'error',
    errors: [new Error('Third party API call failed with error: Something failed')],
  })
})

it('converts to an error result with an erroneous google response with HTTP status', async () => {
  const response: GoogleResponse<any> = {
    state: 'error',
    error: 'Something failed',
    status: 500,
  }

  expect(handler.convert(response)).toEqual({
    state: 'error',
    errors: [new Error('Third party API call failed with HTTP status 500 and error: Something failed')],
  })
})
