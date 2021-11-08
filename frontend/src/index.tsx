import React from 'react'
import { render } from 'react-dom'
import WebFont from 'webfontloader'

import { AppContainer } from './containers/AppContainer'
import { withApollo } from './store/with-apollo'

import './index.css'

render(withApollo(<AppContainer />), document.getElementById('root'))

WebFont.load({
  google: {
    families: ['Neuton:300,400,700', 'Source Sans Pro:300,400,700', 'Montserrat:200,300,400,500,600,700'],
  },
})
