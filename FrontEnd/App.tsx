

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Auth } from './Auth';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { CartProvider } from './contexts/CartContext';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { CartPage } from './pages/CartPage';
import { AdminPage } from './pages/AdminPage';
import { Container, Grid } from '@mui/material';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [showCart, setShowCart] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const API_BASE_URL = 'http://localhost:7000/api';

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <Navbar onCartClick={setShowCart} onAdminClick={setShowAdmin} />
        <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
          {error && (
            <div style={{ color: 'red', marginBottom: '1rem' }}>
              ERROR: {error}
            </div>
          )}

          {!token ? (
            <Auth onLoginSuccess={handleLoginSuccess} />
          ) : (
            <div>
              <p>
                Logged in.{' '}
                <button onClick={handleLogout}>Logout</button>
              </p>
            </div>
          )}

          {showCart ? (
            <CartPage />
          ) : showAdmin ? (
            <AdminPage />
          ) : (
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid key={product.id} xs={12} sm={6} md={4}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;