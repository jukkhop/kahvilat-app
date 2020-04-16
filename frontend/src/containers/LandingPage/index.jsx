import React from 'react'
import styled from 'styled-components'
import { useQuery } from '@apollo/react-hooks'

import LandingPage from '../../components/LandingPage'
import { GET_HELLO } from '../../graphql'

const Message = styled.p`
  font-size: 1.5rem;
  text-align: center;
  margin: auto;
`

function LandingPageContainer() {
  const { loading, error, data } = useQuery(GET_HELLO)

  if (loading) {
    return <Message>Loading...</Message>
  }

  if (error) {
    return <Message>Error while fetching</Message>
  }

  console.log('data', data)

  return <LandingPage />
}

export default LandingPageContainer
