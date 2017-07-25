import React, { Component } from 'react'

import { compose, loading, setPageTitle } from 'decorators'

@loading
@setPageTitle('Login Page')
class Login extends Component {
  componentDidMount = () => {
    console.log('Login component props:', this.props)
  }

  render = () => {
    return (
      <div>
        <h2>Login Page</h2>
      </div>
    )
  }
}

export default Login
