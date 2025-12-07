# Chiptune Sequencer

A browser-based 16-step chiptune sequencer with 3 synth voices and 808-style drums. Built with vanilla JavaScript and the Web Audio API.

## Features

- **3 Synth Voices** with square, triangle, and noise waveforms
- **7 808-Style Drum Sounds** (kick, snare, clap, hats, tom, crash)
- **16-Step Sequencer** with variable note lengths
- **Pattern Library** - Save and organize multiple patterns
- **Song Arrangement** - Chain up to 32 patterns in sequence
- **Mixer** - Per-voice volume, filters (LP/HP), and delay effects
- **BPM Control** - 60-200 BPM range
- **Import/Export** - Save and load complete songs as JSON

## Quick Start

### Running Locally

1. **Start a local server:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Or use the included script (Windows)
   .\start.ps1
   ```

2. **Open in browser:**
   ```
   http://localhost:8000
   ```

3. **Start making music!**
   - Click cells to toggle notes on/off
   - Click and drag to extend note length
   - Use the play button to hear your pattern
   - Adjust BPM with the slider

## Project Structure

```
synth/
├── index.html              # Main HTML file
├── styles.css              # All styles
├── lib/
│   ├── sequencer.js        # Main orchestrator
│   ├── config.js           # Configuration constants
│   ├── audio.js            # Audio re-exports
│   ├── ui.js               # UI re-exports
│   ├── pattern.js          # Pattern data operations
│   ├── modal.js            # Modal dialog utilities
│   ├── transport.js        # Playback control
│   ├── patternLibrary.js   # Pattern/song management
│   ├── audio/
│   │   ├── mixer.js        # Mixer channel management
│   │   ├── synth.js        # Voice synthesis
│   │   └── drums.js        # 808 drum sounds
│   ├── ui/
│   │   ├── voiceGrid.js    # Voice sequencer grid
│   │   └── drumGrid.js     # Drum sequencer grid
│   ├── sequencer/
│   │   ├── events.js       # Event handlers
│   │   ├── mixer.js        # Mixer UI controls
│   │   ├── songSlots.js    # Song arrangement UI
│   │   ├── patternUI.js    # Pattern library UI
│   │   ├── storage.js      # Save/load functionality
│   │   └── demo.js         # Demo song patterns
│   └── utils/
│       ├── logger.js       # Logging utilities
│       ├── errorHandler.js # Error handling
│       └── eventBus.js     # Event system
└── README.md
```

## Architecture

### Module Organization

The codebase is organized into focused modules (all under 250 lines):

- **Core Modules** (`lib/`)
  - `sequencer.js` - Main application orchestrator
  - `config.js` - All configuration constants
  - `pattern.js` - Pattern data structures and operations
  - `transport.js` - Playback timing and control
  - `patternLibrary.js` - Pattern storage and management

- **Audio System** (`lib/audio/`)
  - `mixer.js` - Audio context, mixer channels, effects routing
  - `synth.js` - Oscillator-based voice synthesis
  - `drums.js` - 808-style drum sound generation

- **UI System** (`lib/ui/`)
  - `voiceGrid.js` - Voice sequencer grid with note length control
  - `drumGrid.js` - Drum sequencer grid

- **Sequencer Subsystems** (`lib/sequencer/`)
  - `events.js` - DOM event handlers
  - `mixer.js` - Mixer UI controls
  - `songSlots.js` - Song arrangement interface
  - `patternUI.js` - Pattern library interface
  - `storage.js` - JSON import/export
  - `demo.js` - Default demo song

- **Utilities** (`lib/utils/`)
  - `logger.js` - Logging and performance monitoring
  - `errorHandler.js` - Error handling and user feedback
  - `eventBus.js` - Pub/sub event system

### Audio Signal Flow

```
Voice → Gain → LP Filter → HP Filter → Delay (wet/dry) → Master Output
```

### Pattern Data Structure

```javascript
{
  name: "Pattern Name",
  voicePattern: [
    [ // Voice 0
      [ // Note row (C5)
        { active: true, length: 2 },  // Step 0: active, 2 steps long
        { active: false, length: 1 }, // Step 1: covered by step 0
        // ... 14 more steps
      ],
      // ... 7 more note rows
    ],
    // ... 2 more voices
  ],
  drumPattern: [
    [true, false, true, ...], // Kick pattern (16 steps)
    [false, false, false, ...], // Snare pattern
    // ... 5 more drum rows
  ]
}
```

## Development

### Configuration

Edit `lib/config.js` to change:
- Grid size (steps, voices)
- BPM range
- Audio timing
- Mixer defaults
- Development settings

### Development Mode

```javascript
// In lib/config.js
export const DEV_CONFIG = {
  enableLogging: true,          // Console logging
  performanceWarningThreshold: 100, // ms
  autoLoadDemoSong: false,      // Disable demo for faster testing
  demoSongDelay: 100
};
```

### Debugging

Access debugging tools in the browser console:

```javascript
// Global helpers
window.__sequencer.start()           // Start playback
window.__sequencer.stop()            // Stop playback
window.__sequencer.pattern           // Current pattern data
window.__sequencer.patternLibrary    // All saved patterns
window.__sequencer.state             // App state
window.__eventBus                    // Event bus for monitoring

