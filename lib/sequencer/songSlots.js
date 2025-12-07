// Song arrangement UI and logic
import { SEQUENCER_CONFIG } from '../config.js';

const maxSongSlots = SEQUENCER_CONFIG.maxSongSlots;

export function initSongArranger(songArrangement, patternLibrary) {
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

export function updateSongSlotHighlight(currentSongSlot) {
  document.querySelectorAll('.song-slot').forEach((slot, idx) => {
    slot.classList.toggle('current', idx === currentSongSlot);
  });
}

export function moveToNextSongSlot(currentSongSlot, songArrangement, songMode) {
  if (!songMode) return currentSongSlot;
  
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
  
  return currentSongSlot;
}

export function updateSongSlotsUI(songArrangement, patternLibrary) {
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
}
