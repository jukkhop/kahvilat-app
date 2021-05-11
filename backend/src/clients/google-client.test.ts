import fetch from 'node-fetch'
import GoogleClient from './google-client'
import { testConfig, testGoogle } from '../fixtures'
import {
  FindAddressParams,
  FindPlacesParams,
  GoogleAddress as Address,
  GooglePlace as Place,
  GoogleErrorResponse as ErrorResponse,
  GoogleSuccessResponse as SuccessResponse,
} from '../types'

const { Response, FetchError } = jest.requireActual('node-fetch')
jest.mock('node-fetch', jest.fn)

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
  const { address } = testGoogle
  const fnParams1: FindAddressParams = { latitude: 60.1, longitude: 24.9 }
  const fnParams2: FindAddressParams = { address: 'some-address' }

  let successResponse: any
  let errorResponse: any

  beforeEach(() => {
    successResponse = new Response(JSON.stringify({ results: [address] }), { status: 200 })
    errorResponse = new Response(JSON.stringify('Something failed'), { status: 500 })
  })

  it('calls Google API and returns valid data (using coordinates)', async () => {
    const expectedUrl = `https://maps.googleapis.com/maps/api/geocode/json?key=some-api-key&language=some-lang&latlng=60.1,24.9`
    fetchFn.mockResolvedValueOnce(successResponse)
    const response = (await client.findAddress(fnParams1)) as SuccessResponse<Address>
    expect(fetchFn).toHaveBeenCalledWith(expectedUrl)
    expect(response.results).toEqual([address])
  })

  it('calls Google API and returns valid data (using address)', async () => {
    const expectedUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=some-address&key=some-api-key&language=some-lang`
    fetchFn.mockResolvedValueOnce(successResponse)
    const response = (await client.findAddress(fnParams2)) as SuccessResponse<Address>
    expect(fetchFn).toHaveBeenCalledWith(expectedUrl)
    expect(response.results).toEqual([address])
  })

  it('returns HTTP status and error message returned by Google API', async () => {
    fetchFn.mockResolvedValueOnce(errorResponse)
    const response = (await client.findAddress(fnParams1)) as ErrorResponse
    expect(fetchFn).toHaveBeenCalled()
    expect(response.status).toBe(500)
    expect(response.error).toBe('Something failed')
  })

  it('returns an error when Google API cannot be connected to', async () => {
    fetchFn.mockRejectedValueOnce(new FetchError('Connection timed out'))
    const response = (await client.findAddress(fnParams1)) as ErrorResponse
    expect(fetchFn).toHaveBeenCalled()
    expect(response.status).toBeUndefined()
    expect(response.error).toBe('Connection timed out')
  })
})

describe('findPlaces', () => {
  const { place } = testGoogle
  const fnParams1: FindPlacesParams = { keyword: 'coffee', latitude: 60.1, longitude: 24.9, radius: 500, type: 'cafe' }
  const fnParams2: FindPlacesParams = { cursor: 'some-cursor' }
  const successBody = { results: [place], next_page_token: 'some-cursor' }

  let successResponse: any
  let errorResponse: any

  beforeEach(() => {
    successResponse = new Response(JSON.stringify(successBody), { status: 200 })
    errorResponse = new Response(JSON.stringify('Something failed'), { status: 500 })
  })

  it('calls Google API and returns valid data', async () => {
    const expectedUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=some-api-key&keyword=coffee&location=60.1,24.9&radius=500&types=cafe`
    fetchFn.mockResolvedValueOnce(successResponse)
    const response = (await client.findPlaces(fnParams1)) as SuccessResponse<Place>
    expect(fetchFn).toHaveBeenCalledWith(expectedUrl)
    expect(response.results).toEqual([place])
    expect(response.cursor).toEqual('some-cursor')
  })

  it('calls Google API and returns valid data using cursor', async () => {
    const expectedUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=some-api-key&pagetoken=some-cursor`
    fetchFn.mockResolvedValueOnce(successResponse)
    const response = (await client.findPlaces(fnParams2)) as SuccessResponse<Place>
    expect(fetchFn).toHaveBeenCalledWith(expectedUrl)
    expect(response.results).toEqual([place])
  })

  it('returns HTTP status and error message returned by Google API', async () => {
    fetchFn.mockResolvedValueOnce(errorResponse)
    const response = (await client.findPlaces(fnParams1)) as ErrorResponse
    expect(fetchFn).toHaveBeenCalled()
    expect(response.status).toBe(500)
    expect(response.error).toBe('Something failed')
  })

  it('returns an error message when Google API cannot be connected to', async () => {
    fetchFn.mockRejectedValueOnce(new FetchError('Connection timed out'))
    const response = (await client.findPlaces(fnParams1)) as ErrorResponse
    expect(fetchFn).toHaveBeenCalled()
    expect(response.status).toBeUndefined()
    expect(response.error).toBe('Connection timed out')
  })
})
