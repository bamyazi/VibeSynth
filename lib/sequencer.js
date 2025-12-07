// Sequencer and transport control
import { getAudioContext, playNote, playDrum, updateFilterCutoff, updateFilterResonance, getMixerChannel, updateMixerChannel, getMixerSettings, updateVoiceADSR, updateVoicePWM, updateVoiceArpeggio, updateVoiceVibrato, updateVoiceFilterEnvelope, updateVoiceVolumeEnvelope } from './audio.js';
import { notes, drumNames, createVoiceUI, createDrumUI, clearDrumPatterns } from './ui.js';
import { SEQUENCER_CONFIG, NOTES, DRUM_NAMES } from './config.js';
import { createEmptyPattern, copyPattern, clearVoicePatternData } from './pattern.js';
import { showPatternNameModal } from './modal.js';
import { Transport } from './transport.js';
import { PatternLibrary, SongArrangement } from './patternLibrary.js';
import { createAcidDemo } from './sequencer/acidDemo.js';
import { exportToWav, downloadBlob } from './audio/exporter.js';
import { getAllPresets } from './presets.js';

const numSteps = SEQUENCER_CONFIG.numSteps;
const numVoices = SEQUENCER_CONFIG.numVoices;
const maxSongSlots = SEQUENCER_CONFIG.maxSongSlots;

// Patterns (current working pattern)
export const pattern = [];
for (let v = 0; v < numVoices; v++) {
  pattern[v] = notes.map(() => Array(numSteps).fill(null).map(() => ({ active: false, length: 1 })));
}

export const drumPattern = drumNames.map(() => Array(numSteps).fill(false));

// Pattern library and song arrangement (using new modules)
const patternLibraryManager = new PatternLibrary();
const songArrangementManager = new SongArrangement();

// Legacy accessors for backward compatibility
const patternLibrary = patternLibraryManager.patterns;
const songArrangement = songArrangementManager.slots;

// Transport controller
const transport = new Transport();

// DOM refs
const voicesContainer = document.getElementById("voicesContainer");
const playBtn = document.getElementById("playBtn");
const bpmInput = document.getElementById("bpmInput");
const bpmDisplay = document.getElementById("bpmDisplay");
const clearAllBtn = document.getElementById("clearAllBtn");
const statusLed = document.getElementById("statusLed");
const statusText = document.getElementById("statusText");

const drumSequencerEl = document.getElementById("drumSequencer");
const clearDrumsBtn = document.getElementById("clearDrumsBtn");

const waveSelects = [];
const octaveSelects = [];
const voiceSequencers = [];

let isPlaying = false;
let currentStep = 0;
let intervalId = null;

// Song mode state (always enabled)
let songMode = true;
let currentSongSlot = 0;
let loopCount = 0;
let selectedPatternIndex = null;

function getStepDurationMs() {
  const bpm = parseInt(bpmInput.value, 10);
  return (60000 / bpm) / 4;
}

function updateLoopDuration() {
  const loopDurationEl = document.getElementById("loopDuration");
  if (!loopDurationEl) return;
  
  const bpm = parseInt(bpmInput.value, 10);
  const beatDuration = 60 / bpm; // Duration of one quarter note in seconds
  const loopDurationSeconds = beatDuration * numSteps;
  
  loopDurationEl.textContent = `(${loopDurationSeconds.toFixed(2)}s loop)`;
}

function setPlayingUI(playing) {
  isPlaying = playing;
  playBtn.textContent = playing ? "⏸ Pause" : "▶ Play";
  statusLed.classList.toggle("on", playing);
  statusText.textContent = playing ? "Playing pattern" : "Stopped";
}

function advanceStep() {
  document.querySelectorAll(".seq-grid-cell.step-current").forEach(cell =>
    cell.classList.remove("step-current")
  );

  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const when = now + 0.01;

  // Get current pattern (either working pattern or from song arrangement)
  let activePattern = pattern;
  let activeDrumPattern = drumPattern;

  if (songMode && songArrangement[currentSongSlot] !== null) {
    const patternIndex = songArrangement[currentSongSlot];
    if (patternLibrary[patternIndex]) {
      activePattern = patternLibrary[patternIndex].voicePattern;
      activeDrumPattern = patternLibrary[patternIndex].drumPattern;
    }
  }

  for (let v = 0; v < numVoices; v++) {
    const waveType = waveSelects[v] ? waveSelects[v].value : 'square';
    const octaveShift = octaveSelects[v] ? parseInt(octaveSelects[v].value, 10) : 0;

    notes.forEach((note, rowIndex) => {
      const noteData = activePattern[v][rowIndex][currentStep];
      // Check if note object has active property (new format) or is boolean (legacy)
      const isActive = typeof noteData === 'object' ? noteData.active : noteData;
      
      if (isActive) {
        const shiftedFreq = note.freq * Math.pow(2, octaveShift);
        // Calculate duration based on note length (in steps)
        const stepDuration = getStepDurationMs() / 1000; // Convert to seconds
        const noteLength = typeof noteData === 'object' ? noteData.length : 1;
        const duration = stepDuration * noteLength;
        
        // Get accent and slide flags (TB-303 style)
        const accent = typeof noteData === 'object' ? (noteData.accent || false) : false;
        const slide = typeof noteData === 'object' ? (noteData.slide || false) : false;
        
        // If slide is enabled, find the previous note's frequency
        let slideFromFreq = null;
        if (slide && currentStep > 0) {
          for (let prevStep = currentStep - 1; prevStep >= 0; prevStep--) {
            const prevNoteData = activePattern[v][rowIndex][prevStep];
            const prevIsActive = typeof prevNoteData === 'object' ? prevNoteData.active : prevNoteData;
            if (prevIsActive) {
              slideFromFreq = note.freq * Math.pow(2, octaveShift); // Same as current for now
              break;
            }
          }
        }
        
        playNote(v, shiftedFreq, when, waveType, duration, accent, slideFromFreq);
      }
    });

    const selector = `.seq-grid-cell[data-voice="${v}"][data-step="${currentStep}"]`;
    document.querySelectorAll(selector).forEach(cell => {
      cell.classList.add("step-current");
    });
  }

  for (let d = 0; d < activeDrumPattern.length; d++) {
    if (activeDrumPattern[d][currentStep]) {
      playDrum(d, when);
    }
    const drumSelector = `.seq-grid-cell[data-drum="${d}"][data-step="${currentStep}"]`;
    document.querySelectorAll(drumSelector).forEach(cell => {
      cell.classList.add("step-current");
    });
  }

  currentStep = (currentStep + 1) % numSteps;

  // Handle song mode progression
  if (songMode && currentStep === 0) {
    loopCount++;
    // Move to next song slot after completing the loop
    moveToNextSongSlot();
  }
}

