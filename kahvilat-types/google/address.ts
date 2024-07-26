/* eslint-disable camelcase */

import { Geometry, PlusCode } from './common'

export type Address = {
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
