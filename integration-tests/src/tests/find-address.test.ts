import fetch from 'node-fetch'
import qs from 'qs'

import { getConfig } from '../config'
import { address } from '../data'
import { Address, GoogleErrorResponse, GoogleSuccessResponse } from '../types'

let baseUrl: string

beforeAll(() => {
  const config = getConfig()
  baseUrl = config.backend.baseUrl
})

it('responds with HTTP 200 for a valid query with address', async () => {
  const queryString = qs.stringify({ address: 'Fredrikinkatu' })
  const url = `${baseUrl}/find-address?${queryString}`
  const response = await fetch(url)
  const body = (await response.json()) as GoogleSuccessResponse<Address>
  expect(response.status).toEqual(200)
  expect(body.results).toEqual([address])
})

it('returns HTTP 200 for a valid query with latitude and longitude', async () => {
  const queryString = qs.stringify({ latitude: 11.11, longitude: 22.22 })
  const url = `${baseUrl}/find-address?${queryString}`
  const response = await fetch(url)
  const body = (await response.json()) as GoogleSuccessResponse<Address>
  expect(response.status).toEqual(200)
  expect(body.results).toEqual([address])
})

it('responds with HTTP 400 for an invalid query', async () => {
  const queryString = qs.stringify({ latitude: 11.11 })
  const url = `${baseUrl}/find-address?${queryString}`
  const response = await fetch(url)
  const body = (await response.json()) as GoogleErrorResponse
  expect(response.status).toEqual(400)
  expect(body.error).toEqual('Missing query string parameter: longitude')
})
