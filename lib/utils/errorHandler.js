/**
 * Global error handling and user-friendly error messages
 * @module utils/errorHandler
 */

import { logError } from './logger.js';

/**
 * Error types for categorization
 */
export const ErrorType = {
  AUDIO: 'AUDIO',
  STORAGE: 'STORAGE',
  UI: 'UI',
  PATTERN: 'PATTERN',
  UNKNOWN: 'UNKNOWN'
};

/**
 * User-friendly error messages
 */
const ERROR_MESSAGES = {
  [ErrorType.AUDIO]: 'Audio system error. Please refresh the page.',
  [ErrorType.STORAGE]: 'Unable to save/load data. Check browser permissions.',
  [ErrorType.UI]: 'Interface error. Please try again.',
  [ErrorType.PATTERN]: 'Error with pattern data. Pattern may be corrupted.',
  [ErrorType.UNKNOWN]: 'An unexpected error occurred. Please refresh the page.'
};

/**
 * Handle an error with logging and user notification
 * @param {Error} error - The error object
 * @param {string} type - ErrorType constant
 * @param {string} context - Description of what was being done
 * @param {boolean} [showAlert=true] - Whether to show alert to user
 */
export function handleError(error, type = ErrorType.UNKNOWN, context = '', showAlert = true) {
  const message = `${context ? context + ': ' : ''}${error.message}`;
  logError(message, error);
  
  if (showAlert) {
    const userMessage = ERROR_MESSAGES[type] || ERROR_MESSAGES[ErrorType.UNKNOWN];
    alert(`${userMessage}\n\nDetails: ${error.message}`);
  }
}

/**
 * Wrap a function with error handling
 * @param {Function} fn - Function to wrap
 * @param {string} type - ErrorType constant
 * @param {string} context - Description of the operation
 * @returns {Function} Wrapped function
 */
export function withErrorHandler(fn, type, context) {
  return function(...args) {
    try {
      return fn.apply(this, args);
    } catch (error) {
      handleError(error, type, context);
      return null;
    }
  };
}

/**
 * Wrap an async function with error handling
 * @param {Function} fn - Async function to wrap
 * @param {string} type - ErrorType constant
 * @param {string} context - Description of the operation
 * @returns {Function} Wrapped async function
 */
export function withErrorHandlerAsync(fn, type, context) {
  return async function(...args) {
    try {
      return await fn.apply(this, args);
    } catch (error) {
      handleError(error, type, context);
      return null;
    }
  };
}

/**
 * Safe JSON parse with error handling
 * @param {string} json - JSON string to parse
 * @param {*} defaultValue - Default value if parse fails
 * @returns {*} Parsed object or default value
 */
export function safeJSONParse(json, defaultValue = null) {
  try {
    return JSON.parse(json);
  } catch (error) {
    logError('JSON parse failed', error);
    return defaultValue;
  }
}

/**
 * Validate that required DOM elements exist
 * @param {Object} elements - Object mapping names to DOM elements
 * @throws {Error} If any required element is null
 */
export function validateDOMElements(elements) {
  const missing = [];
  
  for (const [name, element] of Object.entries(elements)) {
    if (element === null || element === undefined) {
      missing.push(name);
    }
  }
  
  if (missing.length > 0) {
    throw new Error(`Missing required DOM elements: ${missing.join(', ')}`);
  }
}
