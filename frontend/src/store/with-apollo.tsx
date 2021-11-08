import React, { Fragment, ReactElement } from 'react'
import { ApolloProvider, getClient } from './apollo-setup'
import { getConfig } from '../config'

function withApollo(child: ReactElement): JSX.Element {
  const config = getConfig()
  const client = getClient(config)
  return (
    <ApolloProvider client={client}>
      <React.StrictMode>
        <Fragment>{child}</Fragment>
      </React.StrictMode>
    </ApolloProvider>
  )
}

export { withApollo }
