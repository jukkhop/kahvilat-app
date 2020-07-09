import qs from 'qs'
import Cache from '../cache'
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

export async function cachedFetch(
  cache: Cache,
  endpoint: string,
  params: { [key: string]: string },
  fetchFn: () => Promise<[number, any, null | string]>,
  cacheExpireSecs: number = DAY_IN_SECONDS,
): Promise<[number, string]> {
  const cacheKey = endpoint + '?' + qs.stringify(params, { encode: false })
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

export const DAY_IN_SECONDS = 86400
