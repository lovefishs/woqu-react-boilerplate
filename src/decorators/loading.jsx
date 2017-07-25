import React, { Component } from 'react'

const loading = (WrappedComponent) => {
  class WrapperComponent extends Component {
    render = () => {
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
