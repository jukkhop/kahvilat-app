import { ApolloClient, ApolloProvider, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { RestLink } from 'apollo-link-rest'
import { Config } from '../types'

function getClient(config: Config): ApolloClient<NormalizedCacheObject> {
  const restLink = new RestLink({
    uri: config.backend.baseUrl,
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
