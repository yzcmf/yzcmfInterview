#!/bin/bash

echo "🚀 Setting up Fullstack Python Application..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Create virtual environment
echo "📦 Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "📥 Installing Python dependencies..."
pip install -r requirements.txt

# Install Node.js dependencies
echo "📥 Installing Node.js dependencies..."
cd frontend
npm install
cd ..

echo "✅ Setup completed successfully!"
echo ""
echo "🎉 To start the application:"
echo ""
echo "1. Start the backend server:"
echo "   source venv/bin/activate"
echo "   python run_backend.py"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "🌐 Backend API: http://localhost:8001"
echo "📚 API Docs: http://localhost:8001/docs"
echo "🎨 Frontend: http://localhost:3001"
echo ""
echo "Happy coding! 🚀" 