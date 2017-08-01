import React, { Component } from 'react'

import { loading, setPageTitle } from 'decorators'

@loading
@setPageTitle
class Home extends Component {
  componentDidMount = () => {
    console.log('Home component props:', this.props)
  }
  componentWillUnmount = () => {
    console.log('Home componentWillUnmount')
  }

  render = () => {
    return (
      <div>
        <h2>Home Page</h2>
      </div>
    )
  }
}

export default Home
