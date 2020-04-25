import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

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

const Header = styled.header`
  color: rgba(1, 1, 1, 0.625);
  font-family: Neuton;
  font-size: calc(10px + 2vmin);
  font-weight: 300;
  text-align: center;
  margin: 2rem auto 0 auto;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 2rem;
  width: 100%;
  max-width: 660px;
`

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  color: #c8ad90;
  font-size: 5rem;
`

const Main = styled.main`
  margin: 1.25rem auto 0 auto;
  max-width: 60ch;
  padding-bottom: 5rem;
`

const Footer = styled.footer`
  font-size: 0.75rem;
  text-align: center;
  padding-bottom: 4rem;

  @media (max-height: 600px) {
    padding-bottom: 1rem;
  }
`

const Heading2 = styled.h2`
  font-family: Source Sans Pro;
  font-size: 1.35rem;
  padding-bottom: 0.35rem;
`

const Paragraph = styled.p`
  font-family: Source Sans Pro;
  font-size: 0.9rem;
`

function Privacy() {
  return (
    <Container>
      <Header>
        <StyledFontAwesomeIcon icon={faCoffee} />
      </Header>
      <Main>
        <Heading2>Privacy statement</Heading2>
        <Paragraph>
          This service does not collect any personally identifiable information
          about you, or about any of its users.
        </Paragraph>
      </Main>
      <Footer>
        <p>© 2020 Purelogic Softworks</p>
      </Footer>
    </Container>
  )
}

export default Privacy
