// src/pages/Dashboard/components/ProductsOverview.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardProductList from './DashboardProductList';

const ProductsOverview: React.FC = () => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Product Overview</h3>
        <Link 
          to="/products" 
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          View all products
        </Link>
      </div>
      <div className="p-5">
        <DashboardProductList />
      </div>
    </div>
  );
};

export default ProductsOverview;
