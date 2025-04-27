import { Howl } from 'howler';

// Sound effect URLs
const SOUND_URLS = {
  buttonClick: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  schoolBell: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  paperCrumple: 'https://assets.mixkit.co/active_storage/sfx/2688/2688-preview.mp3',
  chalk: 'https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/1689/1689-preview.mp3',
  failure: 'https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3',
  crisis: 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3'
};

// Background music URL
const BACKGROUND_MUSIC_URL = 'https://assets.mixkit.co/active_storage/sfx/2513/2513-preview.mp3';

// Create sound instances
const sounds: Record<string, Howl> = {};
let backgroundMusic: Howl | null = null;
let isSoundEnabled = true;

// Initialize sounds
export function initSounds(): void {
  // Create sound effects
  Object.entries(SOUND_URLS).forEach(([key, url]) => {
    sounds[key] = new Howl({
      src: [url],
      volume: 0.5,
      preload: true
    });
  });
  
  // Create background music
  backgroundMusic = new Howl({
    src: [BACKGROUND_MUSIC_URL],
    volume: 0.3,
    loop: true,
    preload: true
  });
}

// Play a sound effect
export function playSound(sound: keyof typeof SOUND_URLS): void {
  if (!isSoundEnabled) return;
  
  const soundInstance = sounds[sound];
  if (soundInstance) {
    soundInstance.play();
  }
}

// Start background music
export function startBackgroundMusic(): void {
  if (!isSoundEnabled || !backgroundMusic) return;
  
  backgroundMusic.play();
}

// Stop background music
export function stopBackgroundMusic(): void {
  if (backgroundMusic) {
    backgroundMusic.stop();
  }
}

// Toggle sound on/off
export function toggleSound(): boolean {
  isSoundEnabled = !isSoundEnabled;
  
  if (!isSoundEnabled && backgroundMusic) {
    backgroundMusic.stop();
  } else if (isSoundEnabled && backgroundMusic) {
    backgroundMusic.play();
  }
  
  return isSoundEnabled;
}

// Get current sound state
export function isSoundOn(): boolean {
  return isSoundEnabled;
}