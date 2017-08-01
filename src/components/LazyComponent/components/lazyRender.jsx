import React from 'react'

import Loading from 'components/Loading'

const lazyRender = (Component, props) => {
  return Component ? <Component {...props} /> : <Loading />
}

export default lazyRender
