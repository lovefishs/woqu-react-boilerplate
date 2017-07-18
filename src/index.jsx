import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import App from 'containers/App'
import 'styles/app.css'

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  )
}

render(App)

console.log('NODE_ENV', typeof NODE_ENV, NODE_ENV)
console.log('process.env.NODE_ENV', typeof process.env.NODE_ENV, process.env.NODE_ENV)
console.log('__HMR__', typeof __HMR__, __HMR__)
console.log('__DEV__', typeof __DEV__, __DEV__)
console.log('__PROD__', typeof __PROD__, __PROD__)

if (__DEV__ && __HMR__ && module.hot) {
  module.hot.accept('containers/App', () => {
    render(App)
  })
}