function startSequencer() {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    ctx.resume();
  }

  currentStep = 0;
  
  // In song mode, find first non-null slot
  if (songMode) {
    currentSongSlot = 0;
    while (currentSongSlot < maxSongSlots && songArrangement[currentSongSlot] === null) {
      currentSongSlot++;
    }
    if (currentSongSlot >= maxSongSlots) {
      currentSongSlot = 0;
    }
    updateSongSlotHighlight();
  }
  
  advanceStep();
  const interval = getStepDurationMs();
  intervalId = setInterval(advanceStep, interval);
  setPlayingUI(true);
}

function stopSequencer() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
  document.querySelectorAll(".seq-grid-cell.step-current").forEach(cell =>
    cell.classList.remove("step-current")
  );
  setPlayingUI(false);
}

function clearAllVoicePatterns() {
  for (let v = 0; v < numVoices; v++) {
    clearVoicePattern(v);
  }
}

function clearVoicePattern(voiceIndex) {
  for (let r = 0; r < pattern[voiceIndex].length; r++) {
    for (let s = 0; s < numSteps; s++) {
      pattern[voiceIndex][r][s].active = false;
      pattern[voiceIndex][r][s].length = 1;
    }
  }
  const selector = `.seq-grid-cell[data-voice="${voiceIndex}"]`;
  document.querySelectorAll(selector).forEach(cell => {
    cell.classList.remove("active");
    cell.style.removeProperty('grid-column');
    cell.style.display = '';
  });
}

function clearDrumPatternsLocal() {
  clearDrumPatterns(drumPattern);
}

// Pattern library management
function saveCurrentPattern(name) {
  // Deep copy note objects
  const voicePatternCopy = pattern.map(voice => 
    voice.map(row => 
      row.map(note => ({ active: note.active, length: note.length }))
    )
  );
  const drumPatternCopy = drumPattern.map(row => [...row]);
  
  if (selectedPatternIndex !== null && patternLibrary[selectedPatternIndex]) {
    // Update existing pattern
    patternLibrary[selectedPatternIndex].voicePattern = voicePatternCopy;
    patternLibrary[selectedPatternIndex].drumPattern = drumPatternCopy;
    if (name) {
      patternLibrary[selectedPatternIndex].name = name;
    }
  } else {
    // Create new pattern
    patternLibrary.push({
      name: name || `Pattern ${patternLibrary.length + 1}`,
      voicePattern: voicePatternCopy,
      drumPattern: drumPatternCopy
    });
    selectedPatternIndex = patternLibrary.length - 1;
  }
  
  updatePatternLibraryUI();
  
  // Update song slots that use this pattern
  document.querySelectorAll('.song-slot').forEach((slot, idx) => {
    if (songArrangement[idx] === selectedPatternIndex) {
      slot.textContent = `${idx + 1}: ${patternLibrary[selectedPatternIndex].name}`;
    }
  });
  
  return selectedPatternIndex;
}

function deleteSelectedPattern() {
  if (selectedPatternIndex === null || !patternLibrary[selectedPatternIndex]) {
    alert('Please select a pattern to delete');
    return;
  }
  
  const patternName = patternLibrary[selectedPatternIndex].name;
  if (!confirm(`Delete pattern "${patternName}"?`)) {
    return;
  }
  
  // Remove from library
  patternLibrary.splice(selectedPatternIndex, 1);
  
  // Update song arrangement indices
  for (let i = 0; i < songArrangement.length; i++) {
    if (songArrangement[i] === selectedPatternIndex) {
      songArrangement[i] = null;
    } else if (songArrangement[i] > selectedPatternIndex) {
      songArrangement[i]--;
    }
  }
  
  selectedPatternIndex = patternLibrary.length > 0 ? 0 : null;
  
  updatePatternLibraryUI();
  
  // Update song slots UI
  document.querySelectorAll('.song-slot').forEach((slot, idx) => {
    const patternIndex = songArrangement[idx];
    if (patternIndex === null) {
      slot.classList.remove('filled');
      slot.textContent = idx + 1;
    } else {
      slot.classList.add('filled');
      slot.textContent = `${idx + 1}: ${patternLibrary[patternIndex].name}`;
    }
  });
  
  // Load first pattern if available
  if (patternLibrary.length > 0) {
    loadPattern(0);
  } else {
    clearAllVoicePatterns();
    clearDrumPatternsLocal();
  }
}

