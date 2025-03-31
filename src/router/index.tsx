// src/router/index.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/Home";
import DashboardHome from "../pages/Dashboard/index"; // Updated import
import Login from "../features/auth/Login";
import ProductList from "../features/products/ProductList";
import ProductDetails from "../features/products/ProductDetails";
import DashboardLayout from "../layouts/DashboardLayout"; // New import
import ProductManagementPage from "../pages/ProductManagement/ProductManagementPage";
import CheckoutPage from "../pages/Checkout/CheckoutPage"; // Import the checkout page

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard routes with layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardHome />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Product routes with layout */}
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProductList />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:id"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProductDetails />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CheckoutPage/>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/productsManagement"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProductManagementPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/unauthorized"
          element={<div>You do not have access to this page</div>}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
