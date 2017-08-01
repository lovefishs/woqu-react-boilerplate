import React, { Component } from 'react'

import AppRouter from '../routes/AppRouter'

class App extends Component {
  // componentDidMount = () => {}

  render = () => {
    return <AppRouter {...this.props} />
  }
}

export default App
