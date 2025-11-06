
import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  Alert,
  Stack
} from '@mui/material';

const API_URL = 'http://localhost:7000/api/auth';

interface AuthProps {
  onLoginSuccess: () => void;
}

export const Auth = ({ onLoginSuccess }: AuthProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/register`, { username, email, password });
      setMessage('Registration successful! You can now log in.');
      setError('');
      console.log('Registration response:', response.data);
    } catch (err) {
      setError('Registration failed.');
      setMessage('');
      console.error('Registration error:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      setMessage(`Login successful! Welcome, ${response.data.username}.`);
      setError('');
      onLoginSuccess();
    } catch (err) {
      setError('Login failed. Incorrect username or password.');
      setMessage('');
      console.error('Login error:', err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Stack spacing={3}>
        {/* Register Form */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Register
          </Typography>
          <Box
            component="form"
            onSubmit={handleRegister}
            sx={{ mt: 2 }}
          >
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
              >
                Register
              </Button>
            </Stack>
          </Box>
        </Paper>

        <Divider />

        {/* Login Form */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ mt: 2 }}
          >
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                color="primary"
              >
                Login
              </Button>
            </Stack>
          </Box>
        </Paper>

        {/* Messages */}
        {message && (
          <Alert severity="success">
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}
      </Stack>
    </Container>
  );
};