// src/utils/errorHandler.ts
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

export const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    // Handle specific error scenarios
    switch (axiosError.response?.status) {
      case 400:
        toast.error('Bad Request: Invalid data submitted');
        break;
      case 401:
        toast.error('Unauthorized: Please log in again');
        // Potential auto-logout logic
        break;
      case 403:
        toast.error('Forbidden: You do not have permission');
        break;
      case 404:
        toast.error('Not Found: Resource does not exist');
        break;
      case 500:
        toast.error('Server Error: Please try again later');
        break;
      default:
        toast.error('An unexpected error occurred');
    }
  } else {
    // Handle non-axios errors
    toast.error(error.message || 'An unknown error occurred');
  }

  // Log error for debugging
  console.error('API Error:', error);
};

// Axios Interceptor Setup
export const setupInterceptors = (logout: () => void) => {
  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        // Automatic logout on token expiration
        logout();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};