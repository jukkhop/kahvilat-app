/* eslint-disable camelcase */

type GoogleResponse<T> = GoogleSuccessResponse<T> | GoogleErrorResponse

type GoogleSuccessResponse<T> = {
  state: 'success'
  cursor?: string
  results: T[]
}

type GoogleErrorResponse = {
  state: 'error'
  status?: number
  error: string
}

type GoogleAddress = {
  address_components: AddressComponent[]
  formatted_address: string
  geometry: Geometry
  place_id: string
  plus_code: PlusCode
  types: string[]
}

type GooglePlace = {
  business_status: string
  geometry: Geometry
  icon: string
  id: string
  name: string
  opening_hours?: {
    open_now: boolean
  }
  photos: any[]
  place_id: string
  plus_code: PlusCode
  price_level: number
  rating: number
  reference: string
  scope: string
  types: string[]
  user_ratings_total: number
  vicinity: string
}

type AddressComponent = {
  long_name: string
  short_name: string
  types: string[]
}

type Geometry = {
  location: Location
  location_type?: string
  viewport: {
    northeast: Location
    southwest: Location
  }
}

type Location = {
  lat: number
  lng: number
}

type PlusCode = {
  compound_code: string
  global_code: string
}

export type { GoogleAddress, GoogleErrorResponse, GooglePlace, GoogleResponse, GoogleSuccessResponse }
