import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, User } from '../lib/api';
import { FaEnvelope } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      api.auth.getCurrentUser()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('auth_token');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      api.messages.getUnreadCount()
        .then(res => setUnreadCount(res.unread_count))
        .catch(() => setUnreadCount(0));
    }
  }, [user]);

  const handleLogout = async () => {
    await api.auth.logout();
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">HouseRent</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
              Home
            </Link>
            <Link to="/properties" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
              Properties
            </Link>
            {user && (
              <>
                <Link to="/bookings" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
                  My Bookings
                </Link>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
                  Dashboard
                </Link>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {!isLoading && (
              <>
                {user && (
                  <Link to="/messages" className="relative">
                    <FaEnvelope className="text-2xl text-gray-700 hover:text-blue-600 transition-colors duration-200" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                )}
                {user ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700 font-medium">
                      Welcome, {user.full_name || user.username}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 