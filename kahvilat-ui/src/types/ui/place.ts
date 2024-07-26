import { Location } from '../api'

export type FormValues = {
  address: string
  distance: number
}

export type PlacesListItem = {
  address: string
  coords: Location
  distance: number
  icon: string
  name: string
  openNow: boolean
  rating: number
}
