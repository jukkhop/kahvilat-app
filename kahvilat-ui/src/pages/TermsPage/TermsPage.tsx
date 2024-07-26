import React from 'react'
import styled from 'styled-components'
import { Layout } from '../../components/Layout'

export function TermsPage(): JSX.Element {
  return (
    <Layout>
      <Heading2>Terms of service</Heading2>
      <Paragraph>This service is provided solely for the benefit of people who enjoy going to cafeterias.</Paragraph>
      <Paragraph>
        This service is the intellectual property of Purelogic Softworks (legal name), who retains all rights to modify
        the service in any way it sees fit, or remove the service at any point in time without prior notice.
      </Paragraph>
    </Layout>
  )
}

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
