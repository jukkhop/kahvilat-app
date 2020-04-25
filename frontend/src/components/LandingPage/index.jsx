import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

import Footer from '../Footer'

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const Header = styled.header`
  color: rgba(1, 1, 1, 0.625);
  font-family: Neuton;
  font-size: calc(10px + 2vmin);
  font-weight: 300;
  text-align: center;
  margin: auto;
`

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  color: #c8ad90;
  font-size: 20vmin;
`

const Main = styled.main``

function LandingPage() {
  return (
    <Container>
      <Header>
        <StyledFontAwesomeIcon icon={faCoffee} />
        <p>Getting you to your favorite cafeterias, faster.</p>
        <p style={{ marginTop: 0 }}>Coming soon.</p>
      </Header>
      <Main />
      <Footer />
    </Container>
  )
}

export default LandingPage
