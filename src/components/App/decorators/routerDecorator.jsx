import React, { Component } from 'react'

import AppRouter from '../routes/AppRouter'

const routerDecorator = (WrappedComponent) => {
  class WrapperComponent extends Component {
    render = () => {
      return (
        <WrappedComponent {...this.props}>
          <AppRouter {...this.props} />
        </WrappedComponent>
      )
    }
  }

  return WrapperComponent
}

export default routerDecorator
