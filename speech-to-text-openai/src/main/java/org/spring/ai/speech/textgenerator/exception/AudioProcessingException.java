package org.spring.ai.speech.textgenerator.exception;

/**
 * Custom exception for audio processing errors
 */
public class AudioProcessingException extends RuntimeException {

    public AudioProcessingException(String message) {
        super(message);
    }

    public AudioProcessingException(String message, Throwable cause) {
        super(message, cause);
    }
}