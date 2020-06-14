/* eslint-disable @typescript-eslint/camelcase */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import fetch from 'node-fetch'
import qs from 'qs'

import * as cache from '../cache'
import { checkQueryStringParameters, getCorsHeaders } from '../utils'

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const { GOOGLE_API_KEY } = process.env
  const queryParams = event.queryStringParameters || {}

  if (!queryParams.cursor) {
    checkQueryStringParameters(Object.keys(queryParams), ['location', 'radius', 'type'])
  }

  const { cursor, location, radius, type } = queryParams
  const cacheClient = cache.createClient()
  const cacheKey = 'search-places?' + qs.stringify(queryParams, { encode: false })
  const cacheResult = await cache.get(cacheClient, cacheKey)
  const headers = getCorsHeaders()

  if (cacheResult) {
    return {
      statusCode: 200,
      headers,
      body: cacheResult,
    }
  }

  const params = cursor
    ? {
        key: GOOGLE_API_KEY,
        pagetoken: cursor,
      }
    : {
        key: GOOGLE_API_KEY,
        keyword: 'coffee',
        location,
        radius,
        types: type,
      }

  const queryString = qs.stringify(params, { encode: false })
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${queryString}`

  const response = await fetch(url)
  const responseData = await response.json()
  const { results, next_page_token } = responseData

  const responseJson = JSON.stringify({
    places: results,
    cursor: next_page_token,
  })

  if (response.status === 200) {
    await cache.set(cacheClient, cacheKey, responseJson, 60)
  }

  return {
    statusCode: 200,
    headers,
    body: responseJson,
  }
}