// Set log level
import { setLogLevel, LogLevel } from './lib/utils/logger.js';
setLogLevel(LogLevel.DEBUG);
```

### Event System

Subscribe to events for debugging or extensions:

```javascript
import { eventBus, Events } from './lib/utils/eventBus.js';

// Listen for playback events
eventBus.on(Events.PLAYBACK_STARTED, () => {
  console.log('Playback started!');
});

eventBus.on(Events.STEP_ADVANCED, ({ step }) => {
  console.log('Current step:', step);
});
```

### Adding New Features

1. **New Audio Effect:**
   - Add to `lib/audio/mixer.js`
   - Update `MIXER_DEFAULTS` in `lib/config.js`
   - Add UI controls in `lib/sequencer/mixer.js`

2. **New Drum Sound:**
   - Add function to `lib/audio/drums.js`
   - Add name to `DRUM_NAMES` in `lib/config.js`
   - Update UI in `lib/ui/drumGrid.js`

3. **New Pattern Operation:**
   - Add function to `lib/pattern.js`
   - Wire up UI in `lib/sequencer/patternUI.js`
   - Emit event from `lib/utils/eventBus.js`

## Performance

### Optimizations

- Notes scheduled 10ms ahead for tight timing
- DOM updates batched per step
- Pattern data deep-copied only when saved
- Event handlers use event delegation where possible

### Monitoring

```javascript
// Check performance warnings in console
// Operations >100ms will log warnings

// Measure custom operations
import { measurePerformance } from './lib/utils/logger.js';

const result = measurePerformance('My Operation', () => {
  // Your code here
});
```

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (requires user interaction for audio)
- Mobile: ⚠️ Works but touch interaction could be improved

## Known Limitations

- Maximum 32 song slots
- Maximum 16 steps per pattern
- No MIDI input/output (yet)
- No audio recording/export (uses Web Audio API only)

## Future Enhancements

- MIDI controller support
- More waveforms (sawtooth, custom)
- Envelope controls (ADSR)
- Additional effects (reverb, distortion)
- Audio export (WAV/MP3)
- Keyboard shortcuts
- Mobile-optimized touch UI
- Undo/redo system
- Cloud save/load

## License

MIT License - Feel free to use and modify!

## Contributing

1. Keep files under 250 lines
2. Add JSDoc comments to functions
3. Use the event bus for component communication
4. Add error handling with `handleError()`
5. Log operations with the logger utilities
6. Update this README for architectural changes

## Credits

Built with:
- Web Audio API for synthesis
- Vanilla JavaScript (ES6 modules)
- CSS Grid for sequencer layout
- Pure love for chiptune music 🎵
