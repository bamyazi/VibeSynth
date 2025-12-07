// Voice grid UI and interactions
import { NOTES, SEQUENCER_CONFIG } from '../config.js';
import { clearVoicePatternData } from '../pattern.js';
import { getVoiceADSR, updateVoiceADSR, getVoicePWM, updateVoicePWM, getVoiceArpeggio, updateVoiceArpeggio, getVoiceVibrato, updateVoiceVibrato, getVoiceFilterEnvelope, updateVoiceFilterEnvelope, getVoiceVolumeEnvelope, updateVoiceVolumeEnvelope } from '../audio.js';

// Drag state (shared across all cells)
let dragState = {
  isDragging: false,
  voice: -1,
  row: -1,
  startStep: -1
};

export function createVoiceUI(voiceIndex, containers) {
  const { voicesContainer, waveSelects, voiceSequencers, octaveSelects, pattern, onPreview } = containers;

  const voiceEl = document.createElement("div");
  voiceEl.className = "voice";
  voiceEl.dataset.voice = voiceIndex;

  const header = document.createElement("div");
  header.className = "voice-header";

  const title = document.createElement("div");
  title.className = "voice-title";
  
  const titleContent = document.createElement("span");
  titleContent.innerHTML = `<span class="voice-index-tag">V${voiceIndex + 1}</span>Voice ${voiceIndex + 1}`;
  
  const previewBtn = document.createElement("button");
  previewBtn.textContent = "▶";
  previewBtn.className = "voice-preview-btn";
  previewBtn.title = "Preview current pattern";
  previewBtn.addEventListener("click", () => {
    if (onPreview) onPreview();
  });
  
  title.appendChild(titleContent);
  title.appendChild(previewBtn);

  const headerRight = document.createElement("div");
  headerRight.className = "voice-header-right";

  const controls = document.createElement("div");
  controls.className = "voice-controls";

  const waveLabel = document.createElement("label");
  waveLabel.textContent = "Wave";

  const waveSelect = document.createElement("select");
  waveSelect.innerHTML = `
        <option value="square">Square</option>
        <option value="sawtooth">Saw</option>
        <option value="triangle">Triangle</option>
        <option value="pulse">Pulse</option>
        <option value="noise">Noise</option>
      `;
  waveSelects[voiceIndex] = waveSelect;

  const octaveLabel = document.createElement("label");
  octaveLabel.textContent = "Octave";

  const octaveSelect = document.createElement("select");
  octaveSelect.innerHTML = `
        <option value="-2">-2</option>
        <option value="-1">-1</option>
        <option value="0" selected>0</option>
        <option value="1">+1</option>
        <option value="2">+2</option>
      `;
  octaveSelects[voiceIndex] = octaveSelect;

  const clearVoiceBtn = document.createElement("button");
  clearVoiceBtn.textContent = "Clear Voice";
  clearVoiceBtn.classList.add("secondary");
  clearVoiceBtn.addEventListener("click", () => {
    clearVoicePattern(voiceIndex, pattern);
  });

  controls.appendChild(waveLabel);
  controls.appendChild(waveSelect);
  
  // PWM Control
  const pwm = getVoicePWM(voiceIndex);
  const pwmContainer = document.createElement("div");
  pwmContainer.className = "pwm-control";
  pwmContainer.style.display = "none"; // Hidden by default
  
  const pwmLabel = document.createElement("label");
  pwmLabel.textContent = "PW";
  pwmLabel.className = "pwm-label";
  
  const pwmSlider = document.createElement("input");
  pwmSlider.type = "range";
  pwmSlider.min = "0.05";
  pwmSlider.max = "0.95";
  pwmSlider.step = "0.01";
  pwmSlider.value = pwm.pulseWidth;
  pwmSlider.className = "pwm-slider";
  
  const pwmValue = document.createElement("span");
  pwmValue.className = "pwm-value";
  pwmValue.textContent = (pwm.pulseWidth * 100).toFixed(0) + "%";
  
  pwmSlider.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    pwmValue.textContent = (val * 100).toFixed(0) + "%";
    updateVoicePWM(voiceIndex, { pulseWidth: val });
  });
  
  pwmContainer.appendChild(pwmLabel);
  pwmContainer.appendChild(pwmSlider);
  pwmContainer.appendChild(pwmValue);
  
  // Show/hide PWM control based on wave type
  waveSelect.addEventListener("change", (e) => {
    if (e.target.value === "pulse") {
      pwmContainer.style.display = "flex";
    } else {
      pwmContainer.style.display = "none";
    }
  });
  
  controls.appendChild(pwmContainer);
  controls.appendChild(octaveLabel);
  controls.appendChild(octaveSelect);

  // ADSR Controls
  const adsrContainer = document.createElement("div");
  adsrContainer.className = "adsr-controls";
  
  const adsr = getVoiceADSR(voiceIndex);
  
  const adsrParams = [
    { name: 'attack', label: 'A', min: 0.001, max: 1, step: 0.001, value: adsr.attack },
    { name: 'decay', label: 'D', min: 0.001, max: 1, step: 0.001, value: adsr.decay },
    { name: 'sustain', label: 'S', min: 0, max: 1, step: 0.01, value: adsr.sustain },
    { name: 'release', label: 'R', min: 0.001, max: 1, step: 0.001, value: adsr.release }
  ];
  
  adsrParams.forEach(param => {
    const adsrGroup = document.createElement("div");
    adsrGroup.className = "adsr-param";
    
    const label = document.createElement("label");
    label.textContent = param.label;
    label.className = "adsr-label";
    
    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = param.min;
    slider.max = param.max;
    slider.step = param.step;
    slider.value = param.value;
    slider.className = "adsr-slider";
    
    const valueDisplay = document.createElement("span");
    valueDisplay.className = "adsr-value";
    valueDisplay.textContent = param.value.toFixed(3);
    
    slider.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      valueDisplay.textContent = val.toFixed(3);
      updateVoiceADSR(voiceIndex, { [param.name]: val });
    });
    
    adsrGroup.appendChild(label);
    adsrGroup.appendChild(slider);
    adsrGroup.appendChild(valueDisplay);
    adsrContainer.appendChild(adsrGroup);
  });

  controls.appendChild(adsrContainer);
  
  // Arpeggio Controls
  const arp = getVoiceArpeggio(voiceIndex);
  const arpContainer = document.createElement("div");
  arpContainer.className = "arp-controls";
  
  const arpCheckbox = document.createElement("input");
  arpCheckbox.type = "checkbox";
  arpCheckbox.checked = arp.enabled;
  arpCheckbox.id = `arp-${voiceIndex}`;
  
  const arpLabel = document.createElement("label");
  arpLabel.htmlFor = `arp-${voiceIndex}`;
  arpLabel.className = "arp-label";
  arpLabel.textContent = "ARP";
  
  const arpSpeed = document.createElement("select");
  arpSpeed.className = "arp-speed";
  arpSpeed.innerHTML = `
    <option value="0">32nd notes</option>
    <option value="1">16th notes</option>
    <option value="2" selected>8th notes</option>
    <option value="3">Quarter notes</option>
    <option value="4">Half notes</option>
  `;
  arpSpeed.value = arp.speed;
  
  const arpType = document.createElement("select");
  arpType.className = "arp-type";
  arpType.innerHTML = `
    <option value="0,4,7">Major</option>
    <option value="0,3,7">Minor</option>
    <option value="0,5,7">Sus4</option>
    <option value="0,2,7">Sus2</option>
    <option value="0,4,7,11">Maj7</option>
    <option value="0,3,7,10">Min7</option>
    <option value="0,4,7,10">Dom7</option>
    <option value="0,3,6">Dim</option>
    <option value="0,4,8">Aug</option>
    <option value="0,12">Octave</option>
    <option value="0,7,12">Power</option>
  `;
  arpType.value = arp.intervals.join(',');
  
  arpCheckbox.addEventListener("change", (e) => {
    updateVoiceArpeggio(voiceIndex, { enabled: e.target.checked });
  });
  
  arpSpeed.addEventListener("change", (e) => {
    updateVoiceArpeggio(voiceIndex, { speed: parseInt(e.target.value) });
  });
  
  arpType.addEventListener("change", (e) => {
    const intervals = e.target.value.split(',').map(v => parseInt(v));
    updateVoiceArpeggio(voiceIndex, { intervals });
  });
  
  arpContainer.appendChild(arpCheckbox);
  arpContainer.appendChild(arpLabel);
  arpContainer.appendChild(arpSpeed);
  arpContainer.appendChild(arpType);
  
  controls.appendChild(arpContainer);
  
  // Vibrato Controls
  const vib = getVoiceVibrato(voiceIndex);
  const vibContainer = document.createElement("div");
  vibContainer.className = "vib-controls";
  
  const vibCheckbox = document.createElement("input");
  vibCheckbox.type = "checkbox";
  vibCheckbox.checked = vib.enabled;
  vibCheckbox.id = `vib-${voiceIndex}`;
  
  const vibLabel = document.createElement("label");
  vibLabel.htmlFor = `vib-${voiceIndex}`;
  vibLabel.className = "vib-label";
  vibLabel.textContent = "VIB";
  
  const vibRate = document.createElement("input");
  vibRate.type = "range";
  vibRate.min = "1";
  vibRate.max = "20";
  vibRate.step = "0.5";
  vibRate.value = vib.rate;
  vibRate.className = "vib-slider";
  vibRate.title = "Rate (Hz)";
  
  const vibDepth = document.createElement("input");
  vibDepth.type = "range";
  vibDepth.min = "0.1";
  vibDepth.max = "2";
  vibDepth.step = "0.1";
  vibDepth.value = vib.depth;
  vibDepth.className = "vib-slider";
  vibDepth.title = "Depth (semitones)";
  
  vibCheckbox.addEventListener("change", (e) => {
    updateVoiceVibrato(voiceIndex, { enabled: e.target.checked });
  });
  
  vibRate.addEventListener("input", (e) => {
    updateVoiceVibrato(voiceIndex, { rate: parseFloat(e.target.value) });
  });
  
  vibDepth.addEventListener("input", (e) => {
    updateVoiceVibrato(voiceIndex, { depth: parseFloat(e.target.value) });
  });
  
  vibContainer.appendChild(vibCheckbox);
  vibContainer.appendChild(vibLabel);
  vibContainer.appendChild(vibRate);
  vibContainer.appendChild(vibDepth);
  
  controls.appendChild(vibContainer);
  
  // Filter Envelope Controls
  const fenv = getVoiceFilterEnvelope(voiceIndex);
  const fenvContainer = document.createElement("div");
  fenvContainer.className = "fenv-controls";
  
  const fenvCheckbox = document.createElement("input");
  fenvCheckbox.type = "checkbox";
  fenvCheckbox.checked = fenv.enabled;
  fenvCheckbox.id = `fenv-${voiceIndex}`;
  
  const fenvLabel = document.createElement("label");
  fenvLabel.htmlFor = `fenv-${voiceIndex}`;
  fenvLabel.className = "fenv-label";
  fenvLabel.textContent = "F.ENV";
  fenvLabel.title = "Filter Envelope";
  
  const fenvAmount = document.createElement("input");
  fenvAmount.type = "range";
  fenvAmount.min = "0";
  fenvAmount.max = "1";
  fenvAmount.step = "0.05";
  fenvAmount.value = fenv.amount;
  fenvAmount.className = "fenv-slider";
  fenvAmount.title = "Amount";
  
  const fenvDecay = document.createElement("input");
  fenvDecay.type = "range";
  fenvDecay.min = "0.01";
  fenvDecay.max = "1";
  fenvDecay.step = "0.01";
  fenvDecay.value = fenv.decay;
  fenvDecay.className = "fenv-slider";
  fenvDecay.title = "Decay";
  
  fenvCheckbox.addEventListener("change", (e) => {
    updateVoiceFilterEnvelope(voiceIndex, { enabled: e.target.checked });
  });
  
  fenvAmount.addEventListener("input", (e) => {
    updateVoiceFilterEnvelope(voiceIndex, { amount: parseFloat(e.target.value) });
  });
  
  fenvDecay.addEventListener("input", (e) => {
    updateVoiceFilterEnvelope(voiceIndex, { decay: parseFloat(e.target.value) });
  });
  
  fenvContainer.appendChild(fenvCheckbox);
  fenvContainer.appendChild(fenvLabel);
  fenvContainer.appendChild(fenvAmount);
  fenvContainer.appendChild(fenvDecay);
  
  controls.appendChild(fenvContainer);
  
  // Volume Envelope (Accent) Controls
  const venv = getVoiceVolumeEnvelope(voiceIndex);
  const venvContainer = document.createElement("div");
  venvContainer.className = "venv-controls";
  
  const venvCheckbox = document.createElement("input");
  venvCheckbox.type = "checkbox";
  venvCheckbox.checked = venv.enabled;
  venvCheckbox.id = `venv-${voiceIndex}`;
  
  const venvLabel = document.createElement("label");
  venvLabel.htmlFor = `venv-${voiceIndex}`;
  venvLabel.className = "venv-label";
  venvLabel.textContent = "ACC";
  venvLabel.title = "Accent (Volume Boost)";
  
  const venvAccent = document.createElement("input");
  venvAccent.type = "range";
  venvAccent.min = "0.5";
  venvAccent.max = "2";
  venvAccent.step = "0.1";
  venvAccent.value = venv.accent;
  venvAccent.className = "venv-slider";
  venvAccent.title = "Accent Amount";
  
  venvCheckbox.addEventListener("change", (e) => {
    updateVoiceVolumeEnvelope(voiceIndex, { enabled: e.target.checked });
  });
  
  venvAccent.addEventListener("input", (e) => {
    updateVoiceVolumeEnvelope(voiceIndex, { accent: parseFloat(e.target.value) });
  });
  
  venvContainer.appendChild(venvCheckbox);
  venvContainer.appendChild(venvLabel);
  venvContainer.appendChild(venvAccent);
  
  controls.appendChild(venvContainer);
  controls.appendChild(clearVoiceBtn);

  headerRight.appendChild(controls);

  header.appendChild(title);
  header.appendChild(headerRight);

  voiceEl.appendChild(header);

  const sequencerEl = document.createElement("div");
  sequencerEl.className = "sequencer";
  sequencerEl.dataset.voice = voiceIndex;
  voiceSequencers[voiceIndex] = sequencerEl;

  createGridForVoice(voiceIndex, sequencerEl, pattern);
  voiceEl.appendChild(sequencerEl);

  voicesContainer.appendChild(voiceEl);
}