function loadPattern(patternIndex) {
  if (patternLibrary[patternIndex]) {
    const savedPattern = patternLibrary[patternIndex];
    selectedPatternIndex = patternIndex;
    
    // Copy saved pattern to working pattern
    for (let v = 0; v < numVoices; v++) {
      for (let r = 0; r < pattern[v].length; r++) {
        for (let s = 0; s < numSteps; s++) {
          const savedNote = savedPattern.voicePattern[v][r][s];
          // Handle both old boolean format and new object format
          if (typeof savedNote === 'object') {
            pattern[v][r][s].active = savedNote.active;
            pattern[v][r][s].length = savedNote.length || 1;
          } else {
            pattern[v][r][s].active = savedNote;
            pattern[v][r][s].length = 1;
          }
        }
      }
    }
    
    for (let d = 0; d < drumPattern.length; d++) {
      for (let s = 0; s < numSteps; s++) {
        drumPattern[d][s] = savedPattern.drumPattern[d][s];
      }
    }
    
    // Update UI
    document.querySelectorAll('.seq-grid-cell').forEach(cell => {
      const voice = cell.dataset.voice;
      const drum = cell.dataset.drum;
      const step = parseInt(cell.dataset.step, 10);
      const row = parseInt(cell.dataset.row, 10);
      
      if (voice !== undefined) {
        const v = parseInt(voice, 10);
        const noteData = pattern[v][row][step];
        cell.classList.toggle('active', noteData.active);
        // Update visual length
        if (noteData.active && noteData.length > 1) {
          cell.style.gridColumn = `${step + 2} / span ${noteData.length}`;
        } else {
          cell.style.removeProperty('grid-column');
        }
        // Hide cells covered by extended notes
        if (step > 0) {
          for (let prevStep = Math.max(0, step - 15); prevStep < step; prevStep++) {
            const prevNote = pattern[v][row][prevStep];
            if (prevNote.active && prevStep + prevNote.length > step) {
              cell.style.display = 'none';
              break;
            } else if (prevStep === step - 1) {
              cell.style.display = '';
            }
          }
        }
      } else if (drum !== undefined) {
        const d = parseInt(drum, 10);
        cell.classList.toggle('active', drumPattern[d][step]);
      }
    });
    
    updatePatternLibraryUI();
  }
}

function moveToNextSongSlot() {
  if (!songMode) return;
  
  // Find next non-null slot
  let nextSlot = currentSongSlot + 1;
  while (nextSlot < maxSongSlots && songArrangement[nextSlot] === null) {
    nextSlot++;
  }
  
  // If we reached the end, loop back to start
  if (nextSlot >= maxSongSlots) {
    currentSongSlot = 0;
    // Find first non-null slot
    while (currentSongSlot < maxSongSlots && songArrangement[currentSongSlot] === null) {
      currentSongSlot++;
    }
    if (currentSongSlot >= maxSongSlots) {
      // No patterns in song, restart from 0
      currentSongSlot = 0;
    }
  } else {
    currentSongSlot = nextSlot;
  }
  
  updateSongSlotHighlight();
}

function updateSongSlotHighlight() {
  document.querySelectorAll('.song-slot').forEach((slot, idx) => {
    slot.classList.toggle('current', idx === currentSongSlot);
  });
}

// Preview a pattern by playing it once
let previewIntervalId = null;
let previewStep = 0;

function previewCurrentPattern() {
  // Stop any existing preview
  if (previewIntervalId) {
    clearInterval(previewIntervalId);
    previewIntervalId = null;
  }
  
  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    ctx.resume();
  }
  
  previewStep = 0;
  
  const playPreviewStep = () => {
    const now = ctx.currentTime;
    const when = now + 0.01;
    
    // Play voice notes from current working pattern
    for (let v = 0; v < numVoices; v++) {
      const waveType = waveSelects[v] ? waveSelects[v].value : 'square';
      const octaveShift = octaveSelects[v] ? parseInt(octaveSelects[v].value, 10) : 0;
      
      notes.forEach((note, rowIndex) => {
        const noteData = pattern[v][rowIndex][previewStep];
        const isActive = typeof noteData === 'object' ? noteData.active : noteData;
        
        if (isActive) {
          const shiftedFreq = note.freq * Math.pow(2, octaveShift);
          const stepDuration = getStepDurationMs() / 1000;
          const noteLength = typeof noteData === 'object' ? noteData.length : 1;
          const duration = stepDuration * noteLength;
          
          playNote(v, shiftedFreq, when, waveType, duration);
        }
      });
    }
    
    // Play drums from current working pattern
    for (let d = 0; d < drumPattern.length; d++) {
      if (drumPattern[d][previewStep]) {
        playDrum(d, when);
      }
    }
    
    previewStep++;
    if (previewStep >= numSteps) {
      clearInterval(previewIntervalId);
      previewIntervalId = null;
    }
  };
  
  playPreviewStep();
  previewIntervalId = setInterval(playPreviewStep, getStepDurationMs());
}

