import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.full_name || user?.username}!
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  User Information
                </Typography>
                <Typography variant="body1">
                  <strong>Username:</strong> {user?.username}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {user?.email}
                </Typography>
                <Typography variant="body1">
                  <strong>Full Name:</strong> {user?.full_name || 'Not provided'}
                </Typography>
                <Typography variant="body1">
                  <strong>Role:</strong> {user?.is_superuser ? 'Admin' : 'User'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/items')}
                    fullWidth
                  >
                    Manage Items
                  </Button>
                  {user?.is_superuser && (
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/users')}
                      fullWidth
                    >
                      Manage Users
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Paper sx={{ mt: 4, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            About This Application
          </Typography>
          <Typography variant="body1" paragraph>
            This is a fullstack Python application built with FastAPI and React. 
            It provides user authentication, item management, and a modern web interface.
          </Typography>
          <Typography variant="body1">
            Features include:
          </Typography>
          <ul>
            <li>User registration and authentication</li>
            <li>JWT token-based security</li>
            <li>Item management with CRUD operations</li>
            <li>Responsive Material-UI design</li>
            <li>Role-based access control</li>
          </ul>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard; 