// Audio mixer channel management

import { MIXER_DEFAULTS } from '../config.js';

let audioCtx = null;
let masterGain = null;

export function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
  }
  return audioCtx;
}

export function getMasterGain() {
  getAudioContext(); // Ensure initialized
  return masterGain;
}

// Mixer channels per voice (each has gain, filter, delay)
const mixerChannels = [];

export function getMixerChannel(voiceIndex) {
  const ctx = getAudioContext();
  if (!mixerChannels[voiceIndex]) {
    // Create channel strip
    const channel = {
      gain: ctx.createGain(),
      lowpass: ctx.createBiquadFilter(),
      highpass: ctx.createBiquadFilter(),
      delay: ctx.createDelay(2.0),
      delayGain: ctx.createGain(),
      delayFeedback: ctx.createGain(),
      dryGain: ctx.createGain(),
      enabled: true,
      settings: {
        volume: MIXER_DEFAULTS.volume,
        lpEnabled: MIXER_DEFAULTS.lpEnabled,
        lpFreq: MIXER_DEFAULTS.lpFreq,
        hpEnabled: MIXER_DEFAULTS.hpEnabled,
        hpFreq: MIXER_DEFAULTS.hpFreq,
        delayEnabled: MIXER_DEFAULTS.delayEnabled,
        delayTime: MIXER_DEFAULTS.delayTime,
        delayFeedback: MIXER_DEFAULTS.delayFeedback,
        delayMix: MIXER_DEFAULTS.delayMix
      }
    };
    
    // Setup filters
    channel.lowpass.type = 'lowpass';
    channel.lowpass.frequency.value = MIXER_DEFAULTS.lpBypassFreq;
    channel.lowpass.Q.value = MIXER_DEFAULTS.lpQ;
    channel.highpass.type = 'highpass';
    channel.highpass.frequency.value = MIXER_DEFAULTS.hpBypassFreq;
    channel.highpass.Q.value = MIXER_DEFAULTS.hpQ;
    
    // Setup delay
    channel.delay.delayTime.value = MIXER_DEFAULTS.delayTime;
    channel.delayFeedback.gain.value = MIXER_DEFAULTS.delayFeedback;
    channel.delayGain.gain.value = 0; // Disabled by default
    channel.dryGain.gain.value = 1;
    
    // Connect signal path: gain -> lowpass -> highpass -> master (dry)
    channel.gain.connect(channel.lowpass);
    channel.lowpass.connect(channel.highpass);
    channel.highpass.connect(channel.dryGain);
    channel.dryGain.connect(masterGain);
    
    // Connect delay path (wet signal)
    channel.highpass.connect(channel.delay);
    channel.delay.connect(channel.delayFeedback);
    channel.delayFeedback.connect(channel.delay);
    channel.delay.connect(channel.delayGain);
    channel.delayGain.connect(masterGain);
    
    // Set initial volume
    channel.gain.gain.value = MIXER_DEFAULTS.volume;
    
    mixerChannels[voiceIndex] = channel;
  }
  return mixerChannels[voiceIndex];
}

export function updateMixerChannel(voiceIndex, settings) {
  const channel = getMixerChannel(voiceIndex);
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  
  if (settings.volume !== undefined) {
    channel.settings.volume = settings.volume;
    channel.gain.gain.setValueAtTime(settings.volume, now);
  }
  
  if (settings.lpEnabled !== undefined) {
    channel.settings.lpEnabled = settings.lpEnabled;
    const freq = settings.lpEnabled ? channel.settings.lpFreq : MIXER_DEFAULTS.lpBypassFreq;
    channel.lowpass.frequency.setValueAtTime(freq, now);
  }
  
  if (settings.lpFreq !== undefined) {
    channel.settings.lpFreq = settings.lpFreq;
    if (channel.settings.lpEnabled) {
      channel.lowpass.frequency.setValueAtTime(settings.lpFreq, now);
    }
  }
  
  if (settings.lpQ !== undefined) {
    channel.settings.lpQ = settings.lpQ;
    channel.lowpass.Q.setValueAtTime(settings.lpQ, now);
  }
  
  if (settings.hpEnabled !== undefined) {
    channel.settings.hpEnabled = settings.hpEnabled;
    const freq = settings.hpEnabled ? channel.settings.hpFreq : MIXER_DEFAULTS.hpBypassFreq;
    channel.highpass.frequency.setValueAtTime(freq, now);
  }
  
  if (settings.hpFreq !== undefined) {
    channel.settings.hpFreq = settings.hpFreq;
    if (channel.settings.hpEnabled) {
      channel.highpass.frequency.setValueAtTime(settings.hpFreq, now);
    }
  }
  
  if (settings.hpQ !== undefined) {
    channel.settings.hpQ = settings.hpQ;
    channel.highpass.Q.setValueAtTime(settings.hpQ, now);
  }
  
  if (settings.delayEnabled !== undefined) {
    channel.settings.delayEnabled = settings.delayEnabled;
    const wetGain = settings.delayEnabled ? channel.settings.delayMix : 0;
    channel.delayGain.gain.setValueAtTime(wetGain, now);
  }
  
  if (settings.delayTime !== undefined) {
    channel.settings.delayTime = settings.delayTime;
    channel.delay.delayTime.setValueAtTime(settings.delayTime, now);
  }
  
  if (settings.delayFeedback !== undefined) {
    channel.settings.delayFeedback = settings.delayFeedback;
    channel.delayFeedback.gain.setValueAtTime(settings.delayFeedback, now);
  }
  
  if (settings.delayMix !== undefined) {
    channel.settings.delayMix = settings.delayMix;
    if (channel.settings.delayEnabled) {
      channel.delayGain.gain.setValueAtTime(settings.delayMix, now);
    }
  }
  
  if (settings.enabled !== undefined) {
    channel.enabled = settings.enabled;
    const vol = settings.enabled ? channel.settings.volume : 0;
    channel.gain.gain.setValueAtTime(vol, now);
  }
}

export function getMixerSettings(voiceIndex) {
  const channel = getMixerChannel(voiceIndex);
  return { ...channel.settings, enabled: channel.enabled };
}
