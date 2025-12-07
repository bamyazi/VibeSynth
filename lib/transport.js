// Transport control - playback and sequencing logic

import { getAudioContext, playNote, playDrum } from './audio.js';
import { SEQUENCER_CONFIG, NOTES, AUDIO_TIMING } from './config.js';
import { isNoteActive, getNoteLength } from './pattern.js';

/**
 * Transport state
 */
export class Transport {
  constructor() {
    this.isPlaying = false;
    this.currentStep = 0;
    this.intervalId = null;
    this.currentSongSlot = 0;
    this.loopCount = 0;
  }

  /**
   * Calculate step duration in milliseconds based on BPM
   */
  getStepDurationMs(bpm) {
    return (60000 / bpm) / 4;
  }

  /**
   * Advance to next step and play notes
   */
  advanceStep(config) {
    const {
      pattern,
      drumPattern,
      patternLibrary,
      songArrangement,
      songMode,
      waveSelects,
      octaveSelects,
      bpm,
      onStepChange
    } = config;

    // Clear current step highlighting
    document.querySelectorAll(".seq-grid-cell.step-current").forEach(cell =>
      cell.classList.remove("step-current")
    );

    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const when = now + AUDIO_TIMING.scheduleAhead;

    // Get current pattern (either working pattern or from song arrangement)
    let activePattern = pattern;
    let activeDrumPattern = drumPattern;

    if (songMode && songArrangement[this.currentSongSlot] !== null) {
      const patternIndex = songArrangement[this.currentSongSlot];
      if (patternLibrary[patternIndex]) {
        activePattern = patternLibrary[patternIndex].voicePattern;
        activeDrumPattern = patternLibrary[patternIndex].drumPattern;
      }
    }

    // Play voice notes
    for (let v = 0; v < SEQUENCER_CONFIG.numVoices; v++) {
      const waveType = waveSelects[v] ? waveSelects[v].value : 'square';
      const octaveShift = octaveSelects[v] ? parseInt(octaveSelects[v].value, 10) : 0;

      NOTES.forEach((note, rowIndex) => {
        const noteData = activePattern[v][rowIndex][this.currentStep];
        
        if (isNoteActive(noteData)) {
          const shiftedFreq = note.freq * Math.pow(2, octaveShift);
          const stepDuration = this.getStepDurationMs(bpm) / 1000;
          const noteLength = getNoteLength(noteData);
          const duration = stepDuration * noteLength;
          
          playNote(v, shiftedFreq, when, waveType, duration);
        }
      });

      // Highlight current step
      const selector = `.seq-grid-cell[data-voice="${v}"][data-step="${this.currentStep}"]`;
      document.querySelectorAll(selector).forEach(cell => {
        cell.classList.add("step-current");
      });
    }

    // Play drums
    for (let d = 0; d < activeDrumPattern.length; d++) {
      if (activeDrumPattern[d][this.currentStep]) {
        playDrum(d, when);
      }
      const drumSelector = `.seq-grid-cell[data-drum="${d}"][data-step="${this.currentStep}"]`;
      document.querySelectorAll(drumSelector).forEach(cell => {
        cell.classList.add("step-current");
      });
    }

    this.currentStep = (this.currentStep + 1) % SEQUENCER_CONFIG.numSteps;

    // Handle song mode progression
    if (songMode && this.currentStep === 0) {
      this.loopCount++;
      if (onStepChange) {
        onStepChange();
      }
    }
  }

  /**
   * Start playback
   */
  start(config) {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    this.currentStep = 0;
    
    // In song mode, find first non-null slot
    if (config.songMode) {
      this.currentSongSlot = 0;
      while (this.currentSongSlot < SEQUENCER_CONFIG.maxSongSlots && 
             config.songArrangement[this.currentSongSlot] === null) {
        this.currentSongSlot++;
      }
      if (this.currentSongSlot >= SEQUENCER_CONFIG.maxSongSlots) {
        this.currentSongSlot = 0;
      }
      if (config.onSongSlotChange) {
        config.onSongSlotChange();
      }
    }
    
    this.advanceStep(config);
    const interval = this.getStepDurationMs(config.bpm);
    this.intervalId = setInterval(() => this.advanceStep(config), interval);
    this.isPlaying = true;
  }

  /**
   * Stop playback
   */
  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    document.querySelectorAll(".seq-grid-cell.step-current").forEach(cell =>
      cell.classList.remove("step-current")
    );
    this.isPlaying = false;
  }

  /**
   * Move to next song slot
   */
  moveToNextSlot(songArrangement, onSlotChange) {
    let nextSlot = this.currentSongSlot + 1;
    while (nextSlot < SEQUENCER_CONFIG.maxSongSlots && songArrangement[nextSlot] === null) {
      nextSlot++;
    }
    
    if (nextSlot >= SEQUENCER_CONFIG.maxSongSlots) {
      this.currentSongSlot = 0;
      while (this.currentSongSlot < SEQUENCER_CONFIG.maxSongSlots && 
             songArrangement[this.currentSongSlot] === null) {
        this.currentSongSlot++;
      }
      if (this.currentSongSlot >= SEQUENCER_CONFIG.maxSongSlots) {
        this.currentSongSlot = 0;
      }
    } else {
      this.currentSongSlot = nextSlot;
    }
    
    if (onSlotChange) {
      onSlotChange();
    }
  }

  /**
   * Preview a pattern once
   */
  previewPattern(patternData, waveSelects, octaveSelects, bpm) {
    let previewStep = 0;
    let previewIntervalId = null;
    
    const ctx = getAudioContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    
    const playPreviewStep = () => {
      const now = ctx.currentTime;
      const when = now + AUDIO_TIMING.scheduleAhead;
      
      for (let v = 0; v < SEQUENCER_CONFIG.numVoices; v++) {
        const waveType = waveSelects[v] ? waveSelects[v].value : 'square';
        const octaveShift = octaveSelects[v] ? parseInt(octaveSelects[v].value, 10) : 0;
        
        NOTES.forEach((note, rowIndex) => {
          const noteData = patternData.voicePattern[v][rowIndex][previewStep];
          
          if (isNoteActive(noteData)) {
            const shiftedFreq = note.freq * Math.pow(2, octaveShift);
            const stepDuration = this.getStepDurationMs(bpm) / 1000;
            const noteLength = getNoteLength(noteData);
            const duration = stepDuration * noteLength;
            
            playNote(v, shiftedFreq, when, waveType, duration);
          }
        });
      }
      
      for (let d = 0; d < patternData.drumPattern.length; d++) {
        if (patternData.drumPattern[d][previewStep]) {
          playDrum(d, when);
        }
      }
      
      previewStep++;
      if (previewStep >= SEQUENCER_CONFIG.numSteps) {
        clearInterval(previewIntervalId);
      }
    };
    
    playPreviewStep();
    previewIntervalId = setInterval(playPreviewStep, this.getStepDurationMs(bpm));
    
    return previewIntervalId;
  }
}
