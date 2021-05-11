import { Address, Place } from './common'

type FindAddressData = {
  findAddress: {
    results: Address[]
    __typename: string
  }
}

type FindCoordsData = {
  findCoordinates: {
    results: Address[]
    __typename: string
  }
}

type FindPlacesData = {
  findPlaces: {
    cursor?: string
    results: Place[]
    __typename: string
  }
}

export type { FindAddressData, FindCoordsData, FindPlacesData }