export function createGridForVoice(voiceIndex, sequencerEl, pattern) {
  const header = document.createElement("div");
  header.className = "seq-header";

  const labelCell = document.createElement("div");
  labelCell.textContent = "Note";
  header.appendChild(labelCell);

  for (let step = 0; step < 16; step++) {
    const stepCell = document.createElement("div");
    stepCell.textContent = step + 1;
    header.appendChild(stepCell);
  }

  sequencerEl.appendChild(header);

  NOTES.forEach((note, rowIndex) => {
    const row = document.createElement("div");
    row.className = "seq-row";

    const rowLabel = document.createElement("div");
    rowLabel.className = "seq-row-label";
    rowLabel.textContent = note.name;
    row.appendChild(rowLabel);

    for (let step = 0; step < 16; step++) {
      const cell = document.createElement("div");
      cell.className = "seq-grid-cell";
      cell.dataset.voice = voiceIndex;
      cell.dataset.row = rowIndex;
      cell.dataset.step = step;

      // Click to toggle note on/off
      // Shift+Click for accent, Alt+Click for slide
      cell.addEventListener("click", (e) => {
        const v = parseInt(cell.dataset.voice, 10);
        const r = parseInt(cell.dataset.row, 10);
        const s = parseInt(cell.dataset.step, 10);
        const noteData = pattern[v][r][s];
        
        if (e.shiftKey && noteData.active) {
          // Shift+Click toggles accent
          noteData.accent = !noteData.accent;
        } else if (e.altKey && noteData.active) {
          // Alt+Click toggles slide
          noteData.slide = !noteData.slide;
        } else {
          // Normal click toggles note on/off
          noteData.active = !noteData.active;
          if (!noteData.active) {
            noteData.length = 1; // Reset length when turning off
            noteData.accent = false;
            noteData.slide = false;
          }
        }
        updateCellUI(cell, noteData);
        updateNoteLength(v, r, s, pattern);
      });
      
      // Drag to extend note length
      cell.addEventListener("mousedown", (e) => {
        const v = parseInt(cell.dataset.voice, 10);
        const r = parseInt(cell.dataset.row, 10);
        const s = parseInt(cell.dataset.step, 10);
        const noteData = pattern[v][r][s];
        
        if (noteData.active) {
          dragState.isDragging = true;
          dragState.voice = v;
          dragState.row = r;
          dragState.startStep = s;
          e.preventDefault();
          e.stopPropagation();
        }
      });
      
      cell.addEventListener("mouseenter", (e) => {
        if (dragState.isDragging && 
            parseInt(cell.dataset.voice, 10) === dragState.voice && 
            parseInt(cell.dataset.row, 10) === dragState.row) {
          const s = parseInt(cell.dataset.step, 10);
          const noteData = pattern[dragState.voice][dragState.row][dragState.startStep];
          
          // Calculate new length (only allow extending to the right)
          if (s >= dragState.startStep) {
            const newLength = s - dragState.startStep + 1;
            if (newLength <= 16 - dragState.startStep) {
              noteData.length = newLength;
              updateNoteLength(dragState.voice, dragState.row, dragState.startStep, pattern);
            }
          }
        }
      });

      row.appendChild(cell);
    }

    sequencerEl.appendChild(row);
  });
}

