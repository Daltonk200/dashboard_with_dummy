// src/services/api.ts
import axios from "axios";
import { handleApiError } from "../utils/errorHandler";

const API_URL = "https://dummyjson.com";

// Base API client with error handling
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
});

// Product-specific API calls with error handling
export const productService = {
  async fetchProducts(page = 1, limit = 10) {
    try {
      const response = await apiClient.get(`/products`, {
        params: { skip: (page - 1) * limit, limit }
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  async getProductDetails(id: number) {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  async searchProducts(query: string) {
    try {
      const response = await apiClient.get(`/products/search`, {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  async getProductCategories() {
    try {
      const response = await apiClient.get(`/products/categories`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
};

// Similar pattern for other resources like comments, users, etc.
export const commentService = {
  async fetchComments(page = 1, limit = 10) {
    try {
      const response = await apiClient.get(`/comments`, {
        params: { skip: (page - 1) * limit, limit }
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  async getProductComments(productId: number) {
    try {
      const response = await apiClient.get(`/comments/post/${productId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
};

export const userService = {
  async fetchUsers(page = 1, limit = 10) {
    try {
      const response = await apiClient.get(`/users`, {
        params: { skip: (page - 1) * limit, limit }
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  async getUserDetails(id: number) {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
};

export const cartService = {
  async fetchCarts(page = 1, limit = 10) {
    try {
      const response = await apiClient.get(`/carts`, {
        params: { skip: (page - 1) * limit, limit }
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
};