function previewPattern(patternIndex) {
  if (!patternLibrary[patternIndex]) return;
  
  // Stop any existing preview
  if (previewIntervalId) {
    clearInterval(previewIntervalId);
    previewIntervalId = null;
  }
  
  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    ctx.resume();
  }
  
  const previewPattern = patternLibrary[patternIndex];
  previewStep = 0;
  
  const playPreviewStep = () => {
    const now = ctx.currentTime;
    const when = now + 0.01;
    
    // Play voice notes
    for (let v = 0; v < numVoices; v++) {
      const waveType = waveSelects[v] ? waveSelects[v].value : 'square';
      const octaveShift = octaveSelects[v] ? parseInt(octaveSelects[v].value, 10) : 0;
      
      notes.forEach((note, rowIndex) => {
        const noteData = previewPattern.voicePattern[v][rowIndex][previewStep];
        const isActive = typeof noteData === 'object' ? noteData.active : noteData;
        
        if (isActive) {
          const shiftedFreq = note.freq * Math.pow(2, octaveShift);
          const stepDuration = getStepDurationMs() / 1000;
          const noteLength = typeof noteData === 'object' ? noteData.length : 1;
          const duration = stepDuration * noteLength;
          
          playNote(v, shiftedFreq, when, waveType, duration);
        }
      });
    }
    
    // Play drums
    for (let d = 0; d < previewPattern.drumPattern.length; d++) {
      if (previewPattern.drumPattern[d][previewStep]) {
        playDrum(d, when);
      }
    }
    
    previewStep++;
    if (previewStep >= numSteps) {
      clearInterval(previewIntervalId);
      previewIntervalId = null;
    }
  };
  
  playPreviewStep();
  previewIntervalId = setInterval(playPreviewStep, getStepDurationMs());
}

function updatePatternLibraryUI() {
  const libraryEl = document.getElementById('patternLibrary');
  if (!libraryEl) return;
  
  libraryEl.innerHTML = '';
  
  if (patternLibrary.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.style.padding = '10px';
    emptyMsg.style.color = '#888';
    emptyMsg.style.fontSize = '0.75rem';
    emptyMsg.style.textAlign = 'center';
    emptyMsg.textContent = 'No patterns yet. Create one!';
    libraryEl.appendChild(emptyMsg);
    return;
  }
  
  patternLibrary.forEach((pat, idx) => {
    const item = document.createElement('div');
    item.className = 'pattern-library-item';
    if (idx === selectedPatternIndex) {
      item.classList.add('selected');
    }
    
    const nameSpan = document.createElement('span');
    nameSpan.textContent = pat.name;
    nameSpan.style.flex = '1';
    nameSpan.style.minWidth = '0';
    nameSpan.style.overflow = 'hidden';
    nameSpan.style.textOverflow = 'ellipsis';
    
    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '4px';
    
    const playBtn = document.createElement('button');
    playBtn.textContent = '▶';
    playBtn.className = 'pattern-preview-btn';
    playBtn.title = 'Preview pattern';
    playBtn.onclick = (e) => {
      e.stopPropagation();
      previewPattern(idx);
    };
    
    const renameBtn = document.createElement('button');
    renameBtn.textContent = '✏️';
    renameBtn.className = 'pattern-rename-btn';
    renameBtn.title = 'Rename pattern';
    renameBtn.onclick = async (e) => {
      e.stopPropagation();
      const newName = await showPatternNameModal('Rename Pattern', pat.name);
      if (newName) {
        pat.name = newName;
        updatePatternLibraryUI();
        // Update song slots
        document.querySelectorAll('.song-slot').forEach((slot, slotIdx) => {
          if (songArrangement[slotIdx] === idx) {
            slot.textContent = `${slotIdx + 1}: ${newName}`;
          }
        });
      }
    };
    
    btnContainer.appendChild(playBtn);
    btnContainer.appendChild(renameBtn);
    
    item.appendChild(nameSpan);
    item.appendChild(btnContainer);
    item.draggable = true;
    item.dataset.patternIndex = idx;
    
    item.addEventListener('click', () => {
      selectedPatternIndex = idx;
      loadPattern(idx);
      updatePatternLibraryUI();
    });
    
    item.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('patternIndex', idx);
    });
    
    libraryEl.appendChild(item);
  });
}

// Event listeners
playBtn.addEventListener("click", () => {
  if (isPlaying) {
    stopSequencer();
  } else {
    startSequencer();
  }
});

bpmInput.addEventListener("input", () => {
  bpmDisplay.textContent = bpmInput.value;
  updateLoopDuration();
  if (isPlaying) {
    clearInterval(intervalId);
    intervalId = setInterval(advanceStep, getStepDurationMs());
  }
});

// Song mode controls
const savePatternBtn = document.getElementById('savePatternBtn');
const loadSongBtn = document.getElementById('loadSongBtn');
const newPatternBtn = document.getElementById('newPatternBtn');
const deletePatternBtn = document.getElementById('deletePatternBtn');
const clearCurrentBtn = document.getElementById('clearCurrentBtn');
const randomizeBtn = document.getElementById('randomizeBtn');
const exportWavBtn = document.getElementById('exportWavBtn');
const presetSelect = document.getElementById('presetSelect');

