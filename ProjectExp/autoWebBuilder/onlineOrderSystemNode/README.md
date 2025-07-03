# Online Order System - Fullstack Application

A modern fullstack online order system built with React frontend and Node.js/Express backend.

## Features

- **Frontend (React)**
  - Modern, responsive UI with Tailwind CSS
  - Product catalog with search and filtering
  - Shopping cart functionality
  - User authentication (login/register)
  - Order management
  - Real-time order status updates

- **Backend (Node.js/Express)**
  - RESTful API endpoints
  - User authentication with JWT
  - Product management
  - Order processing
  - Data validation
  - Security middleware

## Tech Stack

- **Frontend**: React, Tailwind CSS, Axios
- **Backend**: Node.js, Express, JWT, bcryptjs
- **Development**: Concurrently, Nodemon

## Quick Start

1. **Install dependencies:**
   ```bash
   npm run install-all
   ```

2. **Start development servers:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Project Structure

```
onlineOrderSystem/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── server/                 # Node.js backend
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   └── index.js
├── package.json
└── README.md
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `PUT /api/orders/:id` - Update order status

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend
- `npm run build` - Build the frontend for production
- `npm start` - Start the production server 