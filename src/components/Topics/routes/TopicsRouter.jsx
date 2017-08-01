import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import LazyComponent, { lazyRender } from 'components/LazyComponent'

class TopicsRouter extends Component {
  loadTopic = () => import(/* webpackChunkName: 'route.topics.topic' */ '../components/Topic')
  Topic = (props) => <LazyComponent {...props} title={`Toppics - ${props.match.params.topicId}`} load={this.loadTopic} lazyRender={lazyRender} />

  render = () => {
    const { match } = this.props

    return (
      <div>
        <Route path={`${match.url}/:topicId`} component={this.Topic} />
        <Route exact path={match.url} render={() => <h3>Please select a topic.</h3>} />
      </div>
    )
  }
}

export default TopicsRouter
