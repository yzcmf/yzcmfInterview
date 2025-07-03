# Fullstack Python Application

A modern fullstack web application built with **FastAPI** (Python backend) and **React** (TypeScript frontend).

## 🚀 Features

- **Backend (FastAPI)**
  - RESTful API with automatic documentation
  - JWT-based authentication
  - SQLAlchemy ORM with SQLite database
  - Password hashing with bcrypt
  - Role-based access control
  - CORS support

- **Frontend (React + TypeScript)**
  - Modern Material-UI design
  - Type-safe development
  - Responsive layout
  - Protected routes
  - Form validation
  - Real-time data management

- **Core Functionality**
  - User registration and authentication
  - Item management (CRUD operations)
  - User profile management
  - Admin dashboard
  - Secure API endpoints

## 📁 Project Structure

```
onlineOrderSystemPython/
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── database.py          # Database configuration
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── auth.py              # Authentication utilities
│   └── routers/
│       ├── __init__.py
│       ├── auth.py          # Authentication routes
│       ├── users.py         # User management routes
│       └── items.py         # Item management routes
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── Items.tsx
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── index.css
│   └── package.json
├── requirements.txt         # Python dependencies
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the backend server:**
   ```bash
   cd backend
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

The API will be available at `http://localhost:8001`
API documentation: `http://localhost:8001/docs`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3001`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./app.db
```

### Database

The application uses SQLite by default. The database file (`app.db`) will be created automatically when you first run the application.

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/` - List users (admin only)
- `GET /api/users/{user_id}` - Get user details
- `PUT /api/users/{user_id}` - Update user
- `DELETE /api/users/{user_id}` - Delete user

### Items
- `GET /api/items/` - List user's items
- `POST /api/items/` - Create new item
- `GET /api/items/{item_id}` - Get item details
- `PUT /api/items/{item_id}` - Update item
- `DELETE /api/items/{item_id}` - Delete item
- `GET /api/items/admin/all` - List all items (admin only)

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcrypt
- CORS protection
- Role-based access control
- Input validation with Pydantic
- SQL injection protection with SQLAlchemy

## 🎨 Frontend Features

- Material-UI components
- Responsive design
- Form validation
- Error handling
- Loading states
- Protected routes
- User context management

## 🚀 Deployment

### Backend Deployment

1. **Using Docker:**
   ```dockerfile
   FROM python:3.9
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY backend/ .
   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
   ```

2. **Using Heroku:**
   - Add `Procfile` with: `web: uvicorn main:app --host 0.0.0.0 --port 8001`
   - Set environment variables in Heroku dashboard

### Frontend Deployment

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify/Vercel:**
   - Connect your repository
   - Set build command: `npm run build`
   - Set publish directory: `build`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Happy Coding! 🎉** 