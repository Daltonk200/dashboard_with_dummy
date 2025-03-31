// src/pages/Dashboard/Home.tsx
import React from 'react';
import DashboardStats from './components/DashboardStats';
import ActivityPanel from './components/ActivityPanel';
import CommentsPanel from './components/CommentsPanel';
import ProductsOverview from './components/ProductsOverview';

const DashboardHome: React.FC = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Dashboard Stats */}
        <div className="mt-8">
          <DashboardStats />
        </div>

        {/* Recent Activity & Comments */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ActivityPanel />
          <CommentsPanel />
        </div>

        {/* Product List Section */}
        <div className="mt-8">
          <ProductsOverview />
        </div>
      </div>
    </>
  );
};

export default DashboardHome;