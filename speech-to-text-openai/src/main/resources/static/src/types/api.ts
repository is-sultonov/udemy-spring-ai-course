// API Types based on backend DTOs
export interface TranscriptionRequest {
  file: File;
  language?: string;
  responseFormat?: ResponseFormat;
  model?: string;
}

export interface TranscriptionResponse {
  transcription: string;
  language: string;
  confidence: number;
  duration: number;
  model: string;
  responseFormat: string;
  processedAt: string;
  metadata?: Record<string, unknown>;
  success: boolean;
  errorMessage?: string;
}

export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  timestamp: string;
  errors?: Record<string, string>;
}

export type ResponseFormat = 'json' | 'text' | 'srt' | 'vtt' | 'verbose_json';

export type SupportedLanguage = 
  | 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'ja' | 'ko' | 'zh' 
  | 'ar' | 'hi' | 'nl' | 'sv' | 'da' | 'no' | 'fi' | 'pl' | 'tr' | 'auto';

export const SUPPORTED_AUDIO_FORMATS = [
  'audio/mp3',
  'audio/mpeg',
  'audio/wav',
  'audio/m4a',
  'audio/flac',
  'video/mp4',
  'audio/oga',
  'audio/ogg',
  'audio/webm'
] as const;

export type SupportedAudioFormat = typeof SUPPORTED_AUDIO_FORMATS[number];

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface TranscriptionJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: TranscriptionResponse;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}