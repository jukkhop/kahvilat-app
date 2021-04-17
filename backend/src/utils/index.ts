import { APIGatewayProxyResult } from 'aws-lambda'
import qs from 'qs'
import Cache from '../cache'
import { Headers } from '../types'

const constants = {
  DAY_IN_SECONDS: 86400,
}

function getCorsHeaders(): Headers {
  const { STAGE = '', FRONTEND_URL = '' } = process.env
  const origin = STAGE === 'local' ? '*' : FRONTEND_URL
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': true,
  }
}

function checkQueryStringParameters(actualParams: string[], expectedParams: string[]): Error[] {
  return expectedParams.reduce(
    (acc, expectedParam) => {
      if (!actualParams.includes(expectedParam)) {
        acc.push(new Error(`Missing query string parameter: ${expectedParam}`))
      }
      return acc
    },
    [] as Error[],
    //
  )
}

async function cachedFetch(
  cache: Cache,
  endpoint: string,
  params: { [key: string]: string },
  fetchFn: () => Promise<[number, any, string?]>,
  cacheExpireSecs: number = constants.DAY_IN_SECONDS,
): Promise<[number, string]> {
  const cacheKey = `${endpoint}?${qs.stringify(params, { encode: false })}`
  const cachedResponse = await cache.get(cacheKey)

  if (cachedResponse) {
    return [200, cachedResponse]
  }

  const [status, result, error] = await fetchFn()
  const response = !error ? result : { error }
  const responseJson = JSON.stringify(response)

  if (status === 200) {
    await cache.set(cacheKey, responseJson, cacheExpireSecs)
  }

  return [status, responseJson]
}

function mkResponse(status: number, body: string): APIGatewayProxyResult {
  return {
    statusCode: status,
    headers: getCorsHeaders(),
    body,
  }
}

function mkErrorResponse(status: number, errors: Error[]): APIGatewayProxyResult {
  const error = errors.map(x => x.message).join(', ')
  return mkResponse(status, JSON.stringify({ error }))
}

export {
  // prettier-ignore
  cachedFetch,
  checkQueryStringParameters,
  constants,
  getCorsHeaders,
  mkErrorResponse,
  mkResponse,
}
