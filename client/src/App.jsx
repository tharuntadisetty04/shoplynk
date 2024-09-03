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
import PageNotFound from "./components/pages/PageNotFound";
import store from "./redux/store";
import { loadUser } from "./redux/actions/UserAction";

const Home = lazy(() => import("./components/pages/Home"));
const Products = lazy(() => import("./components/pages/Products"));
const About = lazy(() => import("./components/pages/About"));
const Contact = lazy(() => import("./components/pages/Contact"));
const ProductDetails = lazy(() => import("./components/pages/ProductDetails"));
const SearchPage = lazy(() => import("./components/pages/SearchPage"));
const Login = lazy(() => import("./components/pages/Login"));
const SignUp = lazy(() => import("./components/pages/SignUp"));
const Profile = lazy(() => import("./components/pages/Profile"));
const UpdateProfile = lazy(() => import("./components/pages/UpdateProfile"));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function LoadUser() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
}

function App() {
  return (
    <div className="bg-neutral-100 text-gray-900">
      <Router>
        <Navbar />
        <LoadUser />
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
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<UpdateProfile />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
