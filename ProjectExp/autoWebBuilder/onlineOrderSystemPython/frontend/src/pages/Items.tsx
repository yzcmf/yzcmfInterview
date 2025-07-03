import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import axios from 'axios';

interface Item {
  id: number;
  title: string;
  description: string;
  price: number;
  created_at: string;
  owner: {
    username: string;
  };
}

const Items: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('/api/items/');
      setItems(response.data);
    } catch (err: any) {
      setError('Failed to fetch items');
    }
  };

  const handleOpen = (item?: Item) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        description: item.description || '',
        price: item.price.toString()
      });
    } else {
      setEditingItem(null);
      setFormData({ title: '', description: '', price: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingItem(null);
    setFormData({ title: '', description: '', price: '' });
    setError('');
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.price) {
      setError('Title and price are required');
      return;
    }

    setLoading(true);
    try {
      if (editingItem) {
        await axios.put(`/api/items/${editingItem.id}`, {
          title: formData.title,
          description: formData.description,
          price: parseInt(formData.price)
        });
      } else {
        await axios.post('/api/items/', {
          title: formData.title,
          description: formData.description,
          price: parseInt(formData.price)
        });
      }
      handleClose();
      fetchItems();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`/api/items/${id}`);
        fetchItems();
      } catch (err: any) {
        setError('Failed to delete item');
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Items Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
          >
            Add Item
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>${(item.price / 100).toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(item.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(item)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(item.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              variant="outlined"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Price (in cents)"
              fullWidth
              variant="outlined"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" disabled={loading}>
              {loading ? 'Saving...' : (editingItem ? 'Update' : 'Create')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Items; 