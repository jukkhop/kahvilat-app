import { gql } from 'apollo-boost'

export const SEARCH_PLACES = gql`
  query($center: String, $distance: Int, $q: String, $pathFunction: any) {
    searchPlaces(center: $center, distance: $distance, q: $q)
      @rest(type: "Object", pathBuilder: $pathFunction, method: "GET") {
      data @type(name: "[Place]") {
        id
        name
        location
        hours
        isPermanentlyClosed: is_permanently_closed
      }
    }
  }
`
