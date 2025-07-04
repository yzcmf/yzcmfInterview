import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Booking } from '../lib/api';
import { useNavigate } from 'react-router-dom';

const Bookings: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => api.bookings.list(),
  });

  const updateBookingMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: any }) => 
      api.bookings.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  const handleStatusUpdate = (bookingId: number, newStatus: string) => {
    updateBookingMutation.mutate({
      id: bookingId,
      updates: { status: newStatus as any }
    });
  };

  const filteredBookings = bookings?.filter(booking => 
    selectedStatus === 'all' || booking.status === selectedStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) return <div className="container mx-auto px-4 py-8">Loading bookings...</div>;
  if (error) return <div className="container mx-auto px-4 py-8">Error loading bookings</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      {/* Status Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Filter by Status</h2>
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'approved', 'rejected', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {filteredBookings?.map((booking: Booking) => (
          <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Property Info */}
              <div className="md:col-span-2">
                <h3 className="text-xl font-semibold mb-2">
                  {booking.property?.title || 'Property'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {booking.property?.address}, {booking.property?.city}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-500">Check-in</div>
                    <div className="font-medium">
                      {new Date(booking.check_in_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Check-out</div>
                    <div className="font-medium">
                      {new Date(booking.check_out_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Guests</div>
                    <div className="font-medium">{booking.guest_count}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Total Price</div>
                    <div className="font-medium text-green-600">${booking.total_price}</div>
                  </div>
                </div>

                {booking.special_requests && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-500">Special Requests</div>
                    <div className="text-gray-700">{booking.special_requests}</div>
                  </div>
                )}
              </div>

              {/* Status and Actions */}
              <div className="md:col-span-1">
                <div className="flex flex-col items-end space-y-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                  {/* Payment Status */}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                    booking.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    Payment: {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                  </span>
                  
                  <div className="text-sm text-gray-500">
                    Booked on {new Date(booking.created_at).toLocaleDateString()}
                  </div>

                  {/* Action Buttons */}
                  {booking.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(booking.id, 'approved')}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {booking.status === 'approved' && (
                    <button
                      onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  )}

                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                      Cancel Request
                    </button>
                  )}

                  {/* Pay Now Button */}
                  {booking.payment_status === 'pending' && booking.status === 'approved' && (
                    <button
                      onClick={() => navigate(`/payment?booking_id=${booking.id}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBookings?.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No bookings found.</p>
        </div>
      )}
    </div>
  );
};

export default Bookings; 