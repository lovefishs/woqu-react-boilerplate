import React, { Component } from 'react'
import {
  // BrowserRouter as Router,
  HashRouter as Router,
  Route,
} from 'react-router-dom'

import LazyRoute, { lazyRender } from 'components/LazyRoute'
import Home from 'components/Home'
// import Login from 'components/Login'
// import Topics from 'components/Topics'
// <Route path="/topics" component={Topics} />

class AppRouter extends Component {
  render = () => {
    return (
      <Router>
        <div>
          {/*<Route path="/home" component={Home} />*/}
          <Route path="/home" render={() => <Home title="Home Page" />} />
          <Route path="/login" render={() => <LazyRoute title="Login Page" load={() => import(/* webpackChunkName: 'route.' */ 'components/Login')} lazyRender={lazyRender} />} />
        </div>
      </Router>
    )
  }
}

export default AppRouter
