/**
 * Dark Minimal Techno Demo
 * Deep rolling basslines, hypnotic sequences, and industrial textures
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
  
  // Pattern 0: Deep Rolling Bass
  const rollingBass = {
    name: "Rolling Bass",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Deep, hypnotic rolling bassline
  rollingBass.voicePattern[0][7][0] = { active: true, length: 2, accent: false, slide: false };   // G3
  rollingBass.voicePattern[0][6][2] = { active: true, length: 2, accent: false, slide: false };   // A3
  rollingBass.voicePattern[0][7][4] = { active: true, length: 2, accent: false, slide: false };   // G3
  rollingBass.voicePattern[0][5][6] = { active: true, length: 2, accent: false, slide: false };   // C4
  rollingBass.voicePattern[0][7][8] = { active: true, length: 2, accent: false, slide: false };   // G3
  rollingBass.voicePattern[0][6][10] = { active: true, length: 2, accent: false, slide: false };  // A3
  rollingBass.voicePattern[0][7][12] = { active: true, length: 2, accent: false, slide: false };  // G3
  rollingBass.voicePattern[0][4][14] = { active: true, length: 2, accent: false, slide: false };  // D4
  // Minimal kick pattern
  [0,6,8,14].forEach(s => rollingBass.drumPattern[0][s] = true);

  // Pattern 1: Bass + Percussion
  const bassPerc = {
    name: "Bass + Perc",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Same rolling bass
  bassPerc.voicePattern[0][7][0] = { active: true, length: 2, accent: false, slide: false };
  bassPerc.voicePattern[0][6][2] = { active: true, length: 2, accent: false, slide: false };
  bassPerc.voicePattern[0][7][4] = { active: true, length: 2, accent: false, slide: false };
  bassPerc.voicePattern[0][5][6] = { active: true, length: 2, accent: false, slide: false };
  bassPerc.voicePattern[0][7][8] = { active: true, length: 2, accent: false, slide: false };
  bassPerc.voicePattern[0][6][10] = { active: true, length: 2, accent: false, slide: false };
  bassPerc.voicePattern[0][7][12] = { active: true, length: 2, accent: false, slide: false };
  bassPerc.voicePattern[0][4][14] = { active: true, length: 2, accent: false, slide: false };
  // Techno percussion
  [0,4,8,12].forEach(s => bassPerc.drumPattern[0][s] = true);  // 4/4 kick
  bassPerc.drumPattern[3][2] = bassPerc.drumPattern[3][6] = bassPerc.drumPattern[3][10] = bassPerc.drumPattern[3][14] = true;  // Offbeat hats
  bassPerc.drumPattern[5][4] = bassPerc.drumPattern[5][12] = true;  // Tom accents

  // Pattern 2: Melodic Sequence
  const melodicSeq = {
    name: "Melodic Seq",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Bass - more aggressive with slides
  melodicSeq.voicePattern[0][7][0] = { active: true, length: 1, accent: true, slide: false };    // G3
  melodicSeq.voicePattern[0][6][1] = { active: true, length: 1, accent: false, slide: true };    // A3 slide
  melodicSeq.voicePattern[0][7][4] = { active: true, length: 1, accent: true, slide: false };    // G3
  melodicSeq.voicePattern[0][5][6] = { active: true, length: 2, accent: false, slide: true };    // C4 slide
  melodicSeq.voicePattern[0][7][8] = { active: true, length: 1, accent: true, slide: false };    // G3
  melodicSeq.voicePattern[0][6][10] = { active: true, length: 1, accent: false, slide: false };  // A3
  melodicSeq.voicePattern[0][4][11] = { active: true, length: 1, accent: false, slide: true };   // D4 slide
  melodicSeq.voicePattern[0][7][14] = { active: true, length: 2, accent: false, slide: false };  // G3
  // Melodic sequence - syncopated with slides
  melodicSeq.voicePattern[1][5][0] = { active: true, length: 1, accent: false, slide: false };   // C4
  melodicSeq.voicePattern[1][4][2] = { active: true, length: 1, accent: false, slide: true };    // D4 slide
  melodicSeq.voicePattern[1][3][3] = { active: true, length: 1, accent: true, slide: false };    // E4
  melodicSeq.voicePattern[1][2][6] = { active: true, length: 2, accent: false, slide: false };   // G4
  melodicSeq.voicePattern[1][5][8] = { active: true, length: 1, accent: false, slide: false };   // C4
  melodicSeq.voicePattern[1][4][10] = { active: true, length: 1, accent: false, slide: true };   // D4 slide
  melodicSeq.voicePattern[1][3][11] = { active: true, length: 1, accent: true, slide: false };   // E4
  melodicSeq.voicePattern[1][2][14] = { active: true, length: 2, accent: false, slide: false };  // G4
  // Drums - more driving
  [0,4,8,12].forEach(s => melodicSeq.drumPattern[0][s] = true);
  melodicSeq.drumPattern[2][6] = melodicSeq.drumPattern[2][14] = true; // Claps
  [2,6,10,14].forEach(s => melodicSeq.drumPattern[3][s] = true); // Hats
  melodicSeq.drumPattern[4][4] = melodicSeq.drumPattern[4][12] = true; // Open hats

  // Pattern 3: Drone + Stabs
  const droneStabs = {
    name: "Drone Stabs",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Low drone
  droneStabs.voicePattern[0][7][0] = { active: true, length: 16, accent: false, slide: false };  // G3 drone
  // Mid rhythmic stabs
  droneStabs.voicePattern[1][5][4] = { active: true, length: 1, accent: true, slide: false };
  droneStabs.voicePattern[1][4][6] = { active: true, length: 1, accent: false, slide: false };
  droneStabs.voicePattern[1][5][8] = { active: true, length: 1, accent: true, slide: false };
  droneStabs.voicePattern[1][4][10] = { active: true, length: 1, accent: false, slide: false };
  droneStabs.voicePattern[1][5][12] = { active: true, length: 1, accent: true, slide: false };
  droneStabs.voicePattern[1][3][14] = { active: true, length: 1, accent: false, slide: false };
  // High bell-like tones
  droneStabs.voicePattern[2][0][0] = { active: true, length: 4, accent: false, slide: false };
  droneStabs.voicePattern[2][2][8] = { active: true, length: 4, accent: false, slide: false };
  // Drums
  [0,4,8,12].forEach(s => droneStabs.drumPattern[0][s] = true);
  droneStabs.drumPattern[2][8] = true;  // Clap
  droneStabs.drumPattern[3][2] = droneStabs.drumPattern[3][6] = droneStabs.drumPattern[3][10] = droneStabs.drumPattern[3][14] = true;

  // Pattern 4: Industrial Breakdown
  const industrial = {
    name: "Industrial",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Dissonant noise stabs
  industrial.voicePattern[0][7][0] = { active: true, length: 1, accent: true, slide: false };
  industrial.voicePattern[0][6][3] = { active: true, length: 1, accent: true, slide: false };
  industrial.voicePattern[0][7][6] = { active: true, length: 1, accent: true, slide: false };
  industrial.voicePattern[0][5][9] = { active: true, length: 1, accent: true, slide: false };
  industrial.voicePattern[0][7][12] = { active: true, length: 1, accent: true, slide: false };
  // High noise texture
  industrial.voicePattern[2][0][1] = { active: true, length: 1, accent: false, slide: false };
  industrial.voicePattern[2][1][5] = { active: true, length: 1, accent: false, slide: false };
  industrial.voicePattern[2][0][9] = { active: true, length: 1, accent: false, slide: false };
  industrial.voicePattern[2][1][13] = { active: true, length: 1, accent: false, slide: false };
  // Sparse drums
  industrial.drumPattern[0][0] = industrial.drumPattern[0][12] = true;
  industrial.drumPattern[5][4] = industrial.drumPattern[5][8] = true;
  [1,3,5,7,9,11,13,15].forEach(s => industrial.drumPattern[3][s] = true);

  // Pattern 5: Peak Hypnosis
  const peakHypnosis = {
    name: "Peak Hypnosis",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: createEmptyDrumPattern()
  };
  // Pumping bass
  [0,2,4,6,8,10,12,14].forEach(s => {
    const notes = [7,6,7,5,7,6,7,4]; // G3,A3,G3,C4,G3,A3,G3,D4
    peakHypnosis.voicePattern[0][notes[s/2]][s] = { active: true, length: 2, accent: s % 4 === 0, slide: false };
  });
  // Fast arpeggio
  [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].forEach(s => {
    const notes = [2,5,4,2,3,5,2,4,2,5,4,2,3,5,2,4]; // Repeating pattern
    peakHypnosis.voicePattern[1][notes[s]][s] = { active: true, length: 1, accent: false, slide: false };
  });
  // High sustained note
  peakHypnosis.voicePattern[2][0][0] = { active: true, length: 8, accent: false, slide: false };
  peakHypnosis.voicePattern[2][1][8] = { active: true, length: 8, accent: false, slide: false };
  // Full drums
  [0,4,8,12].forEach(s => peakHypnosis.drumPattern[0][s] = true);
  peakHypnosis.drumPattern[2][4] = peakHypnosis.drumPattern[2][12] = true;
  [0,2,4,6,8,10,12,14].forEach(s => peakHypnosis.drumPattern[3][s] = true);
  peakHypnosis.drumPattern[4][8] = true;

  return {
    name: "Dark Minimal Techno",
    bpm: 126,
    
    patternLibrary: [
      rollingBass,
      bassPerc,
      melodicSeq,
      droneStabs,
      industrial,
      peakHypnosis
    ],
    
    songArrangement: [
      0, 0, 0, 0,        // Deep intro
      1, 1, 1, 1,        // Add percussion
      2, 2, 2, 2,        // Melodic sequence
      3, 3, 3, 3,        // Drone and stabs
      4, 4,              // Industrial breakdown
      5, 5, 5, 5,        // Peak hypnosis
      2, 2,              // Return to melodic
      0, 0,              // Outro
      null, null, null, null
    ],
    
    waveTypes: ['sawtooth', 'pulse', 'noise'],
    octaves: [-2, 0, 1],
    
    voiceSettings: [
      // Voice 1: Hard Reese bass - detuned saws with distortion
      {
        adsr: { attack: 0.005, decay: 0.1, sustain: 0.8, release: 0.15 },
        pwm: { pulseWidth: 0.5 },
        arpeggio: { enabled: false, speed: 2, intervals: [0, 4, 7] },
        vibrato: { enabled: false, rate: 5, depth: 0.3 },
        filterEnvelope: { 
          enabled: true, 
          amount: 0.7,
          attack: 0.01,
          decay: 0.2,
          sustain: 0.3,
          release: 0.15,
          baseFreq: 400
        },
        volumeEnvelope: { 
          enabled: true, 
          accent: 1.5
        },
        distortion: {
          enabled: true,
          amount: 35,
          mix: 0.6
        },
        detune: {
          enabled: true,
          voices: 4,
          spread: 18
        }
      },
      
      // Voice 2: Melodic sequencer
      {
        adsr: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 0.08 },
        pwm: { pulseWidth: 0.6 },
        arpeggio: { enabled: false, speed: 1, intervals: [0, 4, 7] },
        vibrato: { enabled: false, rate: 6, depth: 0.4 },
        filterEnvelope: { 
          enabled: true, 
          amount: 0.6,
          attack: 0.005,
          decay: 0.2,
          sustain: 0.2,
          release: 0.1,
          baseFreq: 1200
        },
        volumeEnvelope: { 
          enabled: true, 
          accent: 1.5
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
      // Voice 1: Reese bass - tight low-pass for aggression
      {
        volume: 0.9,
        lpEnabled: true,
        lpFreq: 800,
        lpQ: 8,
        hpEnabled: true,
        hpFreq: 30,
        delayEnabled: false,
        delayTime: 0.375,
        delayFeedback: 0.45,
        delayMix: 0.25
      },
      
      // Voice 2: Melodic - moderate filter with delay
      {
        volume: 0.7,
        lpEnabled: true,
        lpFreq: 3500,
        lpQ: 6,
        hpEnabled: true,
        hpFreq: 300,
        delayEnabled: true,
        delayTime: 0.375,
        delayFeedback: 0.5,
        delayMix: 0.4
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
