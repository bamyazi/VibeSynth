// Pattern library management - save, load, and organize patterns

import { SEQUENCER_CONFIG } from './config.js';
import { copyVoicePattern, copyDrumPattern } from './pattern.js';

/**
 * Pattern Library Manager
 */
export class PatternLibrary {
  constructor() {
    this.patterns = [];
    this.selectedIndex = null;
  }

  /**
   * Save or update a pattern
   */
  savePattern(name, voicePattern, drumPattern) {
    const patternCopy = {
      name: name || `Pattern ${this.patterns.length + 1}`,
      voicePattern: copyVoicePattern(voicePattern),
      drumPattern: copyDrumPattern(drumPattern)
    };

    if (this.selectedIndex !== null && this.patterns[this.selectedIndex]) {
      // Update existing pattern
      this.patterns[this.selectedIndex] = patternCopy;
    } else {
      // Create new pattern
      this.patterns.push(patternCopy);
      this.selectedIndex = this.patterns.length - 1;
    }

    return this.selectedIndex;
  }

  /**
   * Delete a pattern
   */
  deletePattern(index, songArrangement) {
    if (index < 0 || index >= this.patterns.length) {
      return false;
    }

    this.patterns.splice(index, 1);

    // Update song arrangement indices
    for (let i = 0; i < songArrangement.length; i++) {
      if (songArrangement[i] === index) {
        songArrangement[i] = null;
      } else if (songArrangement[i] > index) {
        songArrangement[i]--;
      }
    }

    this.selectedIndex = this.patterns.length > 0 ? 0 : null;
    return true;
  }

  /**
   * Rename a pattern
   */
  renamePattern(index, newName) {
    if (index >= 0 && index < this.patterns.length) {
      this.patterns[index].name = newName;
      return true;
    }
    return false;
  }

  /**
   * Get a pattern by index
   */
  getPattern(index) {
    return this.patterns[index] || null;
  }

  /**
   * Load pattern data into working pattern
   */
  loadPattern(index, targetPattern, targetDrumPattern) {
    const savedPattern = this.getPattern(index);
    if (!savedPattern) return false;

    this.selectedIndex = index;

    // Copy saved pattern to working pattern
    for (let v = 0; v < SEQUENCER_CONFIG.numVoices; v++) {
      for (let r = 0; r < targetPattern[v].length; r++) {
        for (let s = 0; s < SEQUENCER_CONFIG.numSteps; s++) {
          const savedNote = savedPattern.voicePattern[v][r][s];
          // Handle both old boolean format and new object format
          if (typeof savedNote === 'object') {
            targetPattern[v][r][s].active = savedNote.active;
            targetPattern[v][r][s].length = savedNote.length || 1;
          } else {
            targetPattern[v][r][s].active = savedNote;
            targetPattern[v][r][s].length = 1;
          }
        }
      }
    }

    // Copy drum pattern
    for (let d = 0; d < targetDrumPattern.length; d++) {
      for (let s = 0; s < SEQUENCER_CONFIG.numSteps; s++) {
        targetDrumPattern[d][s] = savedPattern.drumPattern[d][s];
      }
    }

    return true;
  }

  /**
   * Export all patterns for saving
   */
  exportPatterns() {
    return this.patterns.map(p => ({
      name: p.name,
      voicePattern: copyVoicePattern(p.voicePattern),
      drumPattern: copyDrumPattern(p.drumPattern)
    }));
  }

  /**
   * Import patterns from saved data
   */
  importPatterns(patternsData) {
    this.patterns = patternsData.map(p => ({
      name: p.name,
      voicePattern: copyVoicePattern(p.voicePattern),
      drumPattern: copyDrumPattern(p.drumPattern)
    }));
    this.selectedIndex = this.patterns.length > 0 ? 0 : null;
  }

  /**
   * Clear all patterns
   */
  clear() {
    this.patterns = [];
    this.selectedIndex = null;
  }

  /**
   * Get pattern count
   */
  get count() {
    return this.patterns.length;
  }
}

/**
 * Song Arrangement Manager
 */
export class SongArrangement {
  constructor() {
    this.slots = Array(SEQUENCER_CONFIG.maxSongSlots).fill(null);
  }

  /**
   * Set pattern at slot
   */
  setSlot(slotIndex, patternIndex) {
    if (slotIndex >= 0 && slotIndex < SEQUENCER_CONFIG.maxSongSlots) {
      this.slots[slotIndex] = patternIndex;
      return true;
    }
    return false;
  }

  /**
   * Clear a slot
   */
  clearSlot(slotIndex) {
    return this.setSlot(slotIndex, null);
  }

  /**
   * Get pattern index at slot
   */
  getSlot(slotIndex) {
    return this.slots[slotIndex];
  }

  /**
   * Export slots for saving
   */
  exportSlots() {
    return [...this.slots];
  }

  /**
   * Import slots from saved data
   */
  importSlots(slotsData) {
    this.slots = [...slotsData];
    // Ensure length matches config
    while (this.slots.length < SEQUENCER_CONFIG.maxSongSlots) {
      this.slots.push(null);
    }
    this.slots = this.slots.slice(0, SEQUENCER_CONFIG.maxSongSlots);
  }

  /**
   * Clear all slots
   */
  clear() {
    this.slots.fill(null);
  }

  /**
   * Find first non-null slot
   */
  getFirstFilledSlot() {
    for (let i = 0; i < this.slots.length; i++) {
      if (this.slots[i] !== null) return i;
    }
    return 0;
  }
}
