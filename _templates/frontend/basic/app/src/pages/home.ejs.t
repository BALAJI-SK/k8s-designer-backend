---
to: <%= outputPath %>/<%= appName %>/src/pages/Home/index.jsx
force: true
---
import React from 'react'
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Main from '../../components/Main';

const Home = () => {
  return (
    <div>
      <Header />
      <Main />
      <Footer />
    </div>
  )
}

export default Home;