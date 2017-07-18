import React from 'react'

import HelloMessage from 'components/HelloMessage'

const App = () => {
  return (
    <div>
      <p>hello message before info</p>

      <HelloMessage />

      <p>hello message after info</p>
    </div>
  )
}

export default App
