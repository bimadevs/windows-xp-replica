import createPlaceholderAudio from '@/utils/createPlaceholderAudio';

// Define sound types for TypeScript
export type SoundType = 
  | 'startup'
  | 'shutdown'
  | 'error'
  | 'notification'
  | 'warning'
  | 'critical'
  | 'question'
  | 'exclamation'
  | 'asterisk'
  | 'windowOpen'
  | 'windowClose'
  | 'navigationStart'
  | 'navigationComplete';

// Map of sound file paths
const SOUND_MAP: Record<SoundType, string> = {
  startup: '/sounds/startup.mp3',
  shutdown: '/sounds/shutdown.mp3',
  error: '/sounds/error.mp3',
  notification: '/sounds/notification.mp3',
  warning: '/sounds/warning.mp3',
  critical: '/sounds/critical.mp3',
  question: '/sounds/question.mp3',
  exclamation: '/sounds/exclamation.mp3',
  asterisk: '/sounds/asterisk.mp3',
  windowOpen: '/sounds/windowOpen.mp3',
  windowClose: '/sounds/windowClose.mp3',
  navigationStart: '/sounds/navigation-start.mp3',
  navigationComplete: '/sounds/navigation-complete.mp3'
};

// Cache for loaded audio elements to prevent creating new ones on every play
const audioCache: Partial<Record<SoundType, HTMLAudioElement>> = {};

/**
 * Play a Windows XP sound
 * @param soundType Type of sound to play
 * @param volume Volume (0-1)
 * @returns Promise that resolves when sound starts playing
 */
export const playSound = (soundType: SoundType, volume = 1): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Get or create the audio element
      let audio = audioCache[soundType];
      
      if (!audio) {
        audio = new Audio(SOUND_MAP[soundType]);
        audioCache[soundType] = audio;
      }
      
      // Reset audio in case it was playing
      audio.pause();
      audio.currentTime = 0;
      
      // Set volume and play
      audio.volume = Math.min(1, Math.max(0, volume));
      
      // Listen for when playback actually starts
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => resolve())
          .catch(err => {
            console.error(`Failed to play sound: ${soundType}`, err);
            // Fallback to placeholder audio in case the file is missing
            createPlaceholderAudio(soundType);
            resolve();
          });
      } else {
        // For older browsers that don't return a promise
        audio.addEventListener('playing', () => resolve(), { once: true });
        audio.addEventListener('error', (e) => {
          console.error(`Error playing sound: ${soundType}`, e);
          // Fallback to placeholder audio in case the file is missing
          createPlaceholderAudio(soundType);
          resolve();
        }, { once: true });
      }
    } catch (error) {
      console.error(`Error setting up sound: ${soundType}`, error);
      // Fallback to placeholder audio in case of any error
      createPlaceholderAudio(soundType);
      resolve();
    }
  });
};

/**
 * Check if sounds are enabled in the user's settings
 */
export const areSoundsEnabled = (): boolean => {
  return localStorage.getItem('windowsXpSounds') !== 'disabled';
};

/**
 * Enable or disable Windows XP sounds
 */
export const setSoundsEnabled = (enabled: boolean): void => {
  if (enabled) {
    localStorage.removeItem('windowsXpSounds');
  } else {
    localStorage.setItem('windowsXpSounds', 'disabled');
  }
};

/**
 * Play a sound if sounds are enabled
 */
export const playSoundIfEnabled = (soundType: SoundType, volume = 1): Promise<void> => {
  if (areSoundsEnabled()) {
    return playSound(soundType, volume);
  }
  return Promise.resolve();
};

// Create a context for system volume
let systemVolume = 0.75; // Default to 75%
let systemMuted = false;

export const getSystemVolume = (): number => systemVolume;
export const isSystemMuted = (): boolean => systemMuted;

export const setSystemVolume = (volume: number): void => {
  systemVolume = Math.min(1, Math.max(0, volume));
};

export const setSystemMuted = (muted: boolean): void => {
  systemMuted = muted;
};

/**
 * Play a sound respecting system volume and mute settings
 */
export const playSystemSound = (soundType: SoundType): Promise<void> => {
  if (systemMuted) {
    return Promise.resolve();
  }
  return playSoundIfEnabled(soundType, systemVolume);
}; 