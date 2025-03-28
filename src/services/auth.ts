// src/services/auth.ts
import axios from "axios";

export const loginUser = async (credentials: { 
  username: string; 
  password: string 
}) => {
  const response = await axios.post(
    "https://dummyjson.com/auth/login", 
    credentials
  );
  return response.data;
};