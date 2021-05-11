import { Coords } from './misc'

type Place = {
  address: string
  coords: Coords
  distance: number
  icon: string
  name: string
  openNow: boolean
  rating: number
}

export type { Place }
