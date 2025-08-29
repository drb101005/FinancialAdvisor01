import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup'
import Navbar from './components/Navbar'
import PortfolioDetail from './components/PortfolioDetail';
function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/portfolio/detail" element={<PortfolioDetail portfolioId={1}/>} />
      </Routes>

    </Router>
  )
}

export default App
