import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import OrderSummary from './components/orderSummary';
import PaymentConfirmation from './components/Paymentconfirmation';
import { motion } from 'framer-motion';

// Define checkout steps
enum CheckoutStep {
  DELIVERY_OPTION = 'delivery',
  SHIPPING_INFO = 'shipping',
  PAYMENT_INFO = 'payment',
  CONFIRMATION = 'confirmation'
}

// Define delivery options
enum DeliveryOption {
  SHIPPING = 'shipping',
  PICKUP = 'pickup'
}

// Define shipping info form data structure
interface ShippingInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  email: string;
  phone: string;
}

// Define payment info form data structure
interface PaymentInfo {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
}

const CheckoutPage: React.FC = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(CheckoutStep.DELIVERY_OPTION);
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>(DeliveryOption.SHIPPING);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  // Form state
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    email: '',
    phone: ''
  });
  
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: ''
  });

  // Handle shipping form changes
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle payment form changes
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle delivery option selection
  const handleDeliveryOptionSelect = (option: DeliveryOption) => {
    setDeliveryOption(option);
    if (option === DeliveryOption.PICKUP) {
      // Skip shipping info step for pickup
      setCurrentStep(CheckoutStep.PAYMENT_INFO);
    } else {
      setCurrentStep(CheckoutStep.SHIPPING_INFO);
    }
    window.scrollTo(0, 0);
  };

  // Submit shipping info and move to payment step
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(CheckoutStep.PAYMENT_INFO);
    window.scrollTo(0, 0);
  };

  // Submit payment info and move to confirmation step
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate a random order ID
    const newOrderId = `ORD-${Math.floor(Math.random() * 1000000)}`;
    setOrderId(newOrderId);
    setCurrentStep(CheckoutStep.CONFIRMATION);
    setOrderComplete(true);
    // Clear the cart after successful order
    clearCart();
    window.scrollTo(0, 0);
  };

  // If cart is empty and order not complete, show empty cart message
  if (cartItems.length === 0 && !orderComplete) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="mb-6">Add some products to your cart to checkout.</p>
          <a 
            href="/" 
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Checkout header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
        
        {/* Progress indicator */}
        {!orderComplete && (
          <div className="flex items-center mt-6 overflow-x-auto">
            <div className={`flex items-center ${currentStep === CheckoutStep.DELIVERY_OPTION ? 'text-blue-600' : 'text-gray-500'}`}>
              <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${currentStep === CheckoutStep.DELIVERY_OPTION ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                1
              </div>
              <span className="ml-2 whitespace-nowrap">Delivery Option</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div className={`h-full ${currentStep !== CheckoutStep.DELIVERY_OPTION ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            </div>
            
            {deliveryOption === DeliveryOption.SHIPPING && (
              <>
                <div className={`flex items-center ${currentStep === CheckoutStep.SHIPPING_INFO ? 'text-blue-600' : 'text-gray-500'}`}>
                  <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${currentStep === CheckoutStep.SHIPPING_INFO ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                    2
                  </div>
                  <span className="ml-2 whitespace-nowrap">Shipping</span>
                </div>
                <div className="flex-1 h-1 mx-4 bg-gray-200">
                  <div className={`h-full ${currentStep === CheckoutStep.PAYMENT_INFO || currentStep === CheckoutStep.CONFIRMATION ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                </div>
              </>
            )}
            
            <div className={`flex items-center ${currentStep === CheckoutStep.PAYMENT_INFO ? 'text-blue-600' : 'text-gray-500'}`}>
              <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${currentStep === CheckoutStep.PAYMENT_INFO ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                {deliveryOption === DeliveryOption.SHIPPING ? '3' : '2'}
              </div>
              <span className="ml-2 whitespace-nowrap">Payment</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div className={`h-full ${currentStep === CheckoutStep.CONFIRMATION ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            </div>
            <div className={`flex items-center ${currentStep === CheckoutStep.CONFIRMATION ? 'text-blue-600' : 'text-gray-500'}`}>
              <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${currentStep === CheckoutStep.CONFIRMATION ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                {deliveryOption === DeliveryOption.SHIPPING ? '4' : '3'}
              </div>
              <span className="ml-2 whitespace-nowrap">Confirmation</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Main checkout form */}
        <div className="md:w-2/3">
          {currentStep === CheckoutStep.DELIVERY_OPTION && (
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4">Choose Delivery Option</h2>
              <div className="space-y-4">
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    deliveryOption === DeliveryOption.SHIPPING 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setDeliveryOption(DeliveryOption.SHIPPING)}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border ${
                      deliveryOption === DeliveryOption.SHIPPING 
                        ? 'border-blue-500' 
                        : 'border-gray-400'
                    } flex items-center justify-center mr-3`}>
                      {deliveryOption === DeliveryOption.SHIPPING && (
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">Ship to my address</h3>
                      <p className="text-sm text-gray-500">Get your items delivered to your door</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    deliveryOption === DeliveryOption.PICKUP 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setDeliveryOption(DeliveryOption.PICKUP)}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border ${
                      deliveryOption === DeliveryOption.PICKUP 
                        ? 'border-blue-500' 
                        : 'border-gray-400'
                    } flex items-center justify-center mr-3`}>
                      {deliveryOption === DeliveryOption.PICKUP && (
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">Pickup at store</h3>
                      <p className="text-sm text-gray-500">Collect your items from our store</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <motion.button
                  onClick={() => handleDeliveryOptionSelect(deliveryOption)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Continue
                </motion.button>
              </div>
            </motion.div>
          )}

          {currentStep === CheckoutStep.SHIPPING_INFO && (
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <form onSubmit={handleShippingSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleShippingChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleShippingChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleShippingChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleShippingChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleShippingChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(CheckoutStep.DELIVERY_OPTION)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  <motion.button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Continue to Payment
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}

          {currentStep === CheckoutStep.PAYMENT_INFO && (
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
              <form onSubmit={handlePaymentSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentInfo.cardNumber}
                      onChange={handlePaymentChange}
                      placeholder="1234 5678 9012 3456"
                      required
                      maxLength={19}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      name="cardholderName"
                      value={paymentInfo.cardholderName}
                      onChange={handlePaymentChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={paymentInfo.expiryDate}
                        onChange={handlePaymentChange}
                        placeholder="MM/YY"
                        required
                        maxLength={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={paymentInfo.cvv}
                        onChange={handlePaymentChange}
                        required
                        maxLength={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(deliveryOption === DeliveryOption.SHIPPING ? CheckoutStep.SHIPPING_INFO : CheckoutStep.DELIVERY_OPTION)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  <motion.button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Complete Order
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}

          {currentStep === CheckoutStep.CONFIRMATION && (
            <PaymentConfirmation 
              orderId={orderId} 
              shippingInfo={shippingInfo}
              deliveryOption={deliveryOption}
            />
          )}
        </div>

        {/* Order summary - only show when not on confirmation page */}
        {currentStep !== CheckoutStep.CONFIRMATION && (
          <div className="md:w-1/3">
            <OrderSummary deliveryOption={deliveryOption} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;