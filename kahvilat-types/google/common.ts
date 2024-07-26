/* eslint-disable camelcase */

export type Bounds = {
  northeast: Location
  southwest: Location
}

export type Geometry = {
  bounds?: Bounds
  location: Location
  location_type?: string
  viewport: Bounds
}

export type Location = {
  lat: number
  lng: number
}

export type PlusCode = {
  compound_code: string
  global_code: string
}
