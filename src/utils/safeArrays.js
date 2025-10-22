// Safe Array Utilities - Add this file to fix all .filter() errors
// File: src/utils/safeArrays.js

/**
 * Ensures any value becomes a safe array
 * This prevents "n.filter is not a function" errors
 */
export function ensureArray(value) {
  // Already an array? Return it
  if (Array.isArray(value)) {
    return value;
  }
  
  // Null or undefined? Empty array
  if (value === null || value === undefined) {
    return [];
  }
  
  // Object with 'data' property? Use that
  if (typeof value === 'object' && Array.isArray(value.data)) {
    return value.data;
  }
  
  // Object with 'agents' property? (common backend pattern)
  if (typeof value === 'object' && Array.isArray(value.agents)) {
    return value.agents;
  }
  
  // Object with 'items' property?
  if (typeof value === 'object' && Array.isArray(value.items)) {
    return value.items;
  }
  
  // Single object? Wrap in array
  if (typeof value === 'object') {
    return [value];
  }
  
  // Anything else? Empty array
  console.warn('ensureArray received unexpected type:', typeof value, value);
  return [];
}

/**
 * Safe filter - never crashes
 */
export function safeFilter(array, predicate) {
  try {
    const arr = ensureArray(array);
    return arr.filter(predicate);
  } catch (error) {
    console.error('safeFilter error:', error);
    return [];
  }
}

/**
 * Safe map - never crashes
 */
export function safeMap(array, callback) {
  try {
    const arr = ensureArray(array);
    return arr.map(callback);
  } catch (error) {
    console.error('safeMap error:', error);
    return [];
  }
}

/**
 * Safe find - never crashes
 */
export function safeFind(array, predicate) {
  try {
    const arr = ensureArray(array);
    return arr.find(predicate);
  } catch (error) {
    console.error('safeFind error:', error);
    return undefined;
  }
}

/**
 * Safe reducer for API responses
 * Handles common response patterns
 */
export function normalizeAPIResponse(response) {
  if (!response) return [];
  
  // Already an array
  if (Array.isArray(response)) return response;
  
  // Common patterns:
  if (response.data) return ensureArray(response.data);
  if (response.agents) return ensureArray(response.agents);
  if (response.items) return ensureArray(response.items);
  if (response.results) return ensureArray(response.results);
  
  // Single item
  return [response];
}

/**
 * HOW TO USE:
 * 
 * // In your components:
 * import { ensureArray, safeFilter } from '@/utils/safeArrays';
 * 
 * // When setting state from API:
 * fetch('/api/agents')
 *   .then(r => r.json())
 *   .then(data => setAgents(ensureArray(data)));
 * 
 * // When filtering:
 * const activeAgents = safeFilter(agents, a => a.status === 'active');
 * 
 * // When mapping:
 * const agentNames = safeMap(agents, a => a.name);
 */

export default {
  ensureArray,
  safeFilter,
  safeMap,
  safeFind,
  normalizeAPIResponse
};
