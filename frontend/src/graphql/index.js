import { gql } from 'apollo-boost'
import qs from 'qs'

const placeFragment = gql`
  fragment placeFragment on Place {
    businessStatus: business_status
    geometry @type(name: "Object") {
      location @type(name: "Object") {
        lat
        lng
      }
    }
    icon
    id
    name
    openingHours: opening_hours @type(name: "Object") {
      openNow: open_now
    }
    priceLevel: price_level
    rating
    types
    vicinity
  }
`

export const SEARCH_PLACES = gql`
  query(
    $keyword: String
    $latitude: String
    $longitude: String
    $pathFunction: any
    $radius: Int
    $type: String
  ) {
    searchPlaces(
      keyword: $keyword
      latitude: $latitude
      longitude: $longitude
      radius: $radius
      type: $type
    ) @rest(type: "Object", pathBuilder: $pathFunction, method: "GET") {
      cursor
      results @type(name: "Place") {
        ...placeFragment
      }
    }
  }
  ${placeFragment}
`

export const SEARCH_MORE_PLACES = gql`
  query($cursor: String, $pathFunction: any) {
    searchMorePlaces(cursor: $cursor)
      @rest(type: "Object", pathBuilder: $pathFunction, method: "GET") {
      cursor
      results @type(name: "Place") {
        ...placeFragment
      }
    }
  }
  ${placeFragment}
`

export const FIND_ADDRESS = gql`
  query($latitude: String, $longitude: String, $pathFunction: any) {
    findAddress(latitude: $latitude, longitude: $longitude, type: $type)
      @rest(type: "Object", pathBuilder: $pathFunction, method: "GET") {
      results @type(name: "Address") {
        address: formatted_address
        components: address_components @type(name: "Object") {
          name: long_name
          types @type(name: "[String]")
        }
      }
    }
  }
`

export const FIND_COORDINATES = gql`
  query($address: String, $pathFunction: any) {
    findCoordinates(address: $address, type: $type)
      @rest(type: "Object", pathBuilder: $pathFunction, method: "GET") {
      results @type(name: "Address") {
        geometry @type(name: "Object") {
          location @type(name: "Object") {
            lat
            lng
          }
        }
      }
    }
  }
`

export const buildPath = endpoint => ({ args }) => {
  const queryString = qs.stringify(args, { encode: false })
  return `${endpoint}?${queryString}`
}
