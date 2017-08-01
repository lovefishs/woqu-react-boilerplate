import React, { Component } from 'react'

const setPageTitle = (WrappedComponent) => {
  class WrapperComponent extends Component {
    componentDidMount = () => {
      if (this.props.title && typeof this.props.title === 'string') {
        window.document.title = this.props.title
      }
    }

    render = () => {
      return <WrappedComponent {...this.props} />
    }
  }

  return WrapperComponent
}

export default setPageTitle

// @setPageTitle

// const setPageTitle = (title) => (WrappedComponent) => {
//   class WrapperComponent extends Component {
//     componentDidMount = () => {
//       window.document.title = this.props.title ? `${title} - ${this.props.title}` : title
//     }

//     render = () => {
//       return <WrappedComponent {...this.props} />
//     }
//   }

//   return WrapperComponent
// }

// export default setPageTitle

// @setPageTitle('Home Page')
// 这种方式无法与国际化功能很好的结合，在组件定义时不方便传入本地化字符串
