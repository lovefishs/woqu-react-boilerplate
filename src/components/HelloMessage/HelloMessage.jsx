import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import styles from './style.module.css'
import cat from './cat.png'

class HelloMessage extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
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
      <div>
        <h1 className={styles.message}>
          {this.props.intl.formatMessage({ id: 'intl.hello' })}, {this.props.text}!
        </h1>

        <img src={cat} alt="cat image" />
      </div>
    )
  }
}

export default HelloMessage
