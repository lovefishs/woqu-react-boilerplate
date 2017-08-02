import React, { Component } from 'react'
import { inject } from 'mobx-react'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'

import { loading, setPageTitle } from 'decorators'

@loading
@setPageTitle
@inject('i18n')
@injectIntl
class Home extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  }
  static defaultProps = {}

  componentDidMount = () => {
    console.log('Home component props:', this.props)
  }
  componentWillUnmount = () => {
    console.log('Home componentWillUnmount')
  }

  handleLocaleChange = (e) => {
    this.props.i18n.updateLocale(e.currentTarget.value)
  }

  render = () => {
    const { i18n, intl } = this.props

    return (
      <div>
        <h2>Home Page</h2>
        <div>
          <select defaultValue={i18n.locale} onChange={this.handleLocaleChange}>
            {i18n.locales.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
            }
          </select>
        </div>
        <h3>{intl.formatMessage({ id: 'intl.hello' })}，<FormattedMessage id="intl.china" /></h3>
        <p>
          <FormattedMessage
            id="intl.name"
            values={{ name: <strong>woqutech</strong> }}
            defaultMessage={'my name is woqutech'}
          />
        </p>
      </div>
    )
  }
}

export default Home
