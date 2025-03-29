import React from 'react';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';

const CartModal: React.FC = () => {
  const { 
    isCartModalOpen, 
    closeCartModal, 
    pendingProduct, 
    addToCart 
  } = useCart();

  if (!isCartModalOpen || !pendingProduct) return null;

  const handleConfirm = () => {
    addToCart(pendingProduct);
    toast.success(`${pendingProduct.title} added to cart`);
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

  return (
    // Modal overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal content */}
      <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-md w-full">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-900">Add to Cart</h3>
          <button 
            onClick={closeCartModal}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mt-4 flex items-center">
          <div className="w-20 h-20 flex-shrink-0 mr-4 rounded overflow-hidden">
            <img 
              src={pendingProduct.thumbnail} 
              alt={pendingProduct.title} 
              className="w-full h-full object-cover"
            />
          </div>
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
        
        <div className="mt-6">
          <p className="text-sm text-gray-600">Add this item to your cart?</p>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={closeCartModal}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;