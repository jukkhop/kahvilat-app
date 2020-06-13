import { gql } from 'apollo-boost'
import qs from 'qs'

export const SEARCH_PLACES = gql`
  query($location: String, $pathFunction: any, $radius: Int, $type: String) {
    searchPlaces(location: $location, radius: $radius, type: $type)
      @rest(type: "Object", pathBuilder: $pathFunction, method: "GET") {
      cursor
      places @type(name: "[Place]") {
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
    }
  }
`

export const SEARCH_MORE_PLACES = gql`
  query($cursor: String) {
    searchMorePlaces(cursor: $cursor)
      @rest(type: "Object", pathBuilder: $pathFunction, method: "GET") {
      cursor
      places @type(name: "[Place]") {
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
    }
  }
`

export function buildPath(endpoint) {
  return function _({ args }) {
    const queryString = qs.stringify(args, { encode: false })
    return `${endpoint}?${queryString}`
  }
}
