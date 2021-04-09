import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import Cache from '../cache'
import GoogleClient from '../clients/google-client'
import { cachedFetch, checkQueryStringParameters, mkErrorResponse, mkResponse } from '../utils'

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const { GOOGLE_API_KEY = '', REDIS_HOST = '', REDIS_PORT = '' } = process.env
  const cache = new Cache(REDIS_HOST, Number(REDIS_PORT))
  const client = new GoogleClient(GOOGLE_API_KEY, 'fi')
  return await helper(event, cache, client)
}

async function helper(
  event: APIGatewayProxyEvent,
  cache: Cache,
  client: GoogleClient,
): Promise<APIGatewayProxyResult> {
  const queryParams = (event.queryStringParameters || {}) as Record<string, string>
  const parametersToCheck = !queryParams.cursor
    ? ['keyword', 'latitude', 'longitude', 'radius', 'type']
    : ['cursor']
  const validationErrors = checkQueryStringParameters(Object.keys(queryParams), parametersToCheck)

  if (validationErrors.length > 0) {
    return mkErrorResponse(400, validationErrors)
  }

  const { cursor, keyword, latitude, longitude, radius, type } = queryParams
  const [status, body] = await cachedFetch(
    cache,
    'find-places',
    queryParams,
    () => client.findPlaces(cursor, keyword, latitude, longitude, Number(radius), type),
    60,
  )

  return mkResponse(status, body)
}

export { handler, helper }
