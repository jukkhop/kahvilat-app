import HttpStatus from 'http-status'
import fetch from 'node-fetch'
import { URL } from 'url'

import { getConfig } from '../config'
import { address } from '../data'
import { Components, GetAddressesResponse } from '../types/api'

describe('Addresses API', () => {
  let baseUrl: URL

  beforeAll(() => {
    const config = getConfig()
    baseUrl = config.api.baseUrl
  })

  it('responds with HTTP 200 for a valid query with address', async () => {
    const url = new URL('/address', baseUrl)

    url.searchParams.set('address', address.address)

    const response = await fetch(url)
    const body = (await response.json()) as GetAddressesResponse

    expect(response.status).toEqual(HttpStatus.OK)
    expect(body.items).toEqual([address])
    expect(body.cursor).toBeUndefined()
  })

  it('returns HTTP 200 for a valid query with latitude and longitude', async () => {
    const url = new URL('/address', baseUrl)

    url.searchParams.set('latitude', address.location.latitude.toString())
    url.searchParams.set('longitude', address.location.longitude.toString())

    const response = await fetch(url)
    const body = (await response.json()) as GetAddressesResponse

    expect(response.status).toEqual(HttpStatus.OK)
    expect(body.items).toEqual([address])
    expect(body.cursor).toBeUndefined()
  })

  it('responds with HTTP 400 for an invalid query', async () => {
    const url = new URL('/address', baseUrl)

    url.searchParams.set('latitude', address.location.latitude.toString())

    const response = await fetch(url)
    const body = (await response.json()) as Components.Responses.BadRequest

    expect(response.status).toEqual(HttpStatus.BAD_REQUEST)
    expect(body.errors).toBeInstanceOf(Array)
    expect(body.errors.at(0)).toMatchObject({
      message: "must have required property 'longitude'",
    })
  })
})
