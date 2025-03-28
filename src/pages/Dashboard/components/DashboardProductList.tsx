// src/pages/Dashboard/components/DashboardProductList.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../../services/api';

const DashboardProductList: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.fetchProducts(1, 5); // Limit to 5 products
        setProducts(response.products);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div className="animate-pulse text-gray-400">Loading products...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return <div className="text-center py-6 text-gray-500">No products found</div>;
  }

  return (
    <div className="overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {products.map((product) => (
          <li key={product.id} className="py-4">
            <Link to={`/products/${product.id}`} className="block hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 h-12 w-12">
                  <img 
                    src={product.thumbnail} 
                    alt={product.title}
                    className="h-12 w-12 rounded-md object-cover" 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                  <p className="text-sm text-gray-500 truncate">{product.category}</p>
                </div>
                <div className="flex-shrink-0">
                  <p className="text-sm font-medium text-gray-900">${product.price}</p>
                  <p className="text-sm text-gray-500">{product.stock} in stock</p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-center">
        <Link 
          to="/products" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          View All Products
        </Link>
      </div>
    </div>
  );
};

export default DashboardProductList;
