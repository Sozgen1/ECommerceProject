import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
  Box
} from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
        }
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={`https://source.unsplash.com/400x400/?${product.name.toLowerCase()}`}
        alt={product.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" color="primary">
            ${product.price.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Stock: {product.stockQuantity}
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button 
          fullWidth 
          variant="contained" 
          startIcon={<AddShoppingCart />}
          onClick={() => addToCart(product)}
          disabled={product.stockQuantity === 0}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};