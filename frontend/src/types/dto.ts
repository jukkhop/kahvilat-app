interface AddressDto {
  address: string
  components: {
    name: string
    types: string[]
  }[]
  geometry: {
    location: {
      lat: string
      lng: string
    }
  }
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

interface FindAddressData {
  findAddress: {
    results: AddressDto[]
  }
}

interface FindCoordsData {
  findCoordinates: {
    results: AddressDto[]
  }
}

interface FindPlacesData {
  findPlaces: {
    cursor?: string
    results: PlaceDto[]
    __typename: string
  }
  findMorePlaces: {
    cursor?: string
    results: PlaceDto[]
  }
}

export type { AddressDto, FindAddressData, FindCoordsData, FindPlacesData, PlaceDto }
