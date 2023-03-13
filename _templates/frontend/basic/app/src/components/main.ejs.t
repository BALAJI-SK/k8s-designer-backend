---
to: <%= outputPath %>/<%= appName %>/src/components/Main/index.jsx
force: true
---
import React from 'react'

const Main = () => {
  return (
    <div>
      <%= appName %>
    </div>
  )
}

export default Main;
