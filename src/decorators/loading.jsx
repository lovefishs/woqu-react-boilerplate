import React, { Component } from 'react'

import getDisplayName from './getDisplayName'

const loading = (WrappedComponent) => {
  class WrapperComponent extends Component {
    static displayName = `HOC-loading(${getDisplayName(WrappedComponent)})`

    render () {
      if (this.props.loading) {
        return <div>Loading...</div>
      }

      return <WrappedComponent {...this.props} />
    }
  }

  return WrapperComponent
}

export default loading

// @loading
