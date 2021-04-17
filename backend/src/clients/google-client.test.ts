import fetch from 'node-fetch'
import GoogleClient from './google-client'
import { Address, GoogleErrorResponse, GoogleSuccessResponse, Place } from '../types'

import testAddress from '../fixtures/test-address'
import testPlace from '../fixtures/test-place'

const { Response, FetchError } = jest.requireActual('node-fetch')
jest.mock('node-fetch', jest.fn)

let client: GoogleClient
let fetchFn: jest.MockedFunction<typeof fetch>

beforeEach(() => {
  client = new GoogleClient('some-api-key', 'some-lang')
  fetchFn = fetch as jest.MockedFunction<typeof fetch>
})

describe('find address', () => {
  it('calls Google API and returns valid data', async () => {
    const expectedUrl = `https://maps.googleapis.com/maps/api/geocode/json?key=some-api-key&language=some-lang&latlng=some-lat,some-lng`
    const expectedBody = { results: [testAddress] }
    fetchFn.mockResolvedValueOnce(new Response(JSON.stringify(expectedBody), { status: 200 }))
    const response = ((await client.findAddress('some-lat', 'some-lng')) as unknown) as GoogleSuccessResponse<Address>
    expect(fetchFn).toHaveBeenCalledWith(expectedUrl)
    expect(response.results).toEqual([testAddress])
  })

  it('returns HTTP status and error message returned by Google API', async () => {
    fetchFn.mockResolvedValueOnce(new Response(JSON.stringify('some-error'), { status: 500 }))
    const response = (await client.findAddress('some-lat', 'some-lng')) as GoogleErrorResponse
    expect(fetchFn).toHaveBeenCalled()
    expect(response.status).toBe(500)
    expect(response.error).toBe('some-error')
  })

  it('returns an error when Google API cannot be connected to', async () => {
    fetchFn.mockRejectedValueOnce(new FetchError('Connection timed out'))
    const response = (await client.findAddress('some-lat', 'some-lng')) as GoogleErrorResponse
    expect(fetchFn).toHaveBeenCalled()
    expect(response.status).toBeUndefined()
    expect(response.error).toBe('Connection timed out')
  })
})

describe('find coordinates', () => {
  it('calls Google API and returns valid data', async () => {
    const expectedUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=some-address&key=some-api-key&language=some-lang`
    const expectedBody = { results: [testAddress] }
    fetchFn.mockResolvedValueOnce(new Response(JSON.stringify(expectedBody), { status: 200 }))
    const response = ((await client.findCoordinates('some-address')) as unknown) as GoogleSuccessResponse<Address>
    expect(fetchFn).toHaveBeenCalledWith(expectedUrl)
    expect(response.results).toEqual([testAddress])
  })

  it('returns HTTP status and error message returned by Google API', async () => {
    fetchFn.mockResolvedValueOnce(new Response(JSON.stringify('some-error'), { status: 500 }))
    const response = (await client.findCoordinates('some-address')) as GoogleErrorResponse
    expect(fetchFn).toHaveBeenCalled()
    expect(response.status).toBe(500)
    expect(response.error).toBe('some-error')
  })

  it('returns an error when Google API cannot be connected to', async () => {
    fetchFn.mockRejectedValueOnce(new FetchError('Connection timed out'))
    const response = (await client.findCoordinates('some-address')) as GoogleErrorResponse
    expect(fetchFn).toHaveBeenCalled()
    expect(response.status).toBeUndefined()
    expect(response.error).toBe('Connection timed out')
  })
})

describe('find places', () => {
  it('calls Google API and returns valid data', async () => {
    const expectedUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=some-api-key&keyword=coffee&location=some-lat,some-lng&radius=500&types=cafe`
    const expectedBody = { results: [testPlace] }
    fetchFn.mockResolvedValueOnce(new Response(JSON.stringify(expectedBody), { status: 200 }))
    const response = ((await client.findPlaces(
      undefined,
      'coffee',
      'some-lat',
      'some-lng',
      500,
      'cafe',
    )) as unknown) as GoogleSuccessResponse<Place>
    expect(fetchFn).toHaveBeenCalledWith(expectedUrl)
    expect(response.results).toEqual([testPlace])
  })

  it('calls Google API and returns valid data using cursor', async () => {
    const expectedUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=some-api-key&pagetoken=some-cursor`
    const expectedBody = { results: [testPlace] }
    fetchFn.mockResolvedValueOnce(new Response(JSON.stringify(expectedBody), { status: 200 }))
    const response = ((await client.findPlaces('some-cursor')) as unknown) as GoogleSuccessResponse<Place>
    expect(fetchFn).toHaveBeenCalledWith(expectedUrl)
    expect(response.results).toEqual([testPlace])
  })

  it('returns HTTP status and error message returned by Google API', async () => {
    fetchFn.mockResolvedValueOnce(new Response(JSON.stringify('some-error'), { status: 500 }))
    const response = (await client.findPlaces('some-cursor')) as GoogleErrorResponse
    expect(fetchFn).toHaveBeenCalled()
    expect(response.status).toBe(500)
    expect(response.error).toBe('some-error')
  })

  it('returns an error message when Google API cannot be connected to', async () => {
    fetchFn.mockRejectedValueOnce(new FetchError('Connection timed out'))
    const response = (await client.findPlaces('some-cursor')) as GoogleErrorResponse
    expect(fetchFn).toHaveBeenCalled()
    expect(response.status).toBeUndefined()
    expect(response.error).toBe('Connection timed out')
  })
})
