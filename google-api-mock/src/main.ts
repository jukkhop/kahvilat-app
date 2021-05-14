import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { address1, place1, place2, place3 } from './data'

async function invoke(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const { path, queryStringParameters } = event

  if (path.includes('geocode')) {
    return ok({ results: [address1] })
  }

  if (path.includes('place/nearbysearch')) {
    const { location, radius, pagetoken } = queryStringParameters || {}

    if (location && radius) {
      const results = Number(radius) <= 500 ? [place1] : [place1, place3]
      return ok({ results, next_page_token: 'token' })
    }

    if (pagetoken) {
      return ok({ results: [place2] })
    }
  }

  return notFound()
}

function ok(data: any): APIGatewayProxyResult {
  return { statusCode: 200, body: JSON.stringify(data) }
}

function notFound(): APIGatewayProxyResult {
  return { statusCode: 404, body: '' }
}

export { invoke }
