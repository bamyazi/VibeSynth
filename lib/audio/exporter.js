/**
 * Audio export functionality for rendering songs to WAV files
 * Uses Web Audio OfflineAudioContext for offline rendering
 * @module audio/exporter
 */

import { SEQUENCER_CONFIG } from '../config.js';
import { getAudioContext } from './mixer.js';

/**
 * Export current song as WAV file
 * @param {Object} songData - Full song data including patterns, arrangement, settings
 * @param {number} bpm - Tempo in beats per minute
 * @param {Function} createPatternCallback - Callback to render a pattern
 * @returns {Promise<Blob>} - WAV file as blob
 */
export async function exportToWav(songData, bpm, createPatternCallback) {
  const { patterns, songSlots, voiceSettings, mixerSettings } = songData;
  
  // Calculate total song duration
  const beatDuration = 60 / bpm;
  const patternDuration = SEQUENCER_CONFIG.numSteps * beatDuration;
  const numSlots = songSlots.filter(slot => slot !== null).length;
  const totalDuration = numSlots * patternDuration;
  
  // Create offline context for rendering
  const sampleRate = getAudioContext().sampleRate;
  const offlineContext = new OfflineAudioContext(2, sampleRate * totalDuration, sampleRate);
  
  // Render each pattern slot
  let currentTime = 0;
  for (let slotIndex = 0; slotIndex < songSlots.length; slotIndex++) {
    const patternIndex = songSlots[slotIndex];
    if (patternIndex === null) continue;
    
    const pattern = patterns[patternIndex];
    if (!pattern) continue;
    
    // Render pattern using callback
    await createPatternCallback(
      offlineContext,
      pattern,
      currentTime,
      bpm,
      voiceSettings,
      mixerSettings
    );
    
    currentTime += patternDuration;
  }
  
  // Render to audio buffer
  const renderedBuffer = await offlineContext.startRendering();
  
  // Convert to WAV blob
  return audioBufferToWav(renderedBuffer);
}

/**
 * Convert AudioBuffer to WAV file blob
 * @param {AudioBuffer} buffer - Rendered audio buffer
 * @returns {Blob} - WAV file blob
 */
function audioBufferToWav(buffer) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  
  const data = interleave(buffer);
  const dataLength = data.length * bytesPerSample;
  const headerLength = 44;
  const totalLength = headerLength + dataLength;
  
  const arrayBuffer = new ArrayBuffer(totalLength);
  const view = new DataView(arrayBuffer);
  
  // Write WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, totalLength - 8, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true); // byte rate
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);
  
  // Write audio data
  floatTo16BitPCM(view, 44, data);
  
  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

/**
 * Interleave multi-channel audio data
 * @param {AudioBuffer} buffer - Audio buffer
 * @returns {Float32Array} - Interleaved samples
 */
function interleave(buffer) {
  const numChannels = buffer.numberOfChannels;
  const length = buffer.length * numChannels;
  const result = new Float32Array(length);
  
  const channels = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }
  
  let offset = 0;
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      result[offset++] = channels[channel][i];
    }
  }
  
  return result;
}

/**
 * Write string to DataView
 * @param {DataView} view - DataView to write to
 * @param {number} offset - Byte offset
 * @param {string} string - String to write
 */
function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Convert float samples to 16-bit PCM
 * @param {DataView} view - DataView to write to
 * @param {number} offset - Byte offset
 * @param {Float32Array} input - Float samples (-1.0 to 1.0)
 */
function floatTo16BitPCM(view, offset, input) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
}

/**
 * Download blob as file
 * @param {Blob} blob - File blob
 * @param {string} filename - Desired filename
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}
