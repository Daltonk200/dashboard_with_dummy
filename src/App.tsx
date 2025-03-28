// src/App.tsx
import React from 'react';
import AppRouter from './router';

const App: React.FC = () => {
  return (
    <div className="min-h-screen w-[100vw] bg-gray-100">
      <AppRouter />
    </div>
  );
};

export default App;