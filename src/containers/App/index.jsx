import React, { Component } from 'react'
import {
  addLocaleData,
  IntlProvider,
  FormattedMessage,
} from 'react-intl'
import enLocaleData from 'react-intl/locale-data/en'
import zhLocaleData from 'react-intl/locale-data/zh'
addLocaleData([...enLocaleData, ...zhLocaleData])

import 'styles/app.css'
import zhCN from 'locales/zh-CN'
import HelloMessage from 'components/HelloMessage'

const LOCALE_LIST = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'zh-TW', label: '繁体中文' },
  { value: 'en-US', label: 'English' },
]
const LOCALE_DEFAULT = 'zh-CN'
const LOCALE_MAP = {
  [LOCALE_DEFAULT]: zhCN,
}

class App extends Component {
  state = {
    locale: LOCALE_DEFAULT,
    messages: LOCALE_MAP[LOCALE_DEFAULT],
  }

  handleLocaleChange = async (e) => {
    const locale = e.currentTarget.value

    if (LOCALE_MAP[locale]) {
      this.setState({
        locale,
        messages: LOCALE_MAP[locale],
      })
    } else {
      try {
        const { default: messages } = await import(/* webpackChunkName: 'i18n.locale.' */ `locales/${locale}`)

        this.setState({
          locale,
          messages,
        })
      } catch (err) {
        console.error(err)
      }
    }
  }

  render () {
    const { locale, messages } = this.state

    return (
      <IntlProvider
        locale={locale}
        messages={messages}
      >
        <div>
          <div>
            <select defaultValue={locale} onChange={this.handleLocaleChange}>
              {LOCALE_LIST.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
              }
            </select>
          </div>

          <HelloMessage text={<FormattedMessage id="intl.china" />} />

          <p>
            <FormattedMessage
              id="intl.name"
              values={{ name: <strong>woqutech</strong> }}
              defaultMessage={'my name is woqutech'}
            />
          </p>
        </div>
      </IntlProvider>
    )
  }
}

export default App
