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
  const queryParams = event.queryStringParameters || {}
  const validationErrors = checkQueryStringParameters(Object.keys(queryParams), ['address'])

  if (validationErrors.length > 0) {
    return mkErrorResponse(400, validationErrors)
  }

  const { address = '' } = queryParams
  const [status, body] = await cachedFetch(
    cache,
    'find-coordinates',
    { address },
    () => client.findCoordinates(address),
    //
  )

  return mkResponse(status, body)
}

export { handler, helper }
