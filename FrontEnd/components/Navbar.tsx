import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  IconButton,
  Box
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';

interface NavbarProps {
  onCartClick: (show: boolean) => void;
  onAdminClick: (show: boolean) => void;
}

export const Navbar = ({ onCartClick, onAdminClick }: NavbarProps) => {
  const { totalItems } = useCart();

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          E-Commerce Store
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button color="inherit" onClick={() => onCartClick(false)}>
            Home
          </Button>
          
          <IconButton color="inherit" onClick={() => onCartClick(true)}>
            <Badge badgeContent={totalItems} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>

          <Button color="inherit" onClick={() => onAdminClick(true)}>
            Admin
          </Button>
          
          <Button color="inherit" href="/login">
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};