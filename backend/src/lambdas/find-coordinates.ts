import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import Cache from '../cache/cache'
import GoogleClient from '../clients/google-client'
import { cachedFetch, checkQueryStringParameters, getCorsHeaders } from '../utils'

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const { GOOGLE_API_KEY = '', REDIS_HOST = '', REDIS_PORT = '' } = process.env
  const queryParams = event.queryStringParameters || {}

  checkQueryStringParameters(Object.keys(queryParams), ['address'])

  const { address } = queryParams
  const cache = new Cache(REDIS_HOST, Number(REDIS_PORT))
  const client = new GoogleClient(GOOGLE_API_KEY, 'fi')

  const [status, response] = await cachedFetch(
    cache,
    'find-coordinates',
    { address },
    () => client.findCoordinates(address),
    //
  )

  return {
    statusCode: status,
    headers: getCorsHeaders(),
    body: response,
  }
}
