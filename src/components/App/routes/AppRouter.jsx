import React, { Component } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'

import AsyncLoadModule from 'components/AsyncLoadModule'
import Home from 'components/Home'

class AppRouter extends Component {
  componentDidMount = () => {
    // const { history, location } = this.props
    // let nextPath = '/home'

    // if (location.pathname !== nextPath) {
    //   history.push(nextPath)
    // }
  }

  WrapHome = (props) => (
    <Home {...props} title="Home Page" />
  )
  WrapNoMatch = (props) => (
    <AsyncLoadModule moduleId="route.nomatch" load={() => import(/* webpackChunkName: 'route.nomatch' */ 'components/NoMatch')}>
      {(Comp) => <Comp {...props} title="404 Page" />}
    </AsyncLoadModule>
  )
  WrapLogin = (props) => (
    <AsyncLoadModule moduleId="route.login" load={() => import(/* webpackChunkName: 'route.login' */ 'components/Login')}>
      {(Comp) => <Comp {...props} title="Login Page" />}
    </AsyncLoadModule>
  )
  WrapTopics = (props) => (
    <AsyncLoadModule moduleId="route.topics" load={() => import(/* webpackChunkName: 'route.topics' */ 'components/Topics')}>
      {(Comp) => <Comp {...props} title="Topics Page" />}
    </AsyncLoadModule>
  )

  render () {
    return (
      <Router>
        <Switch>
          <Route exact={true} path="/" render={() => (
            <div>Loading...</div>
          )} />
          <Route path="/home" component={this.WrapHome} />
          <Route path="/login" component={this.WrapLogin} />
          <Route path="/topics" component={this.WrapTopics} />
          <Route component={this.WrapNoMatch} />
        </Switch>
      </Router>
    )
  }
}

export default AppRouter
