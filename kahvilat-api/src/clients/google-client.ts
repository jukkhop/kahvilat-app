/* eslint-disable camelcase */

import fetch, { FetchError } from 'node-fetch'
import qs from 'qs'

import { FindAddressesParams, FindPlacesParams } from '../types/api'
import { Config } from '../types/config'
import { ClientError } from '../types/error'
import { Address, Place, Response, ResponseSuccess } from '../types/google'

class GoogleClient {
  private apiKey: string
  private baseUrl: URL
  private language: string

  constructor(config: Config) {
    this.apiKey = config.google.apiKey
    this.baseUrl = config.google.baseUrl
    this.language = config.google.language
  }

  async findAddresses(params: FindAddressesParams): Promise<Response<Address>> {
    const queryParams = new Map<string, string>([
      ['key', this.apiKey],
      ['language', this.language],
    ])

    if ('address' in params) {
      queryParams.set('address', params.address)
    }

    if ('latitude' in params) {
      queryParams.set('latlng', `${params.latitude},${params.longitude}`)
    }

    const encodeParams = 'address' in params

    return this.request('geocode', queryParams, encodeParams)
  }

  async findPlaces(params: FindPlacesParams): Promise<Response<Place>> {
    const queryParams = new Map<string, string>([
      ['key', this.apiKey],
      ['language', this.language],
    ])

    if ('keyword' in params) {
      queryParams.set('keyword', params.keyword)
      queryParams.set('location', `${params.latitude},${params.longitude}`)
      queryParams.set('radius', params.radius.toString())
      queryParams.set('types', params.type)
    }

    if ('cursor' in params) {
      queryParams.set('pagetoken', params.cursor)
    }

    return this.request('place/nearbysearch', queryParams)
  }

  private async request<T>(
    endpoint: string,
    queryParams: Map<string, string>,
    queryParamsEncode = false,
  ): Promise<Response<T>> {
    const queryString = qs.stringify(Object.fromEntries(queryParams), { encode: queryParamsEncode })
    const url = `${this.baseUrl}/${endpoint}/json?${queryString}`

    try {
      const response = await fetch(url)

      if (!response.ok) {
        return {
          type: 'error',
          error: new ClientError(response.statusText, response.status),
        }
      }

      const body = await response.json()
      const { results, next_page_token } = body as ResponseSuccess<T>

      return {
        type: 'success',
        results,
        next_page_token,
      }
    } catch (thrown: unknown) {
      const error = thrown as FetchError

      return {
        type: 'error',
        error: new ClientError(error.message),
      }
    }
  }
}

export default GoogleClient
