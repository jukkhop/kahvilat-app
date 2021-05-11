import { gql } from 'apollo-boost'

const addressFragment = gql`
  fragment addressFragment on Address {
    address
    id
    location @type(name: "AddressLocation") {
      latitude
      longitude
    }
  }
`

const placeFragment = gql`
  fragment placeFragment on Place {
    address
    icon
    id
    location @type(name: "PlaceLocation") {
      latitude
      longitude
    }
    name
    openNow
    priceLevel
    rating
    status
    types
  }
`

export { addressFragment, placeFragment }
