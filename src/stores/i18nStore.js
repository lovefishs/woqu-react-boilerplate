import { observable, action, computed, useStrict } from 'mobx'
import { addLocaleData } from 'react-intl'
import enLocaleData from 'react-intl/locale-data/en'
import zhLocaleData from 'react-intl/locale-data/zh'

useStrict(true)
addLocaleData([...enLocaleData, ...zhLocaleData])

class I18n {
  locales = [
    { value: 'zh-CN', label: '简体中文' },
    { value: 'zh-TW', label: '繁体中文' },
    { value: 'en-US', label: 'English' },
  ]
  localeDefault = localStorage.getItem('locale') || 'zh-CN'
  localeMap = ((isDev) => {
    if (isDev) {
      return {}
    }

    const localLocaleMap = localStorage.getItem('localeMap')
    const localeMap = localLocaleMap === null ? {} : JSON.parse(localLocaleMap)

    return localeMap
  })(process.env.NODE_ENV === 'development')

  @observable
  locale = ''

  constructor () {
    this.updateLocale(this.localeDefault)
  }

  @computed
  get messages () {
    if (this.localeMap[this.locale]) {
      return this.localeMap[this.locale]
    }

    return {}
  }

  @action
  asyncUpdateLocale = (locale, mod) => {
    this.localeMap[locale] = mod

    localStorage.setItem('locale', locale)
    this.locale = locale

    if (!(process.env.NODE_ENV === 'development')) {
      // 生产环境把本地语言对象写入本地存储
      localStorage.setItem('localeMap', JSON.stringify(this.localeMap))
    }
  }

  @action
  updateLocale = (locale) => {
    if (typeof locale !== 'string' || locale === '') {
      return
    }

    if (this.localeMap[locale]) {
      localStorage.setItem('locale', locale)
      this.locale = locale
    } else {
      Promise
        .resolve(import(/* webpackChunkName: 'i18n.data.' */ `locales/${locale}`))
        .then(mod => {
          const modReal = mod.default ? mod.default : mod

          this.asyncUpdateLocale(locale, modReal)
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}

export default new I18n()
