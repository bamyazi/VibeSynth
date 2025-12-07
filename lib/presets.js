/**
 * Quick presets for game development
 * Genre-specific templates optimized for common game scenarios
 * @module presets
 */

import { SEQUENCER_CONFIG } from './config.js';

const { numSteps, numVoices } = SEQUENCER_CONFIG;

/**
 * Create empty pattern structure
 */
function createEmptyPatternStructure(name) {
  const voicePattern = [];
  for (let v = 0; v < numVoices; v++) {
    voicePattern[v] = [];
    for (let n = 0; n < 8; n++) {
      voicePattern[v][n] = Array(numSteps).fill(null).map(() => ({ active: false, length: 1 }));
    }
  }
  
  const drumPattern = Array(7).fill(null).map(() => Array(numSteps).fill(false));
  
  return {
    name,
    voicePattern,
    drumPattern
  };
}

/**
 * 8-Bit Platformer Preset
 * Upbeat, bouncy music for classic platformers
 */
export function createPlatformerPreset() {
  const pattern = createEmptyPatternStructure('Platformer');
  
  // Voice 0: Bouncy bass line (C-G pattern)
  pattern.voicePattern[0][5][0] = { active: true, length: 2 }; // C4
  pattern.voicePattern[0][5][4] = { active: true, length: 2 }; // C4
  pattern.voicePattern[0][5][8] = { active: true, length: 2 }; // C4
  pattern.voicePattern[0][5][12] = { active: true, length: 2 }; // C4
  pattern.voicePattern[0][2][2] = { active: true, length: 1 }; // G4
  pattern.voicePattern[0][2][10] = { active: true, length: 1 }; // G4
  
  // Voice 1: Peppy melody
  pattern.voicePattern[1][0][0] = { active: true, length: 1 }; // C5
  pattern.voicePattern[1][1][1] = { active: true, length: 1 }; // A4
  pattern.voicePattern[1][2][2] = { active: true, length: 1 }; // G4
  pattern.voicePattern[1][1][3] = { active: true, length: 1 }; // A4
  pattern.voicePattern[1][0][4] = { active: true, length: 2 }; // C5
  pattern.voicePattern[1][3][8] = { active: true, length: 1 }; // E4
  pattern.voicePattern[1][2][9] = { active: true, length: 1 }; // G4
  pattern.voicePattern[1][1][10] = { active: true, length: 1 }; // A4
  pattern.voicePattern[1][0][12] = { active: true, length: 3 }; // C5
  
  // Voice 2: Harmony chord stabs
  pattern.voicePattern[2][3][0] = { active: true, length: 1 }; // E4
  pattern.voicePattern[2][3][4] = { active: true, length: 1 }; // E4
  pattern.voicePattern[2][3][8] = { active: true, length: 1 }; // E4
  pattern.voicePattern[2][3][12] = { active: true, length: 1 }; // E4
  
  // Drums: Simple kick-snare pattern
  pattern.drumPattern[0][0] = true; // Kick
  pattern.drumPattern[0][4] = true;
  pattern.drumPattern[0][8] = true;
  pattern.drumPattern[0][12] = true;
  pattern.drumPattern[1][4] = true; // Snare
  pattern.drumPattern[1][12] = true;
  pattern.drumPattern[3][2] = true; // Hi-hat
  pattern.drumPattern[3][6] = true;
  pattern.drumPattern[3][10] = true;
  pattern.drumPattern[3][14] = true;
  
  return {
    patterns: [pattern],
    songSlots: [0, 0, 0, 0, null, null, null, null],
    bpm: 150,
    waveTypes: ['pulse', 'pulse', 'square'],
    octaves: [0, 0, 0],
    voiceSettings: [
      { 
        adsr: { attack: 0.002, decay: 0.05, sustain: 0.9, release: 0.05 },
        pwm: { pulseWidth: 0.25 },
        arpeggio: { enabled: false },
        vibrato: { enabled: false }
      },
      {
        adsr: { attack: 0.001, decay: 0.08, sustain: 0.5, release: 0.1 },
        pwm: { pulseWidth: 0.5 },
        arpeggio: { enabled: false },
        vibrato: { enabled: true, rate: 5, depth: 0.3 }
      },
      {
        adsr: { attack: 0.001, decay: 0.03, sustain: 0.3, release: 0.02 },
        pwm: { pulseWidth: 0.5 },
        arpeggio: { enabled: false },
        vibrato: { enabled: false }
      }
    ],
    mixerSettings: [
      { volume: 0.8, lpEnabled: true, lpFreq: 1500, lpQ: 3 },
      { volume: 0.7, lpEnabled: true, lpFreq: 4000, lpQ: 5 },
      { volume: 0.6, lpEnabled: false }
    ]
  };
}

