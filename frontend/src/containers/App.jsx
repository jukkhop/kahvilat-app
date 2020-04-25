import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import LandingPageContainer from './LandingPage'
import Privacy from '../components/Privacy'
import Terms from '../components/Terms'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/privacy">
          <Privacy />
        </Route>
        <Route exact path="/terms">
          <Terms />
        </Route>
        <Route path="/">
          <LandingPageContainer />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
