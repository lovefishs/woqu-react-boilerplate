import React, { Component } from 'react'

import { loading, setPageTitle } from 'decorators'

@loading
@setPageTitle
class Login extends Component {
  componentDidMount = () => {
    console.log('Login component props:', this.props)
  }
  componentWillUnmount = () => {
    console.log('Login componentWillUnmount')
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
