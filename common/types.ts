type Address = {
  address: string
  id: string
  location: Location
}

type Place = {
  address: string
  icon: string
  id: string
  location: Location
  name: string
  openNow: boolean
  priceLevel: number
  rating: number
  status: string
  types: string[]
}

type Location = {
  latitude: number
  longitude: number
}

export type { Address, Place }
