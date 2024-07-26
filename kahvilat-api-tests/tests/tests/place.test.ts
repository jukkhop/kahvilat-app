import HttpStatus from 'http-status'
import fetch from 'node-fetch'

import { getConfig } from '../config'
import { address, place1, place2 } from '../data'
import { Components, GetPlacesResponse } from '../types/api'

describe('Places API', () => {
  let baseUrl: URL

  beforeAll(() => {
    const config = getConfig()
    baseUrl = config.api.baseUrl
  })

  it('responds with HTTP 200 for a valid query with search terms', async () => {
    const url = new URL('/place', baseUrl)

    url.searchParams.set('keyword', 'coffee')
    url.searchParams.set('latitude', address.location.latitude.toString())
    url.searchParams.set('longitude', address.location.longitude.toString())
    url.searchParams.set('radius', '250')
    url.searchParams.set('type', 'cafe')

    const response = await fetch(url)
    const body = (await response.json()) as GetPlacesResponse

    expect(response.status).toEqual(HttpStatus.OK)
    expect(body.items).toEqual([place1])
    expect(body.cursor).toEqual('token2')
  })

  it('responds with HTTP 200 for a valid query with cursor', async () => {
    const url = new URL('/place', baseUrl)

    url.searchParams.set('cursor', 'token2')

    const response = await fetch(url)
    const body = (await response.json()) as GetPlacesResponse

    expect(response.status).toEqual(HttpStatus.OK)
    expect(body.items).toEqual([place2])
    expect(body.cursor).toBeUndefined()
  })

  it('responds with HTTP 400 for an invalid query', async () => {
    const url = new URL('/place', baseUrl)

    url.searchParams.set('keyword', 'coffee')
    url.searchParams.set('latitude', address.location.latitude.toString())
    url.searchParams.set('radius', '250')
    url.searchParams.set('type', 'cafe')

    const response = await fetch(url)
    const body = (await response.json()) as Components.Responses.BadRequest

    expect(response.status).toEqual(HttpStatus.BAD_REQUEST)
    expect(body.errors).toBeInstanceOf(Array)
    expect(body.errors.at(0)).toMatchObject({
      message: "must have required property 'longitude'",
    })
  })
})
