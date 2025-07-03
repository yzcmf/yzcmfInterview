import React, { useEffect, useState } from 'react';
import { api, User, Property, Booking } from '../lib/api';

type TabType = 'stats' | 'users' | 'properties' | 'bookings';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.admin.getStats(),
      api.admin.listUsers(),
      api.admin.listProperties(),
      api.admin.listBookings()
    ]).then(([statsData, usersData, propertiesData, bookingsData]) => {
      setStats(statsData);
      setUsers(usersData);
      setProperties(propertiesData);
      setBookings(bookingsData);
    }).finally(() => setLoading(false));
  }, []);

  const handleUserAction = async (userId: number, action: 'ban' | 'promote' | 'demote') => {
    try {
      const updates: any = {};
      if (action === 'ban') {
        updates.is_active = false;
      } else if (action === 'promote') {
        updates.is_admin = true;
      } else if (action === 'demote') {
        updates.is_admin = false;
      }
      
      await api.admin.updateUser(userId, updates);
      // Refresh users list
      const updatedUsers = await api.admin.listUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handlePropertyAction = async (propertyId: number, action: 'approve' | 'reject') => {
    try {
      const updates: any = {};
      if (action === 'approve') {
        updates.is_available = true;
      } else if (action === 'reject') {
        updates.is_available = false;
      }
      
      await api.admin.updateProperty(propertyId, updates);
      // Refresh properties list
      const updatedProperties = await api.admin.listProperties();
      setProperties(updatedProperties);
    } catch (error) {
      console.error('Failed to update property:', error);
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8">Loading admin dashboard...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Admin Dashboard</h2>
      
      {/* Tabs */}
      <div className="flex space-x-1 mb-8">
        {(['stats', 'users', 'properties', 'bookings'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-500 text-sm">Total Users</div>
            <div className="text-2xl font-bold">{stats.users || stats.total_users}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-500 text-sm">Total Properties</div>
            <div className="text-2xl font-bold">{stats.properties || stats.total_properties}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-500 text-sm">Total Bookings</div>
            <div className="text-2xl font-bold">{stats.bookings || stats.total_bookings}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-500 text-sm">Total Revenue</div>
            <div className="text-2xl font-bold">${stats.revenue || stats.total_revenue}</div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">User Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="px-4 py-3">{user.id}</td>
                    <td className="px-4 py-3">{user.username}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.role}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? 'Active' : 'Banned'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.is_admin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        {user.is_active ? (
                          <button
                            onClick={() => handleUserAction(user.id, 'ban')}
                            className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Ban
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUserAction(user.id, 'ban')}
                            className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Unban
                          </button>
                        )}
                        {!user.is_admin ? (
                          <button
                            onClick={() => handleUserAction(user.id, 'promote')}
                            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Promote
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUserAction(user.id, 'demote')}
                            className="px-2 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
                          >
                            Demote
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Properties Tab */}
      {activeTab === 'properties' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Property Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {properties.map(property => (
                  <tr key={property.id}>
                    <td className="px-4 py-3">{property.id}</td>
                    <td className="px-4 py-3">{property.title}</td>
                    <td className="px-4 py-3">{property.city}</td>
                    <td className="px-4 py-3">${property.price_per_night}/night</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        property.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {property.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        {property.is_available ? (
                          <button
                            onClick={() => handlePropertyAction(property.id, 'reject')}
                            className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Reject
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePropertyAction(property.id, 'approve')}
                            className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Booking Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Renter</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-in</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map(booking => (
                  <tr key={booking.id}>
                    <td className="px-4 py-3">{booking.id}</td>
                    <td className="px-4 py-3">{booking.property?.title}</td>
                    <td className="px-4 py-3">{booking.renter?.username}</td>
                    <td className="px-4 py-3">{new Date(booking.check_in_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">${booking.total_price}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        booking.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                        booking.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.payment_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin; 