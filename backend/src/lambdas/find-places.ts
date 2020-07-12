import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import Cache from '../cache/cache'
import GoogleClient from '../clients/google-client'
import { cachedFetch, checkQueryStringParameters, getCorsHeaders } from '../utils'

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const { GOOGLE_API_KEY = '', REDIS_HOST = '', REDIS_PORT = '' } = process.env
  const queryParams = event.queryStringParameters || {}

  if (!queryParams.cursor) {
    checkQueryStringParameters(Object.keys(queryParams), ['keyword', 'location', 'radius', 'type'])
  }

  const { cursor, keyword, location, radius, type } = queryParams
  const cache = new Cache(REDIS_HOST, Number(REDIS_PORT))
  const client = new GoogleClient(GOOGLE_API_KEY, 'fi')

  const [status, response] = await cachedFetch(
    cache,
    'find-places',
    queryParams,
    () => client.findPlaces(cursor, keyword, location, Number(radius), type),
    60,
  )

  return {
    statusCode: status,
    headers: getCorsHeaders(),
    body: response,
  }
}
