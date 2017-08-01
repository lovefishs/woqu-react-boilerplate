import React, { Component } from 'react'
import PropTypes from 'prop-types'

class LazyComponent extends Component {
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
    // 做此判断是因为在载入目标组件阶段，有可能父组件(LazyComponent)已经被卸载
    // 实际的场景就是基于实际的 URL 地址直接刷新，在 App 组件中基于情况判断执行 history.push() 操作，导致异步载入组件成功后执行 setState 操作报警告错误(因为当前组件已经被卸载)
    if (this._reactInternalInstance) {
      this.setState({ mod: null })

      Promise
        .resolve(props.load())
        .then(mod => {
          if (mod && typeof mod === 'object' && this._reactInternalInstance) {
            this.setState({
              mod: mod.default ? mod.default : mod,
            })
          }
        })
        .catch(err => {
          throw err
        })
    }
  }

  render = () => {
    return this.props.lazyRender(this.state.mod, this.props)
  }
}

export default LazyComponent
