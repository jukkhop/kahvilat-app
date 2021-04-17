import { APIGatewayProxyResult } from 'aws-lambda'
import qs from 'qs'

import Cache from '../cache'
import { DAY_IN_SECONDS } from './constants'
import { Headers } from '../types'

async function cachedFetch(
  cache: Cache,
  endpoint: string,
  params: Record<string, string>,
  fetchFn: () => Promise<[number, string]>,
  cacheExpireSecs: number = DAY_IN_SECONDS,
): Promise<[number, string]> {
  const queryString = qs.stringify(params, { encode: false })
  const cacheKey = `${endpoint}?${queryString}`
  const cachedResponse = await cache.get(cacheKey)

  if (cachedResponse) {
    return [200, cachedResponse]
  }

  const [status, responseJson] = await fetchFn()

  if (status === 200) {
    await cache.set(cacheKey, responseJson, cacheExpireSecs)
  }

  return [status, responseJson]
}

function checkQueryStringParameters(actualParams: string[], expectedParams: string[]): Error[] {
  return expectedParams.reduce(
    // prettier-ignore
    (acc, expectedParam) => {
      if (!actualParams.includes(expectedParam)) {
        acc.push(new Error(`Missing query string parameter: ${expectedParam}`))
      }
      return acc
    },
    [] as Error[],
  )
}

function getCorsHeaders(): Headers {
  const { STAGE = '', FRONTEND_URL = '' } = process.env
  const origin = STAGE === 'local' ? '*' : FRONTEND_URL
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': true,
  }
}

function mkErrorResponse(status: number, errors: Error[]): APIGatewayProxyResult {
  const error = errors.map(x => x.message).join(', ')
  return mkResponse(status, JSON.stringify({ error }))
}

function mkResponse(status: number, body: string): APIGatewayProxyResult {
  return {
    statusCode: status,
    headers: getCorsHeaders(),
    body,
  }
}

export { cachedFetch, checkQueryStringParameters, getCorsHeaders, mkErrorResponse, mkResponse }
