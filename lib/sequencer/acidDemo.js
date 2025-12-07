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
  
  // Pattern 0: Intro - Deep Hypnotic Riff
  const intro = {
    name: "Intro",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Deep, groovy 303 bassline
  intro.voicePattern[0][7][0] = { active: true, length: 1, accent: true, slide: false };    // G3 - accent
  intro.voicePattern[0][5][1] = { active: true, length: 1, accent: false, slide: true };    // C4 - slide
  intro.voicePattern[0][7][3] = { active: true, length: 1, accent: false, slide: false };   // G3
  intro.voicePattern[0][6][4] = { active: true, length: 1, accent: true, slide: false };    // A3 - accent
  intro.voicePattern[0][5][6] = { active: true, length: 1, accent: false, slide: true };    // C4 - slide
  intro.voicePattern[0][7][8] = { active: true, length: 1, accent: true, slide: false };    // G3 - accent
  intro.voicePattern[0][5][9] = { active: true, length: 1, accent: false, slide: true };    // C4 - slide
  intro.voicePattern[0][7][10] = { active: true, length: 1, accent: false, slide: false };  // G3
  intro.voicePattern[0][4][12] = { active: true, length: 1, accent: true, slide: false };   // D4 - accent
  intro.voicePattern[0][5][13] = { active: true, length: 1, accent: false, slide: true };   // C4 - slide
  intro.voicePattern[0][7][15] = { active: true, length: 1, accent: false, slide: false };  // G3
  // Minimal kick
  [0,8].forEach(s => intro.drumPattern[0][s] = true);

  // Pattern 1: Main Groove - Add Full Beat
  const mainGroove = {
    name: "Main Groove",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Same bassline
  mainGroove.voicePattern[0][7][0] = { active: true, length: 1, accent: true, slide: false };
  mainGroove.voicePattern[0][5][1] = { active: true, length: 1, accent: false, slide: true };
  mainGroove.voicePattern[0][7][3] = { active: true, length: 1, accent: false, slide: false };
  mainGroove.voicePattern[0][6][4] = { active: true, length: 1, accent: true, slide: false };
  mainGroove.voicePattern[0][5][6] = { active: true, length: 1, accent: false, slide: true };
  mainGroove.voicePattern[0][7][8] = { active: true, length: 1, accent: true, slide: false };
  mainGroove.voicePattern[0][5][9] = { active: true, length: 1, accent: false, slide: true };
  mainGroove.voicePattern[0][7][10] = { active: true, length: 1, accent: false, slide: false };
  mainGroove.voicePattern[0][4][12] = { active: true, length: 1, accent: true, slide: false };
  mainGroove.voicePattern[0][5][13] = { active: true, length: 1, accent: false, slide: true };
  mainGroove.voicePattern[0][7][15] = { active: true, length: 1, accent: false, slide: false };
  // Four-on-floor + hats
  [0,4,8,12].forEach(s => mainGroove.drumPattern[0][s] = true);
  mainGroove.drumPattern[2][4] = mainGroove.drumPattern[2][12] = true;
  [1,3,5,7,9,11,13,15].forEach(s => mainGroove.drumPattern[3][s] = true);

  // Pattern 2: Squelchy Madness - Crazy Slides
  const squelchy = {
    name: "Squelchy",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Insane sliding bassline
  squelchy.voicePattern[0][5][0] = { active: true, length: 1, accent: true, slide: false };   // C4
  squelchy.voicePattern[0][7][1] = { active: true, length: 1, accent: false, slide: true };   // G3 - slide
  squelchy.voicePattern[0][3][2] = { active: true, length: 1, accent: true, slide: false };   // E4
  squelchy.voicePattern[0][6][3] = { active: true, length: 1, accent: false, slide: true };   // A3 - slide
  squelchy.voicePattern[0][5][4] = { active: true, length: 1, accent: true, slide: false };   // C4
  squelchy.voicePattern[0][4][5] = { active: true, length: 1, accent: false, slide: true };   // D4 - slide
  squelchy.voicePattern[0][7][6] = { active: true, length: 1, accent: false, slide: false };  // G3
  squelchy.voicePattern[0][5][7] = { active: true, length: 1, accent: false, slide: true };   // C4 - slide
  squelchy.voicePattern[0][3][8] = { active: true, length: 1, accent: true, slide: false };   // E4
  squelchy.voicePattern[0][7][9] = { active: true, length: 1, accent: false, slide: true };   // G3 - slide
  squelchy.voicePattern[0][5][10] = { active: true, length: 1, accent: true, slide: false };  // C4
  squelchy.voicePattern[0][6][11] = { active: true, length: 1, accent: false, slide: true };  // A3 - slide
  squelchy.voicePattern[0][7][12] = { active: true, length: 1, accent: true, slide: false };  // G3
  squelchy.voicePattern[0][5][14] = { active: true, length: 1, accent: false, slide: true };  // C4 - slide
  // High melody on voice 2
  squelchy.voicePattern[1][0][0] = { active: true, length: 2, accent: true, slide: false };   // C5
  squelchy.voicePattern[1][1][4] = { active: true, length: 2, accent: false, slide: true };   // A4
  squelchy.voicePattern[1][3][8] = { active: true, length: 2, accent: true, slide: false };   // E4
  squelchy.voicePattern[1][2][12] = { active: true, length: 2, accent: false, slide: true };  // G4
  // Full drums
  [0,4,8,12].forEach(s => squelchy.drumPattern[0][s] = true);
  squelchy.drumPattern[2][4] = squelchy.drumPattern[2][12] = true;
  [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].forEach(s => squelchy.drumPattern[3][s] = true);

  // Pattern 3: Triple Layer Madness
  const tripleLayers = {
    name: "Triple 303",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Voice 1: Low pumping bass
  tripleLayers.voicePattern[0][7][0] = { active: true, length: 1, accent: true, slide: false };
  tripleLayers.voicePattern[0][5][2] = { active: true, length: 1, accent: false, slide: true };
  tripleLayers.voicePattern[0][7][4] = { active: true, length: 1, accent: true, slide: false };
  tripleLayers.voicePattern[0][6][6] = { active: true, length: 1, accent: false, slide: true };
  tripleLayers.voicePattern[0][7][8] = { active: true, length: 1, accent: true, slide: false };
  tripleLayers.voicePattern[0][5][10] = { active: true, length: 1, accent: false, slide: true };
  tripleLayers.voicePattern[0][4][12] = { active: true, length: 1, accent: true, slide: false };
  tripleLayers.voicePattern[0][5][14] = { active: true, length: 1, accent: false, slide: true };
  // Voice 2: Mid sliding melody
  tripleLayers.voicePattern[1][5][1] = { active: true, length: 1, accent: false, slide: true };
  tripleLayers.voicePattern[1][3][3] = { active: true, length: 1, accent: true, slide: false };
  tripleLayers.voicePattern[1][4][5] = { active: true, length: 1, accent: false, slide: true };
  tripleLayers.voicePattern[1][5][7] = { active: true, length: 1, accent: true, slide: false };
  tripleLayers.voicePattern[1][3][9] = { active: true, length: 1, accent: false, slide: true };
  tripleLayers.voicePattern[1][5][11] = { active: true, length: 1, accent: true, slide: false };
  tripleLayers.voicePattern[1][4][13] = { active: true, length: 1, accent: false, slide: true };
  tripleLayers.voicePattern[1][3][15] = { active: true, length: 1, accent: true, slide: false };
  // Voice 3: High stabs
  tripleLayers.voicePattern[2][0][0] = { active: true, length: 1, accent: true, slide: false };
  tripleLayers.voicePattern[2][2][4] = { active: true, length: 1, accent: true, slide: false };
  tripleLayers.voicePattern[2][1][8] = { active: true, length: 1, accent: true, slide: false };
  tripleLayers.voicePattern[2][3][12] = { active: true, length: 1, accent: true, slide: false };
  // Heavy drums
  [0,4,8,12].forEach(s => tripleLayers.drumPattern[0][s] = true);
  tripleLayers.drumPattern[2][4] = tripleLayers.drumPattern[2][12] = true;
  [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].forEach(s => tripleLayers.drumPattern[3][s] = true);
  tripleLayers.drumPattern[4][8] = true; // Open hat

  // Pattern 4: Filter Sweep Build
  const filterBuild = {
    name: "Filter Build",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Long sustained notes for filter sweep
  filterBuild.voicePattern[0][5][0] = { active: true, length: 8, accent: true, slide: false };   // C4 - long
  filterBuild.voicePattern[0][7][8] = { active: true, length: 8, accent: true, slide: false };   // G3 - long
  // High arpeggiated layer
  filterBuild.voicePattern[1][5][0] = { active: true, length: 1, accent: false, slide: false };
  filterBuild.voicePattern[1][3][1] = { active: true, length: 1, accent: false, slide: false };
  filterBuild.voicePattern[1][5][2] = { active: true, length: 1, accent: false, slide: false };
  filterBuild.voicePattern[1][2][3] = { active: true, length: 1, accent: false, slide: false };
  filterBuild.voicePattern[1][5][4] = { active: true, length: 1, accent: false, slide: false };
  filterBuild.voicePattern[1][3][5] = { active: true, length: 1, accent: false, slide: false };
  filterBuild.voicePattern[1][5][6] = { active: true, length: 1, accent: false, slide: false };
  filterBuild.voicePattern[1][2][7] = { active: true, length: 1, accent: false, slide: false };
  filterBuild.voicePattern[1][7][8] = { active: true, length: 1, accent: false, slide: false };
  filterBuild.voicePattern[1][5][9] = { active: true, length: 1, accent: false, slide: false };
  filterBuild.voicePattern[1][7][10] = { active: true, length: 1, accent: false, slide: false };
  filterBuild.voicePattern[1][4][11] = { active: true, length: 1, accent: false, slide: false };
  filterBuild.voicePattern[1][7][12] = { active: true, length: 1, accent: false, slide: false };
  filterBuild.voicePattern[1][5][13] = { active: true, length: 1, accent: false, slide: false };
  filterBuild.voicePattern[1][7][14] = { active: true, length: 1, accent: false, slide: false };
  filterBuild.voicePattern[1][4][15] = { active: true, length: 1, accent: false, slide: false };
  // Building drums - kicks only
  [0,4,8,10,12,14].forEach(s => filterBuild.drumPattern[0][s] = true);
  [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].forEach(s => filterBuild.drumPattern[3][s] = true);

  // Pattern 5: Peak Time Insanity
  const peak = {
    name: "Peak Time",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Voice 1: Frantic bass with every step
  [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].forEach((s, i) => {
    const notes = [7,5,3,5,7,4,5,7,3,5,7,6,5,7,3,5]; // Pattern: G3,C4,E4,C4...
    const accents = [0,4,8,12]; // Accent on beats
    peak.voicePattern[0][notes[i]][s] = { 
      active: true, 
      length: 1, 
      accent: accents.includes(s), 
      slide: i % 2 === 1 
    };
  });
  // Voice 2: High octave screaming 303
  peak.voicePattern[1][0][0] = { active: true, length: 1, accent: true, slide: false };
  peak.voicePattern[1][2][1] = { active: true, length: 1, accent: false, slide: true };
  peak.voicePattern[1][1][2] = { active: true, length: 1, accent: false, slide: false };
  peak.voicePattern[1][3][3] = { active: true, length: 1, accent: false, slide: true };
  peak.voicePattern[1][0][4] = { active: true, length: 1, accent: true, slide: false };
  peak.voicePattern[1][2][5] = { active: true, length: 1, accent: false, slide: true };
  peak.voicePattern[1][1][6] = { active: true, length: 1, accent: false, slide: false };
  peak.voicePattern[1][3][7] = { active: true, length: 1, accent: false, slide: true };
  peak.voicePattern[1][0][8] = { active: true, length: 1, accent: true, slide: false };
  peak.voicePattern[1][2][9] = { active: true, length: 1, accent: false, slide: true };
  peak.voicePattern[1][1][10] = { active: true, length: 1, accent: false, slide: false };
  peak.voicePattern[1][3][11] = { active: true, length: 1, accent: false, slide: true };
  peak.voicePattern[1][0][12] = { active: true, length: 1, accent: true, slide: false };
  peak.voicePattern[1][2][13] = { active: true, length: 1, accent: false, slide: true };
  peak.voicePattern[1][1][14] = { active: true, length: 1, accent: false, slide: false };
  peak.voicePattern[1][3][15] = { active: true, length: 1, accent: false, slide: true };
  // Voice 3: Stab accents
  peak.voicePattern[2][0][0] = { active: true, length: 1, accent: true, slide: false };
  peak.voicePattern[2][1][4] = { active: true, length: 1, accent: true, slide: false };
  peak.voicePattern[2][2][8] = { active: true, length: 1, accent: true, slide: false };
  peak.voicePattern[2][3][12] = { active: true, length: 1, accent: true, slide: false };
  // Maximum drums
  [0,4,8,12].forEach(s => peak.drumPattern[0][s] = true);
  peak.drumPattern[2][4] = peak.drumPattern[2][12] = true;
  [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].forEach(s => peak.drumPattern[3][s] = true);
  peak.drumPattern[4][8] = true; // Open hat
  peak.drumPattern[6][0] = peak.drumPattern[6][8] = true; // Crash accents

  return {
    name: "Hardfloor - Acperience Style",
    bpm: 140,
    
    patternLibrary: [
      intro,
      mainGroove,
      squelchy,
      tripleLayers,
      filterBuild,
      peak
    ],
    
    songArrangement: [
      0, 0,              // Intro - deep groove
      1, 1, 1, 1,        // Main groove
      2, 2, 2, 2,        // Squelchy madness
      3, 3, 3, 3,        // Triple layers
      4, 4,              // Filter build
      5, 5, 5, 5,        // Peak time insanity
      3, 3,              // Back to triple
      2, 2,              // Squelchy outro
      null, null, null, null
    ],
    
    waveTypes: ['sawtooth', 'sawtooth', 'pulse'],
    octaves: [-1, 0, -1],
    
    voiceSettings: [
      // Voice 1: Deep squelchy 303 bass
      {
        adsr: { attack: 0.001, decay: 0.04, sustain: 0.3, release: 0.02 },
        pwm: { pulseWidth: 0.5 },
        arpeggio: { enabled: false, speed: 2, intervals: [0, 4, 7] },
        vibrato: { enabled: false, rate: 5, depth: 0.3 },
        filterEnvelope: { 
          enabled: true, 
          amount: 0.98,
          attack: 0.001,
          decay: 0.06,
          sustain: 0.05,
          release: 0.02,
          baseFreq: 250
        },
        volumeEnvelope: { 
          enabled: true, 
          accent: 2.5
        }
      },
      
      // Voice 2: Screaming high 303
      {
        adsr: { attack: 0.001, decay: 0.05, sustain: 0.4, release: 0.03 },
        pwm: { pulseWidth: 0.35 },
        arpeggio: { enabled: false, speed: 1, intervals: [0, 4, 7] },
        vibrato: { enabled: false, rate: 6, depth: 0.4 },
        filterEnvelope: { 
          enabled: true, 
          amount: 0.9,
          attack: 0.001,
          decay: 0.1,
          sustain: 0.1,
          release: 0.04,
          baseFreq: 500
        },
        volumeEnvelope: { 
          enabled: true, 
          accent: 2.2
        }
      },
      
      // Voice 3: Punchy stabs
      {
        adsr: { attack: 0.001, decay: 0.08, sustain: 0.5, release: 0.06 },
        pwm: { pulseWidth: 0.4 },
        arpeggio: { enabled: false, speed: 0, intervals: [0, 4, 7, 12] },
        vibrato: { enabled: false, rate: 4, depth: 0.2 },
        filterEnvelope: { 
          enabled: true, 
          amount: 0.75,
          attack: 0.005,
          decay: 0.15,
          sustain: 0.3,
          release: 0.1,
          baseFreq: 800
        },
        volumeEnvelope: { 
          enabled: true, 
          accent: 1.9
        }
      }
    ],
    
    mixerSettings: [
      // Voice 1: Deep bass - max resonance
      {
        volume: 1.0,
        lpEnabled: true,
        lpFreq: 1600,
        lpQ: 20,
        hpEnabled: false,
        hpFreq: 200,
        delayEnabled: true,
        delayTime: 0.375,
        delayFeedback: 0.45,
        delayMix: 0.25
      },
      
      // Voice 2: High 303 - screaming resonance
      {
        volume: 0.9,
        lpEnabled: true,
        lpFreq: 2800,
        lpQ: 18,
        hpEnabled: false,
        hpFreq: 200,
        delayEnabled: true,
        delayTime: 0.25,
        delayFeedback: 0.4,
        delayMix: 0.3
      },
      
      // Voice 3: Stabs - punchy with less resonance
      {
        volume: 0.75,
        lpEnabled: true,
        lpFreq: 3500,
        lpQ: 12,
        hpEnabled: false,
        hpFreq: 200,
        delayEnabled: true,
        delayTime: 0.5,
        delayFeedback: 0.5,
        delayMix: 0.35
      }
    ]
  };
}
