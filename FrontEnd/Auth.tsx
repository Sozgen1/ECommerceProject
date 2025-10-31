
import React, { useState } from 'react';
import axios from 'axios';

// The base address of our API Gateway
// NOTE: Even though we are in Docker, this address must be 'localhost' because it runs in the browser.
const API_URL = 'http://localhost:7000/api/auth';

interface AuthProps {
  onLoginSuccess: () => void; // Notifies App.tsx when login is successful
}

export const Auth = ({ onLoginSuccess }: AuthProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState(''); 
    const [message, setMessage] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/register`, { username, email, password });
            setMessage('Registration successful! You can now log in.');
            console.log('Registration response:', response.data);
        } catch (error) {
            setMessage('Registration failed.');
            console.error('Registration error:', error);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/login`, { username, password });
            
            const token = response.data.token;
            localStorage.setItem('token', token); // Save the token to browser storage
            
            setMessage(`Login successful! Welcome, ${response.data.username}.`);
            onLoginSuccess(); // Notify App.tsx
        } catch (error) {
            setMessage('Login failed. Incorrect username or password.');
            console.error('Login error:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleRegister} style={{ padding: '10px' }}>
                <h3>Register</h3>
                {/* Fix: Corrected typo from e.targe.value to e.target.value */}
                <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required /><br />
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required /><br />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br />
                <button type="submit">Register</button>
            </form>
            <hr />
            <form onSubmit={handleLogin} style={{ padding: '10px' }}>
                <h3>Login</h3>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required /><br />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br />
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};