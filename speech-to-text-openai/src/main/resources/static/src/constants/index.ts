export const SUPPORTED_LANGUAGES = [
  { value: 'auto', label: 'Auto-detect' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ar', label: 'Arabic' },
  { value: 'hi', label: 'Hindi' },
  { value: 'nl', label: 'Dutch' },
  { value: 'sv', label: 'Swedish' },
  { value: 'da', label: 'Danish' },
  { value: 'no', label: 'Norwegian' },
  { value: 'fi', label: 'Finnish' },
  { value: 'pl', label: 'Polish' },
  { value: 'tr', label: 'Turkish' },
] as const;

export const RESPONSE_FORMATS = [
  { value: 'json', label: 'JSON', description: 'Structured JSON response with metadata' },
  { value: 'text', label: 'Plain Text', description: 'Simple text transcription' },
  { value: 'srt', label: 'SRT Subtitles', description: 'SubRip subtitle format with timestamps' },
  { value: 'vtt', label: 'VTT Subtitles', description: 'WebVTT subtitle format' },
  { value: 'verbose_json', label: 'Verbose JSON', description: 'Detailed JSON with word-level timestamps' },
] as const;

export const FILE_UPLOAD_CONFIG = {
  MAX_SIZE: 25 * 1024 * 1024, // 25MB
  ACCEPTED_TYPES: {
    'audio/mp3': ['.mp3'],
    'audio/mpeg': ['.mp3', '.mpeg'],
    'audio/wav': ['.wav'],
    'audio/m4a': ['.m4a'],
    'audio/flac': ['.flac'],
    'video/mp4': ['.mp4'],
    'audio/oga': ['.oga'],
    'audio/ogg': ['.ogg'],
    'audio/webm': ['.webm'],
  },
  ACCEPTED_EXTENSIONS: ['.mp3', '.wav', '.m4a', '.flac', '.mp4', '.mpeg', '.oga', '.ogg', '.webm'],
} as const;

export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
  RETRY_ATTEMPTS: 3,
  POLLING_INTERVAL: 2000,
  ANIMATION_DURATION: 300,
} as const;

export const ACCESSIBILITY_CONFIG = {
  FOCUS_VISIBLE_OUTLINE: '2px solid #3b82f6',
  HIGH_CONTRAST_OUTLINE: '3px solid currentColor',
  REDUCED_MOTION_DURATION: '0.01ms',
} as const;

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const STORAGE_KEYS = {
  LANGUAGE_PREFERENCE: 'speech-to-text-language',
  THEME_PREFERENCE: 'speech-to-text-theme',
  TRANSCRIPTION_HISTORY: 'speech-to-text-history',
  USER_SETTINGS: 'speech-to-text-settings',
} as const;