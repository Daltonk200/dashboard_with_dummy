// src/pages/Dashboard/components/SidebarNavItems.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, Users, BarChart2, Settings } from 'lucide-react';

const SidebarNavItems: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard', current: location.pathname === '/dashboard' },
    { name: 'Products', icon: Package, path: '/products', current: location.pathname === '/products' || location.pathname.startsWith('/products/') },
    { name: 'Users', icon: Users, path: '/dashboard', current: false }, // No users route, redirect to dashboard
    { name: 'Reports', icon: BarChart2, path: '/dashboard', current: false }, // No reports route, redirect to dashboard
    { name: 'Settings', icon: Settings, path: '/dashboard', current: false }, // No settings route, redirect to dashboard
  ];

  return (
    <>
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
            item.current
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <item.icon
            className={`mr-3 h-5 w-5 ${
              item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
            }`}
          />
          {item.name}
        </Link>
      ))}
    </>
  );
};

export default SidebarNavItems;
