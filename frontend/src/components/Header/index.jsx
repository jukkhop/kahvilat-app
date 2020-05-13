import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

const Container = styled.header`
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

function Header() {
  return (
    <Container>
      <StyledFontAwesomeIcon icon={faCoffee} />
    </Container>
  )
}

export default Header
