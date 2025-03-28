// src/features/products/ProductDetails.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../../services/api';
import { toast } from 'sonner';

// Detailed Product Type Definition
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || '0', 10);

  const { 
    data: product, 
    isLoading, 
    isError 
  } = useQuery<Product, Error>({
    queryKey: ['product', productId],
    queryFn: () => productService.getProductDetails(productId),
    onError: (error: Error) => {
      toast.error(`Failed to load product details: ${error.message}`);
      console.error(error);
    },
    enabled: !!productId
  });

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="text-center text-red-500 mt-20">
        Product not found
      </div>
    );
  }

  const calculateDiscountedPrice = () => {
    const discount = product.price * (product.discountPercentage / 100);
    return (product.price - discount).toFixed(2);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden">
            <img 
              src={product.images[currentImageIndex]} 
              alt={product.title} 
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt={`${product.title} thumbnail ${index + 1}`}
                className={`w-20 h-20 object-cover cursor-pointer rounded 
                  ${currentImageIndex === index ? 'border-2 border-blue-500' : 'opacity-50'}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          
          <div className="flex items-center mb-4">
            <span className="text-yellow-500">
              {'★'.repeat(Math.round(product.rating))}
              {'☆'.repeat(5 - Math.round(product.rating))}
            </span>
            <span className="ml-2 text-gray-600">
              ({product.rating.toFixed(1)})
            </span>
          </div>

          <div className="mb-4">
            <span className="text-2xl font-bold text-green-600">
              ${calculateDiscountedPrice()}
            </span>
            <span className="ml-2 line-through text-gray-500">
              ${product.price.toFixed(2)}
            </span>
            <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
              {product.discountPercentage.toFixed(0)}% OFF
            </span>
          </div>

          <div className="mb-4">
            <p className="text-gray-700">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="font-semibold">Brand</p>
              <p>{product.brand}</p>
            </div>
            <div>
              <p className="font-semibold">Category</p>
              <p>{product.category}</p>
            </div>
            <div>
              <p className="font-semibold">Stock</p>
              <p 
                className={
                  product.stock > 10 
                    ? 'text-green-600' 
                    : 'text-red-600 font-bold'
                }
              >
                {product.stock} available
              </p>
            </div>
          </div>

          <div className="flex space-x-4">
            <button 
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button 
              className="border border-blue-600 text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50 transition"
            >
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;