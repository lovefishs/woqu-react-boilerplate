import React, { Component } from 'react'
import { IntlProvider } from 'react-intl'
import { observer } from 'mobx-react'

import { getDisplayName } from 'decorators'
import i18n from 'stores/i18nStore'

const i18nDecorator = (WrappedComponent) => {
  @observer
  class WrapperComponent extends Component {
    static displayName = `HOC-i18nDecorator(${getDisplayName(WrappedComponent)})`

    render = () => {
      if (i18n.locale === '') {
        return <div>Loading i18n data...</div>
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
