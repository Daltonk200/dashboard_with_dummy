// src/router/index.tsx
import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from "react-router-dom";
import ProtectedRoute from './ProtectedRoute';
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard/index";
import Login from "../features/auth/Login";
import ProductList from "../features/products/ProductList";
import ProductDetails from "../features/products/ProductDetails"; // New import

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/products" 
          element={
            <ProtectedRoute requiredRole="USER">
              <ProductList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/products/:id" 
          element={
            <ProtectedRoute requiredRole="USER">
              <ProductDetails />
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