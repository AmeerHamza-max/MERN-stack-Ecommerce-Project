import { Route, Routes, Navigate } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import { AdminFeatures } from "./pages/admin-view/features";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import ShoppingDetail from "./pages/shopping-view/details"; // <-- added
import CheckAuth from "./components/common/check-auth";
import { UnauthPage } from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950 text-gray-100">
        <div className="w-full max-w-md p-8">
          <div className="space-y-4 animate-pulse">
            <div className="h-6 bg-neutral-700 rounded w-1/3 mx-auto"></div>
            <div className="h-4 bg-neutral-700 rounded w-2/3 mx-auto"></div>
            <div className="h-4 bg-neutral-700 rounded w-1/2 mx-auto"></div>
            <div className="mt-6 space-y-3">
              <div className="h-10 bg-neutral-700 rounded"></div>
              <div className="h-10 bg-neutral-700 rounded"></div>
              <div className="h-10 bg-neutral-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" replace />} />

      {/* Auth Routes */}
      <Route
        path="/auth/*"
        element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AuthLayout />
          </CheckAuth>
        }
      >
        <Route path="login" element={<AuthLogin />} />
        <Route path="register" element={<AuthRegister />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AdminLayout />
          </CheckAuth>
        }
      >
        <Route path="dashboard" element={<AdminFeatures />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="features" element={<AdminFeatures />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Shopping Routes */}
      <Route
        path="/shop/*"
        element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <ShoppingLayout />
          </CheckAuth>
        }
      >
        <Route path="home" element={<ShoppingHome />} />
        <Route path="listing" element={<ShoppingListing />} />
        <Route path="checkout" element={<ShoppingCheckout />} />
        <Route path="account" element={<ShoppingAccount />} />
        <Route path="product/:id" element={<ShoppingDetail />} /> {/* detail page */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Unauthenticated Page */}
      <Route path="/unauth-page" element={<UnauthPage />} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
