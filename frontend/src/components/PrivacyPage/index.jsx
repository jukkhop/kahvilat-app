import React from 'react'
import styled from 'styled-components'

import Layout from '../SiteLayout'

const Heading2 = styled.h2`
  font-family: Source Sans Pro;
  font-size: 1.35rem;
  padding-bottom: 0.35rem;
`

const Paragraph = styled.p`
  font-family: Source Sans Pro;
  font-size: 0.9rem;
`

function PrivacyPage() {
  return (
    <Layout>
      <Heading2>Privacy statement</Heading2>
      <Paragraph>
        This service does not collect any personally identifiable information
        about you, or about any of its users.
      </Paragraph>
    </Layout>
  )
}

export default PrivacyPage
