import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import LandingPageContainer from '../LandingPageContainer'
import PlacesPageContainer from '../PlacesPageContainer'

import PrivacyPage from '../../components/PrivacyPage'
import TermsPage from '../../components/TermsPage'

function AppContainer(): JSX.Element {
  return (
    <Router>
      <Switch>
        <Route exact path="/privacy">
          <PrivacyPage />
        </Route>
        <Route exact path="/terms">
          <TermsPage />
        </Route>
        <Route exact path="/places">
          <PlacesPageContainer />
        </Route>
        <Route path="/">
          <LandingPageContainer />
        </Route>
      </Switch>
    </Router>
  )
}

export default AppContainer
