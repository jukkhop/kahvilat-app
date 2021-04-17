import fetch, { FetchError } from 'node-fetch'
import qs from 'qs'
import { Address, GoogleResponse, Place } from '../types'

const BASE_URL = 'https://maps.googleapis.com/maps/api'

class GoogleClient {
  private apiKey: string
  private language: string

  constructor(apiKey: string, language: string) {
    this.apiKey = apiKey
    this.language = language
  }

  async findAddress(latitude: string, longitude: string): Promise<GoogleResponse<Address>> {
    const { apiKey, language } = this
    const params = {
      key: apiKey,
      language,
      latlng: `${latitude},${longitude}`,
    }

    return request('geocode', params)
  }

  async findCoordinates(address: string): Promise<GoogleResponse<Address>> {
    const { apiKey, language } = this
    const params = {
      address,
      key: apiKey,
      language,
    }

    return request('geocode', params, true)
  }

  async findPlaces(
    cursor?: string,
    keyword?: string,
    latitude?: string,
    longitude?: string,
    radius?: number,
    type?: string,
  ): Promise<GoogleResponse<Place>> {
    const { apiKey } = this
    const params = cursor
      ? {
          key: apiKey,
          pagetoken: cursor,
        }
      : {
          key: apiKey,
          keyword,
          location: `${latitude},${longitude}`,
          radius,
          types: type,
        }

    return request('place/nearbysearch', params)
  }
}

async function request<T>(endpoint: string, params: any, encodeParams = false): Promise<GoogleResponse<T>> {
  const queryString = qs.stringify(params, { encode: encodeParams })
  const url = `${BASE_URL}/${endpoint}/json?${queryString}`

  try {
    const response = await fetch(url)
    const body = await response.json()

    if (response.status !== 200) {
      return { state: 'error', status: response.status, error: body }
    }

    const { results, next_page_token: cursor = undefined } = body
    return { state: 'success', results, cursor }
  } catch (ex) {
    const err: FetchError = ex
    return { state: 'error', error: err.message }
  }
}

export default GoogleClient
