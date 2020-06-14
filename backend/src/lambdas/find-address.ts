import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import fetch from 'node-fetch'
import qs from 'qs'

import * as cache from '../cache'
import { checkQueryStringParameters, getCorsHeaders } from '../utils'

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const { GOOGLE_API_KEY } = process.env
  const queryParams = event.queryStringParameters || {}

  checkQueryStringParameters(Object.keys(queryParams), ['latitude', 'longitude'])

  const { latitude, longitude } = queryParams
  const cacheClient = cache.createClient()
  const cacheKey = 'find-address?' + qs.stringify(queryParams, { encode: false })
  const cacheResult = await cache.get(cacheClient, cacheKey)
  const headers = getCorsHeaders()

  if (cacheResult) {
    return {
      statusCode: 200,
      headers,
      body: cacheResult,
    }
  }

  const params = {
    key: GOOGLE_API_KEY,
    language: 'fi',
    latlng: `${latitude},${longitude}`,
  }

  const queryString = qs.stringify(params, { encode: false })
  const url = `https://maps.googleapis.com/maps/api/geocode/json?${queryString}`

  const response = await fetch(url)
  const responseData = await response.json()
  const { results } = responseData
  const responseJson = JSON.stringify({ addresses: results })

  if (response.status === 200) {
    await cache.set(cacheClient, cacheKey, responseJson)
  }

  return {
    statusCode: 200,
    headers,
    body: responseJson,
  }
}
