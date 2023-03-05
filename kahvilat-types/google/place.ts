/* eslint-disable camelcase */

import { Geometry, PlusCode } from './common'

type Place = {
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
  types: string[]
  user_ratings_total: number
  vicinity: string
}

export type { Place }
