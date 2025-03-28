// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";
import { loginUser } from "../services/auth";
import { setupInterceptors } from "../utils/errorHandler";

// Expanded User Interface with Roles
interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'USER' | 'MANAGER';
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (credentials: { username: string; password: string }) => {
    try {
      const userData = await loginUser(credentials);
      setUser({
        ...userData,
        role: userData.role || 'USER',
        permissions: userData.permissions || []
      });
      
      // Setup axios interceptors after login
      setupInterceptors(logout);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    // Clear any stored tokens
    localStorage.removeItem('user_token');
  };

  const hasPermission = (permission: string) => {
    return user?.permissions.includes(permission) || 
           (user?.role === 'ADMIN' && true);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};