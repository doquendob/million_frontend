/**
 * Custom Hook for Property Management
 * Separates data fetching logic from UI components
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { Property, PropertyInput, PropertyFilter, Category } from "@/types";
import { propertyApi } from "@/lib/api/propertyService";
import { ApiError } from "@/lib/api/types";

export interface UsePropertiesOptions {
  debounceMs?: number;
  onError?: (error: ApiError) => void;
  onSuccess?: (message: string) => void;
}

export function useProperties(
  initialFilter: PropertyFilter = {},
  options: UsePropertiesOptions = {}
) {
  const { debounceMs = 500, onError, onSuccess } = options;

  const [properties, setProperties] = useState<Property[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState<PropertyFilter>(initialFilter);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load properties and categories
  const loadData = async () => {
    try {
      setIsLoading(true);

      const [propertiesData, categoriesData] = await Promise.all([
        propertyApi.getProperties({
          name: filter.name || undefined,
          address: filter.address || undefined,
          priceMin: filter.priceMin ?? undefined,
          priceMax: filter.priceMax ?? undefined,
          type: filter.type || undefined,
          active: filter.active ?? undefined,
        }),
        categories.length > 0
          ? Promise.resolve(categories)
          : propertyApi.getCategories(),
      ]);

      setProperties(propertiesData);
      if (categories.length === 0) {
        setCategories(categoriesData);
      }
    } catch (err) {
      const apiError = err as ApiError;
      onError?.(apiError);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced reload on filter change
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      loadData();
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Create property
  const createProperty = async (input: PropertyInput) => {
    try {
      setIsSubmitting(true);
      const newProperty = await propertyApi.createProperty(input);
      setProperties((prev) => [newProperty, ...prev]);
      onSuccess?.("Property created successfully");
      return newProperty;
    } catch (err) {
      const apiError = err as ApiError;
      onError?.(apiError);
      throw apiError;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update property
  const updateProperty = async (id: string, input: Partial<PropertyInput>) => {
    try {
      setIsSubmitting(true);
      const updated = await propertyApi.updateProperty(id, input);
      setProperties((prev) => prev.map((p) => (p.id === id ? updated : p)));
      onSuccess?.("Property updated successfully");
      return updated;
    } catch (err) {
      const apiError = err as ApiError;
      onError?.(apiError);
      throw apiError;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete property
  const deleteProperty = async (id: string) => {
    try {
      await propertyApi.deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
      onSuccess?.("Property deleted successfully");
    } catch (err) {
      const apiError = err as ApiError;
      onError?.(apiError);
      throw apiError;
    }
  };

  // Get property by ID
  const getPropertyById = (id: string): Property | undefined => {
    return properties.find((p) => p.id === id);
  };

  // Refresh data
  const refresh = () => {
    return loadData();
  };

  return {
    // State
    properties,
    categories,
    filter,
    isLoading,
    isSubmitting,

    // Actions
    setFilter,
    createProperty,
    updateProperty,
    deleteProperty,
    getPropertyById,
    refresh,
  };
}
