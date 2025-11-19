/**
 * Retry Logic Utilities
 * Handles automatic retries for failed requests
 */

import { ApiError } from "@/lib/api/types";

export interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  retryableStatusCodes?: number[];
  onRetry?: (attempt: number, error: ApiError) => void;
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  onRetry: () => {},
};

/**
 * Determine if an error is retryable
 */
function isRetryable(error: ApiError, retryableStatusCodes: number[]): boolean {
  return retryableStatusCodes.includes(error.statusCode);
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: ApiError | null = null;
  let currentDelay = opts.delayMs;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const apiError = error as ApiError;
      lastError = apiError;

      // Don't retry if it's the last attempt
      if (attempt === opts.maxAttempts) {
        break;
      }

      // Don't retry if error is not retryable
      if (!isRetryable(apiError, opts.retryableStatusCodes)) {
        break;
      }

      // Call retry callback
      opts.onRetry(attempt, apiError);

      // Wait before next attempt
      await sleep(currentDelay);

      // Exponential backoff
      currentDelay *= opts.backoffMultiplier;
    }
  }

  throw lastError;
}

/**
 * Create a retryable version of an async function
 */
export function makeRetryable<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: RetryOptions = {}
): (...args: TArgs) => Promise<TResult> {
  return (...args: TArgs) => withRetry(() => fn(...args), options);
}
