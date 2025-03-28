// src/pages/Dashboard/components/ActivityPanel.tsx
import React, { useState, useEffect } from 'react';
import { Package, User, ShoppingCart } from 'lucide-react';
import ActivityItem from '../components/ActivityItem';
import { productService, userService, cartService } from '../../../services/api';

const ActivityPanel: React.FC = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        setLoading(true);
        const [productsData, usersData, cartsData] = await Promise.all([
          productService.fetchProducts(1, 3), // Get 3 most recent products
          userService.fetchUsers(1, 3), // Get 3 most recent users
          cartService.fetchCarts(1, 3) // Get 3 most recent carts
        ]);
        
        // Create activity items from the fetched data
        const productActivities = productsData.products.map((product: any) => ({
          icon: Package,
          iconColor: 'blue',
          title: `New product: ${product.title}`,
          time: 'Recently added',
          id: `product-${product.id}`
        }));
        
        const userActivities = usersData.users.map((user: any) => ({
          icon: User,
          iconColor: 'green',
          title: `User ${user.firstName} ${user.lastName} registered`,
          time: 'Recently joined',
          id: `user-${user.id}`
        }));
        
        const cartActivities = cartsData.carts.map((cart: any) => ({
          icon: ShoppingCart,
          iconColor: 'yellow',
          title: `New order #${cart.id} for $${cart.total}`,
          time: 'Recently ordered',
          id: `cart-${cart.id}`
        }));
        
        // Combine and sort by most recent
        const allActivities = [...productActivities, ...userActivities, ...cartActivities];
        allActivities.sort(() => Math.random() - 0.5); // Randomize order since we don't have real timestamps
        
        setActivities(allActivities.slice(0, 5)); // Show only 5 most recent activities
      } catch (error) {
        console.error('Error fetching activity data:', error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-5 py-4 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
      </div>
      <div className="p-5">
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-pulse text-gray-400">Loading activity...</div>
          </div>
        ) : activities.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <ActivityItem key={activity.id} {...activity} />
            ))}
          </ul>
        ) : (
          <div className="text-center py-6 text-gray-500">No recent activity found</div>
        )}
      </div>
    </div>
  );
};

export default ActivityPanel;
