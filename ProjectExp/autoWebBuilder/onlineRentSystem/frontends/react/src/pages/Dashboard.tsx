import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api, User, Property, Booking } from '../lib/api';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      api.auth.getCurrentUser()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        });
    } else {
      window.location.href = '/login';
    }
  }, []);

  const { data: userProperties } = useQuery({
    queryKey: ['user-properties'],
    queryFn: () => api.properties.list(),
    enabled: !!user && user.role === 'house_holder',
  });

  const { data: userBookings } = useQuery({
    queryKey: ['user-bookings'],
    queryFn: () => api.bookings.list(),
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const pendingBookings = userBookings?.filter(booking => booking.status === 'pending') || [];
  const approvedBookings = userBookings?.filter(booking => booking.status === 'approved') || [];
  const totalEarnings = userProperties?.reduce((total, property) => {
    const propertyBookings = userBookings?.filter(booking => 
      booking.property_id === property.id && booking.status === 'approved'
    ) || [];
    return total + propertyBookings.reduce((sum, booking) => sum + booking.total_price, 0);
  }, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.full_name || user.username}!
          </h1>
          <p className="text-gray-600">
            {user.role === 'house_holder' ? 'Manage your properties and bookings' : 'Track your rental bookings'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">{userProperties?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{pendingBookings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Approved Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{approvedBookings.length}</p>
              </div>
            </div>
          </div>

          {user.role === 'house_holder' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">${totalEarnings.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Properties Section (for house holders) */}
          {user.role === 'house_holder' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">My Properties</h2>
                <Link
                  to="/properties"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Property
                </Link>
              </div>
              
              {userProperties && userProperties.length > 0 ? (
                <div className="space-y-4">
                  {userProperties.slice(0, 3).map((property: Property) => (
                    <div key={property.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{property.title}</h3>
                          <p className="text-sm text-gray-600">{property.city}, {property.state}</p>
                          <p className="text-sm text-green-600 font-semibold">${property.price_per_night}/night</p>
                        </div>
                        <Link
                          to={`/properties/${property.id}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                  {userProperties.length > 3 && (
                    <Link
                      to="/properties"
                      className="block text-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View all {userProperties.length} properties
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You haven't listed any properties yet.</p>
                  <Link
                    to="/properties"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    List Your First Property
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
              <Link
                to="/bookings"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View All
              </Link>
            </div>
            
            {userBookings && userBookings.length > 0 ? (
              <div className="space-y-4">
                {userBookings.slice(0, 5).map((booking: Booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {booking.property?.title || 'Property'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-green-600 font-semibold">${booking.total_price}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No bookings yet.</p>
                <Link
                  to="/properties"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Properties
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/properties"
              className="bg-blue-600 text-white p-4 rounded-lg text-center hover:bg-blue-700 transition-colors"
            >
              <div className="text-2xl mb-2">🏠</div>
              <div className="font-semibold">Browse Properties</div>
            </Link>
            <Link
              to="/bookings"
              className="bg-green-600 text-white p-4 rounded-lg text-center hover:bg-green-700 transition-colors"
            >
              <div className="text-2xl mb-2">📅</div>
              <div className="font-semibold">My Bookings</div>
            </Link>
            <Link
              to="/register"
              className="bg-purple-600 text-white p-4 rounded-lg text-center hover:bg-purple-700 transition-colors"
            >
              <div className="text-2xl mb-2">👤</div>
              <div className="font-semibold">Update Profile</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 