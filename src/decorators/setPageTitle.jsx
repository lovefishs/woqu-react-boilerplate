import React, { Component } from 'react'

import getDisplayName from './getDisplayName'

const setPageTitle = (WrappedComponent) => {
  class WrapperComponent extends Component {
    static displayName = `HOC-setPageTitle(${getDisplayName(WrappedComponent)})`

    componentDidMount = () => {
      if (this.props.title && typeof this.props.title === 'string') {
        window.document.title = this.props.title
      }
    }
    componentWillReceiveProps = (nextProps) => {
      if (this.props.title && nextProps.title && (this.props.title !== nextProps.title)) {
        window.document.title = nextProps.title
      }
    }

    render = () => {
      return <WrappedComponent {...this.props} />
    }
  }

  return WrapperComponent
}

export default setPageTitle

// @setPageTitle
