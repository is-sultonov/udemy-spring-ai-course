import { 
  TranscriptionRequest, 
  TranscriptionResponse, 
  ApiError,
  UploadProgress 
} from '@types/api';

// Base API configuration
const API_BASE_URL = '/api/v1/speech';

// Custom error class for API errors
export class ApiErrorClass extends Error {
  public status: number;
  public code: string;
  public details: string;

  constructor(error: ApiError) {
    super(error.title);
    this.name = 'ApiError';
    this.status = error.status;
    this.code = error.type;
    this.details = error.detail;
  }
}

// Request configuration
interface RequestConfig {
  timeout?: number;
  onUploadProgress?: (progress: UploadProgress) => void;
  signal?: AbortSignal;
}

// Generic fetch wrapper with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit & RequestConfig = {}
): Promise<T> {
  const { timeout = 300000, onUploadProgress, signal, ...fetchOptions } = options;

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Use provided signal or create new one
  const requestSignal = signal || controller.signal;

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      signal: requestSignal,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        ...fetchOptions.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        type: 'unknown-error',
        title: 'Unknown Error',
        status: response.status,
        detail: response.statusText,
        instance: endpoint,
        timestamp: new Date().toISOString(),
      }));

      throw new ApiErrorClass(errorData);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return response as unknown as T;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof ApiErrorClass) {
      throw error;
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Request timeout or cancelled');
    }

    throw new Error('Network error occurred');
  }
}

// Create FormData for file upload with progress tracking
function createFormDataWithProgress(
  request: TranscriptionRequest,
  onProgress?: (progress: UploadProgress) => void
): FormData {
  const formData = new FormData();
  
  formData.append('file', request.file);
  
  if (request.language) {
    formData.append('language', request.language);
  }
  
  if (request.responseFormat) {
    formData.append('responseFormat', request.responseFormat);
  }

  return formData;
}

// API service methods
export const apiService = {
  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return apiRequest('/health');
  },

  // Synchronous transcription
  async transcribeAudio(
    request: TranscriptionRequest,
    options: RequestConfig = {}
  ): Promise<TranscriptionResponse> {
    const formData = createFormDataWithProgress(request, options.onUploadProgress);

    return apiRequest<TranscriptionResponse>('/transcribe', {
      method: 'POST',
      body: formData,
      ...options,
    });
  },

  // Asynchronous transcription
  async transcribeAudioAsync(
    request: TranscriptionRequest,
    options: RequestConfig = {}
  ): Promise<{ jobId: string; status: string }> {
    const formData = createFormDataWithProgress(request, options.onUploadProgress);

    return apiRequest('/transcribe/async', {
      method: 'POST',
      body: formData,
      ...options,
    });
  },

  // Transcribe resource file (for testing)
  async transcribeResource(filename?: string): Promise<TranscriptionResponse> {
    const params = filename ? `?filename=${encodeURIComponent(filename)}` : '';
    return apiRequest(`/transcribe/resource${params}`);
  },

  // Poll async job status (if backend supports it)
  async getJobStatus(jobId: string): Promise<{ status: string; result?: TranscriptionResponse }> {
    return apiRequest(`/jobs/${jobId}`);
  },
};

// File validation utilities
export const fileValidation = {
  // Maximum file size (25MB as per backend)
  MAX_FILE_SIZE: 25 * 1024 * 1024,

  // Supported MIME types
  SUPPORTED_MIME_TYPES: [
    'audio/mp3',
    'audio/mpeg',
    'audio/wav',
    'audio/m4a',
    'audio/flac',
    'video/mp4',
    'audio/oga',
    'audio/ogg',
    'audio/webm',
  ],

  // Validate file before upload
  validateFile(file: File): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      errors.push(`File size must be less than ${this.MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    // Check MIME type
    if (!this.SUPPORTED_MIME_TYPES.includes(file.type)) {
      errors.push('Unsupported file format. Please use MP3, WAV, M4A, FLAC, or other supported audio formats.');
    }

    // Check if file is empty
    if (file.size === 0) {
      errors.push('File is empty');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Get human-readable file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
};