import React, { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import PageLoader from "./components/layout/PageLoader";
import NotFound from "./components/pages/PageNotFound";
import SearchPage from "./components/pages/SearchPage";

const Home = lazy(() => import("./components/pages/Home"));
const Products = lazy(() => import("./components/pages/Products"));
const About = lazy(() => import("./components/pages/About"));
const Contact = lazy(() => import("./components/pages/Contact"));
const ProductDetails = lazy(() => import("./components/pages/ProductDetails"));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <div className="bg-neutral-100 text-gray-900">
      <Router>
        <Navbar />
        <main>
          <Suspense fallback={<PageLoader />}>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/products/search" element={<SearchPage />} />
              <Route path="/products/search/:keyword" element={<Products />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
