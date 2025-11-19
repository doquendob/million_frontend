import { Property, PropertyInput, Category } from "@/types";
import { API_CONFIG, API_ENDPOINTS } from "./config";
import { ApiResponse, ApiError } from "./types";
import { handleError } from "@/lib/utils/errorHandler";
import { withRetry } from "@/lib/utils/retry";

class PropertyApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
  }

  /**
   * Make a fetch request with centralized error handling
   * Error handling is now delegated to utility functions
   */
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          ...API_CONFIG.headers,
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || response.statusText || "Request failed",
          statusCode: response.status,
          errors: errorData.errors,
        } as ApiError;
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Use centralized error handler
      throw handleError(error, { endpoint, method: options?.method || "GET" });
    }
  }

  /**
   * Make a retryable request (for GET requests)
   */
  private async retryableRequest<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    return withRetry(() => this.request<T>(endpoint, options), {
      maxAttempts: 3,
      delayMs: 1000,
      onRetry: (attempt, error) => {
        console.log(
          `Retry attempt ${attempt} for ${endpoint}: ${error.message}`
        );
      },
    });
  }

  /**
   * Get all properties with optional filters
   */
  async getProperties(filters?: {
    name?: string;
    address?: string;
    priceMin?: number | null;
    priceMax?: number | null;
    type?: string | null;
    active?: boolean | null;
  }): Promise<Property[]> {
    // Build query string from filters
    const params = new URLSearchParams();

    if (filters?.name) params.append("name", filters.name);
    if (filters?.address) params.append("address", filters.address);
    if (filters?.priceMin !== null && filters?.priceMin !== undefined) {
      params.append("priceMin", filters.priceMin.toString());
    }
    if (filters?.priceMax !== null && filters?.priceMax !== undefined) {
      params.append("priceMax", filters.priceMax.toString());
    }
    if (filters?.type) params.append("type", filters.type);
    if (filters?.active !== null && filters?.active !== undefined) {
      params.append("active", filters.active.toString());
    }

    const queryString = params.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.properties}?${queryString}`
      : API_ENDPOINTS.properties;

    // Use retryable request for GET operations
    const response = await this.retryableRequest<
      Property[] | ApiResponse<Property[]>
    >(endpoint);

    // Handle both direct array response and wrapped response
    if (Array.isArray(response)) {
      return response;
    }
    return response.data;
  }

  /**
   * Get a single property by ID
   */
  async getPropertyById(id: string): Promise<Property> {
    const response = await this.retryableRequest<
      Property | ApiResponse<Property>
    >(`${API_ENDPOINTS.properties}/${id}`);

    if ("data" in response) {
      return response.data;
    }
    return response;
  }

  /**
   * Create a new property
   */
  async createProperty(property: PropertyInput): Promise<Property> {
    const response = await this.request<Property | ApiResponse<Property>>(
      API_ENDPOINTS.properties,
      {
        method: "POST",
        body: JSON.stringify(property),
      }
    );

    if ("data" in response) {
      return response.data;
    }
    return response;
  }

  /**
   * Update an existing property
   */
  async updateProperty(
    id: string,
    property: Partial<PropertyInput>
  ): Promise<Property> {
    const response = await this.request<Property | ApiResponse<Property>>(
      `${API_ENDPOINTS.properties}/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(property),
      }
    );

    if ("data" in response) {
      return response.data;
    }
    return response;
  }

  /**
   * Delete a property
   */
  async deleteProperty(id: string): Promise<void> {
    await this.request<void>(`${API_ENDPOINTS.properties}/${id}`, {
      method: "DELETE",
    });
  }

  /**
   * Upload an image
   */
  async uploadImage(
    file: File
  ): Promise<{ imageUrl: string; fileName: string }> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const url = `${this.baseUrl}${API_ENDPOINTS.upload}`;
      const response = await fetch(url, {
        method: "POST",
        body: formData,
        // Don't set Content-Type header - browser will set it with boundary
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || response.statusText || "Upload failed",
          statusCode: response.status,
        } as ApiError;
      }

      return await response.json();
    } catch (error) {
      // Use centralized error handler
      throw handleError(error, {
        endpoint: API_ENDPOINTS.upload,
        method: "POST",
      });
    }
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    const response = await this.retryableRequest<
      Category[] | ApiResponse<Category[]>
    >(API_ENDPOINTS.categories);

    if (Array.isArray(response)) {
      return response;
    }
    return response.data;
  }
}

// Export singleton instance
export const propertyApi = new PropertyApiService();
