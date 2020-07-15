import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { RestLink } from 'apollo-link-rest'
import { ApolloProvider } from 'react-apollo'

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
    cache: new InMemoryCache(),
  })

  return client
}

export { ApolloProvider, getClient }
