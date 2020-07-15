import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import Cache from '../cache'
import GoogleClient from '../clients/google-client'
import { cachedFetch, checkQueryStringParameters, getCorsHeaders } from '../utils'

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
  const queryParams = event.queryStringParameters || {}
  checkQueryStringParameters(Object.keys(queryParams), ['latitude', 'longitude'])

  const { latitude, longitude } = queryParams
  const [status, response] = await cachedFetch(
    cache,
    'find-address',
    { latitude, longitude },
    () => client.findAddress(latitude, longitude),
    //
  )

  return {
    statusCode: status,
    headers: getCorsHeaders(),
    body: response,
  }
}

export { handler, helper }
