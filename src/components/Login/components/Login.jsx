import React, { Component } from 'react'

import { loading, setPageTitle } from 'decorators'
import styles from '../styles/login.module.css'
import cat from '../assets/cat.png'

@loading
@setPageTitle
class Login extends Component {
  componentDidMount () {
    console.log('Login component props:', this.props)
  }
  componentWillUnmount () {
    console.log('Login componentWillUnmount')
  }

  render () {
    return (
      <div>
        <h2 className={styles.message}>Login Page</h2>
        <div>
          <img src={cat} alt="cat image" />
        </div>
      </div>
    )
  }
}

export default Login
