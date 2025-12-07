/**
 * Configuration constants and default values
 * Central location for all app-wide constants to make changes easier
 * @module config
 */

/**
 * Sequencer grid and playback configuration
 */
export const SEQUENCER_CONFIG = {
  numSteps: 16,
  numVoices: 3,
  maxSongSlots: 32,
  defaultBPM: 120,
  minBPM: 60,
  maxBPM: 200
};

/**
 * Development and debugging configuration
 */
export const DEV_CONFIG = {
  enableLogging: true,
  performanceWarningThreshold: 100,
  autoLoadDemoSong: true,
  demoSongDelay: 100
};

export const NOTES = [
  { name: "C5", freq: 523.25 },
  { name: "A4", freq: 440.0 },
  { name: "G4", freq: 392.0 },
  { name: "E4", freq: 329.63 },
  { name: "D4", freq: 293.66 },
  { name: "C4", freq: 261.63 },
  { name: "A3", freq: 220.0 },
  { name: "G3", freq: 196.0 }
];

export const DRUM_NAMES = ["Kick", "Snare", "Clap", "Closed Hat", "Open Hat", "Tom", "Crash"];

export const OCTAVE_RANGE = {
  min: -2,
  max: 2,
  default: 0
};

export const WAVE_TYPES = ['square', 'sawtooth', 'triangle', 'pulse', 'noise'];

export const AUDIO_TIMING = {
  scheduleAhead: 0.01,
  defaultNoteDuration: 0.22
};

export const ADSR_DEFAULTS = {
  attack: 0.004,
  decay: 0.1,
  sustain: 0.7,
  release: 0.08
};

export const PWM_DEFAULTS = {
  pulseWidth: 0.5  // 50% duty cycle
};

export const ARPEGGIO_DEFAULTS = {
  enabled: false,
  speed: 2,  // How many ticks between arp steps (1-4)
  intervals: [0, 4, 7]  // Major chord (root, major third, fifth in semitones)
};

export const VIBRATO_DEFAULTS = {
  enabled: false,
  rate: 5,    // Hz
  depth: 0.5  // Semitones
};

export const FILTER_ENVELOPE_DEFAULTS = {
  enabled: false,
  amount: 0.5,      // 0-1, how much the envelope affects filter cutoff
  attack: 0.01,     // Filter envelope attack time
  decay: 0.2,       // Filter envelope decay time
  sustain: 0.3,     // Filter envelope sustain level
  release: 0.1,     // Filter envelope release time
  baseFreq: 800     // Base filter frequency in Hz
};

export const VOLUME_ENVELOPE_DEFAULTS = {
  enabled: false,
  accent: 1.0       // Volume multiplier for accented notes (0.5-2.0)
};

export const DISTORTION_DEFAULTS = {
  enabled: false,
  amount: 20,       // Drive amount (1-100)
  mix: 0.5          // Dry/wet mix (0-1)
};

export const DETUNE_DEFAULTS = {
  enabled: false,
  voices: 2,        // Number of detuned voices (1-4)
  spread: 10        // Detune spread in cents (0-50)
};

export const MIXER_DEFAULTS = {
  volume: 0.8,
  lpEnabled: false,
  lpFreq: 5000,
  lpQ: 1,
  lpBypassFreq: 22000,
  hpEnabled: false,
  hpFreq: 200,
  hpQ: 1,
  hpBypassFreq: 20,
  delayEnabled: false,
  delayTime: 0.25,
  delayFeedback: 0.3,
  delayMix: 0.3
};

export const UI_CONSTANTS = {
  gridCellSize: 30,
  stepHighlightDuration: 100,
  modalFadeTime: 200
};
