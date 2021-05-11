import { gql } from 'apollo-boost'
import { addressFragment, placeFragment } from './fragments'

const findAddressQuery = gql`
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

const findCoordinatesQuery = gql`
  query($address: String, $pathFunction: any) {
    findCoordinates(address: $address, type: $type) @rest(type: "Object", pathBuilder: $pathFunction, method: "GET") {
      results @type(name: "Address") {
        ...addressFragment
      }
    }
  }
  ${addressFragment}
`

const findPlacesQuery = gql`
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

const findMorePlacesQuery = gql`
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

export { findAddressQuery, findCoordinatesQuery, findMorePlacesQuery, findPlacesQuery }
