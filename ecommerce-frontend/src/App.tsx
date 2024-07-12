import { onAuthStateChanged } from "firebase/auth";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

// Components
import Header from "./components/header";
import Loader from "./components/loader";
import ProtectedRoute from "./components/protected-route";

// Firebase
import { auth } from "./firebase";

// Redux actions
import { getUser } from "./redux/api/userAPI";
import { userExist, userNotExist } from "./redux/reducer/userReducer";

// Types
import { User } from "./types/types";

// Lazy-loaded components
const Login = lazy(() => import("./pages/login"));
const Home = lazy(() => import("./pages/home"));
const Search = lazy(() => import("./pages/search"));
const Cart = lazy(() => import("./pages/cart"));
const Shipping = lazy(() => import("./pages/shipping"));
const Orders = lazy(() => import("./pages/orders"));
// import FoundNot from "./pages/not-found";
const FoundNot = lazy(() => import("./pages/Not_found"));

// Admin components
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/toss"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const ProductManagement = lazy(() => import("./pages/admin/management/productmanagement"));
const TransactionManagement = lazy(() => import("./pages/admin/management/transactionmanagement"));

// Custom hook for authentication
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const data = await getUser(firebaseUser.uid);
          dispatch(userExist(data.user));
          setUser(data.user);
          setIsAdmin(data.user.role === "admin");
          console.log("Logged In. User role:", data.user.role);
        } catch (error) {
          console.error("Error fetching user data:", error);
          dispatch(userNotExist());
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        dispatch(userNotExist());
        setUser(null);
        setIsAdmin(false);
        console.log("Not Logged In.");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  return { user, isAdmin, loading };
};

const App: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      <Header user={user} />
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/cart" element={<Cart />} />

          {/* Login route */}
          <Route
            path="/login"
            element={
              <ProtectedRoute isAuthenticated={!user}>
                <Login />
              </ProtectedRoute>
            }
          />

          {/* User routes */}
          <Route element={<ProtectedRoute isAuthenticated={!!user} />}>
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/orders" element={<Orders />} />
          </Route>

          {/* Admin routes */}
          <Route
            element={
              <ProtectedRoute
                isAuthenticated={!!user}
                adminOnly={true}
                admin={isAdmin}
              />
            }
          >
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/product" element={<Products />} />
            <Route path="/admin/customer" element={<Customers />} />
            <Route path="/admin/transaction" element={<Transaction />} />
            <Route path="/admin/chart/bar" element={<Barcharts />} />
            <Route path="/admin/chart/pie" element={<Piecharts />} />
            <Route path="/admin/chart/line" element={<Linecharts />} />
            <Route path="/admin/app/coupon" element={<Coupon />} />
            <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
            <Route path="/admin/app/toss" element={<Toss />} />
            <Route path="/admin/product/new" element={<NewProduct />} />
            <Route path="/admin/product/:id" element={<ProductManagement />} />
            <Route path="/admin/transaction/:id" element={<TransactionManagement />} />
          </Route>

          {/* 404 route */}
          <Route path="*" element={<FoundNot />} />
        </Routes>
      </Suspense>
      <Toaster position="bottom-center" />
    </Router>
  );
};

export default App;