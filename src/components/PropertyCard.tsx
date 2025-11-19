'use client';

import { Property } from '@/types';
import { Eye, Trash2, MapPin, DollarSign } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onView: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function PropertyCard({ property, onView, onDelete }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  };

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getCategoryColor = (type: string) => {
    const colors: Record<string, string> = {
      'House': 'bg-green-100 text-green-800',
      'Apartment': 'bg-blue-100 text-blue-800',
      'Villa': 'bg-amber-100 text-amber-800',
      'Townhouse': 'bg-purple-100 text-purple-800',
      'Estate': 'bg-pink-100 text-pink-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-200">
        {property.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={property.imageUrl}
            alt={property.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}

        {/* Active badge */}
        {!property.active && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Inactive
          </div>
        )}

        {/* Type badge */}
        <div className={`absolute top-2 left-2 ${getCategoryColor(property.type)} text-xs font-semibold px-3 py-1 rounded-full`}>
          {property.type}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
          {property.name}
        </h3>

        <div className="flex items-start gap-1 text-gray-600 text-sm mb-2">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
          <p className="line-clamp-1">{property.addressProperty}</p>
        </div>

        <p className="text-gray-600 text-sm mb-3 flex-1 line-clamp-2">
          {truncateDescription(property.description)}
        </p>

        {/* Price */}
        <div className="flex items-center gap-1 mb-4">
          <DollarSign className="w-5 h-5 text-green-600" />
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(property.priceProperty)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onView(property.id)}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 font-medium"
          >
            <Eye className="w-4 h-4" />
            View
          </button>

          {onDelete && (
            <button
              onClick={() => onDelete(property.id)}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200 font-medium"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
