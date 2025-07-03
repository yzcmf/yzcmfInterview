const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Sample product data (replace with database in production)
let products = [
  {
    id: '1',
    name: 'Premium Coffee',
    description: 'Rich and aromatic coffee beans from Colombia',
    price: 12.99,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    stock: 50,
    rating: 4.5
  },
  {
    id: '2',
    name: 'Organic Bread',
    description: 'Freshly baked organic whole grain bread',
    price: 4.99,
    category: 'Bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
    stock: 25,
    rating: 4.2
  },
  {
    id: '3',
    name: 'Fresh Milk',
    description: 'Farm-fresh whole milk',
    price: 3.49,
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
    stock: 30,
    rating: 4.0
  },
  {
    id: '4',
    name: 'Organic Apples',
    description: 'Sweet and crisp organic apples',
    price: 5.99,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
    stock: 40,
    rating: 4.3
  },
  {
    id: '5',
    name: 'Chicken Breast',
    description: 'Fresh boneless chicken breast',
    price: 8.99,
    category: 'Meat',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400',
    stock: 20,
    rating: 4.1
  },
  {
    id: '6',
    name: 'Pasta Sauce',
    description: 'Homemade marinara sauce',
    price: 2.99,
    category: 'Pantry',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400',
    stock: 35,
    rating: 4.4
  }
];

// Get all products
router.get('/', (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let filteredProducts = [...products];

    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Search by name or description
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }

    // Sort products
    if (sort) {
      switch (sort) {
        case 'price-low':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'name':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }
    }

    res.json({
      products: filteredProducts,
      total: filteredProducts.length
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get product by ID
router.get('/:id', (req, res) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get product categories
router.get('/categories/list', (req, res) => {
  try {
    const categories = [...new Set(products.map(product => product.category))];
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 