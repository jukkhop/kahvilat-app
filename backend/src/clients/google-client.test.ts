import fetch from 'node-fetch'
import GoogleClient from './google-client'

import {
  Address,
  FindAddressParams,
  FindPlacesParams,
  GoogleErrorResponse,
  GoogleSuccessResponse,
  Place,
} from '../types'

import { testAddress, testConfig, testPlace } from '../fixtures'

const { Response, FetchError } = jest.requireActual('node-fetch')
jest.mock('node-fetch', jest.fn)

const findAddressParams1: FindAddressParams = {
  latitude: 60.1,
  longitude: 24.9,
}

const findAddressParams2: FindAddressParams = {
  address: 'some-address',
}

const findPlacesParams: FindPlacesParams = {
  keyword: 'coffee',
  latitude: 60.1,
  longitude: 24.9,
  radius: 500,
  type: 'cafe',
}

const findMorePlacesParams: FindPlacesParams = {
  cursor: 'some-cursor',
}

let client: GoogleClient
let fetchFn: jest.MockedFunction<typeof fetch>

beforeEach(() => {
  client = new GoogleClient(testConfig)
  fetchFn = fetch as jest.MockedFunction<typeof fetch>
})

afterEach(() => {
  fetchFn.mockClear()
})

describe('findAddress', () => {
  it('calls Google API and returns valid data (using coordinates)', async () => {
    const expectedUrl = `https://maps.googleapis.com/maps/api/geocode/json?key=some-api-key&language=some-lang&latlng=60.1,24.9`
    const expectedBody = { results: [testAddress] }
    fetchFn.mockResolvedValueOnce(new Response(JSON.stringify(expectedBody), { status: 200 }))
    const response = (await client.findAddress(findAddressParams1)) as GoogleSuccessResponse<Address>
    expect(fetchFn).toHaveBeenCalledWith(expectedUrl)
    expect(response.results).toEqual([testAddress])
  })

  it('calls Google API and returns valid data (using address)', async () => {
    const expectedUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=some-address&key=some-api-key&language=some-lang`
    const expectedBody = { results: [testAddress] }
    fetchFn.mockResolvedValueOnce(new Response(JSON.stringify(expectedBody), { status: 200 }))
    const response = (await client.findAddress(findAddressParams2)) as GoogleSuccessResponse<Address>
    expect(fetchFn).toHaveBeenCalledWith(expectedUrl)
    expect(response.results).toEqual([testAddress])
  })

  it('returns HTTP status and error message returned by Google API', async () => {
    fetchFn.mockResolvedValueOnce(new Response(JSON.stringify('some-error'), { status: 500 }))
    const response = (await client.findAddress(findAddressParams2)) as GoogleErrorResponse
    expect(fetchFn).toHaveBeenCalled()
    expect(response.status).toBe(500)
    expect(response.error).toBe('some-error')
  })

  it('returns an error when Google API cannot be connected to', async () => {
    fetchFn.mockRejectedValueOnce(new FetchError('Connection timed out'))
    const response = (await client.findAddress(findAddressParams2)) as GoogleErrorResponse
    expect(fetchFn).toHaveBeenCalled()
    expect(response.status).toBeUndefined()
    expect(response.error).toBe('Connection timed out')
  })
})

describe('findPlaces', () => {
  it('calls Google API and returns valid data', async () => {
    const expectedUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=some-api-key&keyword=coffee&location=60.1,24.9&radius=500&types=cafe`
    const expectedBody = { results: [testPlace], next_page_token: 'some-cursor' }
    fetchFn.mockResolvedValueOnce(new Response(JSON.stringify(expectedBody), { status: 200 }))
    const response = (await client.findPlaces(findPlacesParams)) as GoogleSuccessResponse<Place>
    expect(fetchFn).toHaveBeenCalledWith(expectedUrl)
    expect(response.results).toEqual([testPlace])
    expect(response.cursor).toEqual('some-cursor')
  })

  it('calls Google API and returns valid data using cursor', async () => {
    const expectedUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=some-api-key&pagetoken=some-cursor`
    const expectedBody = { results: [testPlace] }
    fetchFn.mockResolvedValueOnce(new Response(JSON.stringify(expectedBody), { status: 200 }))
    const response = ((await client.findPlaces(findMorePlacesParams)) as unknown) as GoogleSuccessResponse<Place>
    expect(fetchFn).toHaveBeenCalledWith(expectedUrl)
    expect(response.results).toEqual([testPlace])
  })

  it('returns HTTP status and error message returned by Google API', async () => {
    fetchFn.mockResolvedValueOnce(new Response(JSON.stringify('some-error'), { status: 500 }))
    const response = (await client.findPlaces(findMorePlacesParams)) as GoogleErrorResponse
    expect(fetchFn).toHaveBeenCalled()
    expect(response.status).toBe(500)
    expect(response.error).toBe('some-error')
  })

  it('returns an error message when Google API cannot be connected to', async () => {
    fetchFn.mockRejectedValueOnce(new FetchError('Connection timed out'))
    const response = (await client.findPlaces(findMorePlacesParams)) as GoogleErrorResponse
    expect(fetchFn).toHaveBeenCalled()
    expect(response.status).toBeUndefined()
    expect(response.error).toBe('Connection timed out')
  })
})
