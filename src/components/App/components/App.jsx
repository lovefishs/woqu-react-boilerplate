import React, { Component } from 'react'

import routerDecorator from '../decorators/routerDecorator'

@routerDecorator
class App extends Component {
  render = () => {
    return this.props.children
  }
}

export default App
