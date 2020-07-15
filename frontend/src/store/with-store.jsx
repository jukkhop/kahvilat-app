/* eslint-disable react/jsx-props-no-spreading */

import React from 'react'
import { ApolloProvider, getClient } from './apollo-setup'
import App from '../containers/App'

export default props => {
  return (
    <ApolloProvider client={getClient()}>
      <React.StrictMode>
        <App {...props} />
      </React.StrictMode>
    </ApolloProvider>
  )
}
