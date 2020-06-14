import { Headers } from '../types'

export function getCorsHeaders(): Headers {
  const { STAGE = '', FRONTEND_URL = '' } = process.env
  const origin = STAGE === 'local' ? '*' : FRONTEND_URL
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': true,
  }
}

export function checkQueryStringParameters(actualParams: string[], expectedParams: string[]): void {
  expectedParams.forEach((expectedParam) => {
    if (!actualParams.includes(expectedParam)) {
      throw new Error(`Missing query string parameter: ${expectedParam}`)
    }
  })
}
