import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

const Container = styled.header`
  color: rgba(1, 1, 1, 0.625);
  font-weight: 300;
  text-align: center;
  margin: 2rem auto 0 auto;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 1.85rem;
  min-width: 650px;
  max-width: 1000px;

  @media (max-width: 700px) {
    min-width: auto;
    width: 100%;
  }
`

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  color: #c8ad90;
  font-size: 6.5rem;
`

function Header(): JSX.Element {
  return (
    <Container>
      <StyledFontAwesomeIcon icon={faCoffee} />
    </Container>
  )
}

export default Header
