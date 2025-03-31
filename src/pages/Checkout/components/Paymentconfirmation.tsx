import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface PaymentConfirmationProps {
  orderId: string;
  shippingInfo: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    email: string;
  };
  deliveryOption: 'shipping' | 'pickup';
}

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({ 
  orderId, 
  shippingInfo,
  deliveryOption
}) => {
  // Generate a random delivery date (5-7 days from now)
  const getEstimatedDeliveryDate = () => {
    const today = new Date();
    const deliveryDays = Math.floor(Math.random() * 3) + 5; // 5-7 days
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + deliveryDays);
    
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div 
      className="bg-white p-6 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-6">
        <motion.div 
          className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <motion.h2 
          className="text-2xl font-bold text-gray-900"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Thank you for your order!
        </motion.h2>
        <motion.p 
          className="text-gray-600 mt-1"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Your order has been received and is being processed.
        </motion.p>
      </div>
      
      <motion.div 
        className="border-t border-b border-gray-200 py-4 my-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex justify-between mb-2">
          <span className="font-medium">Order Number:</span>
          <span>{orderId}</span>
        </div>
        {deliveryOption === 'shipping' && (
          <div className="flex justify-between">
            <span className="font-medium">Estimated Delivery:</span>
            <span>{getEstimatedDeliveryDate()}</span>
          </div>
        )}
        {deliveryOption === 'pickup' && (
          <div className="flex justify-between">
            <span className="font-medium">Pickup Available:</span>
            <span>Within 24 hours</span>
          </div>
        )}
      </motion.div>
      
      {deliveryOption === 'shipping' && (
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="font-semibold text-lg mb-3">Shipping Address</h3>
          <address className="not-italic">
            {shippingInfo.firstName} {shippingInfo.lastName}<br />
            {shippingInfo.address}<br />
            {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
          </address>
        </motion.div>
      )}
      
      {deliveryOption === 'pickup' && (
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="font-semibold text-lg mb-3">Pickup Information</h3>
          <p className="text-gray-700">
            Please bring your ID and order number when you come to pick up your order.
          </p>
          <div className="mt-2 p-3 bg-blue-50 rounded-md">
            <p className="font-medium">Store Address:</p>
            <p className="text-gray-700">
              123 Main Street<br />
              Anytown, ST 12345
            </p>
            <p className="mt-2 font-medium">Store Hours:</p>
            <p className="text-gray-700">
              Monday - Friday: 9am - 8pm<br />
              Saturday: 10am - 6pm<br />
              Sunday: 12pm - 5pm
            </p>
          </div>
        </motion.div>
      )}
      
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h3 className="font-semibold text-lg mb-3">Order Updates</h3>
        <p className="text-gray-600">
          We'll send order updates to <strong>{shippingInfo.email}</strong>
        </p>
      </motion.div>
      
      <motion.div 
        className="flex flex-col sm:flex-row justify-center gap-4 mt-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Link 
          to="/dashboard"
          className="bg-blue-600 text-white px-6 py-3 rounded-md text-center hover:bg-blue-700 transition"
        >
          Continue Shopping
        </Link>
        <button 
          onClick={() => window.print()}
          className="bg-gray-100 text-gray-800 px-6 py-3 rounded-md text-center hover:bg-gray-200 transition"
        >
          Print Receipt
        </button>
      </motion.div>
    </motion.div>
  );
};

export default PaymentConfirmation;