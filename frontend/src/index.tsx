import React from 'react'
import { render } from 'react-dom'
import WebFont from 'webfontloader'

import './index.css'
import App from './containers/App'
import withApollo from './store/with-apollo'

render(withApollo(<App />), document.getElementById('root'))

WebFont.load({
  google: {
    families: [
      'Neuton:300,400,700',
      'Source Sans Pro:300,400,700',
      'Montserrat:200,300,400,500,600,700',
    ],
  },
})
