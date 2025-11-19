/**
 * Centralized Error Handling Utilities
 * Separates error handling logic from business logic
 */

import { ApiError } from "@/lib/api/types";

/**
 * Parse and normalize errors from different sources
 */
export function parseError(error: unknown): ApiError {
  // API Error (already structured)
  if (isApiError(error)) {
    return error;
  }

  // Fetch/Network errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return {
      message: "Network error. Please check your connection.",
      statusCode: 0,
    };
  }

  // Standard Error object
  if (error instanceof Error) {
    return {
      message: error.message,
      statusCode: 500,
    };
  }

  // Unknown error
  return {
    message: "An unexpected error occurred",
    statusCode: 500,
  };
}

/**
 * Type guard for ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "statusCode" in error
  );
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: ApiError): string {
  const statusMessages: Record<number, string> = {
    0: "Unable to connect to server. Please check your internet connection.",
    400: "Invalid request. Please check your input.",
    401: "You are not authorized. Please log in.",
    403: "You do not have permission to perform this action.",
    404: "The requested resource was not found.",
    409: "This action conflicts with existing data.",
    422: "Validation failed. Please check your input.",
    429: "Too many requests. Please try again later.",
    500: "Server error. Please try again later.",
    503: "Service temporarily unavailable. Please try again later.",
  };

  return statusMessages[error.statusCode] || error.message;
}

/**
 * Log errors (can be extended to send to monitoring service)
 */
export function logError(
  error: ApiError,
  context?: Record<string, unknown>
): void {
  if (process.env.NODE_ENV === "development") {
    console.group("🚨 Error Log");
    console.error("Message:", error.message);
    console.error("Status Code:", error.statusCode);
    if (error.errors) {
      console.error("Validation Errors:", error.errors);
    }
    if (context) {
      console.error("Context:", context);
    }
    console.groupEnd();
  }
}

/**
 * Handle errors with consistent logging and user feedback
 */
export function handleError(
  error: unknown,
  context?: Record<string, unknown>
): ApiError {
  const parsedError = parseError(error);
  logError(parsedError, context);
  return parsedError;
}

/**
 * Create an error notification object (for toast/notification system)
 */
export interface ErrorNotification {
  title: string;
  message: string;
  type: "error" | "warning";
  duration?: number;
}

export function createErrorNotification(error: ApiError): ErrorNotification {
  const isServerError = error.statusCode >= 500;

  return {
    title: isServerError ? "Server Error" : "Error",
    message: getUserFriendlyMessage(error),
    type: isServerError ? "error" : "warning",
    duration: 5000,
  };
}

/**
 * Validation error formatter
 */
export function formatValidationErrors(
  errors?: Record<string, string[]>
): string {
  if (!errors) return "";

  return Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
    .join("\n");
}
