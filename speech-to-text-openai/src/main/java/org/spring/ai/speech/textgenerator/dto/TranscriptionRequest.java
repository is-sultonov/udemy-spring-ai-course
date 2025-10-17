package org.spring.ai.speech.textgenerator.dto;

import org.springframework.web.multipart.MultipartFile;

/**
 * Data Transfer Object for transcription requests
 */
public class TranscriptionRequest {
    
    private MultipartFile file;
    private String language;
    private String responseFormat;
    private String model;
    
    public TranscriptionRequest() {}
    
    private TranscriptionRequest(Builder builder) {
        this.file = builder.file;
        this.language = builder.language;
        this.responseFormat = builder.responseFormat;
        this.model = builder.model;
    }
    
    public static Builder builder() {
        return new Builder();
    }
    
    // Getters
    public MultipartFile getFile() { return file; }
    public String getLanguage() { return language; }
    public String getResponseFormat() { return responseFormat; }
    public String getModel() { return model; }
    
    // Setters
    public void setFile(MultipartFile file) { this.file = file; }
    public void setLanguage(String language) { this.language = language; }
    public void setResponseFormat(String responseFormat) { this.responseFormat = responseFormat; }
    public void setModel(String model) { this.model = model; }
    
    public static class Builder {
        private MultipartFile file;
        private String language;
        private String responseFormat = "json";
        private String model = "whisper-1";
        
        public Builder file(MultipartFile file) {
            this.file = file;
            return this;
        }
        
        public Builder language(String language) {
            this.language = language;
            return this;
        }
        
        public Builder responseFormat(String responseFormat) {
            this.responseFormat = responseFormat;
            return this;
        }
        
        public Builder model(String model) {
            this.model = model;
            return this;
        }
        
        public TranscriptionRequest build() {
            return new TranscriptionRequest(this);
        }
    }
}