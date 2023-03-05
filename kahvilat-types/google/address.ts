/* eslint-disable camelcase */

import { Geometry, PlusCode } from './common'

type Address = {
  address_components: AddressComponent[]
  formatted_address: string
  geometry: Geometry
  place_id: string
  plus_code?: PlusCode
  types: string[]
}

type AddressComponent = {
  long_name: string
  short_name: string
  types: string[]
}

type FindAddressesByAddressParams = {
  address: string
}

type FindAddressesByCoordsParams = {
  latitude: number
  longitude: number
}

export type { Address, FindAddressesByAddressParams, FindAddressesByCoordsParams }
