import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api, Booking } from '../lib/api';

const Payment: React.FC = () => {
  const [searchParams] = useSearchParams();
  const bookingId = Number(searchParams.get('booking_id'));
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!bookingId) {
      setError('No booking ID provided.');
      setLoading(false);
      return;
    }
    api.bookings.getById(bookingId)
      .then(setBooking)
      .catch(() => setError('Booking not found.'))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handlePayNow = async () => {
    if (!booking) return;
    setPaying(true);
    try {
      // For demo, just call the backend and mark as paid
      await api.payments.createIntent(booking.id, booking.total_price);
      setPaid(true);
      // Optionally, update booking status in backend here
    } catch (e) {
      setError('Payment failed.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8">Loading payment...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-600">{error}</div>;
  if (!booking) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Payment for Booking #{booking.id}</h2>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="mb-2"><b>Property:</b> {booking.property?.title}</div>
        <div className="mb-2"><b>Check-in:</b> {new Date(booking.check_in_date).toLocaleDateString()}</div>
        <div className="mb-2"><b>Check-out:</b> {new Date(booking.check_out_date).toLocaleDateString()}</div>
        <div className="mb-2"><b>Total Price:</b> ${booking.total_price}</div>
        <div className="mb-2"><b>Payment Status:</b> {paid ? 'Paid' : booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}</div>
      </div>
      {paid || booking.payment_status === 'paid' ? (
        <div className="bg-green-100 text-green-800 p-4 rounded mb-4">Payment complete! Thank you.</div>
      ) : (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <h3 className="font-semibold mb-2">Pay with Stripe (Demo)</h3>
          <button
            onClick={handlePayNow}
            disabled={paying}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
          >
            {paying ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      )}
      <button
        onClick={() => navigate('/bookings')}
        className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        Back to Bookings
      </button>
    </div>
  );
};

export default Payment; 