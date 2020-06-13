import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

import Footer from '../Footer'

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  @media (max-width: 660px) {
    margin-left: 0.75rem;
    margin-right: 0.75rem;
  }
`

const Header = styled.header`
  color: rgba(1, 1, 1, 0.625);
  font-family: Source Sans Pro;
  font-size: calc(15px + 2vmin);
  font-weight: 300;
  text-align: center;
  margin: auto;

  a {
    text-decoration: none !important;
  }
`

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  color: #c8ad90;
  font-size: 30vmin;
`

const Main = styled.main``

const Button = styled.button`
  background-color: #c8ad90;
  border-radius: 3px;
  border: none;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.25);
  color: white;
  cursor: pointer;
  display: block;
  font-family: Montserrat;
  font-weight: 600;
  height: 45px;
  letter-spacing: 1.5px;
  margin-top: 0.75rem;
  text-transform: uppercase;
  width: 100%;

  @media (max-width: 650px) {
    height: 35px;
  }
`

function LandingPage() {
  return (
    <Container>
      <Header>
        <StyledFontAwesomeIcon icon={faCoffee} />
        <p>Varhainen versio nyt kokeiltavissa.</p>
        <Link to="/places">
          <Button>Kokeile nyt</Button>
        </Link>
      </Header>
      <Main />
      <Footer />
    </Container>
  )
}

export default LandingPage
