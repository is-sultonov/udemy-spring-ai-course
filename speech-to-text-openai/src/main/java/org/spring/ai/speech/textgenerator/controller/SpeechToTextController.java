package org.spring.ai.speech.textgenerator.controller;

import jakarta.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.spring.ai.speech.textgenerator.dto.TranscriptionRequest;
import org.spring.ai.speech.textgenerator.dto.TranscriptionResponse;
import org.spring.ai.speech.textgenerator.service.SpeechToTextService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/v1/speech")
@Validated
public class SpeechToTextController {

    private static final Logger log = LoggerFactory.getLogger(SpeechToTextController.class);

    private final SpeechToTextService speechToTextService;

    public SpeechToTextController(SpeechToTextService speechToTextService) {
        this.speechToTextService = speechToTextService;
    }

    /**
     * Transcribe audio from an uploaded file
     */
    @PostMapping(value = "/transcribe", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TranscriptionResponse> transcribeAudio(
            @RequestParam("file") @NotNull MultipartFile file,
            @RequestParam(value = "language", required = false) String language,
            @RequestParam(value = "responseFormat", required = false, defaultValue = "json") String responseFormat) {
        
        log.info("Received transcription request for file: {}, size: {} bytes", 
                file.getOriginalFilename(), file.getSize());
        
        TranscriptionRequest request = TranscriptionRequest.builder()
                .file(file)
                .language(language)
                .responseFormat(responseFormat)
                .build();
                
        TranscriptionResponse response = speechToTextService.transcribeAudio(request);
        
        log.info("Transcription completed successfully for file: {}", file.getOriginalFilename());
        return ResponseEntity.ok(response);
    }

    /**
     * Async transcription for large files
     */
    @PostMapping(value = "/transcribe/async", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CompletableFuture<TranscriptionResponse>> transcribeAudioAsync(
            @RequestParam("file") @NotNull MultipartFile file,
            @RequestParam(value = "language", required = false) String language,
            @RequestParam(value = "responseFormat", required = false, defaultValue = "json") String responseFormat) {
        
        log.info("Received async transcription request for file: {}", file.getOriginalFilename());
        
        TranscriptionRequest request = TranscriptionRequest.builder()
                .file(file)
                .language(language)
                .responseFormat(responseFormat)
                .build();
                
        CompletableFuture<TranscriptionResponse> futureResponse = 
                speechToTextService.transcribeAudioAsync(request);
        
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(futureResponse);
    }

    /**
     * Transcribe from pre-uploaded resource (for testing/demo)
     */
    @GetMapping("/transcribe/resource")
    public ResponseEntity<TranscriptionResponse> transcribeResource(
            @RequestParam(value = "filename", required = false) String filename) {
        
        log.info("Transcribing resource file: {}", filename);
        TranscriptionResponse response = speechToTextService.transcribeResourceFile(filename);
        return ResponseEntity.ok(response);
    }
}
