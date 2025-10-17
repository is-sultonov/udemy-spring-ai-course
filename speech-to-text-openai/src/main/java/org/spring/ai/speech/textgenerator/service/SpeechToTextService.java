package org.spring.ai.speech.textgenerator.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spring.ai.speech.textgenerator.dto.TranscriptionRequest;
import org.spring.ai.speech.textgenerator.dto.TranscriptionResponse;
import org.springframework.ai.audio.transcription.AudioTranscriptionPrompt;
import org.springframework.ai.audio.transcription.AudioTranscriptionResponse;
import org.springframework.ai.openai.OpenAiAudioTranscriptionModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executors;

@Service
public class SpeechToTextService {

    private static final Logger log = LoggerFactory.getLogger(SpeechToTextService.class);

    @Value("${speech.audio.file:classpath:speech-1760589387683.mp3}")
    private Resource defaultResource;

    private final OpenAiAudioTranscriptionModel audioTranscription;
    private final ResourceLoader resourceLoader;

    public SpeechToTextService(OpenAiAudioTranscriptionModel audioTranscription, 
                              ResourceLoader resourceLoader) {
        this.audioTranscription = audioTranscription;
        this.resourceLoader = resourceLoader;
    }

    /**
     * Transcribe audio from uploaded MultipartFile
     */
    public TranscriptionResponse transcribeAudio(TranscriptionRequest request) {
        long startTime = System.currentTimeMillis();
        
        try {
            MultipartFile file = request.getFile();
            if (file == null || file.isEmpty()) {
                throw new IllegalArgumentException("Audio file is required and cannot be empty");
            }
            
            log.info("Transcribing uploaded file: {}, size: {} bytes", 
                    file.getOriginalFilename(), file.getSize());
            
            // Create AudioTranscriptionPrompt with the uploaded file
            AudioTranscriptionPrompt prompt = new AudioTranscriptionPrompt(file.getResource());
            
            // Set language if provided
            if (request.getLanguage() != null && !request.getLanguage().trim().isEmpty()) {
                // Note: Spring AI 1.0.3 may not support language parameter directly
                // This would require options configuration
                log.debug("Language specified: {}", request.getLanguage());
            }
            
            AudioTranscriptionResponse response = audioTranscription.call(prompt);
            long duration = System.currentTimeMillis() - startTime;
            
            String transcriptionText = response.getResult().getOutput();
            
            // Create a response with metadata
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("originalFilename", file.getOriginalFilename());
            metadata.put("fileSize", file.getSize());
            metadata.put("contentType", file.getContentType());
            
            TranscriptionResponse result = TranscriptionResponse.builder()
                    .transcription(transcriptionText)
                    .language(request.getLanguage())
                    .confidence(1.0) // OpenAI Whisper doesn't provide confidence scores
                    .duration(duration)
                    .model(request.getModel() != null ? request.getModel() : "whisper-1")
                    .responseFormat(request.getResponseFormat() != null ? request.getResponseFormat() : "json")
                    .processedAt(LocalDateTime.now())
                    .metadata(metadata)
                    .success(true)
                    .build();
            
            log.info("Transcription completed successfully in {} ms", duration);
            return result;
            
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("Error transcribing audio file: {}", e.getMessage(), e);
            
            return TranscriptionResponse.builder()
                    .duration(duration)
                    .processedAt(LocalDateTime.now())
                    .success(false)
                    .errorMessage("Transcription failed: " + e.getMessage())
                    .build();
        }
    }

    /**
     * Async transcription for large files
     */
    public CompletableFuture<TranscriptionResponse> transcribeAudioAsync(TranscriptionRequest request) {
        log.info("Starting async transcription for file: {}", 
                request.getFile() != null ? request.getFile().getOriginalFilename() : "unknown");
        
        return CompletableFuture.supplyAsync(() -> transcribeAudio(request), 
                Executors.newVirtualThreadPerTaskExecutor());
    }

    /**
     * Transcribe from a resource file (for testing/demo)
     */
    public TranscriptionResponse transcribeResourceFile(String filename) {
        long startTime = System.currentTimeMillis();
        
        try {
            Resource resource;
            if (filename == null || filename.trim().isEmpty()) {
                // Use default resource
                resource = defaultResource;
                log.info("Using default resource file for transcription");
            } else {
                // Load specified resource
                resource = resourceLoader.getResource("classpath:" + filename);
                log.info("Loading resource file: {}", filename);
            }
            
            if (!resource.exists()) {
                throw new IllegalArgumentException("Resource file not found: " + 
                    (filename != null ? filename : defaultResource.getDescription()));
            }
            
            log.info("Transcribing resource: {}, size: {} bytes", 
                    resource.getFilename(), resource.contentLength());
            
            AudioTranscriptionPrompt prompt = new AudioTranscriptionPrompt(resource);
            AudioTranscriptionResponse response = audioTranscription.call(prompt);
            long duration = System.currentTimeMillis() - startTime;
            
            String transcriptionText = response.getResult().getOutput();
            
            // Create a response with metadata
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("resourcePath", resource.getDescription());
            metadata.put("filename", resource.getFilename());
            metadata.put("fileSize", resource.contentLength());
            
            TranscriptionResponse result = TranscriptionResponse.builder()
                    .transcription(transcriptionText)
                    .confidence(1.0)
                    .duration(duration)
                    .model("whisper-1")
                    .responseFormat("json")
                    .processedAt(LocalDateTime.now())
                    .metadata(metadata)
                    .success(true)
                    .build();
            
            log.info("Resource transcription completed successfully in {} ms", duration);
            return result;
            
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("Error transcribing resource file: {}", e.getMessage(), e);
            
            return TranscriptionResponse.builder()
                    .duration(duration)
                    .processedAt(LocalDateTime.now())
                    .success(false)
                    .errorMessage("Resource transcription failed: " + e.getMessage())
                    .build();
        }
    }

}