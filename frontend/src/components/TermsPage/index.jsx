import React from 'react'
import styled from 'styled-components'

import Header from '../Header'
import Footer from '../Footer'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  min-height: 100vh;

  @media (max-width: 660px) {
    margin-left: 0.75rem;
    margin-right: 0.75rem;
  }
`

const Main = styled.main`
  margin: 1.25rem auto 0 auto;
  max-width: 60ch;
  padding-bottom: 5rem;
`

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

function TermsPage() {
  return (
    <Container>
      <Header />
      <Main>
        <Heading2>Terms of service</Heading2>
        <Paragraph>
          This service is provided solely for the benefit of people who enjoy going to cafeterias.
        </Paragraph>
        <Paragraph>
          This service is the intellectual property of Purelogic Softworks (legal name), who retains
          all rights to modify the service in any way it sees fit, or remove the service at any
          point in time without prior notice.
        </Paragraph>
      </Main>
      <Footer />
    </Container>
  )
}

export default TermsPage
