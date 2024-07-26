import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { LandingPage } from './pages/LandingPage'
import { PlacesPage } from './pages/PlacesPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { TermsPage } from './pages/TermsPage'

export function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/places" element={<PlacesPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Routes>
    </Router>
  )
}
