type AddressComponent = {
  name: string
  types: string[]
}

type AddressDto = {
  address: string
  components: AddressComponent[]
  geometry: Geometry
}

type FindAddressData = {
  findAddress: {
    results: AddressDto[]
  }
}

type FindCoordsData = {
  findCoordinates: {
    results: AddressDto[]
  }
}

type FindPlacesData = {
  findPlaces: {
    cursor?: string
    results: PlaceDto[]
    __typename: string
  }
}

type Geometry = {
  location: LatLng
}

type LatLng = {
  lat: number
  lng: number
}

type PlaceDto = {
  businessStatus: string
  geometry: Geometry
  icon: string
  name: string
  openingHours?: {
    openNow: boolean
  }
  rating: number
  reference: string
  vicinity: string
}

export type {
  AddressComponent,
  AddressDto,
  FindAddressData,
  FindCoordsData,
  FindPlacesData,
  Geometry,
  LatLng,
  PlaceDto,
}
