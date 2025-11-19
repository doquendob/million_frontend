import { renderHook, act, waitFor } from "@testing-library/react";
import { useProperties } from "../useProperties";
import { propertyApi } from "@/lib/api/propertyService";
import { Property, Category } from "@/types";

// Mock the API service
jest.mock("@/lib/api/propertyService");

describe("useProperties", () => {
  const mockProperties: Property[] = [
    {
      id: "1",
      name: "Test Property 1",
      addressProperty: "123 Test St",
      priceProperty: 250000,
      type: "House",
      description: "Test description",
      active: true,
      createdAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "2",
      name: "Test Property 2",
      addressProperty: "456 Test Ave",
      priceProperty: 350000,
      type: "Apartment",
      description: "Test description 2",
      active: true,
      createdAt: "2024-01-02T00:00:00Z",
    },
  ];

  const mockCategories: Category[] = [
    { id: "1", name: "House", color: "#3B82F6" },
    { id: "2", name: "Apartment", color: "#10B981" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (propertyApi.getProperties as jest.Mock).mockResolvedValue(mockProperties);
    (propertyApi.getCategories as jest.Mock).mockResolvedValue(mockCategories);
  });

  it("loads properties and categories on mount", async () => {
    const { result } = renderHook(() => useProperties());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.properties).toEqual(mockProperties);
    expect(result.current.categories).toEqual(mockCategories);
  });

  it("calls onError when loading fails", async () => {
    const mockOnError = jest.fn();
    const error = { message: "Failed to load", statusCode: 500 };

    (propertyApi.getProperties as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() =>
      useProperties({}, { onError: mockOnError })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockOnError).toHaveBeenCalledWith(error);
  });

  it("creates a property successfully", async () => {
    const mockOnSuccess = jest.fn();
    const newProperty = {
      name: "New Property",
      addressProperty: "789 New St",
      priceProperty: 400000,
      type: "House",
      description: "New description",
      active: true,
    };

    const createdProperty: Property = {
      id: "3",
      ...newProperty,
      createdAt: "2024-01-03T00:00:00Z",
    };

    (propertyApi.createProperty as jest.Mock).mockResolvedValue(
      createdProperty
    );

    const { result } = renderHook(() =>
      useProperties({}, { onSuccess: mockOnSuccess })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.createProperty(newProperty);
    });

    expect(propertyApi.createProperty).toHaveBeenCalledWith(newProperty);
    expect(mockOnSuccess).toHaveBeenCalledWith("Property created successfully");
    expect(result.current.properties).toHaveLength(3);
    expect(result.current.properties[0]).toEqual(createdProperty);
  });

  it("handles create property errors", async () => {
    const mockOnError = jest.fn();
    const error = { message: "Create failed", statusCode: 400 };
    const newProperty = {
      name: "New Property",
      addressProperty: "789 New St",
      priceProperty: 400000,
      type: "House",
      description: "New description",
      active: true,
    };

    (propertyApi.createProperty as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() =>
      useProperties({}, { onError: mockOnError })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await expect(result.current.createProperty(newProperty)).rejects.toEqual(
        error
      );
    });

    expect(mockOnError).toHaveBeenCalledWith(error);
  });

  it("deletes a property successfully", async () => {
    const mockOnSuccess = jest.fn();

    (propertyApi.deleteProperty as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useProperties({}, { onSuccess: mockOnSuccess })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.deleteProperty("1");
    });

    expect(propertyApi.deleteProperty).toHaveBeenCalledWith("1");
    expect(mockOnSuccess).toHaveBeenCalledWith("Property deleted successfully");
    expect(result.current.properties).toHaveLength(1);
    expect(result.current.properties.find((p) => p.id === "1")).toBeUndefined();
  });

  it("updates filter and reloads data with debounce", async () => {
    jest.useFakeTimers();

    const { result } = renderHook(() => useProperties({}, { debounceMs: 500 }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    (propertyApi.getProperties as jest.Mock).mockClear();

    act(() => {
      result.current.setFilter({ name: "Beach" });
    });

    // Should not call API immediately
    expect(propertyApi.getProperties).not.toHaveBeenCalled();

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(propertyApi.getProperties).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Beach" })
      );
    });

    jest.useRealTimers();
  });

  it("gets property by ID", async () => {
    const { result } = renderHook(() => useProperties());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const property = result.current.getPropertyById("1");

    expect(property).toEqual(mockProperties[0]);
  });

  it("refreshes data", async () => {
    const { result } = renderHook(() => useProperties());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    (propertyApi.getProperties as jest.Mock).mockClear();

    await act(async () => {
      await result.current.refresh();
    });

    expect(propertyApi.getProperties).toHaveBeenCalled();
  });

  it("updates a property successfully", async () => {
    const mockOnSuccess = jest.fn();
    const updates = {
      name: "Updated Property",
      priceProperty: 300000,
    };

    const updatedProperty: Property = {
      ...mockProperties[0],
      ...updates,
    };

    (propertyApi.updateProperty as jest.Mock).mockResolvedValue(
      updatedProperty
    );

    const { result } = renderHook(() =>
      useProperties({}, { onSuccess: mockOnSuccess })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.updateProperty("1", updates);
    });

    expect(propertyApi.updateProperty).toHaveBeenCalledWith("1", updates);
    expect(mockOnSuccess).toHaveBeenCalledWith("Property updated successfully");
    expect(result.current.properties.find((p) => p.id === "1")).toEqual(
      updatedProperty
    );
  });
});
