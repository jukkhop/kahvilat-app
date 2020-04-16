import { gql } from 'apollo-boost'

export const GET_PLACES = gql`
  query {
    getPlaces @rest(type: "Object", path: "/places", method: "GET") {
      places @type(name: "Place") {
        id
        externalId: external_id
        name
      }
    }
  }
`
