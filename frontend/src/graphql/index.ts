import { gql } from 'apollo-boost'
import qs from 'qs'

const addressFragment = gql`
  fragment addressFragment on Address {
    address: formatted_address
    components: address_components @type(name: "AddressComponents") {
      name: long_name
      types
    }
    geometry @type(name: "AddressGeometry") {
      location @type(name: "AddressGeometryLocation") {
        lat
        lng
      }
    }
  }
`

const placeFragment = gql`
  fragment placeFragment on Place {
    businessStatus: business_status
    geometry @type(name: "PlaceGeometry") {
      location @type(name: "PlaceGeometryLocation") {
        lat
        lng
      }
    }
    icon
    name
    openingHours: opening_hours @type(name: "OpeningHours") {
      openNow: open_now
    }
    priceLevel: price_level
    rating
    reference
    types
    vicinity
  }
`

export const FIND_PLACES = gql`
  query($keyword: String, $latitude: Float, $longitude: Float, $pathFunction: any, $radius: Int, $type: String) {
    findPlaces(keyword: $keyword, latitude: $latitude, longitude: $longitude, radius: $radius, type: $type)
      @rest(type: "Object", pathBuilder: $pathFunction, method: "GET") {
      cursor
      results @type(name: "Place") {
        ...placeFragment
      }
    }
  }
  ${placeFragment}
`

export const FIND_MORE_PLACES = gql`
  query($cursor: String, $pathFunction: any) {
    findPlaces(cursor: $cursor) @rest(type: "Object", pathBuilder: $pathFunction, method: "GET") {
      cursor
      results @type(name: "Place") {
        ...placeFragment
      }
    }
  }
  ${placeFragment}
`

export const FIND_ADDRESS = gql`
  query($latitude: Float, $longitude: Float, $pathFunction: any) {
    findAddress(latitude: $latitude, longitude: $longitude, type: $type)
      @rest(type: "Object", pathBuilder: $pathFunction, method: "GET") {
      results @type(name: "Address") {
        ...addressFragment
      }
    }
  }
  ${addressFragment}
`

export const FIND_COORDINATES = gql`
  query($address: String, $pathFunction: any) {
    findCoordinates(address: $address, type: $type) @rest(type: "Object", pathBuilder: $pathFunction, method: "GET") {
      results @type(name: "Address") {
        ...addressFragment
      }
    }
  }
  ${addressFragment}
`

interface GraphQlPath {
  args: Record<string, string>
}

export function buildPath(endpoint: string) {
  return (path: GraphQlPath): string => {
    const queryString = qs.stringify(path.args, { encode: false })
    return `${endpoint}?${queryString}`
  }
}
