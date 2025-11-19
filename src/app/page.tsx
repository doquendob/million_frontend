'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Property, PropertyFilter as PropertyFilterType, Category } from '@/types';
import PropertyCard from '@/components/PropertyCard';
import AddPropertyForm from '@/components/AddPropertyForm';
import PropertyFilter from '@/components/PropertyFilter';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { Building2, Home as HomeIcon, X } from 'lucide-react';
import { propertyApi } from '@/lib/api/propertyService';
import { ApiError } from '@/lib/api/types';
import { useToastContext } from '@/providers/ToastProvider';

export default function Home() {
  const toast = useToastContext();
  const [properties, setProperties] = useState<Property[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState<PropertyFilterType>({
    name: '',
    address: '',
    priceMin: null,
    priceMax: null,
    type: null,
    active: null,
  });
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch initial data
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload data when filters change (with debouncing)
  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer - wait 500ms after user stops typing
    debounceTimerRef.current = setTimeout(() => {
      loadData();
    }, 500);

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [propertiesData, categoriesData] = await Promise.all([
        propertyApi.getProperties({
          name: filter.name || undefined,
          address: filter.address || undefined,
          priceMin: filter.priceMin ?? undefined,
          priceMax: filter.priceMax ?? undefined,
          type: filter.type || undefined,
          active: filter.active ?? undefined,
        }),
        propertyApi.getCategories(),
      ]);

      setProperties(propertiesData);
      setCategories(categoriesData);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to load data. Please try again.');
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add property
  const addProperty = async (input: Omit<Property, 'id' | 'createdAt'>) => {
    try {
      setIsSubmitting(true);
      const newProperty = await propertyApi.createProperty(input);
      setProperties((prev) => [newProperty, ...prev]);
      toast.success('Success!', 'Property created successfully');
    } catch (err) {
      const apiError = err as ApiError;
      toast.error('Error', `Failed to create property: ${apiError.message}`);
      console.error('Error creating property:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // View property
  const viewProperty = (id: string) => {
    const property = properties.find((p) => p.id === id);
    if (property) {
      setSelectedProperty(property);
    }
  };

  // Delete property
  const deleteProperty = async (id: string) => {
    const property = properties.find((p) => p.id === id);

    // Use native confirm for now (could be replaced with a custom modal later)
    const confirmed = confirm(`Are you sure you want to delete "${property?.name}"?`);
    if (!confirmed) {
      return;
    }

    try {
      await propertyApi.deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
      if (selectedProperty?.id === id) {
        setSelectedProperty(null);
      }
      toast.success('Deleted!', 'Property deleted successfully');
    } catch (err) {
      const apiError = err as ApiError;
      toast.error('Error', `Failed to delete property: ${apiError.message}`);
      console.error('Error deleting property:', err);
    }
  };

  // Apply filters - now just returns the properties from server
  const filteredProperties = useMemo(() => {
    // Server-side filtering is now handled in loadData
    // This is just to maintain the same structure
    return properties;
  }, [properties]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Real Estate Listings</h1>
              <p className="text-sm text-gray-600">Find your dream property</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" text="Loading properties..." />
          </div>
        ) : error ? (
          // Error State
          <ErrorMessage message={error} onRetry={loadData} />
        ) : (
          <>
            {/* Add Property Form */}
            <div className="mb-6">
              <AddPropertyForm onAdd={addProperty} categories={categories} />
              {isSubmitting && (
                <div className="mt-3 flex items-center gap-2 text-blue-600">
                  <LoadingSpinner size="sm" />
                  <span className="text-sm font-medium">Creating property...</span>
                </div>
              )}
            </div>

            {/* Filter */}
            <div className="mb-8">
              <PropertyFilter filter={filter} onChange={setFilter} categories={categories} />
            </div>

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-gray-700 font-medium">
                Showing <span className="text-blue-600 font-bold">{filteredProperties.length}</span> properties
              </p>
            </div>

            {/* Properties Grid */}
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onView={viewProperty}
                    onDelete={deleteProperty}
                  />
                ))}
              </div>
            ) : (
              // Empty State
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="bg-gray-100 rounded-full p-6 mb-4">
                  <HomeIcon className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-600 text-center max-w-md mb-6">
                  {properties.length === 0
                    ? 'Get started by adding your first property using the form above.'
                    : 'Try adjusting your filters to see more results.'}
                </p>
                {properties.length > 0 && (
                  <button
                    onClick={() =>
                      setFilter({
                        name: '',
                        address: '',
                        priceMin: null,
                        priceMax: null,
                        type: null,
                        active: null,
                      })
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Property Details Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Property Details</h2>
              <button
                onClick={() => setSelectedProperty(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Image */}
              {selectedProperty.imageUrl && (
                <div className="mb-6 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedProperty.imageUrl}
                    alt={selectedProperty.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              {/* Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedProperty.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                      {selectedProperty.type}
                    </span>
                    {selectedProperty.active ? (
                      <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Price</h4>
                  <p className="text-3xl font-bold text-green-600">
                    {selectedProperty.priceProperty.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Address</h4>
                  <p className="text-gray-900">{selectedProperty.addressProperty}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Description</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedProperty.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Listed Date</h4>
                  <p className="text-gray-900">
                    {new Date(selectedProperty.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                {selectedProperty.idOwner && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Owner ID</h4>
                    <p className="text-gray-900 font-mono text-sm">{selectedProperty.idOwner}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-md font-semibold transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    deleteProperty(selectedProperty.id);
                    setSelectedProperty(null);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-semibold transition-colors"
                >
                  Delete Property
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
