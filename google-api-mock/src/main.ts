import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { address1, address2, place1, place2, place3, place4, place5, place6 } from './data'
import { Address, Place } from './types/google'

const addr1 = 'fredri'
const addr2 = 'miehen'
const latlng1 = `${address1.geometry.location.lat},${address1.geometry.location.lng}`
const latlng2 = `${address2.geometry.location.lat},${address2.geometry.location.lng}`
const radiusThreshold = 500
const token1 = 'token1'
const token2 = 'token2'
const token3 = 'token3'

async function invoke(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const { path, queryStringParameters } = event

  if (path.includes('geocode')) {
    const { address, latlng } = queryStringParameters || {}
    let results: Address[] = []

    if (address) {
      if (address.toLowerCase().includes(addr1)) results = [address1]
      if (address.toLowerCase().includes(addr2)) results = [address2]
    }

    if (latlng) {
      if (latlng === latlng1) results = [address1]
      if (latlng === latlng2) results = [address2]
    }

    return ok({ results })
  }

  if (path.includes('place/nearbysearch')) {
    const { location, radius, pagetoken } = queryStringParameters || {}

    let results: Place[] = []
    let token: string | undefined

    if (location && radius) {
      if (Number(radius) > radiusThreshold) {
        results = [place1, place2, place3]
        token = token1
      } else if (location === latlng1) {
        results = [place1]
        token = token2
      } else if (location === latlng2) {
        results = [place4]
        token = token3
      }
    }

    if (pagetoken) {
      if (pagetoken === token1) results = [place4, place5, place6]
      if (pagetoken === token2) results = [place2]
      if (pagetoken === token3) results = [place5]
    }

    return ok({ results, next_page_token: token })
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
