// Updated src/features/products/ProductDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService, commentService } from '../../services/api';
import { toast } from 'sonner';
import { useCart } from '../../contexts/CartContext';
import CommentList, { Comment } from './components/CommentList';
import CommentForm from './components/CommentForm';
import { getProductComments, addComment, updateComment, deleteComment } from '../../utils/commentStorage';
import { format } from 'date-fns';

// Review type from DummyJSON API
interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

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
  reviews?: Review[]; // Add reviews from DummyJSON
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || '0', 10);
  const { openCartModal } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);

  // Product details query
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

  // Comments query from API
  const {
    data: apiComments,
    isLoading: isLoadingComments,
  } = useQuery<{ comments: Comment[] }, Error>({
    queryKey: ['productComments', productId],
    queryFn: () => commentService.getProductComments(productId),
    onError: (error: Error) => {
      toast.error(`Failed to load comments: ${error.message}`);
      console.error(error);
    },
    enabled: !!productId
  });

  // Load local comments from localStorage
  useEffect(() => {
    if (productId) {
      const userComments = getProductComments(productId);
      setLocalComments(userComments);
    }
  }, [productId]);

  // Convert DummyJSON reviews to our comment format
  const convertReviewsToComments = (reviews: Review[] = []): Comment[] => {
    return reviews.map((review, index) => ({
      id: `api-review-${productId}-${index}`,
      body: review.comment,
      productId,
      rating: review.rating,
      user: {
        id: index,
        username: review.reviewerName
      },
      isLocal: false,
      isApiReview: true, // Flag to identify API reviews
      createdAt: review.date
    }));
  };

  // Combine API and local comments
  useEffect(() => {
    const remoteComments = apiComments?.comments || [];
    // Transform API comments to match our structure
    const formattedRemoteComments = remoteComments.map(comment => ({
      ...comment,
      productId,
      isLocal: false
    }));

    // Get reviews from product data
    const reviewComments = product?.reviews 
      ? convertReviewsToComments(product.reviews) 
      : [];

    setAllComments([...reviewComments, ...formattedRemoteComments, ...localComments]);
  }, [apiComments, localComments, productId, product]);

  // Handle adding a new comment
  const handleAddComment = (newComment: Omit<Comment, 'id'>) => {
    try {
      const savedComment = addComment(newComment);
      setLocalComments(prev => [...prev, savedComment]);
      toast.success('Comment added successfully!');
    } catch (error) {
      toast.error('Failed to add comment. Please try again.');
      console.error(error);
    }
  };

  // Handle editing a comment
  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment);
  };

  // Handle comment update submission
  const handleUpdateComment = (updatedComment: Omit<Comment, 'id'>) => {
    if (!editingComment) return;

    try {
      const result = updateComment(editingComment.id, updatedComment.body,updatedComment.rating);
      if (result) {
        setLocalComments(prev => 
          prev.map(comment => 
            comment.id === editingComment.id ? result : comment
          )
        );
        setEditingComment(null);
        toast.success('Comment updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update comment. Please try again.');
      console.error(error);
    }
  };

  // Handle deleting a comment
  const handleDeleteComment = (commentId: string) => {
    try {
      const success = deleteComment(commentId);
      if (success) {
        setLocalComments(prev => prev.filter(comment => comment.id !== commentId));
        toast.success('Comment deleted successfully!');
      }
    } catch (error) {
      toast.error('Failed to delete comment. Please try again.');
      console.error(error);
    }
  };

  // Handle canceling comment edit
  const handleCancelEdit = () => {
    setEditingComment(null);
  };

  const calculateDiscountedPrice = () => {
    if (!product) return '0.00';
    const discount = product.price * (product.discountPercentage / 100);
    return (product.price - discount).toFixed(2);
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    openCartModal({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      discountPercentage: product.discountPercentage,
      stock: product.stock // Include stock information
    });
  };

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
              onClick={handleAddToCart}
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
      
      {/* Comments Section */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        
        {isLoadingComments ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <CommentList 
                comments={allComments}
                onEditComment={handleEditComment}
                onDeleteComment={handleDeleteComment}
              />
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Leave Your Review</h3>
              <CommentForm 
                productId={productId}
                onSubmit={editingComment ? handleUpdateComment : handleAddComment}
                editingComment={editingComment}
                onCancelEdit={handleCancelEdit}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
