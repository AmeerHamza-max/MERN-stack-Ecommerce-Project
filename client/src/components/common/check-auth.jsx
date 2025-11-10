import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const CheckAuth = ({ isAuthenticated, user, children }) => {
  const location = useLocation();
  const path = location.pathname;

  const isAuthRoute = path.startsWith("/auth");
  const isAdminRoute = path.startsWith("/admin");
  const isShopRoute = path.startsWith("/shop");

  // Unauthenticated user trying to access protected routes
  if (!isAuthenticated && !isAuthRoute) {
    return <Navigate to="/auth/login" replace />;
  }

  // Authenticated user accessing auth routes
  if (isAuthenticated && isAuthRoute) {
    return user?.role === "admin"
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/shop/home" replace />;
  }

  // Non-admin trying to access admin routes
  if (isAuthenticated && user?.role !== "admin" && isAdminRoute) {
    return <Navigate to="/unauth-page" replace />;
  }

  // Admin trying to access shop routes
  if (isAuthenticated && user?.role === "admin" && isShopRoute) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Otherwise, allow access
  return children || null;
};

export default CheckAuth;
