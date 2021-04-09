interface Coords {
  latitude: string
  longitude: string
}

interface Place {
  distance: number
  icon: string
  lat: string
  lng: string
  name: string
  openNow?: boolean
  rating: number
  vicinity: string
}

export type { Coords, Place }
