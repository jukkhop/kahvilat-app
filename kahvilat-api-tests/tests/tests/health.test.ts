import HttpStatus from 'http-status'
import fetch from 'node-fetch'

import { getConfig } from '../config'
import { GetHealthResponse } from '../types/api'

describe('Health API', () => {
  let baseUrl: URL

  beforeAll(() => {
    const config = getConfig()
    baseUrl = config.api.baseUrl
  })

  it('responds with HTTP 200', async () => {
    const url = new URL('/health', baseUrl)

    const response = await fetch(url)
    const body = (await response.json()) as GetHealthResponse

    expect(response.status).toEqual(HttpStatus.OK)
    expect(body).toEqual<GetHealthResponse>({ status: 'OK' })
  })
})
