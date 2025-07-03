import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Online Order System
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Welcome!
          </h2>
          <p className="text-gray-600 mb-4">
            This is a fullstack online order system built with React and Node.js.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>✅ React Frontend (Port 3000)</p>
            <p>✅ Node.js Backend (Port 5000)</p>
            <p>✅ JWT Authentication</p>
            <p>✅ Product Management</p>
            <p>✅ Order Processing</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 