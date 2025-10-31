
import axios from 'axios';
// Fix: Corrected import path for Product type.
import { Product } from '../types';

// The gateway is running on port 7000 as defined in docker-compose.yml
const API_BASE_URL = 'http://localhost:7000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const getProducts = async (): Promise<Product[]> => {
  try {
    // In a real app, this would fetch from '/products'
    // For now, returning mock data to demonstrate UI.
    console.log("Fetching products...");
    // const response = await apiClient.get('/products');
    // return response.data;
    
    // Mock data
    return Promise.resolve([
      { id: 1, name: 'Quantum Laptop', description: 'Next-gen laptop with quantum processor.', price: 2499.99, imageUrl: 'https://picsum.photos/seed/laptop/400/300', stock: 15 },
      { id: 2, name: 'Chrono Watch', description: 'A stylish watch that manipulates time.', price: 899.50, imageUrl: 'https://picsum.photos/seed/watch/400/300', stock: 30 },
      { id: 3, name: 'Cyber Sneakers', description: 'Light-up sneakers for the modern era.', price: 299.00, imageUrl: 'https://picsum.photos/seed/sneakers/400/300', stock: 50 },
      { id: 4, name: 'AI-Powered Headphones', description: 'Crystal clear audio with adaptive AI.', price: 450.00, imageUrl: 'https://picsum.photos/seed/headphones/400/300', stock: 25 },
      { id: 5, name: 'Smart Coffee Mug', description: 'Keeps your coffee at the perfect temperature.', price: 120.00, imageUrl: 'https://picsum.photos/seed/mug/400/300', stock: 100 },
      { id: 6, name: 'Holographic Desk Lamp', description: 'Project 3D holograms on your desk.', price: 350.00, imageUrl: 'https://picsum.photos/seed/lamp/400/300', stock: 20 },
    ]);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    // Return empty array or throw error for the component to handle
    return [];
  }
};

// Add loginUser, registerUser functions here
// e.g., export const loginUser = async (credentials) => { ... }