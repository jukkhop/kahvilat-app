import fetch from 'node-fetch'

import { config } from '../test/data/config'
import { address1, place1 } from '../test/data/google'

import { GoogleClient } from '../../src/clients'
import { FindAddressesParams, FindPlacesParams } from '../../src/types/api'
import { Address, Place, ResponseError, ResponseSuccess } from '../../src/types/google'

const { Response, FetchError } = jest.requireActual('node-fetch')

jest.mock('node-fetch', jest.fn)

describe('GoogleClient', () => {
  let client: GoogleClient
  let fetchFn: jest.MockedFunction<typeof fetch>

  beforeEach(() => {
    client = new GoogleClient(config)
    fetchFn = fetch as jest.MockedFunction<typeof fetch>
  })

  afterEach(() => {
    fetchFn.mockClear()
  })

  describe('findAddress', () => {
    const params1: FindAddressesParams = { latitude: 60.1, longitude: 24.9 }
    const params2: FindAddressesParams = { address: 'some-address' }

    let successResponse: any
    let errorResponse: any

    beforeEach(() => {
      successResponse = new Response(JSON.stringify({ results: [address1] }), { status: 200 })
      errorResponse = new Response(JSON.stringify('Something failed'), { status: 500 })
    })

    it('calls Google API and returns valid data (using location)', async () => {
      const expectedUrl = `https://maps.googleapis.com/maps/api/geocode/json?key=some-api-key&language=some-lang&latlng=60.1,24.9`
      fetchFn.mockResolvedValueOnce(successResponse)
      const response = (await client.findAddresses(params1)) as ResponseSuccess<Address>
      expect(fetchFn).toHaveBeenCalledWith(expectedUrl)
      expect(response.results).toEqual([address1])
    })

    it('calls Google API and returns valid data (using address)', async () => {
      const expectedUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=some-address&key=some-api-key&language=some-lang`
      fetchFn.mockResolvedValueOnce(successResponse)
      const response = (await client.findAddresses(params2)) as ResponseSuccess<Address>
      expect(fetchFn).toHaveBeenCalledWith(expectedUrl)
      expect(response.results).toEqual([address1])
    })

    it('returns HTTP status and error message returned by Google API', async () => {
      fetchFn.mockResolvedValueOnce(errorResponse)
      const response = (await client.findAddresses(params1)) as ResponseError
      expect(fetchFn).toHaveBeenCalled()
      expect(response.status).toBe(500)
      expect(response.message).toBe('Something failed')
    })

    it('returns an error when Google API cannot be connected to', async () => {
      fetchFn.mockRejectedValueOnce(new FetchError('Connection timed out'))
      const response = (await client.findAddresses(params1)) as ResponseError
      expect(fetchFn).toHaveBeenCalled()
      expect(response.status).toBeUndefined()
      expect(response.message).toBe('Connection timed out')
    })
  })

  describe('findPlaces', () => {
    const params1: FindPlacesParams = {
      keyword: 'coffee',
      latitude: 60.1,
      longitude: 24.9,
      radius: 500,
      type: 'cafe',
    }

    const params2: FindPlacesParams = {
      cursor: 'some-cursor',
    }

    const successBody = { results: [place1], next_page_token: 'some-cursor' }
    const errorBody = { message: 'Something failed' }

    let successResponse: any
    let errorResponse: any

    beforeEach(() => {
      successResponse = new Response(JSON.stringify(successBody), { status: 200 })
      errorResponse = new Response(JSON.stringify(errorBody), { status: 500 })
    })

    it('calls Google API and returns valid data', async () => {
      const expectedUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=some-api-key&keyword=coffee&location=60.1,24.9&radius=500&types=cafe`
      fetchFn.mockResolvedValueOnce(successResponse)
      const response = (await client.findPlaces(params1)) as ResponseSuccess<Place>
      expect(fetchFn).toHaveBeenCalledWith(expectedUrl)
      expect(response.results).toEqual([place1])
      expect(response.cursor).toEqual('some-cursor')
    })

    it('calls Google API and returns valid data using cursor', async () => {
      const expectedUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=some-api-key&pagetoken=some-cursor`
      fetchFn.mockResolvedValueOnce(successResponse)
      const response = (await client.findPlaces(params2)) as ResponseSuccess<Place>
      expect(fetchFn).toHaveBeenCalledWith(expectedUrl)
      expect(response.results).toEqual([place1])
    })

    it('returns HTTP status and error message returned by Google API', async () => {
      fetchFn.mockResolvedValueOnce(errorResponse)
      const response = (await client.findPlaces(params1)) as ResponseError
      expect(fetchFn).toHaveBeenCalled()
      expect(response.status).toBe(500)
      expect(response.message).toBe('Something failed')
    })

    it('returns an error message when Google API cannot be connected to', async () => {
      fetchFn.mockRejectedValueOnce(new FetchError('Connection timed out'))
      const response = (await client.findPlaces(params1)) as ResponseError
      expect(fetchFn).toHaveBeenCalled()
      expect(response.status).toBeUndefined()
      expect(response.message).toBe('Connection timed out')
    })
  })
})