/**
 * Space Shooter Preset
 * Fast-paced, intense music for space shooters
 */
export function createSpaceShooterPreset() {
  const pattern = createEmptyPatternStructure('Space Shooter');
  
  // Voice 0: Driving arpeggio bass
  for (let i = 0; i < 16; i += 2) {
    pattern.voicePattern[0][6][i] = { active: true, length: 1 }; // A3
  }
  for (let i = 1; i < 16; i += 4) {
    pattern.voicePattern[0][3][i] = { active: true, length: 1 }; // E4
  }
  
  // Voice 1: Fast arpeggio lead
  const arpNotes = [0, 3, 2, 3]; // C5, E4, G4, E4
  for (let i = 0; i < 16; i++) {
    pattern.voicePattern[1][arpNotes[i % 4]][i] = { active: true, length: 1 };
  }
  
  // Voice 2: Sustained pad
  pattern.voicePattern[2][1][0] = { active: true, length: 8 }; // A4
  pattern.voicePattern[2][5][8] = { active: true, length: 8 }; // C4
  
  // Drums: Fast aggressive pattern
  for (let i = 0; i < 16; i += 4) {
    pattern.drumPattern[0][i] = true; // Kick
  }
  for (let i = 2; i < 16; i += 4) {
    pattern.drumPattern[1][i] = true; // Snare
  }
  for (let i = 0; i < 16; i++) {
    pattern.drumPattern[3][i] = true; // Hi-hat (continuous)
  }
  pattern.drumPattern[6][8] = true; // Crash at halfway
  
  return {
    patterns: [pattern],
    songSlots: [0, 0, 0, 0, 0, 0, 0, 0],
    bpm: 170,
    waveTypes: ['pulse', 'sawtooth', 'triangle'],
    octaves: [0, 0, 0],
    voiceSettings: [
      { 
        adsr: { attack: 0.001, decay: 0.02, sustain: 0.8, release: 0.03 },
        pwm: { pulseWidth: 0.3 },
        arpeggio: { enabled: false },
        vibrato: { enabled: false }
      },
      {
        adsr: { attack: 0.001, decay: 0.05, sustain: 0.6, release: 0.08 },
        pwm: { pulseWidth: 0.5 },
        arpeggio: { enabled: true, speed: 1, intervals: [0, 4, 7] },
        vibrato: { enabled: false }
      },
      {
        adsr: { attack: 0.05, decay: 0.2, sustain: 0.7, release: 0.3 },
        pwm: { pulseWidth: 0.5 },
        arpeggio: { enabled: false },
        vibrato: { enabled: true, rate: 4, depth: 0.5 }
      }
    ],
    mixerSettings: [
      { volume: 0.9, lpEnabled: true, lpFreq: 2000, lpQ: 8 },
      { volume: 0.8, hpEnabled: true, hpFreq: 400, hpQ: 2 },
      { volume: 0.5, lpEnabled: true, lpFreq: 3000, delayEnabled: true, delayTime: 0.3, delayMix: 0.2 }
    ]
  };
}

/**
 * Horror/Suspense Preset
 * Dark, atmospheric music for horror games
 */
