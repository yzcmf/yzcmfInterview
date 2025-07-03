const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');

const router = express.Router();

// In-memory order storage (replace with database in production)
let orders = [];

// Create new order
router.post('/', auth, [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.productId').notEmpty().withMessage('Product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, shippingAddress, paymentMethod, notes } = req.body;
    const userId = req.user.userId;

    // Calculate total
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      // In a real app, you'd fetch product details from database
      const product = {
        id: item.productId,
        name: `Product ${item.productId}`,
        price: Math.random() * 20 + 5 // Mock price
      };

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      orderItems.push({
        productId: item.productId,
        productName: product.name,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal
      });
    }

    const order = {
      id: uuidv4(),
      userId,
      items: orderItems,
      total: parseFloat(total.toFixed(2)),
      status: 'pending',
      shippingAddress,
      paymentMethod,
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    orders.push(order);

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user orders
router.get('/', auth, (req, res) => {
  try {
    const userId = req.user.userId;
    const userOrders = orders.filter(order => order.userId === userId);
    
    res.json({
      orders: userOrders,
      total: userOrders.length
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get order by ID
router.get('/:id', auth, (req, res) => {
  try {
    const userId = req.user.userId;
    const order = orders.find(o => o.id === req.params.id && o.userId === userId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update order status (admin functionality)
router.put('/:id/status', auth, [
  body('status').isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid status')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const order = orders.find(o => o.id === req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    order.updatedAt = new Date();

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Cancel order
router.put('/:id/cancel', auth, (req, res) => {
  try {
    const userId = req.user.userId;
    const order = orders.find(o => o.id === req.params.id && o.userId === userId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status === 'delivered' || order.status === 'cancelled') {
      return res.status(400).json({ error: 'Order cannot be cancelled' });
    }

    order.status = 'cancelled';
    order.updatedAt = new Date();

    res.json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 