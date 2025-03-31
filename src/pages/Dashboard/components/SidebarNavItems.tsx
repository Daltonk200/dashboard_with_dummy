// src/pages/Dashboard/components/SidebarNavItems.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, Users, BarChart2, Settings, ShoppingCartIcon } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';

const SidebarNavItems: React.FC = () => {
  const location = useLocation();
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();
  
  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard', current: location.pathname === '/dashboard' },
    { name: 'Products', icon: Package, path: '/products', current: location.pathname === '/products' || location.pathname.startsWith('/products/') },
    { name: 'Manage', icon: Users, path: '/productsManagement', current: location.pathname === '/productsManagement' }, 
    { name: 'Cart', icon: ShoppingCartIcon, path: '/checkout', current: location.pathname === '/checkout',badge: cartItemCount > 0 ? cartItemCount : null }, 
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
         <span className="flex-1"> {item.name}</span>

          {/* Badge for cart items count */}
          {item.badge && (
            <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-500 rounded-full">
              {item.badge}
            </span>
          )}
        </Link>
      ))}
    </>
  );
};

export default SidebarNavItems;
