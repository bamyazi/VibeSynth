/**
 * Daft Punk Style Demo
 * Funky filtered house with vocodered vibes and robotic grooves
 * French touch house inspired patterns
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
  
  // Pattern 0: Funky Bassline
  const funkyBass = {
    name: "Funky Bass",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Syncopated funk bass
  funkyBass.voicePattern[0][7][0] = { active: true, length: 2, accent: true, slide: false };     // G3
  funkyBass.voicePattern[0][6][3] = { active: true, length: 1, accent: false, slide: true };     // A3 slide
  funkyBass.voicePattern[0][7][4] = { active: true, length: 1, accent: false, slide: false };    // G3
  funkyBass.voicePattern[0][5][6] = { active: true, length: 1, accent: true, slide: false };     // C4
  funkyBass.voicePattern[0][7][7] = { active: true, length: 1, accent: false, slide: false };    // G3
  funkyBass.voicePattern[0][7][8] = { active: true, length: 2, accent: true, slide: false };     // G3
  funkyBass.voicePattern[0][4][11] = { active: true, length: 1, accent: false, slide: true };    // D4 slide
  funkyBass.voicePattern[0][5][12] = { active: true, length: 1, accent: false, slide: false };   // C4
  funkyBass.voicePattern[0][6][14] = { active: true, length: 1, accent: true, slide: false };    // A3
  // Four on floor
  [0,4,8,12].forEach(s => funkyBass.drumPattern[0][s] = true);
  // Offbeat hats
  [2,6,10,14].forEach(s => funkyBass.drumPattern[3][s] = true);

  // Pattern 1: Filter Disco
  const filterDisco = {
    name: "Filter Disco",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Same bass
  filterDisco.voicePattern[0][7][0] = { active: true, length: 2, accent: true, slide: false };
  filterDisco.voicePattern[0][6][3] = { active: true, length: 1, accent: false, slide: true };
  filterDisco.voicePattern[0][7][4] = { active: true, length: 1, accent: false, slide: false };
  filterDisco.voicePattern[0][5][6] = { active: true, length: 1, accent: true, slide: false };
  filterDisco.voicePattern[0][7][7] = { active: true, length: 1, accent: false, slide: false };
  filterDisco.voicePattern[0][7][8] = { active: true, length: 2, accent: true, slide: false };
  filterDisco.voicePattern[0][4][11] = { active: true, length: 1, accent: false, slide: true };
  filterDisco.voicePattern[0][5][12] = { active: true, length: 1, accent: false, slide: false };
  filterDisco.voicePattern[0][6][14] = { active: true, length: 1, accent: true, slide: false };
  // Chord stabs
  filterDisco.voicePattern[1][5][1] = { active: true, length: 1, accent: true, slide: false };   // C4
  filterDisco.voicePattern[1][3][3] = { active: true, length: 1, accent: false, slide: false };  // E4
  filterDisco.voicePattern[1][5][5] = { active: true, length: 1, accent: true, slide: false };   // C4
  filterDisco.voicePattern[1][4][9] = { active: true, length: 1, accent: true, slide: false };   // D4
  filterDisco.voicePattern[1][3][11] = { active: true, length: 1, accent: false, slide: false }; // E4
  filterDisco.voicePattern[1][5][13] = { active: true, length: 1, accent: true, slide: false };  // C4
  // Four on floor + claps
  [0,4,8,12].forEach(s => filterDisco.drumPattern[0][s] = true);
  filterDisco.drumPattern[2][4] = filterDisco.drumPattern[2][12] = true;
  [0,2,4,6,8,10,12,14].forEach(s => filterDisco.drumPattern[3][s] = true);

  // Pattern 2: Robotic Groove
  const roboticGroove = {
    name: "Robotic Groove",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Pumping bass
  [0,2,4,6,8,10,12,14].forEach(s => {
    roboticGroove.voicePattern[0][7][s] = { active: true, length: 1, accent: s % 4 === 0, slide: false };
  });
  // Arpeggio pattern
  [1,5,9,13].forEach(s => roboticGroove.voicePattern[1][5][s] = { active: true, length: 1, accent: false, slide: false });
  [3,7,11,15].forEach(s => roboticGroove.voicePattern[1][3][s] = { active: true, length: 1, accent: false, slide: false });
  // Full drums
  [0,4,8,12].forEach(s => roboticGroove.drumPattern[0][s] = true);
  roboticGroove.drumPattern[2][4] = roboticGroove.drumPattern[2][12] = true;
  [0,2,4,6,8,10,12,14].forEach(s => roboticGroove.drumPattern[3][s] = true);
  roboticGroove.drumPattern[4][8] = true;

  // Pattern 3: Breakdown
  const breakdown = {
    name: "Breakdown",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Sparse bass
  breakdown.voicePattern[0][7][0] = { active: true, length: 4, accent: true, slide: false };
  breakdown.voicePattern[0][5][8] = { active: true, length: 4, accent: true, slide: false };
  // High pads
  breakdown.voicePattern[2][0][0] = { active: true, length: 16, accent: false, slide: false };
  // Minimal drums
  [0,8].forEach(s => breakdown.drumPattern[0][s] = true);
  [4,12].forEach(s => breakdown.drumPattern[3][s] = true);

  // Pattern 4: Buildup
  const buildup = {
    name: "Buildup",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Rising bass
  buildup.voicePattern[0][7][0] = { active: true, length: 2, accent: true, slide: false };
  buildup.voicePattern[0][6][2] = { active: true, length: 2, accent: true, slide: true };
  buildup.voicePattern[0][5][4] = { active: true, length: 2, accent: true, slide: true };
  buildup.voicePattern[0][4][6] = { active: true, length: 2, accent: true, slide: true };
  buildup.voicePattern[0][7][8] = { active: true, length: 2, accent: true, slide: false };
  buildup.voicePattern[0][6][10] = { active: true, length: 2, accent: true, slide: true };
  buildup.voicePattern[0][5][12] = { active: true, length: 2, accent: true, slide: true };
  buildup.voicePattern[0][4][14] = { active: true, length: 2, accent: true, slide: true };
  // Ascending lead
  [0,2,4,6,8,10,12,14].forEach((s,i) => {
    const notes = [5,4,3,2,5,4,3,2];
    buildup.voicePattern[1][notes[i]][s] = { active: true, length: 1, accent: true, slide: false };
  });
  // Building drums
  [0,2,4,6,8,10,12,14].forEach(s => buildup.drumPattern[0][s] = true);
  [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].forEach(s => buildup.drumPattern[3][s] = true);

  // Pattern 5: Peak Drop
  const peakDrop = {
    name: "Peak Drop",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Heavy bass
  peakDrop.voicePattern[0][7][0] = { active: true, length: 2, accent: true, slide: false };
  peakDrop.voicePattern[0][6][3] = { active: true, length: 1, accent: false, slide: true };
  peakDrop.voicePattern[0][7][4] = { active: true, length: 1, accent: false, slide: false };
  peakDrop.voicePattern[0][5][6] = { active: true, length: 1, accent: true, slide: false };
  peakDrop.voicePattern[0][7][7] = { active: true, length: 1, accent: false, slide: false };
  peakDrop.voicePattern[0][7][8] = { active: true, length: 2, accent: true, slide: false };
  peakDrop.voicePattern[0][4][11] = { active: true, length: 1, accent: false, slide: true };
  peakDrop.voicePattern[0][5][12] = { active: true, length: 1, accent: false, slide: false };
  peakDrop.voicePattern[0][6][14] = { active: true, length: 1, accent: true, slide: false };
  // Stab chords
  [1,5,9,13].forEach(s => {
    peakDrop.voicePattern[1][5][s] = { active: true, length: 1, accent: true, slide: false };
    peakDrop.voicePattern[1][3][s] = { active: true, length: 1, accent: true, slide: false };
  });
  // Heavy drums
  [0,4,8,12].forEach(s => peakDrop.drumPattern[0][s] = true);
  peakDrop.drumPattern[2][4] = peakDrop.drumPattern[2][12] = true;
  [0,2,4,6,8,10,12,14].forEach(s => peakDrop.drumPattern[3][s] = true);
  peakDrop.drumPattern[4][0] = peakDrop.drumPattern[4][8] = true;


  return {
    name: "French Touch House",
    bpm: 124,
    
    patternLibrary: [
      funkyBass,
      filterDisco,
      roboticGroove,
      breakdown,
      buildup,
      peakDrop
    ],
    
    songArrangement: [
      0, 0, 0, 0,        // Intro - funky bass
      1, 1, 1, 1,        // Add chords
      2, 2, 2, 2,        // Robotic groove
      1, 1,              // Back to disco
      3, 3,              // Breakdown
      4, 4,              // Buildup
      5, 5, 5, 5,        // Peak drop
      2, 2, 2, 2,        // Robotic return
      1, 1,              // Wind down
      0, 0,              // Outro
      null, null
    ],
    
    waveTypes: ['sawtooth', 'pulse', 'noise'],
    octaves: [-2, 0, 1],
    
    voiceSettings: [
      // Voice 1: Funky filtered bass
      {
        adsr: { attack: 0.003, decay: 0.12, sustain: 0.7, release: 0.15 },
        pwm: { pulseWidth: 0.5 },
        arpeggio: { enabled: false, speed: 2, intervals: [0, 4, 7] },
        vibrato: { enabled: false, rate: 5, depth: 0.3 },
        filterEnvelope: { 
          enabled: true, 
          amount: 0.75,
          attack: 0.002,
          decay: 0.2,
          sustain: 0.3,
          release: 0.15,
          baseFreq: 400
        },
        volumeEnvelope: { 
          enabled: true, 
          accent: 1.8
        },
        distortion: {
          enabled: true,
          amount: 25,
          mix: 0.3
        },
        detune: {
          enabled: false,
          voices: 1,
          spread: 0
        }
      },
      
      // Voice 2: Chord stabs and arpeggios
      {
        adsr: { attack: 0.005, decay: 0.15, sustain: 0.6, release: 0.2 },
        pwm: { pulseWidth: 0.5 },
        arpeggio: { enabled: false, speed: 1, intervals: [0, 4, 7] },
        vibrato: { enabled: false, rate: 5, depth: 0.2 },
        filterEnvelope: { 
          enabled: true, 
          amount: 0.7,
          attack: 0.005,
          decay: 0.18,
          sustain: 0.4,
          release: 0.2,
          baseFreq: 800
        },
        volumeEnvelope: { 
          enabled: true, 
          accent: 1.6
        },
        distortion: {
          enabled: true,
          amount: 20,
          mix: 0.25
        },
        detune: {
          enabled: true,
          voices: 2,
          spread: 12
        }
      },
      
      // Voice 3: Atmospheric pad/noise
      {
        adsr: { attack: 0.2, decay: 0.3, sustain: 0.8, release: 0.4 },
        pwm: { pulseWidth: 0.3 },
        arpeggio: { enabled: false, speed: 0, intervals: [0, 4, 7, 12] },
        vibrato: { enabled: true, rate: 3, depth: 0.15 },
        filterEnvelope: { 
          enabled: true, 
          amount: 0.3,
          attack: 0.1,
          decay: 0.5,
          sustain: 0.6,
          release: 0.4,
          baseFreq: 2000
        },
        volumeEnvelope: { 
          enabled: false, 
          accent: 1.0
        }
      }
    ],
    
    mixerSettings: [
      // Voice 1: Reese bass - nasty and aggressive
      // Voice 1: Funky bass - warm filter
      {
        volume: 0.9,
        lpEnabled: true,
        lpFreq: 800,
        lpQ: 8,
        hpEnabled: true,
        hpFreq: 40,
        delayEnabled: false,
        delayTime: 0.375,
        delayFeedback: 0.45,
        delayMix: 0.25
      },
      
      // Voice 2: Chord/arp - filtered with delay
      {
        volume: 0.75,
        lpEnabled: true,
        lpFreq: 2500,
        lpQ: 5,
        hpEnabled: true,
        hpFreq: 100,
        delayEnabled: true,
        delayTime: 0.1875,
        delayFeedback: 0.5,
        delayMix: 0.35
      },
      
      // Voice 3: Pad - wide stereo delay
      {
        volume: 0.5,
        lpEnabled: true,
        lpFreq: 5000,
        lpQ: 2,
        hpEnabled: true,
        hpFreq: 400,
        delayEnabled: true,
        delayTime: 0.5,
        delayFeedback: 0.6,
        delayMix: 0.5
      }
    ]
  };
}
