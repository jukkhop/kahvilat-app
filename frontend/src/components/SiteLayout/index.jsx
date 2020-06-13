import PropTypes from 'prop-types'
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
  max-width: 1000px;
  padding-bottom: 5rem;
  margin-top: 1.25rem;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 680px) {
    margin-left: 0;
    margin-right: 0;
  }
`

function Layout({ children }) {
  return (
    <Container>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </Container>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
