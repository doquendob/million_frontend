import { propertyApi } from "../propertyService";
import { Property, PropertyInput, Category } from "@/types";

// Mock fetch globally
global.fetch = jest.fn();

describe("PropertyApiService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  describe("getProperties", () => {
    it("fetches properties successfully", async () => {
      const mockProperties: Property[] = [
        {
          id: "1",
          name: "Test Property",
          addressProperty: "123 Test St",
          priceProperty: 250000,
          type: "House",
          description: "Test description",
          imageUrl: "/test.jpg",
          active: true,
          createdAt: "2024-01-01T00:00:00Z",
          idOwner: "owner1",
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProperties,
      });

      const result = await propertyApi.getProperties();

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/properties",
        expect.objectContaining({
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
      expect(result).toEqual(mockProperties);
    });

    it("applies filters to query string", async () => {
      const filters = {
        name: "Beach",
        address: "Ocean",
        priceMin: 100000,
        priceMax: 500000,
        type: "House",
        active: true,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await propertyApi.getProperties(filters);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("name=Beach"),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("address=Ocean"),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("priceMin=100000"),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("priceMax=500000"),
        expect.any(Object)
      );
    });

    it("handles API errors", async () => {
      // Mock all 3 retry attempts with the same error
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => ({ message: "Server error" }),
      });

      await expect(propertyApi.getProperties()).rejects.toMatchObject({
        message: expect.stringContaining("Server error"),
        statusCode: 500,
      });

      // Should retry 3 times (initial + 2 retries)
      expect(fetch).toHaveBeenCalledTimes(3);
    });
  });

  describe("getPropertyById", () => {
    it("fetches single property successfully", async () => {
      const mockProperty: Property = {
        id: "1",
        name: "Test Property",
        addressProperty: "123 Test St",
        priceProperty: 250000,
        type: "House",
        description: "Test description",
        imageUrl: "/test.jpg",
        active: true,
        createdAt: "2024-01-01T00:00:00Z",
        idOwner: "owner1",
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProperty,
      });

      const result = await propertyApi.getPropertyById("1");

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/properties/1",
        expect.any(Object)
      );
      expect(result).toEqual(mockProperty);
    });
  });

  describe("createProperty", () => {
    it("creates property successfully", async () => {
      const newProperty: PropertyInput = {
        name: "New Property",
        addressProperty: "456 New St",
        priceProperty: 300000,
        type: "Apartment",
        description: "New description",
        active: true,
      };

      const createdProperty: Property = {
        id: "2",
        name: newProperty.name,
        addressProperty: newProperty.addressProperty,
        priceProperty: newProperty.priceProperty,
        type: newProperty.type || "Apartment",
        description: newProperty.description || "",
        active: newProperty.active ?? true,
        createdAt: "2024-01-02T00:00:00Z",
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => createdProperty,
      });

      const result = await propertyApi.createProperty(newProperty);

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/properties",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(newProperty),
        })
      );
      expect(result).toEqual(createdProperty);
    });
  });

  describe("updateProperty", () => {
    it("updates property successfully", async () => {
      const updates: Partial<PropertyInput> = {
        name: "Updated Property",
        priceProperty: 350000,
      };

      const updatedProperty: Property = {
        id: "1",
        name: "Updated Property",
        addressProperty: "123 Test St",
        priceProperty: 350000,
        type: "House",
        description: "Test description",
        active: true,
        createdAt: "2024-01-01T00:00:00Z",
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => updatedProperty,
      });

      const result = await propertyApi.updateProperty("1", updates);

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/properties/1",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(updates),
        })
      );
      expect(result).toEqual(updatedProperty);
    });
  });

  describe("deleteProperty", () => {
    it("deletes property successfully", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      await propertyApi.deleteProperty("1");

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/properties/1",
        expect.objectContaining({
          method: "DELETE",
        })
      );
    });
  });

  describe("uploadImage", () => {
    it("uploads image successfully", async () => {
      const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
      const mockResponse = {
        imageUrl: "/images/properties/test.jpg",
        fileName: "test.jpg",
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await propertyApi.uploadImage(mockFile);

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/upload/image",
        expect.objectContaining({
          method: "POST",
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it("handles upload errors", async () => {
      const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: async () => ({ message: "File too large" }),
      });

      await expect(propertyApi.uploadImage(mockFile)).rejects.toMatchObject({
        message: "File too large",
        statusCode: 400,
      });
    });
  });

  describe("getCategories", () => {
    it("fetches categories successfully", async () => {
      const mockCategories: Category[] = [
        { id: "1", name: "House", color: "#3B82F6" },
        { id: "2", name: "Apartment", color: "#10B981" },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategories,
      });

      const result = await propertyApi.getCategories();

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/categories",
        expect.any(Object)
      );
      expect(result).toEqual(mockCategories);
    });
  });

  describe("Error Handling", () => {
    it("handles network errors", async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

      await expect(propertyApi.getProperties()).rejects.toMatchObject({
        message: expect.stringContaining("Network error"),
      });

      // Should retry 3 times (initial + 2 retries)
      expect(fetch).toHaveBeenCalledTimes(3);
    });

    it("handles malformed JSON responses", async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

      await expect(propertyApi.getProperties()).rejects.toMatchObject({
        statusCode: 500,
      });

      // Should retry 3 times (initial + 2 retries)
      expect(fetch).toHaveBeenCalledTimes(3);
    });
  });
});
