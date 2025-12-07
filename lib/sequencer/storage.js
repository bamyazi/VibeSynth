// Song save/load functionality

export function saveSong(songData, bpmInput, patternLibrary, songArrangement, waveSelects, octaveSelects) {
  const data = {
    version: 1,
    bpm: parseInt(bpmInput.value, 10),
    patternLibrary: patternLibrary,
    songArrangement: songArrangement,
    waveTypes: waveSelects.map(select => select ? select.value : 'square'),
    octaves: octaveSelects.map(select => select ? parseInt(select.value, 10) : 0)
  };
  
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'chiptune-song.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function loadSong(songData, state, callbacks) {
  try {
    const { patternLibrary, songArrangement, bpmInput, bpmDisplay, waveSelects, octaveSelects } = state;
    
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
    
    // Update UI
    callbacks.updatePatternLibraryUI();
    callbacks.updateSongSlotsUI();
    
    // Load first pattern
    if (patternLibrary.length > 0) {
      callbacks.loadPattern(0);
    }
    
    alert('Song loaded successfully!');
  } catch (error) {
    alert('Error loading song: ' + error.message);
  }
}

export function loadSongFile(state, callbacks) {
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
          loadSong(songData, state, callbacks);
        } catch (error) {
          alert('Invalid song file: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
}
