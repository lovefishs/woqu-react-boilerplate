import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { loading, setPageTitle } from 'decorators'
import TopicsRouter from '../routes/TopicsRouter'

@loading
@setPageTitle
class Topics extends Component {
  componentDidMount () {
    console.log('Topics component props:', this.props)
  }
  componentWillUnmount () {
    console.log('Topics componentWillUnmount')
  }

  render () {
    const { match } = this.props

    return (
      <div>
        <h2>Topics</h2>
        <ul>
          <li>
            <Link to={`${match.url}/rendering`}>Rendering with React</Link>
          </li>
          <li>
            <Link to={`${match.url}/components`}>Components</Link>
          </li>
          <li>
            <Link to={`${match.url}/props-v-state`}>Props v. State xxx</Link>
          </li>
        </ul>

        <TopicsRouter {...this.props} />
      </div>
    )
  }
}

export default Topics
