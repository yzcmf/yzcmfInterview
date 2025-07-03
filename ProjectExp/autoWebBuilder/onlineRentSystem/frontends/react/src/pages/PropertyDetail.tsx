import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Property, Booking } from '../lib/api';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [bookingData, setBookingData] = useState({
    check_in_date: '',
    check_out_date: '',
    guest_count: 1,
    special_requests: '',
  });

  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: () => api.properties.getById(Number(id)),
  });

  const { data: reviews } = useQuery({
    queryKey: ['property-reviews', id],
    queryFn: () => api.properties.getReviews(Number(id)),
  });

  const createBookingMutation = useMutation({
    mutationFn: (data: typeof bookingData) => api.bookings.create({
      ...data,
      property_id: Number(id),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      alert('Booking request submitted successfully!');
      setBookingData({
        check_in_date: '',
        check_out_date: '',
        guest_count: 1,
        special_requests: '',
      });
    },
    onError: (error: any) => {
      alert(`Booking failed: ${error.response?.data?.detail || 'Unknown error'}`);
    },
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBookingMutation.mutate(bookingData);
  };

  if (isLoading) return <div className="container mx-auto px-4 py-8">Loading property...</div>;
  if (error) return <div className="container mx-auto px-4 py-8">Error loading property</div>;
  if (!property) return <div className="container mx-auto px-4 py-8">Property not found</div>;

  const images = property.images ? JSON.parse(property.images) : [];
  const amenities = property.amenities ? JSON.parse(property.amenities) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Property Details */}
        <div className="lg:col-span-2">
          {/* Images */}
          <div className="mb-6">
            <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
              {images.length > 0 ? (
                <img
                  src={images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No Image Available
                </div>
              )}
            </div>
          </div>

          {/* Property Info */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
            <p className="text-gray-600 mb-4">{property.address}, {property.city}, {property.state} {property.zip_code}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{property.bedrooms}</div>
                <div className="text-gray-600">Bedrooms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{property.bathrooms}</div>
                <div className="text-gray-600">Bathrooms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{property.max_guests}</div>
                <div className="text-gray-600">Max Guests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{property.property_type}</div>
                <div className="text-gray-600">Type</div>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-700 mb-6">{property.description}</p>

            {amenities.length > 0 && (
              <>
                <h2 className="text-xl font-semibold mb-3">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
                  {amenities.map((amenity: string, index: number) => (
                    <div key={index} className="flex items-center text-gray-700">
                      <span className="mr-2">✓</span>
                      {amenity}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>
            {reviews && reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="text-yellow-400 mr-2">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                        <span className="font-semibold">{review.author?.full_name || 'Anonymous'}</span>
                      </div>
                      <span className="text-gray-500 text-sm">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <div className="text-3xl font-bold text-green-600 mb-2">
              ${property.price_per_night}
              <span className="text-lg text-gray-600">/night</span>
            </div>
            
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in Date
                </label>
                <input
                  type="date"
                  required
                  value={bookingData.check_in_date}
                  onChange={(e) => setBookingData(prev => ({ ...prev, check_in_date: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-out Date
                </label>
                <input
                  type="date"
                  required
                  value={bookingData.check_out_date}
                  onChange={(e) => setBookingData(prev => ({ ...prev, check_out_date: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Guests
                </label>
                <input
                  type="number"
                  min="1"
                  max={property.max_guests}
                  required
                  value={bookingData.guest_count}
                  onChange={(e) => setBookingData(prev => ({ ...prev, guest_count: parseInt(e.target.value) }))}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Requests
                </label>
                <textarea
                  value={bookingData.special_requests}
                  onChange={(e) => setBookingData(prev => ({ ...prev, special_requests: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 h-20"
                  placeholder="Any special requests or requirements..."
                />
              </div>

              <button
                type="submit"
                disabled={createBookingMutation.isPending}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {createBookingMutation.isPending ? 'Submitting...' : 'Book Now'}
              </button>
            </form>

            <div className="mt-4 text-sm text-gray-600">
              <p>• Free cancellation up to 24 hours before check-in</p>
              <p>• Instant confirmation</p>
              <p>• Secure payment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail; 