import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import LandingPageContainer from './LandingPage'

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <LandingPageContainer />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
