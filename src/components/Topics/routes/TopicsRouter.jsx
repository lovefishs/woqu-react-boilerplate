import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import AsyncLoadModule from 'components/AsyncLoadModule'

class TopicsRouter extends Component {
  componentDidMount = () => {
    // preloads the rest
    // this.loadTopic()
  }

  loadTopic = () => import(/* webpackChunkName: 'route.topic' */ '../components/Topic')
  WrapTopic = (props) => (
    <AsyncLoadModule moduleId="route.topic" load={this.loadTopic}>
      {(Comp) => <Comp {...props} title={`Topic Page - ${props.match.params.topicId}`} />}
    </AsyncLoadModule>
  )

  render = () => {
    const { match } = this.props

    return (
      <div>
        <Route path={`${match.url}/:topicId`} component={this.WrapTopic} />
        <Route exact path={match.url} render={() => <h3>Please select a topic.</h3>} />
      </div>
    )
  }
}

export default TopicsRouter