// Global mouseup handler to end dragging
document.addEventListener("mouseup", () => {
  if (dragState.isDragging) {
    dragState.isDragging = false;
    dragState.voice = -1;
    dragState.row = -1;
    dragState.startStep = -1;
  }
});

function clearVoicePattern(voiceIndex, pattern) {
  clearVoicePatternData(pattern, voiceIndex);
  
  const selector = `.seq-grid-cell[data-voice="${voiceIndex}"]`;
  document.querySelectorAll(selector).forEach(cell => {
    cell.classList.remove("active");
    cell.style.removeProperty('grid-column');
    cell.style.display = '';
  });
}

// Update a single cell's UI based on note data
function updateCellUI(cell, noteData) {
  cell.classList.toggle("active", noteData.active);
  cell.classList.toggle("accent", noteData.active && noteData.accent);
  cell.classList.toggle("slide", noteData.active && noteData.slide);
  
  if (noteData.active && noteData.length > 1) {
    const step = parseInt(cell.dataset.step, 10);
    cell.style.gridColumn = `${step + 2} / span ${noteData.length}`;
  } else {
    cell.style.removeProperty('grid-column');
  }
}

// Update all cells for a specific note to show length
function updateNoteLength(voiceIndex, rowIndex, startStep, pattern) {
  const noteData = pattern[voiceIndex][rowIndex][startStep];
  
  // Find all cells in this row
  const selector = `.seq-grid-cell[data-voice="${voiceIndex}"][data-row="${rowIndex}"]`;
  const cells = Array.from(document.querySelectorAll(selector));
  
  cells.forEach((cell) => {
    const step = parseInt(cell.dataset.step, 10);
    
    if (step === startStep && noteData.active) {
      // Starting cell - show full length
      cell.classList.add("active");
      cell.classList.toggle("accent", noteData.accent);
      cell.classList.toggle("slide", noteData.slide);
      if (noteData.length > 1) {
        cell.style.gridColumn = `${step + 2} / span ${noteData.length}`;
      } else {
        cell.style.removeProperty('grid-column');
      }
      cell.style.display = '';
    } else if (step > startStep && step < startStep + noteData.length && noteData.active) {
      // Cell covered by extended note - hide it
      cell.style.display = 'none';
    } else {
      // Reset other cells in the row
      if (step !== startStep) {
        cell.style.display = '';
      }
    }
  });
}
