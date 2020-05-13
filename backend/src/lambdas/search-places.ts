/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import fetch from 'node-fetch'
import qs from 'qs'

import * as cache from '../utils/cache'
import { getCorsHeaders } from '../utils/cors'

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const { FACEBOOK_ACCESS_TOKEN } = process.env

  if (!FACEBOOK_ACCESS_TOKEN) {
    throw new Error('Missing environment variable FACEBOOK_ACCESS_TOKEN')
  }

  const { center, distance, q } = event.queryStringParameters || {}
  const fields = ['id', 'name', 'location', 'hours', 'is_permanently_closed'].join(',')

  const cacheClient = cache.createClient()
  const cacheKey = qs.stringify({ center, distance, fields, q }, { encode: false })
  const cacheResult = await cache.get(cacheClient, cacheKey)
  const headers = getCorsHeaders()

  if (cacheResult) {
    return {
      statusCode: 200,
      headers,
      body: cacheResult,
    }
  }

  const queryString = qs.stringify(
    {
      access_token: FACEBOOK_ACCESS_TOKEN,
      center,
      distance,
      fields,
      limit: 200,
      q,
      type: 'place',
    },
    { encode: false },
  )

  const url = `https://graph.facebook.com/search?${queryString}`
  const response = await fetch(url)
  const responseData = await response.json()
  const responseJson = JSON.stringify({ data: responseData.data })

  if (response.status === 200) {
    await cache.set(cacheClient, cacheKey, responseJson)
  }

  return {
    statusCode: 200,
    headers,
    body: responseJson,
  }
}
