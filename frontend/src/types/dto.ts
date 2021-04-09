interface AddressDto {
  address: string
  components: {
    name: string
    types: string[]
  }[]
}

interface PlaceDto {
  businessStatus: string
  geometry: {
    location: {
      lat: string
      lng: string
    }
  }
  icon: string
  name: string
  openingHours?: {
    openNow: boolean
  }
  rating: number
  reference: string
  vicinity: string
}

export type { AddressDto, PlaceDto }
