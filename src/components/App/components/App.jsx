import React, { Component } from 'react'

import AppRouter from '../routes/AppRouter'

class App extends Component {
  componentDidMount = () => {
    console.log('App component props:', this.props)

    const { history, location } = this.props
    let nextPath = '/home'

    if (location.pathname !== nextPath) {
      history.push(nextPath)
    }
  }

  render = () => {
    return (
      <div>
        <AppRouter />
      </div>
    )
  }
}

export default App