export function createHorrorPreset() {
  const pattern = createEmptyPatternStructure('Horror');
  
  // Voice 0: Low ominous drone
  pattern.voicePattern[0][7][0] = { active: true, length: 16 }; // G3
  
  // Voice 1: Dissonant melody
  pattern.voicePattern[1][4][0] = { active: true, length: 3 }; // D4
  pattern.voicePattern[1][3][4] = { active: true, length: 3 }; // E4
  pattern.voicePattern[1][4][8] = { active: true, length: 3 }; // D4
  pattern.voicePattern[1][6][12] = { active: true, length: 3 }; // A3
  
  // Voice 2: Noise texture (sparse)
  pattern.voicePattern[2][0][6] = { active: true, length: 1 };
  pattern.voicePattern[2][0][14] = { active: true, length: 1 };
  
  // Drums: Minimal, tense percussion
  pattern.drumPattern[0][8] = true; // Single kick
  pattern.drumPattern[5][3] = true; // Tom
  pattern.drumPattern[5][11] = true; // Tom
  
  return {
    patterns: [pattern],
    songSlots: [0, 0, 0, 0],
    bpm: 80,
    waveTypes: ['sawtooth', 'pulse', 'noise'],
    octaves: [-1, 0, 0],
    voiceSettings: [
      { 
        adsr: { attack: 0.1, decay: 0.3, sustain: 0.9, release: 0.5 },
        pwm: { pulseWidth: 0.5 },
        arpeggio: { enabled: false },
        vibrato: { enabled: true, rate: 2, depth: 0.8 }
      },
      {
        adsr: { attack: 0.02, decay: 0.15, sustain: 0.6, release: 0.2 },
        pwm: { pulseWidth: 0.2 },
        arpeggio: { enabled: false },
        vibrato: { enabled: true, rate: 3, depth: 1.2 }
      },
      {
        adsr: { attack: 0.001, decay: 0.05, sustain: 0.1, release: 0.05 },
        pwm: { pulseWidth: 0.5 },
        arpeggio: { enabled: false },
        vibrato: { enabled: false }
      }
    ],
    mixerSettings: [
      { volume: 0.7, lpEnabled: true, lpFreq: 800, lpQ: 10, delayEnabled: true, delayTime: 0.5, delayFeedback: 0.5, delayMix: 0.4 },
      { volume: 0.6, lpEnabled: true, lpFreq: 2000, lpQ: 6 },
      { volume: 0.4, hpEnabled: true, hpFreq: 1000 }
    ]
  };
}

/**
 * Menu/UI Preset
 * Simple, pleasant music for menus and UI
 */
export function createMenuPreset() {
  const pattern = createEmptyPatternStructure('Menu Music');
  
  // Voice 0: Simple bass
  pattern.voicePattern[0][5][0] = { active: true, length: 4 }; // C4
  pattern.voicePattern[0][3][8] = { active: true, length: 4 }; // E4
  
  // Voice 1: Gentle melody
  pattern.voicePattern[1][0][0] = { active: true, length: 2 }; // C5
  pattern.voicePattern[1][3][2] = { active: true, length: 2 }; // E4
  pattern.voicePattern[1][2][4] = { active: true, length: 2 }; // G4
  pattern.voicePattern[1][3][6] = { active: true, length: 2 }; // E4
  pattern.voicePattern[1][0][8] = { active: true, length: 4 }; // C5
  
  // Voice 2: Soft harmony
  pattern.voicePattern[2][3][0] = { active: true, length: 8 }; // E4
  pattern.voicePattern[2][2][8] = { active: true, length: 8 }; // G4
  
  // Drums: Minimal
  pattern.drumPattern[3][4] = true; // Hi-hat
  pattern.drumPattern[3][12] = true;
  
  return {
    patterns: [pattern],
    songSlots: [0, 0, 0, 0],
    bpm: 110,
    waveTypes: ['triangle', 'pulse', 'square'],
    octaves: [0, 0, 0],
    voiceSettings: [
      { 
        adsr: { attack: 0.01, decay: 0.1, sustain: 0.8, release: 0.1 },
        pwm: { pulseWidth: 0.5 },
        arpeggio: { enabled: false },
        vibrato: { enabled: false }
      },
      {
        adsr: { attack: 0.005, decay: 0.08, sustain: 0.6, release: 0.15 },
        pwm: { pulseWidth: 0.5 },
        arpeggio: { enabled: false },
        vibrato: { enabled: true, rate: 4, depth: 0.2 }
      },
      {
        adsr: { attack: 0.02, decay: 0.15, sustain: 0.7, release: 0.2 },
        pwm: { pulseWidth: 0.5 },
        arpeggio: { enabled: false },
        vibrato: { enabled: false }
      }
    ],
    mixerSettings: [
      { volume: 0.6, lpEnabled: true, lpFreq: 2000 },
      { volume: 0.7, lpEnabled: true, lpFreq: 4000, delayEnabled: true, delayTime: 0.375, delayMix: 0.3 },
      { volume: 0.5, lpEnabled: true, lpFreq: 3000 }
    ]
  };
}

/**
 * Get all available presets
 */
export function getAllPresets() {
  return [
    { name: '🎮 8-Bit Platformer', generator: createPlatformerPreset },
    { name: '🚀 Space Shooter', generator: createSpaceShooterPreset },
    { name: '👻 Horror/Suspense', generator: createHorrorPreset },
    { name: '📋 Menu Music', generator: createMenuPreset }
  ];
}
