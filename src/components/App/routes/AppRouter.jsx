import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import LazyComponent, { lazyRender } from 'components/LazyComponent'

class AppRouter extends Component {
  componentDidMount = () => {
    // preloads the rest
    this.loadHome()
  }

  loadHome = () => import(/* webpackChunkName: 'route.home' */ 'components/Home')
  Home = (props) => <LazyComponent {...props} title="Home" load={this.loadHome} lazyRender={lazyRender} />

  loadLogin = () => import(/* webpackChunkName: 'route.login' */ 'components/Login')
  Login = (props) => <LazyComponent {...props} title="Login" load={this.loadLogin} lazyRender={lazyRender} />

  loadTopics = () => import(/* webpackChunkName: 'route.topics' */ 'components/Topics')
  Topics = (props) => <LazyComponent {...props} title="Topics" load={this.loadTopics} lazyRender={lazyRender} />

  render = () => {
    return (
      <div>
        <Route path="/home" component={this.Home} exact strict />
        <Route path="/login" component={this.Login} exact strict />
        <Route path="/topics" component={this.Topics} />
      </div>
    )
  }
}

export default AppRouter
