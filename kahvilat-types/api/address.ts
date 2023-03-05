import { Location } from './location'

type FindAddressesByAddressQueryParams = {
  address: string
}

type FindAddressesByCoordsQueryParams = {
  latitude: string
  longitude: string
}

type FindAddressesByAddressParams = {
  address: string
}

type FindAddressesByCoordsParams = {
  latitude: number
  longitude: number
}

type FindAddressesQueryParams = FindAddressesByAddressQueryParams | FindAddressesByCoordsQueryParams
type FindAddressesParams = FindAddressesByAddressParams | FindAddressesByCoordsParams

type FindAddressesResult = {
  results: Address[]
}

type Address = {
  address: string
  id: string
  location: Location
}

export type { Address }
export type { FindAddressesQueryParams, FindAddressesParams, FindAddressesResult }
