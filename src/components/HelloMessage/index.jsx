import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './index.module.css'

class HelloMessage extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
  }
  static defaultProps = {
    text: 'world',
  }
  constructor (props) {
    super(props)

    console.log('HelloMessage constructor')
  }

  render () {
    return <h1 className={styles.message}>Hello, {this.props.text}!</h1>
  }
}

export default HelloMessage
