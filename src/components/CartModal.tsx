import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const CartModal: React.FC = () => {
  const { 
    isCartModalOpen, 
    closeCartModal, 
    pendingProduct, 
    addToCart,
    cartItems,
    getTotalItems,
    getTotalPrice
  } = useCart();

  // State for quantity selector
  const [quantity, setQuantity] = useState(1);
  
  // Get the actual stock from the product data
  // The DummyJSON API includes stock information
  const maxStock = pendingProduct?.stock || 20; // Default to 100 if stock is not provided
  // Reset quantity when modal opens with a new product
  useEffect(() => {
    if (pendingProduct) {
      setQuantity(1);
    }
  }, [pendingProduct]);

  if (!isCartModalOpen || !pendingProduct) return null;

  const handleConfirm = () => {
    // Add to cart with the selected quantity
    const productWithQuantity = {
      ...pendingProduct,
      quantity // Pass the quantity directly instead of looping
    };
    
    addToCart(productWithQuantity);
    toast.success(`${quantity} ${quantity > 1 ? 'items' : 'item'} of ${pendingProduct.title} added to cart`);
    closeCartModal();
  };

  // Navigate to checkout
  const goToCheckout = () => {
    closeCartModal();
    window.location.href = '/checkout';
  };

  // Calculate discounted price if applicable
  const getPrice = () => {
    if (pendingProduct.discountPercentage) {
      const discountedPrice = pendingProduct.price - 
        (pendingProduct.price * (pendingProduct.discountPercentage / 100));
      return discountedPrice.toFixed(2);
    }
    return pendingProduct.price.toFixed(2);
  };

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <AnimatePresence>
      {isCartModalOpen && (
        // Modal overlay with animation
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Modal content with animation */}
          <motion.div 
            className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-md w-full"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-gray-900">Add to Cart</h3>
              <button 
                onClick={closeCartModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mt-4 flex items-center">
              <motion.div 
                className="w-20 h-20 flex-shrink-0 mr-4 rounded overflow-hidden"
                whileHover={{ scale: 1.05 }}
              >
                <img 
                  src={pendingProduct.thumbnail} 
                  alt={pendingProduct.title} 
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div>
                <h4 className="font-medium text-gray-900">{pendingProduct.title}</h4>
                <div className="flex items-center">
                  <p className="text-green-600 font-semibold">${getPrice()}</p>
                  {pendingProduct.discountPercentage && (
                    <>
                      <span className="ml-2 line-through text-gray-500">
                        ${pendingProduct.price.toFixed(2)}
                      </span>
                      <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                        {pendingProduct.discountPercentage.toFixed(0)}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Quantity selector */}
            <div className="mt-6">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center">
                <button 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="p-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max={maxStock}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="p-2 w-16 text-center border-t border-b border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= maxStock}
                  className="p-2 border border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <span className="ml-3 text-sm text-gray-500">
                  {maxStock > 0 ? `${maxStock} available` : 'Out of stock'}
                </span>
              </div>
            </div>
            
            {/* Cart summary if there are items already in cart */}
            {cartItems.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Current Cart:</span>
                  <span>{getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}</span>
                </div>
                <div className="flex justify-between text-sm font-medium mt-1">
                  <span>Subtotal:</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            )}
            
            <div className="mt-6 flex flex-col space-y-3">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeCartModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add to Cart
                </motion.button>
              </div>
              
              {/* Checkout button */}
              {cartItems.length > 0 && (
                <motion.button
                  onClick={goToCheckout}
                  className="w-full px-4 py-2 bg-green-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-green-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Cart & Checkout
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartModal;