import React, { Component } from 'react'

import i18nDecorator from '../decorators/i18nDecorator'
import AppRouter from '../routes/AppRouter'

@i18nDecorator
class App extends Component {
  // componentDidMount = () => {}

  render = () => {
    return <AppRouter {...this.props} />
  }
}

export default App
