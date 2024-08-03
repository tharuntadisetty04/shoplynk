import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Loader from "./components/layout/Loader";
import NotFound from "./components/pages/NotFound";
import TitleHelmet from "./components/utils/TitleHelmet";

const Home = lazy(() => import("./components/pages/Home"));
const Products = lazy(() => import("./components/pages/Products"));
const About = lazy(() => import("./components/pages/About"));
const Contact = lazy(() => import("./components/pages/Contact"));

function App() {
  return (
    <div className="bg-neutral-100 text-gray-900">
      <TitleHelmet title={"ShopLynk | Connecting You to the Best Deals"} />

      <Router>
        <Navbar />
        <main>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
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
