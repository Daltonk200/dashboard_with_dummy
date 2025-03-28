// src/features/products/ProductList.tsx
import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Link } from 'react-router-dom';
import { productService } from '../../services/api';
import { toast } from 'sonner';

// Product Type Definition
interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  brand: string;
}

// API Response Type
interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

const ProductList: React.FC = () => {
  const [page, setPage] = useState(1);
  const { 
    data, 
    isLoading, 
    isError 
  } = useQuery<ProductResponse, Error>({
    queryKey: ["products", page],
    queryFn: () => productService.fetchProducts(page),
    onError: (error: Error) => {
      toast.error(`Failed to load products: ${error.message}`);
      console.error(error);
    }
  });

  if (isLoading) return <p>Loading products...</p>;
  if (isError) return <p>Error fetching products</p>;

  const products = data?.products || [];
  const totalProducts = data?.total || 0;
  const limit = data?.limit || 10;
  const hasMore = (data?.skip || 0) + limit < totalProducts;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <Link 
            to={`/products/${product.id}`} 
            key={product.id} 
            className="border p-4 rounded shadow hover:shadow-lg transition"
          >
            <img 
              src={product.thumbnail} 
              alt={product.title} 
              className="w-full h-48 object-cover"
            />
            <h3 className="text-lg font-bold mt-2">{product.title}</h3>
            <p className="text-green-600">${product.price}</p>
            <p className="text-gray-500">{product.brand}</p>
          </Link>
        ))}
      </div>

      <div className="flex justify-center mt-6 space-x-4">
        <button 
          onClick={() => setPage(prev => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {page}</span>
        <button 
          onClick={() => setPage(prev => prev + 1)}
          disabled={!hasMore}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;