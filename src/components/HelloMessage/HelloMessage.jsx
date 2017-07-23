import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { intlShape } from 'react-intl'

import styles from './style.module.css'
import cat from './cat.png'

class HelloMessage extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    // text: PropTypes.node.isRequired, // node: numbers, strings, elements or an array or fragment
    text: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]).isRequired,
  }
  static defaultProps = {
    text: 'world',
  }

  render () {
    return (
      <h1 className={styles.message}>
        <img src={cat} alt="cat image" /> <span>{this.props.intl.formatMessage({ id: 'intl.hello' })}, {this.props.text}!</span>
      </h1>
    )
  }
}

export default HelloMessage
