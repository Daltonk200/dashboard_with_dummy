// src/config/env.ts
export const ENV = {
  API_URL: import.meta.env.VITE_API_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME,
  IS_DEBUG: import.meta.env.VITE_DEBUG_MODE === 'true',
};