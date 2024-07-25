// import React from 'react'
// import Navbar from './components/layout/Navbar'
// import { BrowserRouter as Router } from "react-router-dom"
// import Footer from './components/layout/Footer'

// function App() {
//   return (
//     <Router>
//       <div className='bg-neutral-100 text-gray-900 w-svw'>
//         <Navbar />
//         <Footer />
//       </div>
//     </Router>
//   )
// }

// export default App

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import NotFound from './components/misc/NotFound';

// Lazy loading components
// const Home = lazy(() => import('./components/pages/Home'));
// const Products = lazy(() => import('./components/pages/Products'));
// const About = lazy(() => import('./components/pages/About'));
// const Contact = lazy(() => import('./components/pages/Contact'));

function App() {
  return (
    <Router>
      <div className='bg-neutral-100 text-gray-900'>
        <Navbar />
        <main>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {/* <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} /> */}
              {/* Add a 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;