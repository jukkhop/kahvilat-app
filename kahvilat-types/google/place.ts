/* eslint-disable camelcase */

import { PlaceType } from '../api'
import { Geometry, PlusCode } from './common'

export type Place = {
  business_status: string
  geometry: Geometry
  icon: string
  name: string
  opening_hours?: {
    open_now: boolean
  }
  photos: any[]
  place_id: string
  plus_code?: PlusCode
  price_level?: number
  rating: number
  reference: string
  scope: string
  types: PlaceType[]
  user_ratings_total: number
  vicinity: string
}
