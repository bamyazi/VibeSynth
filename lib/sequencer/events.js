// Event handlers and playback control
import { getAudioContext } from '../audio.js';

export function setupPlaybackEvents(state, callbacks) {
  const { playBtn, bpmInput, bpmDisplay, clearAllBtn, clearDrumsBtn } = state.elements;
  const { startSequencer, stopSequencer, clearAllVoicePatterns, clearDrumPatternsLocal } = callbacks;
  
  if (playBtn) {
    playBtn.addEventListener("click", () => {
      if (state.isPlaying) {
        stopSequencer();
      } else {
        startSequencer();
      }
    });
  }

  if (bpmInput) {
    bpmInput.addEventListener("input", () => {
      bpmDisplay.textContent = bpmInput.value;
      if (state.isPlaying) {
        clearInterval(state.intervalId);
        state.intervalId = setInterval(callbacks.advanceStep, callbacks.getStepDurationMs());
      }
    });
  }
  
  if (clearAllBtn) {
    clearAllBtn.addEventListener("click", () => {
      clearAllVoicePatterns();
    });
  }
  
  if (clearDrumsBtn) {
    clearDrumsBtn.addEventListener("click", () => {
      clearDrumPatternsLocal();
    });
  }
}

export function setupPatternEvents(state, callbacks) {
  const { savePatternBtn, loadSongBtn, newPatternBtn, deletePatternBtn, clearCurrentBtn } = state.elements;
  const { saveSong, loadSongFile, createNewPattern, deleteSelectedPattern, clearAllVoicePatterns, clearDrumPatternsLocal } = callbacks;
  
  if (savePatternBtn) {
    savePatternBtn.addEventListener('click', () => {
      saveSong();
    });
  }

  if (loadSongBtn) {
    loadSongBtn.addEventListener('click', () => {
      loadSongFile();
    });
  }

  if (newPatternBtn) {
    newPatternBtn.addEventListener('click', async () => {
      await createNewPattern();
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
}

export function setupMixerEvents(state, callbacks) {
  const { mixerTabBtn, closeMixerBtn } = state.elements;
  const { openMixer, closeMixer } = callbacks;
  
  if (mixerTabBtn) {
    mixerTabBtn.addEventListener('click', () => {
      openMixer();
    });
  }

  if (closeMixerBtn) {
    closeMixerBtn.addEventListener('click', () => {
      closeMixer();
    });
  }
}

export function setPlayingUI(state, playing) {
  const { playBtn, statusLed, statusText } = state.elements;
  state.isPlaying = playing;
  playBtn.textContent = playing ? "⏸ Pause" : "▶ Play";
  statusLed.classList.toggle("on", playing);
  statusText.textContent = playing ? "Playing pattern" : "Stopped";
}

export function getStepDurationMs(bpmInput) {
  const bpm = parseInt(bpmInput.value, 10);
  return (60000 / bpm) / 4;
}
