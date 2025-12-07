/**
 * Synth voice playback and synthesis
 * Handles oscillator-based note playback with multiple waveforms
 * Includes filter and volume envelopes for TB-303 style modulation
 * @module audio/synth
 */

import { AUDIO_TIMING, ADSR_DEFAULTS, PWM_DEFAULTS, ARPEGGIO_DEFAULTS, VIBRATO_DEFAULTS, FILTER_ENVELOPE_DEFAULTS, VOLUME_ENVELOPE_DEFAULTS } from '../config.js';
import { getAudioContext, getMixerChannel } from './mixer.js';

// Store ADSR settings per voice
const voiceADSR = [
  { ...ADSR_DEFAULTS },
  { ...ADSR_DEFAULTS },
  { ...ADSR_DEFAULTS }
];

// Store PWM settings per voice
const voicePWM = [
  { ...PWM_DEFAULTS },
  { ...PWM_DEFAULTS },
  { ...PWM_DEFAULTS }
];

// Store arpeggio settings per voice
const voiceArpeggio = [
  { ...ARPEGGIO_DEFAULTS },
  { ...ARPEGGIO_DEFAULTS },
  { ...ARPEGGIO_DEFAULTS }
];

// Store vibrato settings per voice
const voiceVibrato = [
  { ...VIBRATO_DEFAULTS },
  { ...VIBRATO_DEFAULTS },
  { ...VIBRATO_DEFAULTS }
];

// Store filter envelope settings per voice
const voiceFilterEnvelope = [
  { ...FILTER_ENVELOPE_DEFAULTS },
  { ...FILTER_ENVELOPE_DEFAULTS },
  { ...FILTER_ENVELOPE_DEFAULTS }
];

// Store volume envelope settings per voice
const voiceVolumeEnvelope = [
  { ...VOLUME_ENVELOPE_DEFAULTS },
  { ...VOLUME_ENVELOPE_DEFAULTS },
  { ...VOLUME_ENVELOPE_DEFAULTS }
];

/**
 * Get ADSR settings for a voice
 * @param {number} voiceIndex - Voice index (0-2)
 * @returns {Object} ADSR settings {attack, decay, sustain, release}
 */
export function getVoiceADSR(voiceIndex) {
  return { ...voiceADSR[voiceIndex] };
}

/**
 * Update ADSR settings for a voice
 * @param {number} voiceIndex - Voice index (0-2)
 * @param {Object} adsr - ADSR settings {attack, decay, sustain, release}
 */
export function updateVoiceADSR(voiceIndex, adsr) {
  Object.assign(voiceADSR[voiceIndex], adsr);
}

/**
 * Get PWM settings for a voice
 * @param {number} voiceIndex - Voice index (0-2)
 * @returns {Object} PWM settings {pulseWidth}
 */
export function getVoicePWM(voiceIndex) {
  return { ...voicePWM[voiceIndex] };
}

/**
 * Update PWM settings for a voice
 * @param {number} voiceIndex - Voice index (0-2)
 * @param {Object} pwm - PWM settings {pulseWidth}
 */
export function updateVoicePWM(voiceIndex, pwm) {
  Object.assign(voicePWM[voiceIndex], pwm);
}

/**
 * Get arpeggio settings for a voice
 * @param {number} voiceIndex - Voice index (0-2)
 * @returns {Object} Arpeggio settings {enabled, speed, intervals}
 */
export function getVoiceArpeggio(voiceIndex) {
  return { ...voiceArpeggio[voiceIndex] };
}

/**
 * Update arpeggio settings for a voice
 * @param {number} voiceIndex - Voice index (0-2)
 * @param {Object} arp - Arpeggio settings {enabled, speed, intervals}
 */
export function updateVoiceArpeggio(voiceIndex, arp) {
  Object.assign(voiceArpeggio[voiceIndex], arp);
}

/**
 * Get vibrato settings for a voice
 * @param {number} voiceIndex - Voice index (0-2)
 * @returns {Object} Vibrato settings {enabled, rate, depth}
 */
export function getVoiceVibrato(voiceIndex) {
  return { ...voiceVibrato[voiceIndex] };
}

/**
 * Update vibrato settings for a voice
 * @param {number} voiceIndex - Voice index (0-2)
 * @param {Object} vib - Vibrato settings {enabled, rate, depth}
 */
export function updateVoiceVibrato(voiceIndex, vib) {
  Object.assign(voiceVibrato[voiceIndex], vib);
}

/**
 * Get filter envelope settings for a voice
 * @param {number} voiceIndex - Voice index (0-2)
 * @returns {Object} Filter envelope settings
 */
export function getVoiceFilterEnvelope(voiceIndex) {
  return { ...voiceFilterEnvelope[voiceIndex] };
}

