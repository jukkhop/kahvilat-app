import { FetchError, Response } from 'node-fetch'

import { ApiTestData } from '../../data/api'
import { GoogleTestData } from '../../data/google'
import { testContext } from '../../test-context-unit'

import { GoogleClient } from '../../../src/clients'
import * as Google from '../../../src/types/google'
import { unwrap, unwrapE } from '../../../src/utils/result'
import { urlEncode } from '../../../src/utils/url'

const { config, utils } = testContext
const { fetch } = utils
const { apiKey, baseUrl, language } = config.google

describe('GoogleClient', () => {
  let impl: GoogleClient

  beforeEach(() => {
    impl = new GoogleClient(config, utils)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getAddresses', () => {
    const { address1, address2 } = GoogleTestData
    const { getAddressesParams1, getAddressesParams2 } = ApiTestData

    const { address } = getAddressesParams1
    const { latitude, longitude } = getAddressesParams2

    const googleResponse: Google.Response<Google.Address> = {
      results: [address1, address2],
    }

    it('calls Google API and returns valid data (using location)', async () => {
      const expectedUrl = `${baseUrl}/geocode/json?key=${apiKey}&language=${language}&address=${urlEncode(address!)}` // prettier-ignore
      fetch.mockResolvedValueOnce(new Response(JSON.stringify(googleResponse), { status: 200 }))
      const response = unwrap(await impl.getAddresses(getAddressesParams1))
      expect(fetch).toHaveBeenCalledWith(expectedUrl)
      expect(response.results).toEqual([address1, address2])
    })

    it('calls Google API and returns valid data (using address)', async () => {
      const expectedUrl = `${baseUrl}/geocode/json?key=${apiKey}&language=${language}&latlng=${latitude}%2C${longitude}`
      fetch.mockResolvedValueOnce(new Response(JSON.stringify(googleResponse), { status: 200 }))
      const response = unwrap(await impl.getAddresses(getAddressesParams2))
      expect(fetch).toHaveBeenCalledWith(expectedUrl)
      expect(response.results).toEqual([address1, address2])
    })

    it('returns the error message returned by Google API', async () => {
      const [status, statusText] = [500, 'Something failed']
      fetch.mockResolvedValueOnce(new Response(undefined, { status, statusText }))
      const error = unwrapE(await impl.getAddresses(getAddressesParams1))
      expect(fetch).toHaveBeenCalled()
      expect(error.message).toBe(`Client operation failed with HTTP status ${status} and message: ${statusText}`)
    })

    it('returns an error when Google API cannot be connected to', async () => {
      const fetchError = new FetchError('Connection timed out', 'FetchError')
      fetch.mockRejectedValueOnce(fetchError)
      const clientError = unwrapE(await impl.getAddresses(getAddressesParams1))
      expect(fetch).toHaveBeenCalled()
      expect(clientError.message).toBe(`Client operation failed with message: ${fetchError.message}`)
    })
  })

  describe('getPlaces', () => {
    const { place1, place2 } = GoogleTestData
    const { getPlacesParams1, getPlacesParams2 } = ApiTestData

    const { keyword, latitude, longitude, radius, type } = getPlacesParams1
    const { cursor } = getPlacesParams2

    const googleResponse: Google.Response<Google.Place> = {
      results: [place1, place2],
      next_page_token: 'next-page-token',
    }

    it('calls Google API and returns valid data', async () => {
      const expectedUrl = `${baseUrl}/place/nearbysearch/json?key=${apiKey}&language=${language}&keyword=${keyword}&location=${latitude}%2C${longitude}&radius=${radius}&types=${type}`
      fetch.mockResolvedValueOnce(new Response(JSON.stringify(googleResponse), { status: 200 }))
      const response = unwrap(await impl.getPlaces(getPlacesParams1))
      expect(fetch).toHaveBeenCalledWith(expectedUrl)
      expect(response.results).toEqual([place1, place2])
      expect(response.next_page_token).toEqual(googleResponse.next_page_token)
    })

    it('calls Google API and returns valid data using pagetoken', async () => {
      const expectedUrl = `${baseUrl}/place/nearbysearch/json?key=${apiKey}&language=${language}&pagetoken=${cursor}`
      fetch.mockResolvedValueOnce(new Response(JSON.stringify(googleResponse), { status: 200 }))
      const response = unwrap(await impl.getPlaces(getPlacesParams2))
      expect(fetch).toHaveBeenCalledWith(expectedUrl)
      expect(response.results).toEqual([place1, place2])
    })

    it('returns the error message returned by Google API', async () => {
      const statusText = 'Something failed'
      fetch.mockResolvedValueOnce(new Response(undefined, { status: 500, statusText }))
      const error = unwrapE(await impl.getPlaces(getPlacesParams1))
      expect(fetch).toHaveBeenCalled()
      expect(error.message).toBe(`Client operation failed with HTTP status 500 and message: ${statusText}`)
    })

    it('returns an error message when Google API cannot be connected to', async () => {
      const fetchError = new FetchError('Connection timed out', 'FetchError')
      fetch.mockRejectedValueOnce(fetchError)
      const clientError = unwrapE(await impl.getPlaces(getPlacesParams1))
      expect(fetch).toHaveBeenCalled()
      expect(clientError.message).toBe(`Client operation failed with message: ${fetchError.message}`)
    })
  })
})
