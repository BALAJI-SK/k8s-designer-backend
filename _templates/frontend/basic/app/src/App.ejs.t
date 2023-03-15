---
to:  <%= outputPath %>/<%= name %>/src/App.jsx
force: true
---
import {BrowserRouter, Route, Routes} from 'react-router-dom'
<% if(backends.length > 0) { -%>
import Ping from './pages/Ping';
<% } -%>
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <% if(backends.length > 0) { -%>
        <Route path='/ping/:backendName' element={<Ping />}/>
        <% } -%>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