/**
 * Update filter envelope settings for a voice
 * @param {number} voiceIndex - Voice index (0-2)
 * @param {Object} fenv - Filter envelope settings
 */
export function updateVoiceFilterEnvelope(voiceIndex, fenv) {
  Object.assign(voiceFilterEnvelope[voiceIndex], fenv);
}

/**
 * Get volume envelope settings for a voice
 * @param {number} voiceIndex - Voice index (0-2)
 * @returns {Object} Volume envelope settings
 */
export function getVoiceVolumeEnvelope(voiceIndex) {
  return { ...voiceVolumeEnvelope[voiceIndex] };
}

/**
 * Update volume envelope settings for a voice
 * @param {number} voiceIndex - Voice index (0-2)
 * @param {Object} venv - Volume envelope settings
 */
export function updateVoiceVolumeEnvelope(voiceIndex, venv) {
  Object.assign(voiceVolumeEnvelope[voiceIndex], venv);
}

/**
 * Create a pulse wave using Fourier series
 * @param {AudioContext} ctx - Audio context
 * @param {number} pulseWidth - Pulse width (0-1, where 0.5 = square wave)
 * @returns {PeriodicWave} Custom pulse wave
 */
function createPulseWave(ctx, pulseWidth) {
  const harmonics = 32;
  const real = new Float32Array(harmonics);
  const imag = new Float32Array(harmonics);
  
  // DC offset
  real[0] = 2 * pulseWidth - 1;
  
  // Fourier series for pulse wave
  for (let i = 1; i < harmonics; i++) {
    real[i] = 0;
    imag[i] = (2 / (Math.PI * i)) * Math.sin(2 * Math.PI * i * pulseWidth);
  }
  
  return ctx.createPeriodicWave(real, imag);
}

/**
 * Get the filter node for a voice (currently returns gain node)
 * @param {number} voiceIndex - Voice index (0-2)
 * @returns {GainNode} Voice filter node
 */
export function getVoiceFilter(voiceIndex) {
  return getMixerChannel(voiceIndex).gain;
}

/**
 * Calculate filter cutoff frequency from normalized value
 * @param {number} voiceIndex - Voice index (0-2)
 * @param {number} normalizedVal - Normalized value (0-1)
 * @returns {number} Frequency in Hz
 */
export function updateFilterCutoff(voiceIndex, normalizedVal) {
  const min = 200;
  const max = 8000;
  const exp = 3;
  const freq = min + (max - min) * Math.pow(normalizedVal, exp);
  return freq;
}

/**
 * Calculate filter resonance from normalized value
 * @param {number} voiceIndex - Voice index (0-2)
 * @param {number} normalizedVal - Normalized value (0-1)
 * @returns {number} Q factor
 */
export function updateFilterResonance(voiceIndex, normalizedVal) {
  const minQ = 0.1;
  const maxQ = 20;
  const Q = minQ + (maxQ - minQ) * normalizedVal;
  return Q;
}

/**
 * Play a note on a synth voice
 * @param {number} voiceIndex - Voice index (0-2)
 * @param {number} frequency - Frequency in Hz
 * @param {number} time - AudioContext time to start playback
 * @param {string} waveType - Waveform type: 'square', 'triangle', or 'noise'
 * @param {number} [duration] - Note duration in seconds
 * @param {boolean} [accent] - TB-303 style accent (boosts filter envelope & volume)
 * @param {number} [slideFromFreq] - Frequency to slide from (portamento)
 */
export function playNote(voiceIndex, frequency, time, waveType, duration = AUDIO_TIMING.defaultNoteDuration, accent = false, slideFromFreq = null) {
  const arp = voiceArpeggio[voiceIndex];
  
  // If arpeggio is enabled, play multiple notes
  if (arp.enabled && waveType !== "noise") {
    // Speed: 0=32nd notes, 1=16th notes, 2=8th notes, 3=quarter notes, 4=half notes
    // Each speed level doubles the duration
    const baseNoteDuration = duration / 8; // 8 x 16th notes per step at 120 BPM
    const speedMultiplier = Math.pow(2, arp.speed); // 0=1x, 1=2x, 2=4x, 3=8x, 4=16x
    const arpStepDuration = baseNoteDuration * speedMultiplier;
    const numSteps = Math.max(1, Math.floor(duration / arpStepDuration));
    
    for (let i = 0; i < numSteps; i++) {
      const intervalIndex = i % arp.intervals.length;
      const semitoneOffset = arp.intervals[intervalIndex];
      const arpFreq = frequency * Math.pow(2, semitoneOffset / 12);
      const arpTime = time + (i * arpStepDuration);
      
      playNoteSingle(voiceIndex, arpFreq, arpTime, waveType, arpStepDuration, accent, null);
    }
  } else {
    playNoteSingle(voiceIndex, frequency, time, waveType, duration, accent, slideFromFreq);
  }
}

