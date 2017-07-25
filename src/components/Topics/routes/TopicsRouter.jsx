import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'

import Topic from '../components/Topic'

const TopicsRouter = () => {
  return (
    <Router>
      <Route path={`${match.url}/:topicId`} component={Topic} />
      <Route exact path={match.url} render={() => (
        <h3>Please select a topic.</h3>
      )}/>
    </Router>
  )
}

export default TopicsRouter
