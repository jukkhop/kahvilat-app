/* eslint-disable camelcase */

type Address = {
  address_components: AddressComponent[]
  formatted_address: string
  geometry: Geometry
  place_id: string
  plus_code: PlusCode
  types: string[]
}

type AddressComponent = {
  long_name: string
  short_name: string
  types: string[]
}

type Geometry = {
  location: LatLng
  location_type?: string
  viewport: {
    northeast: LatLng
    southwest: LatLng
  }
}

type Headers = {
  [header: string]: boolean | number | string
}

type LatLng = {
  lat: number
  lng: number
}

type Place = {
  business_status: string
  geometry: Geometry
  icon: string
  id: string
  name: string
  opening_hours: {
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

type PlusCode = {
  compound_code: string
  global_code: string
}

// prettier-ignore
type FindAddressParams =
  | { address: string }
  | { latitude: string; longitude: string }

type FindPlacesParams =
  | { cursor: string }
  | { keyword: string; latitude: string; longitude: string; radius: number; type: string }

export type {
  Address,
  AddressComponent,
  FindAddressParams,
  FindPlacesParams,
  Geometry,
  Headers,
  LatLng,
  Place,
  PlusCode,
}