/**
 * Play a single note (internal function)
 * @param {number} voiceIndex - Voice index (0-2)
 * @param {number} frequency - Frequency in Hz
 * @param {number} time - AudioContext time to start playback
 * @param {string} waveType - Waveform type
 * @param {number} duration - Note duration in seconds
 * @param {boolean} accent - Accent flag (enhances filter & volume)
 * @param {number} slideFromFreq - Frequency to slide from (null = no slide)
 */
function playNoteSingle(voiceIndex, frequency, time, waveType, duration, accent = false, slideFromFreq = null) {
  const ctx = getAudioContext();
  const gainNode = ctx.createGain();
  const voiceFilter = getVoiceFilter(voiceIndex);
  const adsr = voiceADSR[voiceIndex];
  const fenv = voiceFilterEnvelope[voiceIndex];
  const venv = voiceVolumeEnvelope[voiceIndex];

  // Add filter if filter envelope is enabled
  let filterNode = null;
  if (fenv.enabled && waveType !== "noise") {
    filterNode = ctx.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.Q.value = 8; // Resonance for 303 character
    
    // Filter envelope (boosted by accent)
    const filterAttackTime = time;
    const filterDecayTime = filterAttackTime + fenv.attack;
    const filterSustainTime = time + duration - fenv.release;
    const filterReleaseTime = time + duration;
    
    const accentBoost = accent ? 1.5 : 1.0; // Accent increases filter sweep
    const minFreq = fenv.baseFreq;
    const maxFreq = fenv.baseFreq + (8000 * fenv.amount * accentBoost); // Amount controls modulation depth
    
    filterNode.frequency.setValueAtTime(minFreq, filterAttackTime);
    filterNode.frequency.exponentialRampToValueAtTime(maxFreq, filterDecayTime);
    filterNode.frequency.exponentialRampToValueAtTime(minFreq + ((maxFreq - minFreq) * fenv.sustain), filterSustainTime);
    filterNode.frequency.exponentialRampToValueAtTime(minFreq, filterReleaseTime);
    
    filterNode.connect(gainNode);
  }

  gainNode.connect(voiceFilter);

  // ADSR envelope with optional accent
  const attackTime = time;
  const decayTime = attackTime + adsr.attack;
  const sustainTime = time + duration - adsr.release;
  const releaseTime = time + duration;
  
  // Combine volume envelope accent with per-note accent
  const envAccent = venv.enabled ? venv.accent : 1.0;
  const noteAccent = accent ? 1.3 : 1.0;
  const peakGain = 0.85 * envAccent * noteAccent;

  gainNode.gain.setValueAtTime(0.0, attackTime);
  gainNode.gain.linearRampToValueAtTime(peakGain, decayTime);
  gainNode.gain.exponentialRampToValueAtTime(Math.max(0.01, peakGain * adsr.sustain), sustainTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, releaseTime);

  if (waveType === "noise") {
    // Generate noise buffer
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    if (filterNode) {
      noiseSource.connect(filterNode);
    } else {
      noiseSource.connect(gainNode);
    }
    noiseSource.start(time);
    noiseSource.stop(time + duration + 0.02);
  } else {
    const osc = ctx.createOscillator();
    
    if (waveType === "pulse") {
      // Use custom pulse wave with variable width
      const pwm = voicePWM[voiceIndex];
      const pulseWave = createPulseWave(ctx, pwm.pulseWidth);
      osc.setPeriodicWave(pulseWave);
    } else {
      osc.type = waveType;
    }
    
    // Handle slide (portamento) from previous note
    if (slideFromFreq !== null && slideFromFreq !== frequency) {
      osc.frequency.setValueAtTime(slideFromFreq, time);
      osc.frequency.exponentialRampToValueAtTime(frequency, time + 0.08); // 80ms slide time
    } else {
      osc.frequency.setValueAtTime(frequency, time);
    }
    
    // Add vibrato if enabled
    const vib = voiceVibrato[voiceIndex];
    if (vib.enabled) {
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      
      lfo.frequency.setValueAtTime(vib.rate, time);
      // Convert semitones to frequency deviation
      const detuneAmount = vib.depth * 100; // cents (1 semitone = 100 cents)
      lfoGain.gain.setValueAtTime(detuneAmount, time);
      
      lfo.connect(lfoGain);
      lfoGain.connect(osc.detune);
      
      lfo.start(time);
      lfo.stop(time + duration + 0.02);
    }

    if (filterNode) {
      osc.connect(filterNode);
    } else {
      osc.connect(gainNode);
    }
    osc.start(time);
    osc.stop(time + duration + 0.02);
  }
}
