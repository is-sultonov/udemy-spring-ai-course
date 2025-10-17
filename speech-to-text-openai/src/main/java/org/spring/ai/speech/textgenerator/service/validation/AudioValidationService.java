package org.spring.ai.speech.textgenerator.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spring.ai.speech.textgenerator.exception.AudioProcessingException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

/**
 * Service for validating audio files before processing
 */
@Service
public class AudioValidationService {

    private static final Logger log = LoggerFactory.getLogger(AudioValidationService.class);

    @Value("${app.audio.max-file-size:26214400}") // 25MB default
    private long maxFileSize;

    @Value("${app.audio.allowed-formats:mp3,wav,m4a,flac,mp4,mpeg,mpga,oga,ogg,webm}")
    private String allowedFormatsStr;

    private static final Set<String> SUPPORTED_MIME_TYPES = Set.of(
            "audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/wave",
            "audio/mp4", "audio/m4a", "audio/flac", "audio/ogg", "audio/webm",
            "video/mp4", "video/mpeg", "video/webm"
    );

    /**
     * Validate audio file for transcription processing
     */
    public void validateAudioFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new AudioProcessingException("Audio file is required and cannot be empty");
        }

        validateFileName(file.getOriginalFilename());
        validateFileSize(file.getSize());
        validateFileType(file);
        
        log.debug("Audio file validation passed for: {}", file.getOriginalFilename());
    }

    private void validateFileName(String fileName) {
        if (!StringUtils.hasText(fileName)) {
            throw new AudioProcessingException("File name cannot be empty");
        }

        // Check for potentially dangerous file names
        if (fileName.contains("..") || fileName.contains("/") || fileName.contains("\\")) {
            throw new AudioProcessingException("Invalid file name: " + fileName);
        }

        // Validate file extension
        String extension = getFileExtension(fileName).toLowerCase();
        Set<String> allowedFormats = Set.of(allowedFormatsStr.toLowerCase().split(","));
        
        if (!allowedFormats.contains(extension)) {
            throw new AudioProcessingException(
                String.format("Unsupported file format: %s. Allowed formats: %s", 
                    extension, allowedFormatsStr));
        }
    }

    private void validateFileSize(long fileSize) {
        if (fileSize <= 0) {
            throw new AudioProcessingException("File size must be greater than 0");
        }

        if (fileSize > maxFileSize) {
            throw new AudioProcessingException(
                String.format("File size (%d bytes) exceeds maximum allowed size (%d bytes)", 
                    fileSize, maxFileSize));
        }
    }

    private void validateFileType(MultipartFile file) {
        String contentType = file.getContentType();
        
        if (!StringUtils.hasText(contentType)) {
            log.warn("Content type is null for file: {}", file.getOriginalFilename());
            return; // Allow null content type but log warning
        }

        if (!SUPPORTED_MIME_TYPES.contains(contentType.toLowerCase())) {
            log.warn("Potentially unsupported MIME type: {} for file: {}", 
                contentType, file.getOriginalFilename());
            // Log warning but don't fail - OpenAI Whisper is quite flexible
        }
    }

    private String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex == -1 || lastDotIndex == fileName.length() - 1) {
            return "";
        }
        return fileName.substring(lastDotIndex + 1);
    }
}