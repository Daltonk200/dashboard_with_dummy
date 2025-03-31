import React from 'react';
import { useCart } from '../../../contexts/CartContext';
import { motion } from 'framer-motion';

interface OrderSummaryProps {
  deliveryOption?: 'shipping' | 'pickup';
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ deliveryOption = 'shipping' }) => {
  const { cartItems, getTotalItems, getTotalPrice } = useCart();
  
  // Calculate subtotal (without discounts)
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Calculate discount amount
  const discountAmount = subtotal - getTotalPrice();
  
  // Calculate shipping cost (free over $50, otherwise $5.99)
  // If pickup is selected, shipping is free
  const shippingCost = deliveryOption === 'pickup' ? 0 : (getTotalPrice() > 50 ? 0 : 5.99);
  
  // Calculate tax (assume 8%)
  const taxRate = 0.08;
  const taxAmount = getTotalPrice() * taxRate;
  
  // Calculate final total
  const orderTotal = getTotalPrice() + shippingCost + taxAmount;

  return (
    <motion.div 
      className="bg-white p-6 rounded-lg shadow-md sticky top-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      {/* Item count */}
      <div className="text-sm text-gray-600 mb-4">
        {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
      </div>
      
      {/* Items list */}
      <div className="max-h-60 overflow-y-auto mb-4">
        {cartItems.map(item => (
          <motion.div 
            key={item.id} 
            className="flex py-3 border-b border-gray-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="ml-4 flex flex-1 flex-col">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <h3 className="line-clamp-1">{item.title}</h3>
                <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <div className="flex items-end justify-between text-sm">
                <p className="text-gray-500">Qty {item.quantity}</p>
                {item.discountPercentage && (
                  <p className="text-green-600">
                    {item.discountPercentage}% off
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Price calculations */}
      <div className="space-y-2 py-4">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        {discountAmount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>
            {deliveryOption === 'pickup' 
              ? 'Free (Pickup)' 
              : (shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`)}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Tax (8%)</span>
          <span>${taxAmount.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between pt-4 border-t border-gray-200 text-base font-medium">
          <span>Total</span>
          <span>${orderTotal.toFixed(2)}</span>
        </div>
      </div>
      
     
    </motion.div>
  );
};

export default OrderSummary;