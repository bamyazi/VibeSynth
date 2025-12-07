// Pattern data model and operations

import { SEQUENCER_CONFIG, NOTES, DRUM_NAMES } from './config.js';

/**
 * Creates an empty note object
 */
export function createNote() {
  return { 
    active: false, 
    length: 1,
    accent: false,   // TB-303 style accent (enhances filter envelope & volume)
    slide: false     // TB-303 style slide/glide (portamento to next note)
  };
}

/**
 * Creates an empty voice pattern
 */
export function createVoicePattern() {
  return NOTES.map(() => 
    Array(SEQUENCER_CONFIG.numSteps).fill(null).map(() => createNote())
  );
}

/**
 * Creates an empty drum pattern
 */
export function createDrumPattern() {
  return DRUM_NAMES.map(() => 
    Array(SEQUENCER_CONFIG.numSteps).fill(false)
  );
}

/**
 * Creates a complete empty pattern (voices + drums)
 */
export function createEmptyPattern() {
  const voicePattern = [];
  for (let v = 0; v < SEQUENCER_CONFIG.numVoices; v++) {
    voicePattern.push(createVoicePattern());
  }
  
  return {
    voicePattern,
    drumPattern: createDrumPattern()
  };
}

/**
 * Deep copies a note object
 */
export function copyNote(note) {
  if (typeof note === 'object') {
    return { 
      active: note.active, 
      length: note.length || 1,
      accent: note.accent || false,
      slide: note.slide || false
    };
  }
  // Handle legacy boolean format
  return { active: note, length: 1 };
}

/**
 * Deep copies a voice pattern
 */
export function copyVoicePattern(voicePattern) {
  return voicePattern.map(voice => 
    voice.map(row => 
      row.map(note => copyNote(note))
    )
  );
}

/**
 * Deep copies a drum pattern
 */
export function copyDrumPattern(drumPattern) {
  return drumPattern.map(row => [...row]);
}

/**
 * Deep copies a complete pattern
 */
export function copyPattern(pattern) {
  return {
    voicePattern: copyVoicePattern(pattern.voicePattern),
    drumPattern: copyDrumPattern(pattern.drumPattern)
  };
}

/**
 * Clears all notes in a voice pattern
 */
export function clearVoicePatternData(voicePattern, voiceIndex) {
  for (let r = 0; r < voicePattern[voiceIndex].length; r++) {
    for (let s = 0; s < SEQUENCER_CONFIG.numSteps; s++) {
      voicePattern[voiceIndex][r][s].active = false;
      voicePattern[voiceIndex][r][s].length = 1;
    }
  }
}

/**
 * Clears all notes in a drum pattern
 */
export function clearDrumPatternData(drumPattern) {
  for (let d = 0; d < drumPattern.length; d++) {
    for (let s = 0; s < SEQUENCER_CONFIG.numSteps; s++) {
      drumPattern[d][s] = false;
    }
  }
}

/**
 * Checks if a note is active (handles both object and legacy boolean format)
 */
export function isNoteActive(noteData) {
  return typeof noteData === 'object' ? noteData.active : noteData;
}

/**
 * Gets the length of a note (handles both object and legacy boolean format)
 */
export function getNoteLength(noteData) {
  return typeof noteData === 'object' ? (noteData.length || 1) : 1;
}
