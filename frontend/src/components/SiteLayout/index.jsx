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
  margin: 1.25rem auto 0 auto;
  max-width: 60ch;
  padding-bottom: 5rem;
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
