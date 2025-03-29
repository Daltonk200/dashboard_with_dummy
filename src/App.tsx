// src/App.tsx
import React from 'react';
import AppRouter from './router';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import CartModal from './components/CartModal';
import './index.css';

const App: React.FC = () => {
  return (
    // <BrowserRouter>
    <CartProvider>
    <div className="min-h-screen w-[100vw] ">
      <CartModal/>
      <AppRouter />
    </div>
    </CartProvider>
    // </BrowserRouter>
  );
};

export default App;