import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './index.module.css'
import cat from './cat.png'

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
    return (
      <div>
        <h1 className={styles.message}>Hello, {this.props.text}!</h1>
        <img src={cat} alt="cat image" />
      </div>
    )
  }
}

export default HelloMessage
