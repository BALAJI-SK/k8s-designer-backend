---
to:  <%= outputPath %>/<%= name %>/src/App.jsx
force: true
---
import {BrowserRouter, Route, Routes} from 'react-router-dom';
<% if(backends.length > 0) { -%>
import Ping from './pages/Ping';
<% } -%>
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <%_ if(backends.length > 0) { _%>
          <Route path='/ping/:backendName' element={<Ping />}/>
          <%_ } _%>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
