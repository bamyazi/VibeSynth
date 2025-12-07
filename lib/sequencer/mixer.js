// Mixer UI controls
import { getMixerSettings, updateMixerChannel } from '../audio.js';
import { SEQUENCER_CONFIG } from '../config.js';

const numVoices = SEQUENCER_CONFIG.numVoices;

export function createMixerUI(mixerChannelsEl) {
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
  channel.dataset.voice = voiceIndex;
  
  const header = document.createElement('div');
  header.className = 'mixer-channel-header';
  
  const titleRow = document.createElement('div');
  titleRow.className = 'mixer-title-row';
  
  const title = document.createElement('h4');
  title.innerHTML = `<span class="voice-badge">V${voiceIndex + 1}</span>${name}`;
  
  const enabledCheckbox = document.createElement('input');
  enabledCheckbox.type = 'checkbox';
  enabledCheckbox.id = `mixer-enable-${voiceIndex}`;
  enabledCheckbox.className = 'mixer-toggle';
  enabledCheckbox.checked = settings.enabled;
  enabledCheckbox.addEventListener('change', (e) => {
    updateMixerChannel(voiceIndex, { enabled: e.target.checked });
    channel.classList.toggle('disabled', !e.target.checked);
  });
  
  const enableLabel = document.createElement('label');
  enableLabel.htmlFor = `mixer-enable-${voiceIndex}`;
  enableLabel.className = 'mixer-toggle-label';
  enableLabel.appendChild(enabledCheckbox);
  enableLabel.appendChild(document.createTextNode('ON'));
  
  titleRow.appendChild(title);
  titleRow.appendChild(enableLabel);
  header.appendChild(titleRow);
  
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
  lpCheckbox.id = `lp-${voiceIndex}`;
  lpCheckbox.checked = settings.lpEnabled;
  lpCheckbox.addEventListener('change', (e) => {
    updateMixerChannel(voiceIndex, { lpEnabled: e.target.checked });
    lpSection.classList.toggle('disabled', !e.target.checked);
  });
  const lpLabel = document.createElement('label');
  lpLabel.htmlFor = `lp-${voiceIndex}`;
  lpLabel.className = 'mixer-effect-label';
  lpLabel.appendChild(lpCheckbox);
  lpLabel.appendChild(document.createTextNode(' 🔊 Low Pass'));
  lpSection.appendChild(lpLabel);
  if (!settings.lpEnabled) lpSection.classList.add('disabled');
  lpSection.appendChild(createSlider('Cutoff', voiceIndex, 'lpFreq', 200, 10000, 10, settings.lpFreq, (val) => {
    updateMixerChannel(voiceIndex, { lpFreq: parseFloat(val) });
  }, 'Hz'));
  lpSection.appendChild(createSlider('Resonance', voiceIndex, 'lpQ', 0.1, 20, 0.1, settings.lpQ, (val) => {
    updateMixerChannel(voiceIndex, { lpQ: parseFloat(val) });
  }, 'Q'));
  channel.appendChild(lpSection);
  
  // HP Filter
  const hpSection = document.createElement('div');
  hpSection.className = 'mixer-effect-section';
  const hpCheckbox = document.createElement('input');
  hpCheckbox.type = 'checkbox';
  hpCheckbox.id = `hp-${voiceIndex}`;
  hpCheckbox.checked = settings.hpEnabled;
  hpCheckbox.addEventListener('change', (e) => {
    updateMixerChannel(voiceIndex, { hpEnabled: e.target.checked });
    hpSection.classList.toggle('disabled', !e.target.checked);
  });
  const hpLabel = document.createElement('label');
  hpLabel.htmlFor = `hp-${voiceIndex}`;
  hpLabel.className = 'mixer-effect-label';
  hpLabel.appendChild(hpCheckbox);
  hpLabel.appendChild(document.createTextNode(' 🔉 High Pass'));
  hpSection.appendChild(hpLabel);
  if (!settings.hpEnabled) hpSection.classList.add('disabled');
  hpSection.appendChild(createSlider('Cutoff', voiceIndex, 'hpFreq', 20, 2000, 10, settings.hpFreq, (val) => {
    updateMixerChannel(voiceIndex, { hpFreq: parseFloat(val) });
  }, 'Hz'));
  hpSection.appendChild(createSlider('Resonance', voiceIndex, 'hpQ', 0.1, 20, 0.1, settings.hpQ, (val) => {
    updateMixerChannel(voiceIndex, { hpQ: parseFloat(val) });
  }, 'Q'));
  channel.appendChild(hpSection);
  
  // Delay
  const delaySection = document.createElement('div');
  delaySection.className = 'mixer-effect-section';
  const delayCheckbox = document.createElement('input');
  delayCheckbox.type = 'checkbox';
  delayCheckbox.id = `delay-${voiceIndex}`;
  delayCheckbox.checked = settings.delayEnabled;
  delayCheckbox.addEventListener('change', (e) => {
    updateMixerChannel(voiceIndex, { delayEnabled: e.target.checked });
    delaySection.classList.toggle('disabled', !e.target.checked);
  });
  const delayLabel = document.createElement('label');
  delayLabel.htmlFor = `delay-${voiceIndex}`;
  delayLabel.className = 'mixer-effect-label';
  delayLabel.appendChild(delayCheckbox);
  delayLabel.appendChild(document.createTextNode(' ⏱️ Delay'));
  delaySection.appendChild(delayLabel);
  if (!settings.delayEnabled) delaySection.classList.add('disabled');
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
