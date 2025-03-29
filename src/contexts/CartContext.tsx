import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the structure for cart items
export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
  discountPercentage?: number;
}

// Define the Cart context structure
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isCartModalOpen: boolean;
  openCartModal: (product: Omit<CartItem, 'quantity'>) => void;
  closeCartModal: () => void;
  pendingProduct: Omit<CartItem, 'quantity'> | null;
}

// Create context with default values
const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getTotalItems: () => 0,
  getTotalPrice: () => 0,
  isCartModalOpen: false,
  openCartModal: () => {},
  closeCartModal: () => {},
  pendingProduct: null,
});

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

interface CartProviderProps {
  children: ReactNode;
}

// Cart Provider component
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // Initialize cart from localStorage if available
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // State for cart modal
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<Omit<CartItem, 'quantity'> | null>(null);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // If item already exists, increase quantity
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // If item doesn't exist, add it with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    closeCartModal();
  };

  // Remove item from cart
  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Get total number of items in cart
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Get total price of items in cart
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      // Apply discount if available
      if (item.discountPercentage) {
        const discountedPrice = item.price - (item.price * (item.discountPercentage / 100));
        return total + (discountedPrice * item.quantity);
      }
      return total + (item.price * item.quantity);
    }, 0);
  };

  // Open cart modal with pending product
  const openCartModal = (product: Omit<CartItem, 'quantity'>) => {
    setPendingProduct(product);
    setIsCartModalOpen(true);
  };

  // Close cart modal
  const closeCartModal = () => {
    setIsCartModalOpen(false);
    setPendingProduct(null);
  };

  // Context value
  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isCartModalOpen,
    openCartModal,
    closeCartModal,
    pendingProduct
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};