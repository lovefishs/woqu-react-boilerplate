import React, { Component } from 'react'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'

import { loading, setPageTitle } from 'decorators'
import i18n, { LOCALE_LIST } from 'stores/i18nStore'

@loading
@setPageTitle
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
    i18n.updateLocale(e.currentTarget.value)
  }

  render = () => {
    return (
      <div>
        <h2>Home Page</h2>
        <div>
          <select defaultValue={i18n.locale} onChange={this.handleLocaleChange}>
            {LOCALE_LIST.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
            }
          </select>
        </div>
        <h3>{this.props.intl.formatMessage({ id: 'intl.hello' })}，<FormattedMessage id="intl.china" /></h3>
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
