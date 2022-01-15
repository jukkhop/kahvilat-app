import fetch, { FetchError } from 'node-fetch'
import qs from 'qs'

import {
  Config,
  FindAddressParams,
  FindPlacesParams,
  GoogleAddress as Address,
  GooglePlace as Place,
  GoogleResponse as Response,
} from '../types'

class GoogleClient {
  private apiKey: string
  private baseUrl: string
  private language: string

  constructor(config: Config) {
    this.apiKey = config.google.apiKey
    this.baseUrl = config.google.baseUrl
    this.language = config.google.language
  }

  async findAddress(params: FindAddressParams): Promise<Response<Address>> {
    const queryParams = () => {
      if ('address' in params) {
        return {
          address: params.address,
          key: this.apiKey,
          language: this.language,
        }
      }

      if ('latitude' in params) {
        return {
          key: this.apiKey,
          language: this.language,
          latlng: `${params.latitude},${params.longitude}`,
        }
      }

      return {}
    }

    const encodeParams = () => {
      if ('address' in params) return true
      if ('latitude' in params) return false
      return false
    }

    return this.request('geocode', queryParams(), encodeParams())
  }

  async findPlaces(params: FindPlacesParams): Promise<Response<Place>> {
    const queryParams = () => {
      if ('cursor' in params) {
        return { key: this.apiKey, pagetoken: params.cursor }
      }

      if ('keyword' in params) {
        return {
          key: this.apiKey,
          keyword: params.keyword,
          location: `${params.latitude},${params.longitude}`,
          radius: params.radius,
          types: params.type,
        }
      }

      return {}
    }

    return this.request('place/nearbysearch', queryParams())
  }

  private async request<T>(
    endpoint: string,
    queryParams: Record<string, any>,
    queryParamsEncode = false,
  ): Promise<Response<T>> {
    const queryString = qs.stringify(queryParams, { encode: queryParamsEncode })
    const url = `${this.baseUrl}/${endpoint}/json?${queryString}`

    try {
      const response = await fetch(url)
      const body = await response.json()

      if (!response.ok) {
        return { type: 'error', status: response.status, error: body }
      }

      const { results, next_page_token: cursor = undefined } = body

      return {
        type: 'success',
        results,
        cursor,
      }
    } catch (ex: unknown) {
      const err = ex as FetchError
      return {
        type: 'error',
        error: err.message,
      }
    }
  }
}

export default GoogleClient
