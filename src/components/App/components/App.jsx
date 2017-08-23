import React, { Component } from 'react'

import storeDecorator from '../decorators/storeDecorator'
import i18nDecorator from '../decorators/i18nDecorator'
import AppRouter from '../routes/AppRouter'

@storeDecorator
@i18nDecorator
class App extends Component {
  // componentDidMount = () => {}

  render () {
    return <AppRouter {...this.props} />
  }
}

export default App