async function exportWav() {
  try {
    // Show exporting status
    statusText.textContent = 'Exporting WAV...';
    statusLed.classList.remove('led-off');
    statusLed.classList.add('led-playing');
    
    // Collect current song data
    const songData = {
      patterns: patternLibrary,
      songSlots: songArrangement,
      bpm: parseInt(bpmInput.value, 10),
      waveTypes: waveSelects.map(select => select ? select.value : 'square'),
      octaves: octaveSelects.map(select => select ? parseInt(select.value, 10) : 0),
      mixerSettings: [],
      voiceSettings: []
    };
    
    // Collect mixer settings for each voice
    for (let v = 0; v < numVoices; v++) {
      songData.mixerSettings.push(getMixerSettings(v));
    }
    
    // Export to WAV
    const wavBlob = await exportToWav(
      songData,
      songData.bpm,
      renderPatternOffline
    );
    
    // Download the file
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    downloadBlob(wavBlob, `chiptune-${timestamp}.wav`);
    
    // Update status
    statusText.textContent = 'WAV exported!';
    setTimeout(() => {
      statusLed.classList.remove('led-playing');
      statusLed.classList.add('led-off');
      statusText.textContent = 'Stopped';
    }, 2000);
    
  } catch (error) {
    console.error('Export failed:', error);
    statusText.textContent = 'Export failed';
    statusLed.classList.remove('led-playing');
    statusLed.classList.add('led-off');
  }
}

// Render a single pattern to offline context
async function renderPatternOffline(offlineCtx, pattern, startTime, bpm, voiceSettings, mixerSettings) {
  const stepDuration = 60 / bpm; // Duration of one step in seconds
  
  // Get wave types and octaves from current UI state
  const waveTypes = waveSelects.map(select => select ? select.value : 'square');
  const octaves = octaveSelects.map(select => select ? parseInt(select.value, 10) : 0);
  
  for (let step = 0; step < numSteps; step++) {
    const when = startTime + (step * stepDuration);
    
    // Render voice notes
    for (let v = 0; v < numVoices; v++) {
      const waveType = waveTypes[v] || 'square';
      const octaveShift = octaves[v] || 0;
      
      notes.forEach((note, rowIndex) => {
        const noteData = pattern.voicePattern[v][rowIndex][step];
        const isActive = typeof noteData === 'object' ? noteData.active : noteData;
        
        if (isActive) {
          const shiftedFreq = note.freq * Math.pow(2, octaveShift);
          const noteLength = typeof noteData === 'object' ? noteData.length : 1;
          const duration = stepDuration * noteLength;
          
          // Create oscillator for this note in offline context
          const osc = offlineCtx.createOscillator();
          const gain = offlineCtx.createGain();
          
          osc.type = waveType === 'noise' ? 'square' : waveType;
          osc.frequency.value = shiftedFreq;
          
          // Simple envelope
          gain.gain.setValueAtTime(0, when);
          gain.gain.linearRampToValueAtTime(0.3, when + 0.01);
          gain.gain.setValueAtTime(0.3, when + duration - 0.05);
          gain.gain.linearRampToValueAtTime(0, when + duration);
          
          osc.connect(gain);
          gain.connect(offlineCtx.destination);
          
          osc.start(when);
          osc.stop(when + duration);
        }
      });
    }
    
    // TODO: Render drums in offline context
  }
}

