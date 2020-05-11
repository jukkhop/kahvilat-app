import { gql } from 'apollo-boost'

export const GET_PLACES = gql`
  query {
    searchPlaces @rest(type: "Object", path: "/search-places", method: "GET") {
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
