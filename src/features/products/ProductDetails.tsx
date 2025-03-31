// Updated src/features/products/ProductDetails.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService, commentService } from '../../services/api';
import { toast } from 'sonner';
import { useCart } from '../../contexts/CartContext';
import CommentList, { Comment } from './components/CommentList';
import CommentForm from './components/CommentForm';
import { getProductComments, addComment, updateComment, deleteComment } from '../../utils/commentStorage';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Share2, ChevronLeft, ChevronRight, Star } from 'lucide-react';

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [activeTab, setActiveTab] = useState('description');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const [wishlist, setWishlist] = useState(false);

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
      const result = updateComment(editingComment.id, updatedComment.body, updatedComment.rating);
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
      stock: product.stock, // Include stock information
      quantity: 1
    });
    
    toast.success(`${product.title} added to cart!`, {
      position: 'bottom-right',
      duration: 3000,
    });
  };
  
  const handleNextImage = () => {
    if (!product) return;
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };
  
  const handlePrevImage = () => {
    if (!product) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };
  
  const handleImageZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomPosition({ x, y });
  };
  
  const toggleWishlist = () => {
    setWishlist(!wishlist);
    toast.success(wishlist ? 'Removed from wishlist' : 'Added to wishlist', {
      position: 'bottom-right',
      duration: 2000,
    });
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title,
        text: product?.description,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!', {
        position: 'bottom-right',
        duration: 2000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="animate-pulse">
              <div className="bg-gray-200 rounded-2xl h-[400px] w-full"></div>
              <div className="flex mt-4 space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-lg h-16 w-16"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-10 bg-gray-200 rounded w-full mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto text-center py-10 px-6 bg-white rounded-2xl shadow-lg">
          <div className="text-red-500 text-5xl mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the product you're looking for. It may have been removed or doesn't exist.</p>
          <Link to="/products" className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Calculate average rating
  const averageRating = allComments.length > 0 
    ? allComments.reduce((acc, comment) => acc + (comment.rating || 0), 0) / allComments.length 
    : product.rating;
  
  // Rating distribution
  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: allComments.filter(c => Math.round(c.rating || 0) === rating).length,
    percentage: allComments.length > 0 
      ? (allComments.filter(c => Math.round(c.rating || 0) === rating).length / allComments.length) * 100 
      : 0
  }));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="px-4 py-6"
    >
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <ol className="flex items-center space-x-2">
          <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
          <li><span>/</span></li>
          <li><Link to="/products" className="hover:text-blue-600">Products</Link></li>
          <li><span>/</span></li>
          <li><Link to={`/products?category=${product.category}`} className="hover:text-blue-600">{product.category}</Link></li>
          <li><span>/</span></li>
          <li className="text-gray-900 font-medium truncate max-w-xs">{product.title}</li>
        </ol>
      </nav>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image with Zoom */}
            <div 
              ref={imageRef}
              className="relative overflow-hidden rounded-2xl h-[450px] bg-gray-50 border border-gray-100 shadow-sm"
              onMouseMove={handleImageZoom}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            >
              <div 
                className="w-full h-full"
                style={{
                  backgroundImage: `url(${product.images[currentImageIndex]})`,
                  backgroundSize: isZoomed ? '150%' : 'contain',
                  backgroundPosition: isZoomed ? `${zoomPosition.x}% ${zoomPosition.y}%` : 'center',
                  backgroundRepeat: 'no-repeat',
                  transition: isZoomed ? 'none' : 'all 0.3s ease'
                }}
              ></div>
              
              {/* Image Navigation Buttons */}
              <button 
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm text-gray-800 p-2 rounded-full shadow-md hover:bg-white transition"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm text-gray-800 p-2 rounded-full shadow-md hover:bg-white transition"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
              
              {/* Discount Badge */}
              {product.discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {Math.round(product.discountPercentage)}% OFF
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((image, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative cursor-pointer rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                    currentImageIndex === index ? 'border-blue-500' : 'border-transparent'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img 
                    src={image} 
                    alt={`${product.title} thumbnail ${index + 1}`}
                    className="w-20 h-20 object-cover"
                  />
                  {currentImageIndex === index && (
                    <div className="absolute inset-0 bg-blue-500/10"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                  {product.brand}
                </span>
                <div className="flex space-x-3">
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleWishlist}
                    className={`p-2 rounded-full ${wishlist ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    aria-label="Add to wishlist"
                  >
                    <Heart size={20} fill={wishlist ? "currentColor" : "none"} />
                  </motion.button>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={handleShare}
                    className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                    aria-label="Share product"
                  >
                    <Share2 size={20} />
                  </motion.button>
                </div>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold mt-2 text-gray-900">{product.title}</h1>
              
              <div className="flex items-center mt-3">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      fill={i < Math.floor(averageRating) ? "#F59E0B" : "none"} 
                      className={i < Math.floor(averageRating) ? "text-amber-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600 font-medium">
                  {averageRating.toFixed(1)}
                </span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-gray-600">
                  {allComments.length} {allComments.length === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            </div>

            <div className="flex items-end space-x-3">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-900">
                  ${calculateDiscountedPrice()}
                </span>
                {product.discountPercentage > 0 && (
                  <span className="text-lg text-gray-500 line-through ml-2">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
              
              {product.stock > 0 ? (
                <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  In Stock ({product.stock})
                </span>
              ) : (
                <span className="px-3 py-1 bg-red-50 text-red-700 text-sm font-medium rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Tabs - Completely redesigned with better spacing and colors */}
            <div className="space-y-4 mt-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`py-3 px-6 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === 'description'
                      ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('specifications')}
                  className={`py-3 px-6 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === 'specifications'
                      ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  Specifications
                </button>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                {activeTab === 'description' ? (
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                ) : (
                  <div className="grid gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="font-medium text-blue-800 mb-1">Brand</p>
                      <p className="text-gray-700">{product.brand}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="font-medium text-purple-800 mb-1">Category</p>
                      <p className="text-gray-700">{product.category}</p>
                    </div>
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <p className="font-medium text-pink-800 mb-1">Stock</p>
                      <p className="text-gray-700">{product.stock} units</p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <p className="font-medium text-amber-800 mb-1">Rating</p>
                      <p className="text-gray-700">{product.rating} out of 5</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Add to Cart */}
            <div className="mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-medium text-lg transition-all ${
                  product.stock > 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                    : 'bg-gray-300 cursor-not-allowed text-gray-500'
                }`}
              >
                <ShoppingCart size={20} />
                <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="mt-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-gray-900">Customer Reviews</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Review Summary */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                <div className="flex justify-center my-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={20} 
                      fill={i < Math.floor(averageRating) ? "#F59E0B" : "none"} 
                      className={i < Math.floor(averageRating) ? "text-amber-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <div className="text-gray-500 text-sm">Based on {allComments.length} reviews</div>
              </div>
              
              <div className="space-y-2">
                {ratingCounts.map((item) => (
                  <div key={item.rating} className="flex items-center">
                    <div className="w-12 text-sm text-gray-700">{item.rating} star</div>
                    <div className="flex-1 mx-3 h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div 
                        className="h-full bg-amber-400 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-9 text-sm text-gray-500">{item.count}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Review List */}
            <div className="md:col-span-2">
              {isLoadingComments ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                </div>
              ) : allComments.length > 0 ? (
                <div className="space-y-6">
                  <CommentList 
                    comments={allComments}
                    onEditComment={handleEditComment}
                    onDeleteComment={handleDeleteComment}
                  />
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                  <div className="text-gray-400 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No reviews yet</h3>
                  <p className="text-gray-500 mt-1">Be the first to review this product</p>
                </div>
              )}
              
              {/* Add Review Form */}
              <div className="mt-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">{editingComment ? 'Edit Your Review' : 'Write a Review'}</h3>
                <CommentForm 
                  productId={productId}
                  onSubmit={editingComment ? handleUpdateComment : handleAddComment}
                  editingComment={editingComment}
                  onCancelEdit={handleCancelEdit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetails;
