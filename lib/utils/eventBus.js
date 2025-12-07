/**
 * Simple event bus for decoupled component communication
 * @module utils/eventBus
 */

import { logDebug } from './logger.js';

/**
 * Event names used throughout the app
 */
export const Events = {
  // Playback events
  PLAYBACK_STARTED: 'playback:started',
  PLAYBACK_STOPPED: 'playback:stopped',
  STEP_ADVANCED: 'step:advanced',
  
  // Pattern events
  PATTERN_SAVED: 'pattern:saved',
  PATTERN_LOADED: 'pattern:loaded',
  PATTERN_DELETED: 'pattern:deleted',
  PATTERN_CLEARED: 'pattern:cleared',
  
  // Song events
  SONG_LOADED: 'song:loaded',
  SONG_SAVED: 'song:saved',
  SONG_SLOT_CHANGED: 'song:slotChanged',
  
  // UI events
  NOTE_TOGGLED: 'ui:noteToggled',
  DRUM_TOGGLED: 'ui:drumToggled',
  MIXER_CHANGED: 'mixer:changed',
  
  // Audio events
  AUDIO_CONTEXT_READY: 'audio:contextReady',
  AUDIO_ERROR: 'audio:error'
};

/**
 * EventBus class for pub/sub pattern
 */
class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event).push(callback);
    
    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribe from an event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function to remove
   */
  off(event, callback) {
    if (!this.listeners.has(event)) return;
    
    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  /**
   * Emit an event
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data = null) {
    logDebug(`Event emitted: ${event}`, data);
    
    if (!this.listeners.has(event)) return;
    
    const callbacks = this.listeners.get(event);
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
      }
    });
  }

  /**
   * Subscribe to an event once (auto-unsubscribes after first trigger)
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  once(event, callback) {
    const wrappedCallback = (data) => {
      callback(data);
      this.off(event, wrappedCallback);
    };
    
    this.on(event, wrappedCallback);
  }

  /**
   * Clear all listeners for an event, or all events
   * @param {string} [event] - Optional event name. If omitted, clears all.
   */
  clear(event = null) {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}

// Export singleton instance
export const eventBus = new EventBus();

// Export to window for debugging
if (typeof window !== 'undefined') {
  window.__eventBus = eventBus;
}
