// Default demo song patterns
import { SEQUENCER_CONFIG } from '../config.js';

const numSteps = SEQUENCER_CONFIG.numSteps;
const numVoices = SEQUENCER_CONFIG.numVoices;

export function loadDefaultSong(pattern, drumPattern, patternLibrary, songArrangement, callbacks) {
  const drumNames = callbacks.getDrumNames();
  const notes = callbacks.getNotes();
  
  // Helper to create empty voice pattern with proper note objects
  const createEmptyVoicePattern = () => 
    pattern.map(voice => voice.map(row => 
      Array(numSteps).fill(null).map(() => ({ active: false, length: 1 }))
    ));
  
  // Pattern 1: Bass line
  const bassPattern = {
    name: "Bass Groove",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: drumPattern.map(row => Array(numSteps).fill(false))
  };
  // C3 bass on beats
  bassPattern.voicePattern[0][7][0].active = true;
  bassPattern.voicePattern[0][7][4].active = true;
  bassPattern.voicePattern[0][7][8].active = true;
  bassPattern.voicePattern[0][7][12].active = true;
  // Add some variation
  bassPattern.voicePattern[0][6][6].active = true;
  bassPattern.voicePattern[0][6][14].active = true;
  
  // Pattern 2: Lead melody
  const leadPattern = {
    name: "Lead Melody",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: drumPattern.map(row => Array(numSteps).fill(false))
  };
  // Melody line
  leadPattern.voicePattern[1][0][0].active = true;
  leadPattern.voicePattern[1][1][2].active = true;
  leadPattern.voicePattern[1][2][4].active = true;
  leadPattern.voicePattern[1][3][6].active = true;
  leadPattern.voicePattern[1][2][8].active = true;
  leadPattern.voicePattern[1][1][10].active = true;
  leadPattern.voicePattern[1][0][12].active = true;
  leadPattern.voicePattern[1][1][14].active = true;
  
  // Pattern 3: Bass + Lead combo
  const comboPattern = {
    name: "Bass + Lead",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: drumPattern.map(row => Array(numSteps).fill(false))
  };
  // Bass
  comboPattern.voicePattern[0][7][0].active = true;
  comboPattern.voicePattern[0][7][4].active = true;
  comboPattern.voicePattern[0][7][8].active = true;
  comboPattern.voicePattern[0][7][12].active = true;
  // Lead
  comboPattern.voicePattern[1][0][1].active = true;
  comboPattern.voicePattern[1][2][3].active = true;
  comboPattern.voicePattern[1][4][5].active = true;
  comboPattern.voicePattern[1][3][7].active = true;
  comboPattern.voicePattern[1][2][9].active = true;
  comboPattern.voicePattern[1][0][11].active = true;
  
  // Pattern 4: Kick + Hat
  const drumPattern1 = {
    name: "Kick + Hat",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: drumPattern.map(row => Array(numSteps).fill(false))
  };
  // Kick on 1 and 3
  drumPattern1.drumPattern[0][0] = true;
  drumPattern1.drumPattern[0][8] = true;
  // Closed hat 8ths
  for (let i = 0; i < 16; i += 2) {
    drumPattern1.drumPattern[3][i] = true;
  }
  
  // Pattern 5: Full drums
  const drumPattern2 = {
    name: "Full Drums",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: drumPattern.map(row => Array(numSteps).fill(false))
  };
  // Kick
  drumPattern2.drumPattern[0][0] = true;
  drumPattern2.drumPattern[0][6] = true;
  drumPattern2.drumPattern[0][8] = true;
  drumPattern2.drumPattern[0][14] = true;
  // Snare
  drumPattern2.drumPattern[1][4] = true;
  drumPattern2.drumPattern[1][12] = true;
  // Closed hat
  for (let i = 0; i < 16; i += 2) {
    drumPattern2.drumPattern[3][i] = true;
  }
  // Open hat accents
  drumPattern2.drumPattern[4][7] = true;
  drumPattern2.drumPattern[4][15] = true;
  
  // Pattern 6: Bass + Full Drums
  const fullGroove = {
    name: "Full Groove",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: drumPattern.map(row => Array(numSteps).fill(false))
  };
  // Bass
  fullGroove.voicePattern[0][7][0].active = true;
  fullGroove.voicePattern[0][7][4].active = true;
  fullGroove.voicePattern[0][6][6].active = true;
  fullGroove.voicePattern[0][7][8].active = true;
  fullGroove.voicePattern[0][7][12].active = true;
  fullGroove.voicePattern[0][6][14].active = true;
  // Kick
  fullGroove.drumPattern[0][0] = true;
  fullGroove.drumPattern[0][6] = true;
  fullGroove.drumPattern[0][8] = true;
  fullGroove.drumPattern[0][14] = true;
  // Snare
  fullGroove.drumPattern[1][4] = true;
  fullGroove.drumPattern[1][12] = true;
  // Hats
  for (let i = 0; i < 16; i += 2) {
    fullGroove.drumPattern[3][i] = true;
  }
  
  // Pattern 7: Full song
  const fullSong = {
    name: "Full Song",
    voicePattern: createEmptyVoicePattern(),
    drumPattern: drumPattern.map(row => Array(numSteps).fill(false))
  };
  // Bass
  fullSong.voicePattern[0][7][0].active = true;
  fullSong.voicePattern[0][7][4].active = true;
  fullSong.voicePattern[0][6][6].active = true;
  fullSong.voicePattern[0][7][8].active = true;
  fullSong.voicePattern[0][7][12].active = true;
  fullSong.voicePattern[0][5][14].active = true;
  // Lead melody
  fullSong.voicePattern[1][0][1].active = true;
  fullSong.voicePattern[1][2][3].active = true;
  fullSong.voicePattern[1][4][5].active = true;
  fullSong.voicePattern[1][3][7].active = true;
  fullSong.voicePattern[1][2][9].active = true;
  fullSong.voicePattern[1][0][11].active = true;
  fullSong.voicePattern[1][1][13].active = true;
  fullSong.voicePattern[1][0][15].active = true;
  // Noise hi-hat
  fullSong.voicePattern[2][0][0].active = true;
  fullSong.voicePattern[2][0][2].active = true;
  fullSong.voicePattern[2][0][4].active = true;
  fullSong.voicePattern[2][0][6].active = true;
  fullSong.voicePattern[2][0][8].active = true;
  fullSong.voicePattern[2][0][10].active = true;
  fullSong.voicePattern[2][0][12].active = true;
  fullSong.voicePattern[2][0][14].active = true;
  // Drums
  fullSong.drumPattern[0][0] = true;
  fullSong.drumPattern[0][6] = true;
  fullSong.drumPattern[0][8] = true;
  fullSong.drumPattern[0][14] = true;
  fullSong.drumPattern[1][4] = true;
  fullSong.drumPattern[1][12] = true;
  for (let i = 0; i < 16; i += 2) {
    fullSong.drumPattern[3][i] = true;
  }
  fullSong.drumPattern[4][7] = true;
  fullSong.drumPattern[4][15] = true;
  
  // Add patterns to library
  patternLibrary.push(bassPattern);
  patternLibrary.push(leadPattern);
  patternLibrary.push(comboPattern);
  patternLibrary.push(drumPattern1);
  patternLibrary.push(drumPattern2);
  patternLibrary.push(fullGroove);
  patternLibrary.push(fullSong);
  
  // Set up song arrangement
  songArrangement[0] = 3;  // Kick + Hat
  songArrangement[1] = 3;  // Kick + Hat
  songArrangement[2] = 4;  // Full Drums
  songArrangement[3] = 4;  // Full Drums
  songArrangement[4] = 0;  // Bass Groove
  songArrangement[5] = 0;  // Bass Groove
  songArrangement[6] = 5;  // Full Groove
  songArrangement[7] = 5;  // Full Groove
  songArrangement[8] = 2;  // Bass + Lead
  songArrangement[9] = 2;  // Bass + Lead
  songArrangement[10] = 6; // Full Song
  songArrangement[11] = 6; // Full Song
  songArrangement[12] = 6; // Full Song
  songArrangement[13] = 6; // Full Song
  songArrangement[14] = 5; // Full Groove
  songArrangement[15] = 5; // Full Groove
  
  // Update UI
  callbacks.updatePatternLibraryUI();
  
  // Update song slots UI
  songArrangement.forEach((patternIndex, slotIndex) => {
    if (patternIndex !== null) {
      const slot = document.querySelector(`.song-slot[data-slot-index="${slotIndex}"]`);
      if (slot && patternLibrary[patternIndex]) {
        slot.classList.add('filled');
        slot.textContent = `${slotIndex + 1}: ${patternLibrary[patternIndex].name}`;
      }
    }
  });
  
  // Load first pattern into editor
  callbacks.loadPattern(6);
  
  // Set wave types for better sound
  const waveSelects = callbacks.getWaveSelects();
  if (waveSelects[0]) waveSelects[0].value = 'square';  // Bass
  if (waveSelects[1]) waveSelects[1].value = 'square';  // Lead
  if (waveSelects[2]) waveSelects[2].value = 'noise';   // Percussion
}
