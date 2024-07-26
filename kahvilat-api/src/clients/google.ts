import { GetAddressesParams, GetPlacesParams } from '../types/api'
import { Config } from '../types/config'
import { Utils } from '../types/context'
import { Address, Place, Response } from '../types/google'
import { Result } from '../types/result'
import { ClientBase } from './base'
import { ClientError } from './error'

export class GoogleClient extends ClientBase {
  private apiKey: string
  private baseUrl: URL
  private language: string

  constructor(config: Config, utils: Utils) {
    super(config, utils)
    this.apiKey = config.google.apiKey
    this.baseUrl = config.google.baseUrl
    this.language = config.google.language
  }

  async getAddresses(params: GetAddressesParams): Promise<Result<Response<Address>, ClientError>> {
    const address = 'address' in params ? params.address : undefined
    const latitude = 'latitude' in params ? params.latitude : undefined
    const longitude = 'longitude' in params ? params.longitude : undefined
    const latlng = latitude && longitude ? `${latitude},${longitude}` : undefined

    const url = new URL(`${this.baseUrl}/geocode/json`)
    const queryParams = url.searchParams

    queryParams.set('key', this.apiKey)
    queryParams.set('language', this.language)

    if (address) queryParams.set('address', address)
    if (latlng) queryParams.set('latlng', latlng)

    return this.request<Response<Address>>(url)
  }

  async getPlaces(params: GetPlacesParams): Promise<Result<Response<Place>, ClientError>> {
    const keyword = 'keyword' in params ? params.keyword : undefined
    const latitude = 'latitude' in params ? params.latitude : undefined
    const longitude = 'longitude' in params ? params.longitude : undefined
    const radius = 'radius' in params ? params.radius : undefined
    const type = 'type' in params ? params.type : undefined
    const cursor = 'cursor' in params ? params.cursor : undefined
    const location = latitude && longitude ? `${latitude},${longitude}` : undefined

    const url = new URL(`${this.baseUrl}/place/nearbysearch/json`)
    const queryParams = url.searchParams

    queryParams.set('key', this.apiKey)
    queryParams.set('language', this.language)

    if (keyword) queryParams.set('keyword', keyword)
    if (location) queryParams.set('location', location)
    if (radius) queryParams.set('radius', radius)
    if (type) queryParams.set('types', type)
    if (cursor) queryParams.set('pagetoken', cursor)

    return this.request<Response<Place>>(url)
  }
}
