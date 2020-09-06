/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */

import { ApolloProvider } from '@apollo/react-hooks'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { RestLink } from 'apollo-link-rest'

function getClient() {
  const { REACT_APP_BACKEND_URL } = process.env

  if (!REACT_APP_BACKEND_URL) {
    throw new Error('Missing environment variable REACT_APP_BACKEND_URL')
  }

  const restLink = new RestLink({
    uri: `${REACT_APP_BACKEND_URL}`,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const client = new ApolloClient({
    link: restLink,
    cache: new InMemoryCache({
      dataIdFromObject: o => {
        o.id ? `${o.__typename}-${o.id}` : `${o.__typename}-${o.cursor}`
      },
    }),
  })

  return client
}

export { ApolloProvider, getClient }