function saveSong() {
  const songData = {
    version: 1,
    bpm: parseInt(bpmInput.value, 10),
    patternLibrary: patternLibrary,
    songArrangement: songArrangement,
    waveTypes: waveSelects.map(select => select ? select.value : 'square'),
    octaves: octaveSelects.map(select => select ? parseInt(select.value, 10) : 0)
  };
  
  const json = JSON.stringify(songData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'chiptune-song.json';
  a.click();
  URL.revokeObjectURL(url);
}

function loadSong(songData) {
  try {
    // Clear existing data
    patternLibrary.length = 0;
    songArrangement.fill(null);
    
    // Load pattern library
    if (songData.patternLibrary) {
      songData.patternLibrary.forEach(pat => {
        patternLibrary.push(pat);
      });
    }
    
    // Load song arrangement
    if (songData.songArrangement) {
      songData.songArrangement.forEach((val, idx) => {
        songArrangement[idx] = val;
      });
    }
    
    // Load BPM
    if (songData.bpm) {
      bpmInput.value = songData.bpm;
      bpmDisplay.textContent = songData.bpm;
    }
    
    // Load wave types
    if (songData.waveTypes) {
      songData.waveTypes.forEach((waveType, idx) => {
        if (waveSelects[idx]) {
          waveSelects[idx].value = waveType;
        }
      });
    }
    
    // Load octave settings
    if (songData.octaves) {
      songData.octaves.forEach((octave, idx) => {
        if (octaveSelects[idx]) {
          octaveSelects[idx].value = octave;
        }
      });
    }
    
    // Load mixer settings
    if (songData.mixerSettings) {
      songData.mixerSettings.forEach((settings, voiceIndex) => {
        updateMixerChannel(voiceIndex, settings);
      });
      // Refresh mixer UI to reflect loaded settings
      createMixerUI(document.getElementById('mixer-channels'));
    }
    
    // Load voice settings (ADSR, PWM, arpeggio, vibrato, filter envelope, volume envelope)
    if (songData.voiceSettings) {
      songData.voiceSettings.forEach((settings, voiceIndex) => {
        if (settings.adsr) updateVoiceADSR(voiceIndex, settings.adsr);
        if (settings.pwm) updateVoicePWM(voiceIndex, settings.pwm);
        if (settings.arpeggio) updateVoiceArpeggio(voiceIndex, settings.arpeggio);
        if (settings.vibrato) updateVoiceVibrato(voiceIndex, settings.vibrato);
        if (settings.filterEnvelope) updateVoiceFilterEnvelope(voiceIndex, settings.filterEnvelope);
        if (settings.volumeEnvelope) updateVoiceVolumeEnvelope(voiceIndex, settings.volumeEnvelope);
      });
    }
    
    // Update UI
    updatePatternLibraryUI();
    
    // Update song slots
    document.querySelectorAll('.song-slot').forEach((slot, idx) => {
      const patternIndex = songArrangement[idx];
      if (patternIndex !== null && patternLibrary[patternIndex]) {
        slot.classList.add('filled');
        slot.textContent = `${idx + 1}: ${patternLibrary[patternIndex].name}`;
      } else {
        slot.classList.remove('filled');
        slot.textContent = idx + 1;
      }
    });
    
    // Load first pattern
    if (patternLibrary.length > 0) {
      loadPattern(0);
    }
  } catch (error) {
    alert('Error loading song: ' + error.message);
  }
}

if (savePatternBtn) {
  savePatternBtn.addEventListener('click', () => {
    saveSong();
  });
}

if (loadSongBtn) {
  loadSongBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const songData = JSON.parse(event.target.result);
            loadSong(songData);
          } catch (error) {
            alert('Invalid song file: ' + error.message);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  });
}

if (exportWavBtn) {
  exportWavBtn.addEventListener('click', () => {
    exportWav();
  });
}

if (newPatternBtn) {
  newPatternBtn.addEventListener('click', async () => {
    // Check if current pattern has changes
    const hasContent = pattern.some(voice => 
      voice.some(row => row.some(step => step))
    ) || drumPattern.some(row => row.some(step => step));
    
    if (hasContent) {
      const save = confirm('Save current pattern before creating a new one?');
      if (save) {
        const currentName = selectedPatternIndex !== null && patternLibrary[selectedPatternIndex] 
          ? patternLibrary[selectedPatternIndex].name 
          : '';
        const name = await showPatternNameModal('Save Current Pattern', currentName);
        if (name) {
          saveCurrentPattern(name);
        }
      }
    }
    
    clearAllVoicePatterns();
    clearDrumPatternsLocal();
    selectedPatternIndex = null;
    updatePatternLibraryUI();
  });
}

if (deletePatternBtn) {
  deletePatternBtn.addEventListener('click', () => {
    deleteSelectedPattern();
  });
}

if (clearCurrentBtn) {
  clearCurrentBtn.addEventListener('click', () => {
    clearAllVoicePatterns();
    clearDrumPatternsLocal();
  });
}

if (randomizeBtn) {
  randomizeBtn.addEventListener('click', () => {
    generateRandomPattern();
  });
}

/**
 * Generate a musically coherent random pattern
 */
