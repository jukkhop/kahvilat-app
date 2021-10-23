/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */

import { FunctionHandlerBase } from '../../src/functions'
import { FunctionResult, GoogleResponse } from '../../src/types'

let handler: FunctionHandlerBase

class FunctionHandlerImpl extends FunctionHandlerBase {
  async handle(_params: any): Promise<FunctionResult<any>> {
    return Promise.resolve({ type: 'success', data: {} })
  }
}

beforeEach(() => {
  handler = new FunctionHandlerImpl()
})

it('converts to a successful result with a successful google response', async () => {
  const response: GoogleResponse<any> = {
    type: 'success',
    results: [{}],
  }

  expect(handler.convert(response, (x) => x)).toEqual({
    type: 'success',
    data: response,
  })
})

it('converts the successful result via the given transformer function', async () => {
  const response: GoogleResponse<any> = {
    type: 'success',
    results: [{ foo: 'bar' }],
  }

  const transform = () => ({ bar: 'foo' })

  expect(handler.convert(response, transform)).toEqual({
    type: 'success',
    data: { type: 'success', results: [{ bar: 'foo' }] },
  })
})

it('converts to an error result with an erroneous google response', async () => {
  const response: GoogleResponse<any> = {
    type: 'error',
    error: 'Something failed',
  }

  expect(handler.convert(response, (x) => x)).toEqual({
    type: 'error',
    errors: [new Error('Third party API call failed with error: Something failed')],
  })
})

it('converts to an error result with an erroneous google response with HTTP status', async () => {
  const response: GoogleResponse<any> = {
    type: 'error',
    error: 'Something failed',
    status: 500,
  }

  expect(handler.convert(response, (x) => x)).toEqual({
    type: 'error',
    errors: [new Error('Third party API call failed with HTTP status 500 and error: Something failed')],
  })
})
