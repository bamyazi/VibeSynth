/**
 * Hardfloor "Acperience" Style Demo
 * Heavy 303 basslines with slides, accents, and driving beats
 */

import { SEQUENCER_CONFIG } from '../config.js';

const numSteps = SEQUENCER_CONFIG.numSteps;

/**
 * Helper to create empty pattern structure
 */
const createEmptyVoicePattern = () => [
  Array(8).fill(null).map(() => Array(numSteps).fill(null).map(() => ({ active: false, length: 1 }))),
  Array(8).fill(null).map(() => Array(numSteps).fill(null).map(() => ({ active: false, length: 1 }))),
  Array(8).fill(null).map(() => Array(numSteps).fill(null).map(() => ({ active: false, length: 1 })))
];

const createEmptyDrumPattern = () => Array(7).fill(null).map(() => Array(numSteps).fill(false));

export function createAcidDemo() {
  
  // Pattern 0: Main 303 Riff - Hardfloor Style
  const mainRiff = {
    name: "Main 303 Riff",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Hypnotic 303 with slides and accents
  mainRiff.voicePattern[0][5][0] = { active: true, length: 1, accent: true, slide: false };    // C4 - accent
  mainRiff.voicePattern[0][7][1] = { active: true, length: 1, accent: false, slide: true };    // G3 - slide up
  mainRiff.voicePattern[0][5][2] = { active: true, length: 1, accent: false, slide: false };   // C4
  mainRiff.voicePattern[0][3][4] = { active: true, length: 1, accent: true, slide: false };    // E4 - accent
  mainRiff.voicePattern[0][4][5] = { active: true, length: 1, accent: false, slide: true };    // D4 - slide
  mainRiff.voicePattern[0][5][6] = { active: true, length: 1, accent: false, slide: false };   // C4
  mainRiff.voicePattern[0][7][8] = { active: true, length: 1, accent: true, slide: false };    // G3 - accent
  mainRiff.voicePattern[0][5][10] = { active: true, length: 1, accent: false, slide: true };   // C4 - slide
  mainRiff.voicePattern[0][3][12] = { active: true, length: 1, accent: true, slide: false };   // E4 - accent
  mainRiff.voicePattern[0][7][13] = { active: true, length: 1, accent: false, slide: false };  // G3
  mainRiff.voicePattern[0][5][14] = { active: true, length: 1, accent: false, slide: true };   // C4 - slide

  // Pattern 1: Riff + Driving Beat
  const riffBeat = {
    name: "Riff + Beat",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Same 303 riff
  riffBeat.voicePattern[0][5][0] = { active: true, length: 1, accent: true, slide: false };
  riffBeat.voicePattern[0][7][1] = { active: true, length: 1, accent: false, slide: true };
  riffBeat.voicePattern[0][5][2] = { active: true, length: 1, accent: false, slide: false };
  riffBeat.voicePattern[0][3][4] = { active: true, length: 1, accent: true, slide: false };
  riffBeat.voicePattern[0][4][5] = { active: true, length: 1, accent: false, slide: true };
  riffBeat.voicePattern[0][5][6] = { active: true, length: 1, accent: false, slide: false };
  riffBeat.voicePattern[0][7][8] = { active: true, length: 1, accent: true, slide: false };
  riffBeat.voicePattern[0][5][10] = { active: true, length: 1, accent: false, slide: true };
  riffBeat.voicePattern[0][3][12] = { active: true, length: 1, accent: true, slide: false };
  riffBeat.voicePattern[0][7][13] = { active: true, length: 1, accent: false, slide: false };
  riffBeat.voicePattern[0][5][14] = { active: true, length: 1, accent: false, slide: true };
  // Four-on-floor kick
  [0,4,8,12].forEach(s => riffBeat.drumPattern[0][s] = true);
  // Driving offbeat claps
  riffBeat.drumPattern[2][4] = true;
  riffBeat.drumPattern[2][12] = true;
  // 16th hi-hats
  [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].forEach(s => riffBeat.drumPattern[3][s] = true);

  // Pattern 2: Variation - Higher Octave
  const variation = {
    name: "High Variation",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Higher register 303 pattern with more slides
  variation.voicePattern[0][0][0] = { active: true, length: 1, accent: true, slide: false };   // C5 - accent
  variation.voicePattern[0][1][1] = { active: true, length: 1, accent: false, slide: true };   // A4 - slide
  variation.voicePattern[0][2][3] = { active: true, length: 1, accent: false, slide: true };   // G4 - slide
  variation.voicePattern[0][3][4] = { active: true, length: 1, accent: true, slide: false };   // E4 - accent
  variation.voicePattern[0][2][6] = { active: true, length: 1, accent: false, slide: true };   // G4 - slide
  variation.voicePattern[0][1][8] = { active: true, length: 1, accent: true, slide: false };   // A4 - accent
  variation.voicePattern[0][2][9] = { active: true, length: 1, accent: false, slide: true };   // G4 - slide
  variation.voicePattern[0][3][10] = { active: true, length: 1, accent: false, slide: false };  // E4
  variation.voicePattern[0][0][12] = { active: true, length: 1, accent: true, slide: false };  // C5 - accent
  variation.voicePattern[0][1][14] = { active: true, length: 1, accent: false, slide: true };  // A4 - slide
  // Same driving beat
  [0,4,8,12].forEach(s => variation.drumPattern[0][s] = true);
  variation.drumPattern[2][4] = true;
  variation.drumPattern[2][12] = true;
  [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].forEach(s => variation.drumPattern[3][s] = true);

  // Pattern 3: Double 303s - Layered Madness
  const doubleLayers = {
    name: "Double 303",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Voice 1: Main riff
  doubleLayers.voicePattern[0][5][0] = { active: true, length: 1, accent: true, slide: false };
  doubleLayers.voicePattern[0][7][1] = { active: true, length: 1, accent: false, slide: true };
  doubleLayers.voicePattern[0][5][2] = { active: true, length: 1, accent: false, slide: false };
  doubleLayers.voicePattern[0][3][4] = { active: true, length: 1, accent: true, slide: false };
  doubleLayers.voicePattern[0][4][5] = { active: true, length: 1, accent: false, slide: true };
  doubleLayers.voicePattern[0][5][6] = { active: true, length: 1, accent: false, slide: false };
  doubleLayers.voicePattern[0][7][8] = { active: true, length: 1, accent: true, slide: false };
  doubleLayers.voicePattern[0][5][10] = { active: true, length: 1, accent: false, slide: true };
  doubleLayers.voicePattern[0][3][12] = { active: true, length: 1, accent: true, slide: false };
  doubleLayers.voicePattern[0][7][13] = { active: true, length: 1, accent: false, slide: false };
  doubleLayers.voicePattern[0][5][14] = { active: true, length: 1, accent: false, slide: true };
  // Voice 2: Counter-melody with slides
  doubleLayers.voicePattern[1][0][2] = { active: true, length: 1, accent: false, slide: true };   // C5
  doubleLayers.voicePattern[1][1][4] = { active: true, length: 1, accent: true, slide: false };   // A4
  doubleLayers.voicePattern[1][2][6] = { active: true, length: 1, accent: false, slide: true };   // G4
  doubleLayers.voicePattern[1][3][8] = { active: true, length: 1, accent: true, slide: false };   // E4
  doubleLayers.voicePattern[1][0][10] = { active: true, length: 1, accent: false, slide: true };  // C5
  doubleLayers.voicePattern[1][1][12] = { active: true, length: 1, accent: true, slide: false };  // A4
  doubleLayers.voicePattern[1][2][14] = { active: true, length: 1, accent: false, slide: false };  // G4
  // Full drums
  [0,4,8,12].forEach(s => doubleLayers.drumPattern[0][s] = true);
  doubleLayers.drumPattern[2][4] = true;
  doubleLayers.drumPattern[2][12] = true;
  [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].forEach(s => doubleLayers.drumPattern[3][s] = true);

  // Pattern 4: Breakdown - Minimal
  const breakdown = {
    name: "Breakdown",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Sparse 303 with long slides
  breakdown.voicePattern[0][5][0] = { active: true, length: 4, accent: true, slide: false };    // C4
  breakdown.voicePattern[0][3][4] = { active: true, length: 4, accent: false, slide: true };    // E4 - long slide
  breakdown.voicePattern[0][7][8] = { active: true, length: 4, accent: true, slide: false };    // G3
  breakdown.voicePattern[0][5][12] = { active: true, length: 4, accent: false, slide: true };   // C4 - long slide
  // Minimal drums - just kick
  [0,8].forEach(s => breakdown.drumPattern[0][s] = true);

  // Pattern 5: Peak Time Madness
  const peak = {
    name: "Peak Time",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Frantic 303 with max slides and accents
  peak.voicePattern[0][5][0] = { active: true, length: 1, accent: true, slide: false };
  peak.voicePattern[0][7][1] = { active: true, length: 1, accent: false, slide: true };
  peak.voicePattern[0][3][2] = { active: true, length: 1, accent: true, slide: false };
  peak.voicePattern[0][5][3] = { active: true, length: 1, accent: false, slide: true };
  peak.voicePattern[0][7][4] = { active: true, length: 1, accent: true, slide: false };
  peak.voicePattern[0][3][5] = { active: true, length: 1, accent: false, slide: true };
  peak.voicePattern[0][5][6] = { active: true, length: 1, accent: true, slide: false };
  peak.voicePattern[0][7][7] = { active: true, length: 1, accent: false, slide: true };
  peak.voicePattern[0][3][8] = { active: true, length: 1, accent: true, slide: false };
  peak.voicePattern[0][5][9] = { active: true, length: 1, accent: false, slide: true };
  peak.voicePattern[0][7][10] = { active: true, length: 1, accent: true, slide: false };
  peak.voicePattern[0][3][11] = { active: true, length: 1, accent: false, slide: true };
  peak.voicePattern[0][5][12] = { active: true, length: 1, accent: true, slide: false };
  peak.voicePattern[0][7][13] = { active: true, length: 1, accent: false, slide: true };
  peak.voicePattern[0][3][14] = { active: true, length: 1, accent: true, slide: false };
  peak.voicePattern[0][5][15] = { active: true, length: 1, accent: false, slide: true };
  // Second 303 layer - high octave
  peak.voicePattern[1][0][0] = { active: true, length: 1, accent: true, slide: false };
  peak.voicePattern[1][1][2] = { active: true, length: 1, accent: false, slide: true };
  peak.voicePattern[1][2][4] = { active: true, length: 1, accent: true, slide: false };
  peak.voicePattern[1][3][6] = { active: true, length: 1, accent: false, slide: true };
  peak.voicePattern[1][0][8] = { active: true, length: 1, accent: true, slide: false };
  peak.voicePattern[1][1][10] = { active: true, length: 1, accent: false, slide: true };
  peak.voicePattern[1][2][12] = { active: true, length: 1, accent: true, slide: false };
  peak.voicePattern[1][3][14] = { active: true, length: 1, accent: false, slide: true };
  // Pounding drums
  [0,4,8,12].forEach(s => peak.drumPattern[0][s] = true);
  peak.drumPattern[2][4] = peak.drumPattern[2][12] = true;
  [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].forEach(s => peak.drumPattern[3][s] = true);
  peak.drumPattern[4][8] = true; // Open hat accent

  return {
    name: "Hardfloor - Acperience Style",
    bpm: 138,
    
    patternLibrary: [
      mainRiff,
      riffBeat,
      variation,
      doubleLayers,
      breakdown,
      peak
    ],
    
    songArrangement: [
      0, 0,              // Intro - just 303
      1, 1, 1, 1,        // Add drums
      2, 2, 1, 1,        // Variation
      3, 3, 3, 3,        // Double layers
      4, 4,              // Breakdown
      3, 3,              // Build back
      5, 5, 5, 5,        // Peak time madness
      1, 1,              // Come down
      null, null, null, null, null, null
    ],
    
    waveTypes: ['sawtooth', 'sawtooth', 'pulse'],
    octaves: [-1, 0, -1],
    
    voiceSettings: [
      // Voice 1: Heavy 303 Bass with aggressive filter
      {
        adsr: { attack: 0.001, decay: 0.05, sustain: 0.4, release: 0.03 },
        pwm: { pulseWidth: 0.5 },
        arpeggio: { enabled: false, speed: 2, intervals: [0, 4, 7] },
        vibrato: { enabled: false, rate: 5, depth: 0.3 },
        filterEnvelope: { 
          enabled: true, 
          amount: 0.95,
          attack: 0.001,
          decay: 0.08,
          sustain: 0.1,
          release: 0.03,
          baseFreq: 300
        },
        volumeEnvelope: { 
          enabled: true, 
          accent: 2.0
        }
      },
      
      // Voice 2: Second 303 with bright filter
      {
        adsr: { attack: 0.001, decay: 0.06, sustain: 0.5, release: 0.04 },
        pwm: { pulseWidth: 0.4 },
        arpeggio: { enabled: false, speed: 1, intervals: [0, 4, 7] },
        vibrato: { enabled: false, rate: 6, depth: 0.4 },
        filterEnvelope: { 
          enabled: true, 
          amount: 0.85,
          attack: 0.001,
          decay: 0.12,
          sustain: 0.15,
          release: 0.05,
          baseFreq: 600
        },
        volumeEnvelope: { 
          enabled: true, 
          accent: 1.8
        }
      },
      
      // Voice 3: Third layer (not used much)
      {
        adsr: { attack: 0.01, decay: 0.1, sustain: 0.6, release: 0.1 },
        pwm: { pulseWidth: 0.35 },
        arpeggio: { enabled: false, speed: 0, intervals: [0, 4, 7, 12] },
        vibrato: { enabled: false, rate: 4, depth: 0.2 },
        filterEnvelope: { 
          enabled: true, 
          amount: 0.5,
          attack: 0.02,
          decay: 0.2,
          sustain: 0.4,
          release: 0.15,
          baseFreq: 1500
        },
        volumeEnvelope: { 
          enabled: false, 
          accent: 1.0
        }
      }
    ],
    
    mixerSettings: [
      // Voice 1: Main 303 - heavy resonance
      {
        volume: 1.0,
        lpEnabled: true,
        lpFreq: 1800,
        lpQ: 18,
        hpEnabled: false,
        hpFreq: 200,
        delayEnabled: true,
        delayTime: 0.375,
        delayFeedback: 0.4,
        delayMix: 0.2
      },
      
      // Voice 2: Second 303 - bright and cutting
      {
        volume: 0.85,
        lpEnabled: true,
        lpFreq: 3000,
        lpQ: 15,
        hpEnabled: false,
        hpFreq: 200,
        delayEnabled: true,
        delayTime: 0.25,
        delayFeedback: 0.35,
        delayMix: 0.25
      },
      
      // Voice 3: Light layer
      {
        volume: 0.5,
        lpEnabled: true,
        lpFreq: 4000,
        lpQ: 8,
        hpEnabled: false,
        hpFreq: 200,
        delayEnabled: true,
        delayTime: 0.5,
        delayFeedback: 0.45,
        delayMix: 0.3
      }
    ]
  };
}
