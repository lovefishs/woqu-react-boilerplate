import React, { Component } from 'react'
import { IntlProvider } from 'react-intl'
import { inject, observer } from 'mobx-react'

import { getDisplayName } from 'decorators'

const i18nDecorator = (WrappedComponent) => {
  @inject('i18n')
  @observer
  class WrapperComponent extends Component {
    static displayName = `HOC-i18nDecorator(${getDisplayName(WrappedComponent)})`

    render = () => {
      const { i18n } = this.props

      if (i18n.locale === '') {
        return <div>Loading language data...</div>
      }

      return (
        <IntlProvider locale={i18n.locale} messages={i18n.messages}>
          <WrappedComponent {...this.props} />
        </IntlProvider>
      )
    }
  }

  return WrapperComponent
}

export default i18nDecorator
