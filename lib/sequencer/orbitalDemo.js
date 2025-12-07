// Feature showcase demo - demonstrates all C64 and game dev features
import { SEQUENCER_CONFIG } from '../config.js';

const numSteps = SEQUENCER_CONFIG.numSteps;

/**
 * Generate the ultimate feature showcase demo song
 * Shows off: ADSR, PWM, arpeggio, vibrato, filter resonance, delay
 * @returns {Object} Song data in save format
 */
export function generateOrbitalDemo() {
  // Helper to create empty pattern structure
  const createEmptyVoicePattern = () => [
    Array(8).fill(null).map(() => Array(numSteps).fill(null).map(() => ({ active: false, length: 1 }))),
    Array(8).fill(null).map(() => Array(numSteps).fill(null).map(() => ({ active: false, length: 1 }))),
    Array(8).fill(null).map(() => Array(numSteps).fill(null).map(() => ({ active: false, length: 1 })))
  ];

  const createEmptyDrumPattern = () => Array(7).fill(null).map(() => Array(numSteps).fill(false));

  // Pattern 1: PWM Bass Showcase (demonstrates pulse width modulation)
  const pwmBass = {
    name: "PWM Bass",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Groovy bass line in C minor
  pwmBass.voicePattern[0][5][0] = { active: true, length: 3 };   // C
  pwmBass.voicePattern[0][3][4] = { active: true, length: 2 };   // E♭
  pwmBass.voicePattern[0][2][6] = { active: true, length: 2 };   // G
  pwmBass.voicePattern[0][5][8] = { active: true, length: 2 };   // C
  pwmBass.voicePattern[0][7][10] = { active: true, length: 2 };  // B♭
  pwmBass.voicePattern[0][6][12] = { active: true, length: 4 };  // A

  // Pattern 2: Arpeggio Mode Showcase (hardware arpeggiator)
  const arpeggioChords = {
    name: "Arpeggio Magic",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Chord progression using arpeggiator feature
  arpeggioChords.voicePattern[1][5][0] = { active: true, length: 4 };   // Cm chord
  arpeggioChords.voicePattern[1][3][4] = { active: true, length: 4 };   // E♭ chord
  arpeggioChords.voicePattern[1][2][8] = { active: true, length: 4 };   // G chord
  arpeggioChords.voicePattern[1][6][12] = { active: true, length: 4 };  // A♭ chord

  // Pattern 3: Vibrato Lead (demonstrates LFO vibrato)
  const vibratoLead = {
    name: "Vibrato Lead",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Expressive melody with long notes for vibrato
  vibratoLead.voicePattern[2][0][0] = { active: true, length: 4 };   // C5
  vibratoLead.voicePattern[2][2][4] = { active: true, length: 3 };   // G4
  vibratoLead.voicePattern[2][3][7] = { active: true, length: 1 };   // E4
  vibratoLead.voicePattern[2][2][8] = { active: true, length: 3 };   // G4
  vibratoLead.voicePattern[2][1][11] = { active: true, length: 1 };  // A4
  vibratoLead.voicePattern[2][0][12] = { active: true, length: 4 };  // C5

  // Pattern 4: Filter Resonance Demo (showcases resonant filters)
  const filterSweep = {
    name: "Filter Sweep",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Fast arpeggio pattern for filter sweep effect
  const sweepPattern = [5,3,2,5,3,2,5,3,2,5,3,2,5,3,2,5];
  sweepPattern.forEach((note, step) => {
    filterSweep.voicePattern[0][note][step] = { active: true, length: 1 };
  });

  // Pattern 5: All Features Combined
  const showcase = {
    name: "Feature Showcase",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Bass with PWM
  showcase.voicePattern[0][5][0] = { active: true, length: 3 };
  showcase.voicePattern[0][3][4] = { active: true, length: 2 };
  showcase.voicePattern[0][2][6] = { active: true, length: 2 };
  showcase.voicePattern[0][5][8] = { active: true, length: 2 };
  showcase.voicePattern[0][7][10] = { active: true, length: 2 };
  showcase.voicePattern[0][6][12] = { active: true, length: 4 };
  // Arpeggio chords
  showcase.voicePattern[1][5][0] = { active: true, length: 4 };
  showcase.voicePattern[1][3][4] = { active: true, length: 4 };
  showcase.voicePattern[1][2][8] = { active: true, length: 4 };
  showcase.voicePattern[1][6][12] = { active: true, length: 4 };
  // Vibrato lead
  showcase.voicePattern[2][0][0] = { active: true, length: 4 };
  showcase.voicePattern[2][2][4] = { active: true, length: 4 };
  showcase.voicePattern[2][1][8] = { active: true, length: 4 };
  showcase.voicePattern[2][0][12] = { active: true, length: 4 };

  // Pattern 6: Drums + Bass
  const drumGroove = {
    name: "Drum Groove",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Bass
  drumGroove.voicePattern[0][5][0] = { active: true, length: 2 };
  drumGroove.voicePattern[0][5][4] = { active: true, length: 2 };
  drumGroove.voicePattern[0][5][8] = { active: true, length: 2 };
  drumGroove.voicePattern[0][5][12] = { active: true, length: 2 };
  // Full drum pattern
  for (let i = 0; i < 16; i += 4) drumGroove.drumPattern[0][i] = true;  // Kick
  drumGroove.drumPattern[1][4] = true;   // Snare
  drumGroove.drumPattern[1][12] = true;  // Snare
  for (let i = 0; i < 16; i += 2) drumGroove.drumPattern[3][i] = true;  // Hi-hat
  drumGroove.drumPattern[4][8] = true;   // Open hat

  // Pattern 7: Epic Finale (everything!)
  const finale = {
    name: "Epic Finale",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Moving bass
  const finaleBass = [5,5,4,4,3,3,2,2,5,5,6,6,7,7,6,6];
  finaleBass.forEach((note, step) => {
    finale.voicePattern[0][note][step] = { active: true, length: 1 };
  });
  // Fast arpeggios
  const finaleArp = [0,2,3,5,0,2,3,5,1,3,4,6,1,3,4,6];
  finaleArp.forEach((note, step) => {
    finale.voicePattern[1][note][step] = { active: true, length: 1 };
  });
  // High melody
  finale.voicePattern[2][0][0] = { active: true, length: 4 };
  finale.voicePattern[2][1][4] = { active: true, length: 4 };
  finale.voicePattern[2][2][8] = { active: true, length: 4 };
  finale.voicePattern[2][0][12] = { active: true, length: 4 };
  // Intense drums
  for (let i = 0; i < 16; i += 2) finale.drumPattern[0][i] = true;  // Double kick
  finale.drumPattern[1][4] = true;
  finale.drumPattern[1][12] = true;
  for (let i = 0; i < 16; i++) finale.drumPattern[3][i] = true;  // 16th note hats
  finale.drumPattern[6][0] = true;   // Crash
  finale.drumPattern[6][8] = true;   // Crash

  // Return song data with feature-showcasing settings
  return {
    version: 1,
    name: "C64 Feature Showcase",
    bpm: 135,
    patternLibrary: [
      pwmBass,
      arpeggioChords,
      vibratoLead,
      filterSweep,
      showcase,
      drumGroove,
      finale
    ],
    songArrangement: [
      0, 0,              // Intro: PWM Bass showcase
      1, 1,              // Add: Arpeggio mode
      2, 2,              // Add: Vibrato lead
      3, 3,              // Filter sweep demo
      4, 4, 4, 4,        // Full showcase (all features)
      5, 5,              // Drums join in
      6, 6, 6, 6,        // Epic finale
      4, 4,              // Wind down to showcase
      0, 0,              // End on PWM bass
      null, null, null, null, null, null, null, null
    ],
    waveTypes: ['pulse', 'pulse', 'pulse'],  // All PWM for that classic sound
    octaves: [-1, 0, 1],  // Bass low, chords mid, lead high
    voiceSettings: [
      // Voice 0 (Bass) - Wide PWM showcase (25% duty cycle)
      {
        adsr: { attack: 0.001, decay: 0.04, sustain: 0.95, release: 0.08 },
        pwm: { pulseWidth: 0.25 },  // Distinctive thin pulse!
        arpeggio: { enabled: false, speed: 2, intervals: [0, 4, 7] },
        vibrato: { enabled: false, rate: 5, depth: 0.5 }
      },
      // Voice 1 (Chords) - ARPEGGIO MODE ENABLED! (hardware feature)
      {
        adsr: { attack: 0.002, decay: 0.06, sustain: 0.4, release: 0.05 },
        pwm: { pulseWidth: 0.5 },  // Square wave (50%)
        arpeggio: { enabled: true, speed: 0, intervals: [0, 3, 7] },  // VERY FAST MINOR CHORD!
        vibrato: { enabled: false, rate: 5, depth: 0.5 }
      },
      // Voice 2 (Lead) - VIBRATO SHOWCASE with extreme settings
      {
        adsr: { attack: 0.015, decay: 0.2, sustain: 0.75, release: 0.25 },
        pwm: { pulseWidth: 0.35 },  // Narrow pulse for brightness
        arpeggio: { enabled: false, speed: 2, intervals: [0, 4, 7] },
        vibrato: { enabled: true, rate: 7, depth: 1.2 }  // EXTREME VIBRATO!
      }
    ],
    mixerSettings: [
      // Voice 0 (Bass) - RESONANT FILTER showcase (high Q!)
      {
        enabled: true,
        volume: 1.0,
        lpEnabled: true,
        lpFreq: 800,
        lpQ: 12,  // EXTREME RESONANCE!
        hpEnabled: false,
        hpFreq: 200,
        hpQ: 1,
        delayEnabled: false,
        delayTime: 0.25,
        delayFeedback: 0.3,
        delayMix: 0.3
      },
      // Voice 1 (Chords) - Clean with subtle HP filter
      {
        enabled: true,
        volume: 0.7,
        lpEnabled: false,
        lpFreq: 5000,
        lpQ: 1,
        hpEnabled: true,
        hpFreq: 400,
        hpQ: 2.5,
        delayEnabled: false,
        delayTime: 0.25,
        delayFeedback: 0.3,
        delayMix: 0.3
      },
      // Voice 2 (Lead) - Resonant LP + DELAY showcase
      {
        enabled: true,
        volume: 0.8,
        lpEnabled: true,
        lpFreq: 3500,
        lpQ: 10,  // High resonance for character
        hpEnabled: false,
        hpFreq: 200,
        hpQ: 1,
        delayEnabled: true,
        delayTime: 0.15,  // Fast slapback
        delayFeedback: 0.4,  // More feedback for effect
        delayMix: 0.35  // Prominent delay
      }
    ]
  };
}
