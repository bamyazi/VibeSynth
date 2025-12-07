// Audio engine - re-exports from modular components
// This file maintains backward compatibility while delegating to split modules

export { getAudioContext, getMixerChannel, updateMixerChannel, getMixerSettings } from './audio/mixer.js';
export { playNote, getVoiceFilter, updateFilterCutoff, updateFilterResonance, getVoiceADSR, updateVoiceADSR, getVoicePWM, updateVoicePWM, getVoiceArpeggio, updateVoiceArpeggio, getVoiceVibrato, updateVoiceVibrato, getVoiceFilterEnvelope, updateVoiceFilterEnvelope, getVoiceVolumeEnvelope, updateVoiceVolumeEnvelope } from './audio/synth.js';
export { playDrum, playKick, playSnare, playClap, playClosedHat, playOpenHat, playTom, playCrash } from './audio/drums.js';

