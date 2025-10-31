

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Auth } from './Auth'; 

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0, stockQuantity: 0 });
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  // The gateway address (as seen from the browser)
  const API_BASE_URL = 'http://localhost:7000/api';

  // Runs when the token changes (login/logout)
  useEffect(() => {
    fetchProducts();
  }, [token]); 

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError('An error occurred while loading products.');
      console.error('Fetch error:', err);
    }
  };

  const handleLoginSuccess = () => {
    setToken(localStorage.getItem('token'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const getAuthHeaders = () => {
    return {
      'Authorization': `Bearer ${token}`
    };
  };

  // Fix: The type React.FormEvent requires 'React' to be imported.
  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('You must be logged in to add a product.');
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/products`, newProduct, { headers: getAuthHeaders() });
      setProducts([...products, response.data]);
      setNewProduct({ name: '', description: '', price: 0, stockQuantity: 0 }); // Clear the form
      setError(null);
    } catch (err) {
      setError('An error occurred while adding the product (Authorization check?).');
      console.error('Add product error:', err);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!token) {
      setError('You must be logged in to delete a product.');
      return;
    }
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`, { headers: getAuthHeaders() });
      setProducts(products.filter(p => p.id !== id));
      setError(null);
    } catch (err) {
      setError('An error occurred while deleting the product (Authorization check?).');
      console.error('Delete product error:', err);
    }
  };

  return (
    <div>
      <h1>E-Commerce Product Management (Docker Compose)</h1>
      {error && <p style={{ color: 'red' }}>ERROR: {error}</p>}

      {!token ? (
        // IF NOT LOGGED IN: show the Auth component
        <Auth onLoginSuccess={handleLoginSuccess} />
      ) : (
        // IF LOGGED IN:
        <div>
          <p>Logged in. <button onClick={handleLogout}>Logout</button></p>
          <hr />
          <form onSubmit={addProduct}>
            <h3>Add New Product</h3>
            <input type="text" placeholder="Product Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required />
            <input type="text" placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
            <input type="number" placeholder="Price" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })} />
            <input type="number" placeholder="Stock" value={newProduct.stockQuantity} onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: parseInt(e.target.value) || 0 })} />
            <button type="submit">Add Product</button>
          </form>
        </div>
      )}

      <hr />
      <h2>Products ({products.length})</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <strong>{product.name}</strong> (${product.price}) - Stock: {product.stockQuantity}
            {token && ( // Only show delete button if logged in
              <button onClick={() => deleteProduct(product.id)} style={{ marginLeft: '10px' }}>
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;