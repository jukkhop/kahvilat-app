import { gql } from 'apollo-boost'

export const GET_HELLO = gql`
  query {
    getHello @rest(type: "[Object]", path: "/hello", method: "GET") {
      message
    }
  }
`
