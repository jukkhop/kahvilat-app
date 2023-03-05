import { Location } from './location'

type FindPlacesInitialQueryParams = {
  latitude: string
  longitude: string
  radius: string
  type: string
  keyword: string
}

type FindPlacesMoreQueryParams = {
  cursor: string
}

type FindPlacesInitialParams = {
  latitude: number
  longitude: number
  radius: number
  type: string
  keyword: string
}

type FindPlacesMoreParams = {
  cursor: string
}

type FindPlacesQueryParams = FindPlacesInitialQueryParams | FindPlacesMoreQueryParams
type FindPlacesParams = FindPlacesInitialParams | FindPlacesMoreParams

type FindPlacesResult = {
  results: Place[]
  cursor?: string
}

type Place = {
  address: string
  icon: string
  id: string
  location: Location
  name: string
  openNow: boolean
  rating: number
  status: string
  types: string[]
}

export type { Place }
export type { FindPlacesQueryParams, FindPlacesParams, FindPlacesResult }
