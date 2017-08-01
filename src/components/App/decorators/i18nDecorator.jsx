import React, { Component } from 'react'
import { IntlProvider } from 'react-intl'

const i18n = (WrappedComponent) => {
  class WrapperComponent extends Component {
    static displayName = `HOC-i18n(${getDisplayName(WrappedComponent)})`

    componentDidMount = () => {
      if (this.props.title && typeof this.props.title === 'string') {
        window.document.title = this.props.title
      }
    }

    render = () => {
      return (
        <IntlProvider locale={locale} messages={messages}>
          <WrappedComponent {...this.props} />
        </IntlProvider>
      )
    }
  }

  return WrapperComponent
}

export default i18n
