import { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import PageLoader from "./components/layout/Loaders/PageLoader";
import PageNotFound from "./components/pages/PageNotFound";
import store from "./redux/store";
import { loadUser } from "./redux/actions/UserAction";
import ProtectedRoute from "./components/utils/ProtectedRoute";
import SellerRoute from "./components/utils/SellerRoute";

const Home = lazy(() => import("./components/pages/Home"));
const Products = lazy(() => import("./components/pages/Products"));
const About = lazy(() => import("./components/pages/About"));
const Contact = lazy(() => import("./components/pages/Contact"));
const ProductDetails = lazy(() => import("./components/pages/Product/ProductDetails"));
const SearchPage = lazy(() => import("./components/pages/SearchPage"));
const Login = lazy(() => import("./components/pages/User/Login"));
const SignUp = lazy(() => import("./components/pages/User/SignUp"));
const Profile = lazy(() => import("./components/pages/User/Profile"));
const ForgotPassword = lazy(() => import("./components/pages/User/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/pages/User/ResetPassword"));
const Cart = lazy(() => import("./components/pages/Cart"));
const ShippingInfo = lazy(() => import("./components/pages/Order/ShippingInfo"));
const ConfirmOrder = lazy(() => import("./components/pages/Order/ConfirmOrder"));
const Payment = lazy(() => import("./components/pages/Order/Payment"));
const OrderSuccess = lazy(() => import("./components/pages/Order/OrderSuccess"));
const Orders = lazy(() => import("./components/pages/Order/Orders"));
const AdminDashboard = lazy(() => import("./components/pages/Seller/AdminDashboard"));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <div className="bg-neutral-100 text-gray-900">
      <Router>
        <Header />
        <main>
          <Suspense fallback={<PageLoader />}>
            <ScrollToTop />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/products/search" element={<SearchPage />} />
              <Route path="/products/search/:keyword" element={<Products />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/password/reset/:token" element={<ResetPassword />} />
              <Route path="/cart" element={<Cart />} />

              {/* Protected routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/shipping"
                element={
                  <ProtectedRoute>
                    <ShippingInfo />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/order/confirm"
                element={
                  <ProtectedRoute>
                    <ConfirmOrder />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/order/payment"
                element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/order/success"
                element={
                  <ProtectedRoute>
                    <OrderSuccess />
                  </ProtectedRoute>
                }
              />

              {/* Seller routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <SellerRoute>
                    <AdminDashboard />
                  </SellerRoute>
                }
              />

              {/* Misc route */}
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
