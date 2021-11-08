import React from 'react'
import styled from 'styled-components'

import { Layout } from '../Layout'

const Heading2 = styled.h2`
  color: rgba(0, 0, 0, 0.85);
  font-family: Montserrat;
  font-size: 1.35rem;
  font-weight: 600;
  padding-bottom: 0.35rem;
  text-transform: uppercase;
`

const Paragraph = styled.p`
  color: rgba(0, 0, 0, 0.85);
  font-family: Source Sans Pro;
  font-size: 0.875rem;
`

function PrivacyPage(): JSX.Element {
  return (
    <Layout>
      <Heading2>Privacy statement</Heading2>
      <Paragraph>
        This service does not collect any personally identifiable information about you, or about any of its users.
      </Paragraph>
    </Layout>
  )
}

export { PrivacyPage }
