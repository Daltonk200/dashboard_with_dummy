// src/pages/Dashboard/index.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import MobileSidebar from './components/MobileSidebar';
import DashboardStats from './components/DashboardStats';
import ActivityPanel from './components/ActivityPanel';
import CommentsPanel from './components/CommentsPanel'; // Changed from NotificationsPanel
import ProductsOverview from './components/ProductsOverview';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        user={user} 
      />

      {/* Desktop Sidebar */}
      <Sidebar user={user} />

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
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
                <CommentsPanel /> {/* Changed from NotificationsPanel */}
              </div>

              {/* Product List Section */}
              <div className="mt-8">
                <ProductsOverview />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
