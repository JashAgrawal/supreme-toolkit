import { ConvexReactClient } from "convex/react";
import { getModuleConfig } from "../config";

// ============================================================================
// CONVEX CLIENT SETUP
// ============================================================================

const config = getModuleConfig('convex');

if (!config?.url) {
  throw new Error('Convex configuration is missing. Please add NEXT_PUBLIC_CONVEX_URL to your environment variables.');
}

export const convex = new ConvexReactClient(config.url);

// ============================================================================
// CONVEX UTILITIES
// ============================================================================

/**
 * Helper function to handle Convex errors
 */
export function handleConvexError(error: any): string {
  if (error?.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred';
}

/**
 * Helper function to format Convex timestamps
 */
export function formatConvexTimestamp(timestamp: number): string {
  return new Date(timestamp).toISOString();
}

/**
 * Helper function to get current timestamp for Convex
 */
export function getConvexTimestamp(): number {
  return Date.now();
}

/**
 * Helper function to validate required environment variables
 */
export function validateConvexConfig(): boolean {
  try {
    const config = getModuleConfig('convex');
    return !!(config?.url);
  } catch {
    return false;
  }
}

// ============================================================================
// CONVEX HOOKS UTILITIES
// ============================================================================

/**
 * Helper to create consistent loading states
 */
export interface ConvexQueryState<T> {
  data: T | undefined;
  isLoading: boolean;
  error: string | null;
}

/**
 * Helper to create consistent mutation states
 */
export interface ConvexMutationState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

/**
 * Create a standardized query state
 */
export function createQueryState<T>(
  data: T | undefined,
  isLoading: boolean,
  error?: any
): ConvexQueryState<T> {
  return {
    data,
    isLoading,
    error: error ? handleConvexError(error) : null,
  };
}

/**
 * Create a standardized mutation state
 */
export function createMutationState(
  isLoading: boolean = false,
  error?: any,
  success: boolean = false
): ConvexMutationState {
  return {
    isLoading,
    error: error ? handleConvexError(error) : null,
    success,
  };
}

// ============================================================================
// CONVEX DATA TRANSFORMERS
// ============================================================================

/**
 * Transform Convex document to include formatted dates
 */
export function transformConvexDoc<T extends { createdAt: number; updatedAt: number }>(
  doc: T
): T & { createdAtFormatted: string; updatedAtFormatted: string } {
  return {
    ...doc,
    createdAtFormatted: formatConvexTimestamp(doc.createdAt),
    updatedAtFormatted: formatConvexTimestamp(doc.updatedAt),
  };
}

/**
 * Transform array of Convex documents
 */
export function transformConvexDocs<T extends { createdAt: number; updatedAt: number }>(
  docs: T[]
): Array<T & { createdAtFormatted: string; updatedAtFormatted: string }> {
  return docs.map(transformConvexDoc);
}

// ============================================================================
// CONVEX PAGINATION HELPERS
// ============================================================================

export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  hasMore: boolean;
  total: number;
  offset: number;
  limit: number;
}

/**
 * Create paginated result structure
 */
export function createPaginatedResult<T>(
  data: T[],
  total: number,
  options: PaginationOptions = {}
): PaginatedResult<T> {
  const limit = options.limit || 20;
  const offset = options.offset || 0;
  
  return {
    data,
    hasMore: offset + data.length < total,
    total,
    offset,
    limit,
  };
}

// ============================================================================
// CONVEX SEARCH HELPERS
// ============================================================================

export interface SearchOptions {
  searchTerm: string;
  limit?: number;
  offset?: number;
}

/**
 * Helper for case-insensitive search
 */
export function searchInText(text: string, searchTerm: string): boolean {
  return text.toLowerCase().includes(searchTerm.toLowerCase());
}

/**
 * Helper for searching in multiple fields
 */
export function searchInFields(
  item: Record<string, any>,
  fields: string[],
  searchTerm: string
): boolean {
  return fields.some(field => {
    const value = item[field];
    if (typeof value === 'string') {
      return searchInText(value, searchTerm);
    }
    if (Array.isArray(value)) {
      return value.some(v => typeof v === 'string' && searchInText(v, searchTerm));
    }
    return false;
  });
}

// ============================================================================
// CONVEX VALIDATION HELPERS
// ============================================================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate required fields
 */
export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields = requiredFields.filter(field => 
    !data[field] || (typeof data[field] === 'string' && !data[field].trim())
  );
  
  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

/**
 * Validate string length
 */
export function validateStringLength(
  input: string,
  minLength: number = 0,
  maxLength: number = Infinity
): boolean {
  const length = input.trim().length;
  return length >= minLength && length <= maxLength;
}

// ============================================================================
// CONVEX ERROR TYPES
// ============================================================================

export class ConvexError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ConvexError';
  }
}

export class ConvexValidationError extends ConvexError {
  constructor(message: string, public field?: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ConvexValidationError';
  }
}

export class ConvexNotFoundError extends ConvexError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND');
    this.name = 'ConvexNotFoundError';
  }
}

export class ConvexPermissionError extends ConvexError {
  constructor(action: string) {
    super(`Permission denied for ${action}`, 'PERMISSION_DENIED');
    this.name = 'ConvexPermissionError';
  }
}
