'use client';

import { PropertyFilter as PropertyFilterType, Category } from '@/types';
import { Search, X } from 'lucide-react';

interface PropertyFilterProps {
  filter: PropertyFilterType;
  onChange: (next: PropertyFilterType) => void;
  categories?: Category[];
}

export default function PropertyFilter({ filter, onChange, categories = [] }: PropertyFilterProps) {
  const handleChange = (field: keyof PropertyFilterType, value: string | number | boolean | null | undefined) => {
    onChange({ ...filter, [field]: value });
  };

  const handleClear = () => {
    onChange({
      name: '',
      address: '',
      priceMin: null,
      priceMax: null,
      type: null,
      active: null,
    });
  };

  const hasActiveFilters =
    filter.name ||
    filter.address ||
    filter.priceMin ||
    filter.priceMax ||
    filter.type ||
    filter.active !== null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Search className="w-5 h-5" />
          Filter Properties
        </h2>
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Name */}
      <div>
        <label htmlFor="filter-name" className="block text-sm font-medium text-gray-700 mb-1">
          Property Name
        </label>
        <input
          id="filter-name"
          type="text"
          value={filter.name || ''}
          onChange={(e) => handleChange('name', e.target.value || undefined)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Search by name..."
        />
      </div>

      {/* Address */}
      <div>
        <label htmlFor="filter-address" className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <input
          id="filter-address"
          type="text"
          value={filter.address || ''}
          onChange={(e) => handleChange('address', e.target.value || undefined)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Search by address..."
        />
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price Range
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              id="filter-price-min"
              type="number"
              min="0"
              step="10000"
              value={filter.priceMin || ''}
              onChange={(e) => handleChange('priceMin', e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Min price"
            />
          </div>
          <div>
            <input
              id="filter-price-max"
              type="number"
              min="0"
              step="10000"
              value={filter.priceMax || ''}
              onChange={(e) => handleChange('priceMax', e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Max price"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      {categories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Type
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleChange('type', null)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${filter.type === null
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleChange('type', category.name === filter.type ? null : category.name)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${filter.type === category.name
                    ? 'text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                style={
                  filter.type === category.name
                    ? { backgroundColor: category.color }
                    : {}
                }
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => handleChange('active', null)}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors duration-200 ${filter.active === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            All
          </button>
          <button
            onClick={() => handleChange('active', true)}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors duration-200 ${filter.active === true
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Active
          </button>
          <button
            onClick={() => handleChange('active', false)}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors duration-200 ${filter.active === false
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Inactive
          </button>
        </div>
      </div>
    </div>
  );
}
