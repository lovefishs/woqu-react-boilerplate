import React, { Component } from 'react'

import { compose, loading, setPageTitle } from 'decorators'

@loading
@setPageTitle('Home Page')
class Home extends Component {
  componentDidMount = () => {
    console.log('Home component props:', this.props)
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
