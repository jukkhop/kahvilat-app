import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.footer`
  font-size: 0.75rem;
  text-align: center;
  padding-bottom: 4rem;

  @media (max-height: 600px) {
    padding-bottom: 1rem;
  }
`

const Links = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  list-style: none;
  margin: 0rem auto 1rem auto;
  padding-inline-start: 0;

  a {
    color: rgba(1, 1, 1, 0.75);
    margin-right: 0.65rem;
    text-decoration: none;
  }

  a:not(:last-of-type)::after {
    color: black;
    content: '|';
    cursor: default;
    margin-left: 0.65rem;
  }

  @media (max-width: 400px) {
    flex-direction: column;

    a {
      margin: 0.5rem 0rem;
    }

    a::after {
      display: none;
    }
  }
`

function Footer() {
  return (
    <Container>
      <Links>
        <Link to="/privacy">Privacy statement</Link>
        <Link to="/terms">Terms of service</Link>
      </Links>
      <p>© 2020 Purelogic Softworks</p>
    </Container>
  )
}

export default Footer
