'use client';

import { useState } from 'react';
import { Property, Category } from '@/types';
import { Plus, X, Upload, Image as ImageIcon } from 'lucide-react';
import { propertyApi } from '@/lib/api/propertyService';

interface AddPropertyFormProps {
  onAdd: (input: Omit<Property, 'id' | 'createdAt'>) => void;
  categories: Category[];
}

export default function AddPropertyForm({ onAdd, categories }: AddPropertyFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    addressProperty: '',
    type: categories[0]?.name || 'House',
    priceProperty: '',
    imageUrl: '',
    active: true,
    idOwner: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [errors, setErrors] = useState({
    name: false,
    description: false,
    addressProperty: false,
    priceProperty: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors = {
      name: !formData.name.trim(),
      description: !formData.description.trim(),
      addressProperty: !formData.addressProperty.trim(),
      priceProperty: !formData.priceProperty || Number(formData.priceProperty) <= 0,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    try {
      let imageUrl = formData.imageUrl.trim();

      // Upload image if file is selected
      if (selectedFile) {
        setIsUploading(true);
        setUploadError(null);

        try {
          const result = await propertyApi.uploadImage(selectedFile);
          // Convert relative path to absolute URL for backend validation
          imageUrl = result.imageUrl.startsWith('http')
            ? result.imageUrl
            : `http://localhost:5000${result.imageUrl}`;
        } catch (error) {
          setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
          setIsUploading(false);
          return;
        }

        setIsUploading(false);
      }

      // Submit
      onAdd({
        name: formData.name.trim(),
        description: formData.description.trim(),
        addressProperty: formData.addressProperty.trim(),
        type: formData.type,
        priceProperty: Number(formData.priceProperty),
        imageUrl: imageUrl || undefined,
        active: formData.active,
        idOwner: formData.idOwner.trim() || undefined,
      });

      // Reset form
      setFormData({
        name: '',
        description: '',
        addressProperty: '',
        type: categories[0]?.name || 'House',
        priceProperty: '',
        imageUrl: '',
        active: true,
        idOwner: '',
      });
      setSelectedFile(null);
      setImagePreview(null);
      setUploadError(null);
      setErrors({ name: false, description: false, addressProperty: false, priceProperty: false });
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting property:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors duration-200 shadow-md"
      >
        <Plus className="w-5 h-5" />
        Add New Property
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-blue-500">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Add New Property</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Property Name *
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="e.g., Modern Downtown Loft"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">Name is required</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Describe the property..."
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">Description is required</p>}
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address *
          </label>
          <input
            id="address"
            type="text"
            value={formData.addressProperty}
            onChange={(e) => handleChange('addressProperty', e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.addressProperty ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="e.g., 123 Main St, City, State ZIP"
          />
          {errors.addressProperty && <p className="text-red-500 text-xs mt-1">Address is required</p>}
        </div>

        {/* Type and Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Property Type *
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price *
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="1000"
              value={formData.priceProperty}
              onChange={(e) => handleChange('priceProperty', e.target.value)}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.priceProperty ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="e.g., 500000"
            />
            {errors.priceProperty && <p className="text-red-500 text-xs mt-1">Valid price is required</p>}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Image (optional)
          </label>

          {!imagePreview && !formData.imageUrl ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="w-10 h-10 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 5MB
                </span>
              </label>
            </div>
          ) : (
            <div className="relative border-2 border-gray-300 rounded-lg p-4">
              <img
                src={imagePreview || formData.imageUrl}
                alt="Property preview"
                className="w-full h-48 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {uploadError && (
            <p className="text-red-500 text-sm mt-2">{uploadError}</p>
          )}
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-2">
          <input
            id="active"
            type="checkbox"
            checked={formData.active}
            onChange={(e) => handleChange('active', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="active" className="text-sm font-medium text-gray-700">
            Active listing
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isUploading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Add Property
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            disabled={isUploading}
            className="px-6 py-3 border border-gray-300 rounded-md font-semibold text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
