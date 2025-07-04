import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, Property } from '../lib/api';
import { Link } from 'react-router-dom';

const Properties: React.FC = () => {
  const [filters, setFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
  });

  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => api.properties.list({
      city: filters.city || undefined,
      min_price: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
      max_price: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
      property_type: filters.propertyType || undefined,
    }),
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) return <div className="container mx-auto px-4 py-8">Loading properties...</div>;
  if (error) return <div className="container mx-auto px-4 py-8">Error loading properties</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Find Your Perfect Home</h1>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Search Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={filters.city}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <select
            name="propertyType"
            value={filters.propertyType}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="condo">Condo</option>
          </select>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties?.map((property: Property) => (
          <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {property.images ? (
                <img
                  src={JSON.parse(property.images)[0] || '/placeholder-house.jpg'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-500">No Image</div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
              <p className="text-gray-600 mb-2">{property.city}, {property.state}</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-green-600">
                  ${property.price_per_night}/night
                </span>
                <span className="text-sm text-gray-500">
                  {property.bedrooms} bed • {property.bathrooms} bath
                </span>
              </div>
              <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                {property.description}
              </p>
              <Link
                to={`/properties/${property.id}`}
                className="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {properties?.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No properties found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Properties; 