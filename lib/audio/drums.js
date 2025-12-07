// 808-style drum sounds

import { getAudioContext, getMasterGain } from './mixer.js';

// Noise buffer helper
let noiseBuffer = null;

function createNoiseBuffer() {
  const ctx = getAudioContext();
  const duration = 1.0;
  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function getNoiseBuffer() {
  if (!noiseBuffer) {
    noiseBuffer = createNoiseBuffer();
  }
  return noiseBuffer;
}

export function playKick(time) {
  const ctx = getAudioContext();
  const masterGain = getMasterGain();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(120, time);
  osc.frequency.exponentialRampToValueAtTime(40, time + 0.15);

  gain.gain.setValueAtTime(1.0, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(time);
  osc.stop(time + 0.5);
}

export function playSnare(time) {
  const ctx = getAudioContext();
  const masterGain = getMasterGain();
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer();

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.setValueAtTime(1800, time);
  noiseFilter.Q.setValueAtTime(0.8, time);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.8, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.25);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(masterGain);

  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(200, time);
  oscGain.gain.setValueAtTime(0.4, time);
  oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
  osc.connect(oscGain);
  oscGain.connect(masterGain);

  noise.start(time);
  noise.stop(time + 0.3);
  osc.start(time);
  osc.stop(time + 0.3);
}

export function playClap(time) {
  const ctx = getAudioContext();
  const masterGain = getMasterGain();
  const bufferSource = ctx.createBufferSource();
  bufferSource.buffer = getNoiseBuffer();

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.setValueAtTime(1500, time);
  bandpass.Q.setValueAtTime(0.5, time);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0, time);

  bufferSource.connect(bandpass);
  bandpass.connect(gain);
  gain.connect(masterGain);

  const hits = [0.0, 0.03, 0.06];
  hits.forEach(offset => {
    const t = time + offset;
    gain.gain.setValueAtTime(0.0, t);
    gain.gain.linearRampToValueAtTime(0.8, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
  });

  bufferSource.start(time);
  bufferSource.stop(time + 0.4);
}

export function playClosedHat(time) {
  const ctx = getAudioContext();
  const masterGain = getMasterGain();
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer();

  const highpass = ctx.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.setValueAtTime(6000, time);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.7, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.08);

  noise.connect(highpass);
  highpass.connect(gain);
  gain.connect(masterGain);

  noise.start(time);
  noise.stop(time + 0.15);
}

export function playOpenHat(time) {
  const ctx = getAudioContext();
  const masterGain = getMasterGain();
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer();

  const highpass = ctx.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.setValueAtTime(5000, time);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.7, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);

  noise.connect(highpass);
  highpass.connect(gain);
  gain.connect(masterGain);

  noise.start(time);
  noise.stop(time + 0.5);
}

export function playTom(time) {
  const ctx = getAudioContext();
  const masterGain = getMasterGain();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(180, time);
  osc.frequency.exponentialRampToValueAtTime(80, time + 0.25);

  gain.gain.setValueAtTime(0.9, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(time);
  osc.stop(time + 0.5);
}

export function playCrash(time) {
  const ctx = getAudioContext();
  const masterGain = getMasterGain();
  const noise = ctx.createBufferSource();
  noise.buffer = getNoiseBuffer();

  const highpass = ctx.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.setValueAtTime(4000, time);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.5, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 1.2);

  noise.connect(highpass);
  highpass.connect(gain);
  gain.connect(masterGain);

  noise.start(time);
  noise.stop(time + 1.5);
}

export function playDrum(drumIndex, time) {
  switch (drumIndex) {
    case 0: return playKick(time);
    case 1: return playSnare(time);
    case 2: return playClap(time);
    case 3: return playClosedHat(time);
    case 4: return playOpenHat(time);
    case 5: return playTom(time);
    case 6: return playCrash(time);
  }
}
