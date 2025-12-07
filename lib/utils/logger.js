/**
 * Logging utility for debugging and performance monitoring
 * @module utils/logger
 */

import { DEV_CONFIG } from '../config.js';

/**
 * Log levels for filtering output
 */
export const LogLevel = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

let currentLogLevel = LogLevel.INFO;

/**
 * Set the current log level
 * @param {number} level - LogLevel constant
 */
export function setLogLevel(level) {
  currentLogLevel = level;
}

/**
 * Log an error message
 * @param {string} message - Error message
 * @param {Error} [error] - Optional error object
 */
export function logError(message, error = null) {
  if (currentLogLevel >= LogLevel.ERROR) {
    console.error(`[ERROR] ${message}`, error || '');
  }
}

/**
 * Log a warning message
 * @param {string} message - Warning message
 */
export function logWarn(message) {
  if (currentLogLevel >= LogLevel.WARN) {
    console.warn(`[WARN] ${message}`);
  }
}

/**
 * Log an info message
 * @param {string} message - Info message
 */
export function logInfo(message) {
  if (currentLogLevel >= LogLevel.INFO && DEV_CONFIG.enableLogging) {
    console.log(`[INFO] ${message}`);
  }
}

/**
 * Log a debug message
 * @param {string} message - Debug message
 * @param {*} [data] - Optional data to log
 */
export function logDebug(message, data = null) {
  if (currentLogLevel >= LogLevel.DEBUG && DEV_CONFIG.enableLogging) {
    console.log(`[DEBUG] ${message}`, data !== null ? data : '');
  }
}

/**
 * Measure performance of a function
 * @param {string} label - Label for the operation
 * @param {Function} fn - Function to measure
 * @returns {*} Result of the function
 */
export function measurePerformance(label, fn) {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  
  if (duration > DEV_CONFIG.performanceWarningThreshold) {
    logWarn(`${label} took ${duration.toFixed(2)}ms (threshold: ${DEV_CONFIG.performanceWarningThreshold}ms)`);
  } else {
    logDebug(`${label} took ${duration.toFixed(2)}ms`);
  }
  
  return result;
}

/**
 * Async version of measurePerformance
 * @param {string} label - Label for the operation
 * @param {Function} fn - Async function to measure
 * @returns {Promise<*>} Result of the function
 */
export async function measurePerformanceAsync(label, fn) {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  
  if (duration > DEV_CONFIG.performanceWarningThreshold) {
    logWarn(`${label} took ${duration.toFixed(2)}ms (threshold: ${DEV_CONFIG.performanceWarningThreshold}ms)`);
  } else {
    logDebug(`${label} took ${duration.toFixed(2)}ms`);
  }
  
  return result;
}
