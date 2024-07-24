import React from 'react'
import Navbar from './components/layout/Navbar'
import { BrowserRouter as Router } from "react-router-dom"
import Footer from './components/layout/Footer'

function App() {
  return (
    <Router>
      <div className='bg-white text-gray-900 w-svw h-svh'> {/* second bg: slate-100 */}
        <Navbar />
        <Footer />
      </div>
    </Router>
  )
}

export default App