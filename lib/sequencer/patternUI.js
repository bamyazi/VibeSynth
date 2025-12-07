// Pattern library UI
import { showPatternNameModal } from '../modal.js';
import { SEQUENCER_CONFIG } from '../config.js';

const numSteps = SEQUENCER_CONFIG.numSteps;

export function updatePatternLibraryUI(patternLibrary, selectedPatternIndex, callbacks) {
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
      callbacks.previewPattern(idx);
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
        callbacks.updatePatternLibraryUI();
        // Update song slots
        document.querySelectorAll('.song-slot').forEach((slot, slotIdx) => {
          const songArrangement = callbacks.getSongArrangement();
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
      callbacks.selectAndLoadPattern(idx);
    });
    
    item.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('patternIndex', idx);
    });
    
    libraryEl.appendChild(item);
  });
}

export function loadPatternIntoUI(pattern, drumPattern, numVoices, notes) {
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
}
