import React, { Component } from 'react'
import { Provider } from 'mobx-react'

import { getDisplayName } from 'decorators'
import i18n from 'stores/i18nStore'

const stores = {
  i18n,
}

const storeDecorator = (WrappedComponent) => {
  class WrapperComponent extends Component {
    static displayName = `HOC-storeDecorator(${getDisplayName(WrappedComponent)})`

    render = () => {
      return (
        <Provider {...stores}>
          <WrappedComponent {...this.props} />
        </Provider>
      )
    }
  }

  return WrapperComponent
}

export default storeDecorator
