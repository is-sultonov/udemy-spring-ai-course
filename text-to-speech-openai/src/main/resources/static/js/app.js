/**
 * Text-to-Speech Application
 * Handles text-to-speech conversion with download and streaming capabilities
 */
class TextToSpeechApp {
    constructor() {
        this.initializeElements();
        this.initializeEventListeners();
        this.updateCharacterCount();
    }

    /**
     * Initialize DOM element references
     */
    initializeElements() {
        this.textInput = document.getElementById('textInput');
        this.charCount = document.getElementById('charCount');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.streamBtn = document.getElementById('streamBtn');
        this.audioPlayer = document.getElementById('audioPlayer');
        this.audioControls = document.getElementById('audioControls');
    }

    /**
     * Set up event listeners for user interactions
     */
    initializeEventListeners() {
        // Character counter
        this.textInput.addEventListener('input', () => this.updateCharacterCount());
        
        // Button click handlers
        this.downloadBtn.addEventListener('click', () => this.handleDownload());
        this.streamBtn.addEventListener('click', () => this.handleStream());
        
        // Keyboard shortcuts
        this.textInput.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                this.handleDownload();
            }
        });
    }

    /**
     * Update character count display with color coding
     */
    updateCharacterCount() {
        const count = this.textInput.value.length;
        this.charCount.textContent = count;
        
        // Color coding based on character count
        if (count > 3800) {
            this.charCount.style.color = '#e53e3e'; // Red
        } else if (count > 3500) {
            this.charCount.style.color = '#d69e2e'; // Orange
        } else {
            this.charCount.style.color = '#a0aec0'; // Gray
        }
    }

    /**
     * Validate user input before processing
     * @returns {boolean} True if input is valid
     */
    validateInput() {
        const text = this.textInput.value.trim();
        
        if (!text) {
            this.showError('downloadError', 'Please enter some text to convert to speech.');
            this.showError('streamError', 'Please enter some text to convert to speech.');
            return false;
        }
        
        if (text.length > 4000) {
            this.showError('downloadError', 'Text is too long. Please limit to 4000 characters.');
            this.showError('streamError', 'Text is too long. Please limit to 4000 characters.');
            return false;
        }
        
        return true;
    }

    /**
     * Handle audio download functionality
     */
    async handleDownload() {
        if (!this.validateInput()) return;

        this.clearMessages();
        this.setLoadingState('download', true);

        try {
            const text = encodeURIComponent(this.textInput.value.trim());
            
            console.log('Starting download request for text:', this.textInput.value.trim());
            
            const response = await fetch(`/api/v1/tts?userMessage=${text}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/octet-stream'
                }
            });

            console.log('Download response received:', {
                status: response.status,
                headers: Object.fromEntries(response.headers.entries()),
                contentType: response.headers.get('content-type')
            });

            if (!response.ok) {
                let errorText = 'Unknown error';
                try {
                    errorText = await response.text();
                } catch (e) {
                    errorText = `HTTP ${response.status} ${response.statusText}`;
                }
                throw new Error(`Server error (${response.status}): ${errorText}`);
            }

            const blob = await response.blob();
            console.log('Blob created:', { size: blob.size, type: blob.type });
            
            // Verify blob has content
            if (blob.size === 0) {
                throw new Error('Generated audio file is empty');
            }

            // Create download with auto-detected or fallback MIME type
            const contentType = response.headers.get('content-type') || 'audio/mpeg';
            const downloadBlob = new Blob([blob], { type: contentType });
            const url = window.URL.createObjectURL(downloadBlob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `speech-${Date.now()}.mp3`;
            a.style.display = 'none';
            
            console.log('Creating download link:', a.href);
            
            document.body.appendChild(a);
            
            // Force click and immediate cleanup
            try {
                a.click();
                console.log('Download initiated successfully');
                this.showSuccess('downloadSuccess', 'Audio file generated and downloaded successfully!');
            } catch (clickError) {
                console.error('Click error:', clickError);
                throw new Error('Failed to initiate download');
            }
            
            // Clean up
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Download error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            
            const errorMessage = this.getErrorMessage(error);
            this.showError('downloadError', errorMessage);
        } finally {
            this.setLoadingState('download', false);
        }
    }

    /**
     * Handle audio streaming functionality
     */
    async handleStream() {
        if (!this.validateInput()) return;

        this.clearMessages();
        this.setLoadingState('stream', true);
        this.audioControls.style.display = 'none';

        try {
            const text = encodeURIComponent(this.textInput.value.trim());
            const response = await fetch(`/api/v1/tts/stream?userMessage=${text}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/octet-stream'
                }
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            const blob = await response.blob();
            const audioUrl = window.URL.createObjectURL(blob);
            
            this.audioPlayer.src = audioUrl;
            this.audioControls.style.display = 'block';
            
            // Auto-play the audio
            this.audioPlayer.play().catch(e => {
                console.log('Auto-play was prevented by browser policy');
            });

            this.showSuccess('streamSuccess', 'Audio stream ready! Click play to listen.');

            // Clean up the blob URL when audio ends
            this.audioPlayer.addEventListener('ended', () => {
                window.URL.revokeObjectURL(audioUrl);
            }, { once: true });

        } catch (error) {
            console.error('Stream error:', error);
            this.showError('streamError', `Failed to stream audio: ${error.message}`);
        } finally {
            this.setLoadingState('stream', false);
        }
    }

    /**
     * Generate appropriate error message based on error type
     * @param {Error} error - The error object
     * @returns {string} User-friendly error message
     */
    getErrorMessage(error) {
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            return 'Network error: Unable to connect to server. Please check your connection.';
        } else if (error.message.includes('Server error')) {
            return error.message;
        } else if (error.message.includes('download')) {
            return `Download failed: ${error.message}`;
        } else {
            return `Error: ${error.message}`;
        }
    }

    /**
     * Set loading state for buttons and show/hide spinners
     * @param {string} type - Either 'download' or 'stream'
     * @param {boolean} isLoading - Whether to show loading state
     */
    setLoadingState(type, isLoading) {
        const btn = type === 'download' ? this.downloadBtn : this.streamBtn;
        const loading = document.getElementById(`${type}Loading`);
        
        btn.disabled = isLoading;
        loading.classList.toggle('show', isLoading);
    }

    /**
     * Show error message with auto-hide
     * @param {string} elementId - ID of error element
     * @param {string} message - Error message to display
     */
    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.classList.add('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorElement.classList.remove('show');
        }, 5000);
    }

    /**
     * Show success message with auto-hide
     * @param {string} elementId - ID of success element
     * @param {string} message - Success message to display
     */
    showSuccess(elementId, message) {
        const successElement = document.getElementById(elementId);
        successElement.textContent = message;
        successElement.classList.add('show');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            successElement.classList.remove('show');
        }, 3000);
    }

    /**
     * Clear all error and success messages
     */
    clearMessages() {
        const messages = document.querySelectorAll('.error-message, .success-message');
        messages.forEach(msg => msg.classList.remove('show'));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TextToSpeechApp();
});

// Global keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'F1') {
        e.preventDefault();
        alert('Keyboard Shortcuts:\n• Ctrl+Enter: Generate & Download\n• F1: Show this help');
    }
});