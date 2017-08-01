import React, { PureComponent } from 'react'

import { setPageTitle } from 'decorators'

@setPageTitle
class NoMatch extends PureComponent {
  render = () => {
    const { location } = this.props

    return (
      <div>
        <h3>No match for <code>{location.pathname}</code></h3>
      </div>
    )
  }
}

export default NoMatch
