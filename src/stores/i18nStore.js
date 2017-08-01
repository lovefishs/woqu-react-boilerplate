import { observable, action, computed } from 'mobx'
import { addLocaleData } from 'react-intl'
import enLocaleData from 'react-intl/locale-data/en'
import zhLocaleData from 'react-intl/locale-data/zh'
addLocaleData([...enLocaleData, ...zhLocaleData])

export const LOCALE_LIST = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'zh-TW', label: '繁体中文' },
  { value: 'en-US', label: 'English' },
]
const LOCALE_DEFAULT = localStorage.getItem('locale') || 'zh-CN'
const LOCALE_MAP = {}

class I18n {
  @observable
  locale = ''

  constructor () {
    this.updateLocale(LOCALE_DEFAULT)
  }

  @computed
  get messages () {
    if (LOCALE_MAP[this.locale]) {
      return LOCALE_MAP[this.locale]
    }

    return {}
  }

  @action
  updateLocale = (locale) => {
    if (typeof locale !== 'string' || locale === '') {
      return
    }

    if (LOCALE_MAP[locale]) {
      localStorage.setItem('locale', locale)
      this.locale = locale
    } else {
      Promise
        .resolve(import(/* webpackChunkName: 'i18n.data.' */ `locales/${locale}`))
        .then(mod => {
          const modReal = mod.default ? mod.default : mod

          LOCALE_MAP[locale] = modReal

          localStorage.setItem('locale', locale)
          this.locale = locale
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}

export default new I18n()
