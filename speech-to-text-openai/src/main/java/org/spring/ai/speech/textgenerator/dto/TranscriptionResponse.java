package org.spring.ai.speech.textgenerator.dto;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Data Transfer Object for transcription responses
 */
public class TranscriptionResponse {
    
    private String transcription;
    private String language;
    private double confidence;
    private long duration;
    private String model;
    private String responseFormat;
    private LocalDateTime processedAt;
    private Map<String, Object> metadata;
    private boolean success;
    private String errorMessage;
    
    public TranscriptionResponse() {}
    
    private TranscriptionResponse(Builder builder) {
        this.transcription = builder.transcription;
        this.language = builder.language;
        this.confidence = builder.confidence;
        this.duration = builder.duration;
        this.model = builder.model;
        this.responseFormat = builder.responseFormat;
        this.processedAt = builder.processedAt;
        this.metadata = builder.metadata;
        this.success = builder.success;
        this.errorMessage = builder.errorMessage;
    }
    
    public static Builder builder() {
        return new Builder();
    }
    
    // Getters
    public String getTranscription() { return transcription; }
    public String getLanguage() { return language; }
    public double getConfidence() { return confidence; }
    public long getDuration() { return duration; }
    public String getModel() { return model; }
    public String getResponseFormat() { return responseFormat; }
    public LocalDateTime getProcessedAt() { return processedAt; }
    public Map<String, Object> getMetadata() { return metadata; }
    public boolean isSuccess() { return success; }
    public String getErrorMessage() { return errorMessage; }
    
    // Setters
    public void setTranscription(String transcription) { this.transcription = transcription; }
    public void setLanguage(String language) { this.language = language; }
    public void setConfidence(double confidence) { this.confidence = confidence; }
    public void setDuration(long duration) { this.duration = duration; }
    public void setModel(String model) { this.model = model; }
    public void setResponseFormat(String responseFormat) { this.responseFormat = responseFormat; }
    public void setProcessedAt(LocalDateTime processedAt) { this.processedAt = processedAt; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
    public void setSuccess(boolean success) { this.success = success; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    
    public static class Builder {
        private String transcription;
        private String language;
        private double confidence;
        private long duration;
        private String model;
        private String responseFormat;
        private LocalDateTime processedAt;
        private Map<String, Object> metadata;
        private boolean success = true;
        private String errorMessage;
        
        public Builder transcription(String transcription) {
            this.transcription = transcription;
            return this;
        }
        
        public Builder language(String language) {
            this.language = language;
            return this;
        }
        
        public Builder confidence(double confidence) {
            this.confidence = confidence;
            return this;
        }
        
        public Builder duration(long duration) {
            this.duration = duration;
            return this;
        }
        
        public Builder model(String model) {
            this.model = model;
            return this;
        }
        
        public Builder responseFormat(String responseFormat) {
            this.responseFormat = responseFormat;
            return this;
        }
        
        public Builder processedAt(LocalDateTime processedAt) {
            this.processedAt = processedAt;
            return this;
        }
        
        public Builder metadata(Map<String, Object> metadata) {
            this.metadata = metadata;
            return this;
        }
        
        public Builder success(boolean success) {
            this.success = success;
            return this;
        }
        
        public Builder errorMessage(String errorMessage) {
            this.errorMessage = errorMessage;
            this.success = false;
            return this;
        }
        
        public TranscriptionResponse build() {
            return new TranscriptionResponse(this);
        }
    }
}