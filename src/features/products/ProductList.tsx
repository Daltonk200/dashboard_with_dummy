// src/features/products/ProductList.tsx
import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Link } from 'react-router-dom';
import { productService } from '../../services/api';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, ChevronRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Product Type Definition
interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  brand: string;
  category?: string;
  rating?: number;
  discountPercentage?: number;
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
    isError,
    refetch
  } = useQuery<ProductResponse, Error>({
    queryKey: ["products", page],
    queryFn: () => productService.fetchProducts(page),
    onError: (error: Error) => {
      toast.error(`Failed to load products: ${error.message}`);
      console.error(error);
    }
  });
  
  const products = data?.products || [];
  const totalProducts = data?.total || 0;
  const limit = data?.limit || 10;
  const hasMore = (data?.skip || 0) + limit < totalProducts;
  const totalPages = Math.ceil(totalProducts / limit);

  // Skeleton loader with staggered animation
  if (isLoading) return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="bg-white rounded-xl overflow-hidden shadow-sm"
          >
            <div className="w-full h-56 bg-gradient-to-r from-blue-100 to-blue-200 animate-pulse"></div>
            <div className="p-5 space-y-3">
              <div className="h-4 bg-blue-100 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-blue-100 rounded animate-pulse"></div>
              <div className="flex justify-between pt-2">
                <div className="h-6 w-1/3 bg-blue-100 rounded animate-pulse"></div>
                <div className="h-6 w-1/4 bg-blue-100 rounded animate-pulse"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
  
  if (isError) return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 text-center bg-white rounded-xl shadow-sm border border-blue-100"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-500 mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load products</h3>
        <p className="text-gray-500 mb-6">There was a problem connecting to the server. Please try again.</p>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Try Again
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header with stats */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-4">
          <h1 className="text-xl font-semibold text-white flex items-center">
            <Zap className="mr-2" size={20} /> Product Showcase
          </h1>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center space-x-6">
            <div>
              <span className="text-sm text-gray-500">Total Products</span>
              <div className="text-2xl font-bold text-gray-900">{totalProducts}</div>
            </div>
            <div>
              <span className="text-sm text-gray-500">Page</span>
              <div className="text-2xl font-bold text-gray-900">{page} <span className="text-sm text-gray-400">of {totalPages}</span></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Grid */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Link to={`/products/${product.id}`} className="block">
                {/* Product Image with Overlay */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img 
                    src={product.thumbnail} 
                    alt={product.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Product+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Discount Badge */}
                  {product.discountPercentage && product.discountPercentage > 0 && (
                    <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {Math.round(product.discountPercentage)}% OFF
                    </div>
                  )}
                  
                  <div className="absolute bottom-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="flex items-center text-sm font-medium">
                      View Details
                      <ChevronRight size={16} className="ml-1" />
                    </span>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {product.title}
                    </h3>
                    
                    {/* Rating - GOLDEN STARS */}
                    {product.rating && (
                      <div className="flex items-center bg-yellow-50 px-1.5 py-0.5 rounded">
                        <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                        <span className="text-xs font-medium text-gray-700 ml-1">{product.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-1">{product.brand}</p>
                  
                  <div className="mt-3 flex justify-between items-end">
                    <div className="flex items-baseline">
                      <span className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</span>
                      {product.discountPercentage && product.discountPercentage > 0 && (
                        <span className="text-xs text-gray-500 line-through ml-2">
                          ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                      Details
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-6">
          <div className="bg-white rounded-xl shadow-sm p-2 inline-flex items-center">
            <button 
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="relative inline-flex items-center px-3 py-2 rounded-lg mr-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed
                bg-white text-gray-700 hover:bg-blue-50 disabled:hover:bg-white transition-colors"
              aria-label="Previous page"
            >
              <ArrowLeft size={16} className="mr-1" />
              <span>Previous</span>
            </button>
            
            {/* Page Number Buttons */}
            <div className="hidden md:flex space-x-1">
              {[...Array(Math.min(7, totalPages))].map((_, idx) => {
                // Logic to show current page in the middle when possible
                let pageNum;
                if (totalPages <= 7) {
                  pageNum = idx + 1;
                } else if (page <= 4) {
                  pageNum = idx + 1;
                } else if (page >= totalPages - 3) {
                  pageNum = totalPages - 6 + idx;
                } else {
                  pageNum = page - 3 + idx;
                }
                
                return (
                  <button
                    key={idx}
                    onClick={() => setPage(pageNum)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors
                      ${page === pageNum 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm' 
                        : 'bg-white text-gray-700 hover:bg-blue-50'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            {/* Mobile pagination indicator */}
            <div className="md:hidden px-4">
              <span className="text-sm font-medium text-gray-700">
                Page {page} of {totalPages}
              </span>
            </div>
            
            <button 
              onClick={() => setPage(prev => prev + 1)}
              disabled={!hasMore}
              className="relative inline-flex items-center px-3 py-2 rounded-lg ml-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed
                bg-white text-gray-700 hover:bg-blue-50 disabled:hover:bg-white transition-colors"
              aria-label="Next page"
            >
              <span>Next</span>
              <ArrowRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
