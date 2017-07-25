import React, { Component } from 'react'
import PropTypes from 'prop-types'

const Loading = ({ text, children }) => {
  return <div className="loading">{children ? children : text}</div>
}

Loading.propTypes = {
  text: PropTypes.string,
  children: PropTypes.node,
}
Loading.defaultProps = {
  text: 'Loading...',
}

export default Loading
