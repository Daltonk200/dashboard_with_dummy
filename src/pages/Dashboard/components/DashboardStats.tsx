// src/pages/Dashboard/components/DashboardStats.tsx
import React, { useState, useEffect } from 'react';
import { Package, Users, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from './StatCard';
import { productService, userService, cartService } from '../../../services/api';

const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [productsData, usersData, cartsData] = await Promise.all([
          productService.fetchProducts(1, 1), // Just to get total
          userService.fetchUsers(1, 1), // Just to get total
          cartService.fetchCarts()
        ]);
        
        // Calculate total revenue from all carts
        const totalRevenue = cartsData.carts.reduce((sum: number, cart: any) => {
          return sum + cart.total;
        }, 0);
        
        setStats({
          products: productsData.total,
          users: usersData.total,
          revenue: totalRevenue
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Products',
      value: loading ? 'Loading...' : stats.products.toString(),
      icon: Package,
      color: 'blue',
      link: { text: 'View all', href: '/products' }
    },
    {
      title: 'Active Users',
      value: loading ? 'Loading...' : stats.users.toString(),
      icon: Users,
      color: 'green',
      link: { text: 'View all', href: '/dashboard' } // Since there's no users route in router
    },
    {
      title: 'Total Revenue',
      value: loading ? 'Loading...' : `$${stats.revenue.toLocaleString()}`,
      icon: ShoppingCart,
      color: 'indigo',
      link: { text: 'View report', href: '/dashboard' } // Since there's no reports route in router
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {statCards.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;
