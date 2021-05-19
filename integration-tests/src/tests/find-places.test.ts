import fetch from 'node-fetch'
import qs from 'qs'

import { getConfig } from '../config'
import { place1, place2 } from '../data'
import { GoogleErrorResponse, GoogleSuccessResponse, Place } from '../types'

let baseUrl: string

beforeAll(() => {
  const config = getConfig()
  baseUrl = config.backend.baseUrl
})

it('responds with HTTP 200 for a valid query with search terms', async () => {
  const queryString = qs.stringify({
    keyword: 'coffee',
    latitude: 60.1631932,
    longitude: 24.93846,
    radius: 250,
    type: 'cafe',
  })
  const url = `${baseUrl}/find-places?${queryString}`
  const response = await fetch(url)
  const body = (await response.json()) as GoogleSuccessResponse<Place>
  expect(response.status).toEqual(200)
  expect(body.results).toEqual([place1])
  expect(body.cursor).toEqual('token2')
})

it('responds with HTTP 200 for a valid query with cursor', async () => {
  const queryString = qs.stringify({ cursor: 'token2' })
  const url = `${baseUrl}/find-places?${queryString}`
  const response = await fetch(url)
  const body = (await response.json()) as GoogleSuccessResponse<Place>
  expect(response.status).toEqual(200)
  expect(body.results).toEqual([place2])
})

it('responds with HTTP 400 for an invalid query', async () => {
  const queryString = qs.stringify({ keyword: 'coffee', latitude: 11.1, radius: 250, type: 'cafe' })
  const url = `${baseUrl}/find-places?${queryString}`
  const response = await fetch(url)
  const body = (await response.json()) as GoogleErrorResponse
  expect(response.status).toEqual(400)
  expect(body.error).toEqual('Missing query string parameter: longitude')
})
