type Coords = {
  latitude: number
  longitude: number
}

type Place = {
  distance: number
  icon: string
  lat: number
  lng: number
  name: string
  openNow?: boolean
  rating: number
  vicinity: string
}

export type { Coords, Place }
