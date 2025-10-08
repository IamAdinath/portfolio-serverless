/**
 * API Retry Manager - Circuit Breaker Pattern
 * Prevents continuous API bombardment by tracking failures
 */

interface RetryState {
  failureCount: number;
  isBlocked: boolean;
  lastFailureTime: number;
}

class ApiRetryManager {
  private retryStates: Map<string, RetryState> = new Map();
  private readonly MAX_FAILURES = 5;
  private readonly RESET_TIME = 5 * 60 * 1000; // 5 minutes

  /**
   * Check if an API endpoint is blocked due to too many failures
   */
  isBlocked(endpoint: string): boolean {
    const state = this.retryStates.get(endpoint);
    if (!state) return false;

    // Auto-reset after 5 minutes
    if (state.isBlocked && Date.now() - state.lastFailureTime > this.RESET_TIME) {
      this.reset(endpoint);
      return false;
    }

    return state.isBlocked;
  }

  /**
   * Record a successful API call
   */
  recordSuccess(endpoint: string): void {
    this.retryStates.delete(endpoint);
  }

  /**
   * Record a failed API call
   */
  recordFailure(endpoint: string): boolean {
    const state = this.retryStates.get(endpoint) || {
      failureCount: 0,
      isBlocked: false,
      lastFailureTime: 0
    };

    state.failureCount++;
    state.lastFailureTime = Date.now();

    if (state.failureCount >= this.MAX_FAILURES) {
      state.isBlocked = true;
      console.warn(`🚫 API endpoint ${endpoint} blocked after ${this.MAX_FAILURES} failures. Please reload the page or wait 5 minutes.`);
    }

    this.retryStates.set(endpoint, state);
    return state.isBlocked;
  }

  /**
   * Get current failure count for an endpoint
   */
  getFailureCount(endpoint: string): number {
    const state = this.retryStates.get(endpoint);
    return state ? state.failureCount : 0;
  }

  /**
   * Reset failure state for an endpoint
   */
  reset(endpoint: string): void {
    this.retryStates.delete(endpoint);
  }

  /**
   * Reset all failure states (useful for page reload)
   */
  resetAll(): void {
    this.retryStates.clear();
  }

  /**
   * Get blocked endpoints for debugging
   */
  getBlockedEndpoints(): string[] {
    const blocked: string[] = [];
    this.retryStates.forEach((state, endpoint) => {
      if (state.isBlocked) {
        blocked.push(endpoint);
      }
    });
    return blocked;
  }
}

// Singleton instance
export const apiRetryManager = new ApiRetryManager();

/**
 * Wrapper function for API calls with circuit breaker
 */
export async function safeApiCall<T>(
  endpoint: string,
  apiFunction: () => Promise<T>,
  onBlocked?: (failureCount: number) => void
): Promise<T> {
  // Check if endpoint is blocked
  if (apiRetryManager.isBlocked(endpoint)) {
    const failureCount = apiRetryManager.getFailureCount(endpoint);
    const error = new Error(`API endpoint ${endpoint} is temporarily blocked due to repeated failures (${failureCount}/${5}). Please reload the page.`);
    
    if (onBlocked) {
      onBlocked(failureCount);
    }
    
    throw error;
  }

  try {
    const result = await apiFunction();
    apiRetryManager.recordSuccess(endpoint);
    return result;
  } catch (error) {
    const isBlocked = apiRetryManager.recordFailure(endpoint);
    const failureCount = apiRetryManager.getFailureCount(endpoint);
    
    console.warn(`⚠️ API call failed for ${endpoint} (${failureCount}/${5})`, error);
    
    if (isBlocked && onBlocked) {
      onBlocked(failureCount);
    }
    
    throw error;
  }
}