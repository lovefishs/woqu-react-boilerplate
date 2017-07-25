import React, { Component } from 'react'
import PropTypes from 'prop-types'

class LazyRoute extends Component {
  static propTypes = {
    load: PropTypes.func.isRequired,
    lazyRender: PropTypes.func.isRequired,
  }
  static defaultProps = {
    load: () => {},
    lazyRender: () => {},
  }

  state = {
    mod: null,
  }
  componentWillMount = () => {
    this.load(this.props)
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps)
    }
  }

  load = (props) => {
    this.setState({ mod: null })

    Promise
      .resolve(props.load())
      .then(mod => {
        if (mod && typeof mod === 'object') {
          this.setState({
            mod: mod.default ? mod.default : mod,
          })
        }
      })
      .catch(err => {
        throw err
      })
  }

  render = () => {
    return this.props.lazyRender(this.state.mod, this.props)
  }
}

export default LazyRoute
