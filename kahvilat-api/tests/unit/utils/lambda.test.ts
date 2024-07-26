import { LambdaEvent } from '../../../src/types/lambda'
import { mergeQueryParams } from '../../../src/utils/lambda'
import { LambdaTestData } from '../../data/lambda'

describe('mergeQueryParams', () => {
  it('merges single-value and multi-value query string parameters into one object', () => {
    const event: LambdaEvent = {
      ...LambdaTestData.nullEvent,
      queryStringParameters: {
        param1: 'value1',
        param2: 'value2,value3',
      },
      multiValueQueryStringParameters: {
        param1: ['value1'],
        param2: ['value2', 'value3'],
      },
    }

    expect(mergeQueryParams(event)).toEqual({
      param1: 'value1',
      param2: ['value2', 'value3'],
    })
  })
})
