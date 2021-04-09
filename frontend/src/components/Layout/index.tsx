import React, { ReactNode } from 'react'
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
  max-width: 1000px;
  padding-bottom: 5rem;
  margin-top: 1.5rem;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 680px) {
    margin-left: 0;
    margin-right: 0;
    padding-bottom: 2.5rem;
  }
`

interface Props {
  children: ReactNode[]
}

function Layout(props: Props): JSX.Element {
  return (
    <Container>
      <Header />
      <Main>{props.children}</Main>
      <Footer />
    </Container>
  )
}

export default Layout
