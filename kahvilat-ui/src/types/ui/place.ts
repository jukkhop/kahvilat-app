import { Location } from '../api'

type FormValues = {
  address: string
  distance: number
}

type PlacesListItem = {
  address: string
  coords: Location
  distance: number
  icon: string
  name: string
  openNow: boolean
  rating: number
}

export type { FormValues, PlacesListItem }
