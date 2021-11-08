import React from 'react'
import { render } from '@testing-library/react'
import { AppContainer } from './index'

it('should render the landing page title', () => {
  const { getByText } = render(<AppContainer />)
  const linkElement = getByText(/Varhainen versio nyt kokeiltavissa./i)
  expect(linkElement).toBeInTheDocument()
})