function generateRandomPattern() {
  clearAllVoicePatterns();
  clearDrumPatternsLocal();
  
  // Musical scales (using array indices for our notes)
  const scales = {
    minor: [5, 7, 6, 4, 3, 5], // C, G, A, D, E (minor pentatonic-ish)
    major: [5, 4, 3, 2, 0], // C, D, E, G, C5 (major pentatonic)
    dorian: [5, 4, 3, 2, 6, 7], // C, D, E, G, A, G3
    dark: [7, 6, 5, 4, 3] // G3, A3, C4, D4, E4 (minor)
  };
  
  const scaleNames = Object.keys(scales);
  const chosenScale = scales[scaleNames[Math.floor(Math.random() * scaleNames.length)]];
  
  // Random pattern density (0.2 to 0.5)
  const density = 0.2 + Math.random() * 0.3;
  
  // Random active voices (1-3)
  const numActiveVoices = Math.floor(Math.random() * 3) + 1;
  
  for (let voiceIdx = 0; voiceIdx < numActiveVoices; voiceIdx++) {
    const notesPerBar = Math.random() < 0.5 ? 4 : 8; // 4th or 8th notes mainly
    const stepSize = 16 / notesPerBar;
    
    // Rhythmic pattern - some voices play on-beat, some off-beat
    const offset = voiceIdx === 1 ? Math.floor(Math.random() * 2) : 0;
    
    for (let i = 0; i < notesPerBar; i++) {
      const step = Math.floor(i * stepSize + offset) % 16;
      
      // Probability of note being active
      if (Math.random() < density) {
        // Pick note from scale
        const noteIdx = chosenScale[Math.floor(Math.random() * chosenScale.length)];
        
        // Note length (1-4 steps)
        const length = Math.random() < 0.7 ? 1 : (Math.random() < 0.5 ? 2 : 4);
        
        // Accent on downbeats mainly
        const accent = step % 4 === 0 && Math.random() < 0.6;
        
        // Slides occasionally
        const slide = Math.random() < 0.15;
        
        pattern[voiceIdx][noteIdx][step] = {
          active: true,
          length: length,
          accent: accent,
          slide: slide
        };
        
        // Update UI for this cell
        const cell = document.querySelector(`.seq-grid-cell[data-voice="${voiceIdx}"][data-row="${noteIdx}"][data-step="${step}"]`);
        if (cell) {
          cell.classList.add('active');
          if (length > 1) {
            cell.style.gridColumn = `span ${length}`;
          }
          if (accent) {
            cell.classList.add('accent');
          }
          if (slide) {
            cell.classList.add('slide');
          }
        }
      }
    }
  }
  
  // Generate drum pattern
  const drumStyle = Math.floor(Math.random() * 3);
  
  if (drumStyle === 0) {
    // Four-on-floor
    [0, 4, 8, 12].forEach(s => drumPattern[0][s] = true);
    drumPattern[2][4] = drumPattern[2][12] = true; // Claps
    for (let i = 0; i < 16; i += 2) drumPattern[3][i] = true; // Hats
  } else if (drumStyle === 1) {
    // Broken beat
    [0, 6, 8, 14].forEach(s => drumPattern[0][s] = true);
    drumPattern[1][4] = drumPattern[1][12] = true; // Snare
    for (let i = 1; i < 16; i += 2) drumPattern[3][i] = true; // Offbeat hats
  } else {
    // Minimal
    [0, 8].forEach(s => drumPattern[0][s] = true);
    [2, 6, 10, 14].forEach(s => drumPattern[3][s] = true);
  }
  
  // Update drum UI
  for (let d = 0; d < drumPattern.length; d++) {
    for (let s = 0; s < numSteps; s++) {
      const cell = document.querySelector(`.drum-cell[data-drum="${d}"][data-step="${s}"]`);
      if (cell) {
        if (drumPattern[d][s]) {
          cell.classList.add('active');
        } else {
          cell.classList.remove('active');
        }
      }
    }
  }
  
  console.log('Random pattern generated with scale:', Object.keys(scales).find(k => scales[k] === chosenScale));
}

// Mixer controls
const mixerTabBtn = document.getElementById('mixerTabBtn');
const mixerPanel = document.getElementById('mixerPanel');
const closeMixerBtn = document.getElementById('closeMixerBtn');
const mixerChannelsEl = document.getElementById('mixerChannels');

function createMixerUI() {
  mixerChannelsEl.innerHTML = '';
  
  for (let v = 0; v < numVoices; v++) {
    const channel = createMixerChannel(v, `Voice ${v + 1}`);
    mixerChannelsEl.appendChild(channel);
  }
}

function createMixerChannel(voiceIndex, name) {
  const settings = getMixerSettings(voiceIndex);
  
  const channel = document.createElement('div');
  channel.className = 'mixer-channel';
  
  const header = document.createElement('div');
  header.className = 'mixer-channel-header';
  header.innerHTML = `<h4>${name}</h4>`;
  
  const enabledCheckbox = document.createElement('input');
  enabledCheckbox.type = 'checkbox';
  enabledCheckbox.checked = settings.enabled;
  enabledCheckbox.addEventListener('change', (e) => {
    updateMixerChannel(voiceIndex, { enabled: e.target.checked });
  });
  
  const enableLabel = document.createElement('label');
  enableLabel.appendChild(enabledCheckbox);
  enableLabel.appendChild(document.createTextNode(' Enable'));
  header.appendChild(enableLabel);
  
  channel.appendChild(header);
  
  // Volume
  channel.appendChild(createSlider('Volume', voiceIndex, 'volume', 0, 1, 0.01, settings.volume, (val) => {
    updateMixerChannel(voiceIndex, { volume: parseFloat(val) });
  }));
  
  // LP Filter
  const lpSection = document.createElement('div');
  lpSection.className = 'mixer-effect-section';
  const lpCheckbox = document.createElement('input');
  lpCheckbox.type = 'checkbox';
  lpCheckbox.checked = settings.lpEnabled;
  lpCheckbox.addEventListener('change', (e) => {
    updateMixerChannel(voiceIndex, { lpEnabled: e.target.checked });
  });
  const lpLabel = document.createElement('label');
  lpLabel.appendChild(lpCheckbox);
  lpLabel.appendChild(document.createTextNode(' LP Filter'));
  lpSection.appendChild(lpLabel);
  lpSection.appendChild(createSlider('Cutoff', voiceIndex, 'lpFreq', 200, 10000, 10, settings.lpFreq, (val) => {
    updateMixerChannel(voiceIndex, { lpFreq: parseFloat(val) });
  }, 'Hz'));
  channel.appendChild(lpSection);
  
  // HP Filter
  const hpSection = document.createElement('div');
  hpSection.className = 'mixer-effect-section';
  const hpCheckbox = document.createElement('input');
  hpCheckbox.type = 'checkbox';
  hpCheckbox.checked = settings.hpEnabled;
  hpCheckbox.addEventListener('change', (e) => {
    updateMixerChannel(voiceIndex, { hpEnabled: e.target.checked });
  });
  const hpLabel = document.createElement('label');
  hpLabel.appendChild(hpCheckbox);
  hpLabel.appendChild(document.createTextNode(' HP Filter'));
  hpSection.appendChild(hpLabel);
  hpSection.appendChild(createSlider('Cutoff', voiceIndex, 'hpFreq', 20, 2000, 10, settings.hpFreq, (val) => {
    updateMixerChannel(voiceIndex, { hpFreq: parseFloat(val) });
  }, 'Hz'));
  channel.appendChild(hpSection);
  
  // Delay
  const delaySection = document.createElement('div');
  delaySection.className = 'mixer-effect-section';
  const delayCheckbox = document.createElement('input');
  delayCheckbox.type = 'checkbox';
  delayCheckbox.checked = settings.delayEnabled;
  delayCheckbox.addEventListener('change', (e) => {
    updateMixerChannel(voiceIndex, { delayEnabled: e.target.checked });
  });
  const delayLabel = document.createElement('label');
  delayLabel.appendChild(delayCheckbox);
  delayLabel.appendChild(document.createTextNode(' Delay'));
  delaySection.appendChild(delayLabel);
  delaySection.appendChild(createSlider('Time', voiceIndex, 'delayTime', 0.01, 1, 0.01, settings.delayTime, (val) => {
    updateMixerChannel(voiceIndex, { delayTime: parseFloat(val) });
  }, 's'));
  delaySection.appendChild(createSlider('Feedback', voiceIndex, 'delayFeedback', 0, 0.9, 0.01, settings.delayFeedback, (val) => {
    updateMixerChannel(voiceIndex, { delayFeedback: parseFloat(val) });
  }));
  delaySection.appendChild(createSlider('Mix', voiceIndex, 'delayMix', 0, 1, 0.01, settings.delayMix, (val) => {
    updateMixerChannel(voiceIndex, { delayMix: parseFloat(val) });
  }));
  channel.appendChild(delaySection);
  
  return channel;
}

