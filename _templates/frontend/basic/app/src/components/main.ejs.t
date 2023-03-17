---
to: <%= outputPath %>/<%= name %>/src/components/Main/index.jsx
force: true
---
import React from 'react'

const Main = () => {
  return (
    <div>
      <%= name %>
    </div>
  )
}

export default Main;
