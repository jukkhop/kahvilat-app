/* eslint-disable camelcase */

type Bounds = {
  northeast: Location
  southwest: Location
}

type Geometry = {
  bounds?: Bounds
  location: Location
  location_type?: string
  viewport: Bounds
}

type Location = {
  lat: number
  lng: number
}

type PlusCode = {
  compound_code: string
  global_code: string
}

export type { Bounds, Geometry, Location, PlusCode }