function createSlider(label, voiceIndex, param, min, max, step, value, onChange, unit = '') {
  const container = document.createElement('div');
  container.className = 'mixer-slider';
  
  const labelEl = document.createElement('label');
  labelEl.textContent = label;
  
  const valueDisplay = document.createElement('span');
  valueDisplay.className = 'mixer-value';
  valueDisplay.textContent = value.toFixed(2) + unit;
  
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = min;
  slider.max = max;
  slider.step = step;
  slider.value = value;
  
  slider.addEventListener('input', (e) => {
    onChange(e.target.value);
    valueDisplay.textContent = parseFloat(e.target.value).toFixed(2) + unit;
  });
  
  container.appendChild(labelEl);
  container.appendChild(slider);
  container.appendChild(valueDisplay);
  
  return container;
}

if (mixerTabBtn) {
  mixerTabBtn.addEventListener('click', () => {
    mixerPanel.style.display = 'block';
    createMixerUI();
  });
}

if (closeMixerBtn) {
  closeMixerBtn.addEventListener('click', () => {
    mixerPanel.style.display = 'none';
  });
}

// Init UI
for (let v = 0; v < numVoices; v++) {
  createVoiceUI(v, {
    voicesContainer,
    waveSelects,
    octaveSelects,
    voiceSequencers,
    pattern,
    onPreview: previewCurrentPattern
  });
}
createDrumUI(drumSequencerEl, drumNames, drumPattern);

// Initialize song arranger UI
function initSongArranger() {
  const songSlotsEl = document.getElementById('songSlots');
  if (!songSlotsEl) return;
  
  for (let i = 0; i < maxSongSlots; i++) {
    const slot = document.createElement('div');
    slot.className = 'song-slot';
    slot.dataset.slotIndex = i;
    slot.textContent = i + 1;
    
    slot.addEventListener('dragover', (e) => {
      e.preventDefault();
      slot.classList.add('drag-over');
    });
    
    slot.addEventListener('dragleave', () => {
      slot.classList.remove('drag-over');
    });
    
    slot.addEventListener('drop', (e) => {
      e.preventDefault();
      slot.classList.remove('drag-over');
      const patternIndex = parseInt(e.dataTransfer.getData('patternIndex'), 10);
      songArrangement[i] = patternIndex;
      slot.classList.add('filled');
      slot.textContent = `${i + 1}: ${patternLibrary[patternIndex].name}`;
    });
    
    slot.addEventListener('dblclick', () => {
      songArrangement[i] = null;
      slot.classList.remove('filled');
      slot.textContent = i + 1;
    });
    
    songSlotsEl.appendChild(slot);
  }
}

initSongArranger();

// Initialize preset selector
function initPresetSelector() {
  if (!presetSelect) return;
  
  const presets = getAllPresets();
  presets.forEach((preset, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = preset.name;
    presetSelect.appendChild(option);
  });
  
  presetSelect.addEventListener('change', (e) => {
    const index = parseInt(e.target.value, 10);
    if (!isNaN(index)) {
      const presets = getAllPresets();
      const preset = presets[index];
      if (preset) {
        const presetData = preset.generator();
        loadSong(presetData);
        statusText.textContent = `Loaded: ${preset.name}`;
      }
      // Reset selector to default
      presetSelect.value = '';
    }
  });
}

initPresetSelector();

// Initialize loop duration display
updateLoopDuration();

// Load default demo song on startup
setTimeout(() => {
  const demoSong = createAcidDemo();
  loadSong(demoSong);
}, 100);

