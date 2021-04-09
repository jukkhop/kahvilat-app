import React from 'react'
import { render } from '@testing-library/react'
import App from './App'

it('should render the landing page title', () => {
  const { getByText } = render(<App />)
  const linkElement = getByText(/Varhainen versio nyt kokeiltavissa./i)
  expect(linkElement).toBeInTheDocument()
})
