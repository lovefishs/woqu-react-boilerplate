import React, { Component } from 'react'

const setPageTitle = (title) => (WrappedComponent) => {
  class WrapperComponent extends Component {
    componentDidMount = () => {
      window.document.title = this.props.title ? `${title} - ${this.props.title}` : title
    }

    render = () => {
      return <WrappedComponent {...this.props} />
    }
  }

  return WrapperComponent
}

export default setPageTitle

// @setPageTitle('Home Page')
