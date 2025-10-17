package org.spring.ai.speech.textgenerator.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.spring.ai.speech.textgenerator.dto.TranscriptionRequest;
import org.spring.ai.speech.textgenerator.dto.TranscriptionResponse;
import org.spring.ai.speech.textgenerator.exception.AudioProcessingException;
import org.springframework.ai.audio.transcription.AudioTranscriptionPrompt;
import org.springframework.ai.audio.transcription.AudioTranscriptionResponse;
import org.springframework.ai.audio.transcription.AudioTranscriptionResult;
import org.springframework.ai.openai.OpenAiAudioTranscriptionModel;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SpeechToTextServiceTest {

    @Mock
    private OpenAiAudioTranscriptionModel audioTranscriptionModel;

    @Mock
    private AudioTranscriptionResponse mockResponse;

    @Mock
    private AudioTranscriptionResult mockResult;

    private SpeechToTextService speechToTextService;

    @BeforeEach
    void setUp() {
        speechToTextService = new SpeechToTextService(audioTranscriptionModel);
        
        // Set up default resource
        Resource defaultResource = new ClassPathResource("speech-1760589387683.mp3");
        ReflectionTestUtils.setField(speechToTextService, "defaultResource", defaultResource);
        ReflectionTestUtils.setField(speechToTextService, "defaultResourceFilename", "speech-1760589387683.mp3");
    }

    @Test
    void testTranscribeAudio_Success() {
        // Arrange
        MultipartFile file = new MockMultipartFile(
                "audio", 
                "test.mp3", 
                "audio/mpeg", 
                "test audio content".getBytes()
        );
        
        TranscriptionRequest request = TranscriptionRequest.builder()
                .file(file)
                .model("whisper-1")
                .responseFormat("json")
                .build();

        when(mockResult.getOutput()).thenReturn("Hello, this is a test transcription.");
        when(mockResponse.getResult()).thenReturn(mockResult);
        when(audioTranscriptionModel.call(any(AudioTranscriptionPrompt.class))).thenReturn(mockResponse);

        // Act
        TranscriptionResponse response = speechToTextService.transcribeAudio(request);

        // Assert
        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertEquals("Hello, this is a test transcription.", response.getTranscription());
        assertNotNull(response.getProcessedAt());
        assertNotNull(response.getMetadata());
        
        verify(audioTranscriptionModel).call(any(AudioTranscriptionPrompt.class));
    }

    @Test
    void testTranscribeAudio_EmptyFile() {
        // Arrange
        MultipartFile emptyFile = new MockMultipartFile(
                "audio", 
                "empty.mp3", 
                "audio/mpeg", 
                new byte[0]
        );
        
        TranscriptionRequest request = TranscriptionRequest.builder()
                .file(emptyFile)
                .build();

        // Act & Assert
        TranscriptionResponse response = speechToTextService.transcribeAudio(request);
        
        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertNotNull(response.getErrorMessage());
        assertTrue(response.getErrorMessage().contains("empty"));
    }

    @Test
    void testTranscribeAudio_UnsupportedFormat() {
        // Arrange
        MultipartFile file = new MockMultipartFile(
                "audio", 
                "test.xyz", 
                "application/octet-stream", 
                "test content".getBytes()
        );
        
        TranscriptionRequest request = TranscriptionRequest.builder()
                .file(file)
                .build();

        // Act & Assert
        TranscriptionResponse response = speechToTextService.transcribeAudio(request);
        
        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertNotNull(response.getErrorMessage());
        assertTrue(response.getErrorMessage().contains("Unsupported file format"));
    }

    @Test
    void testTranscribeAudio_FileTooLarge() {
        // Arrange
        byte[] largeContent = new byte[30 * 1024 * 1024]; // 30MB
        MultipartFile largeFile = new MockMultipartFile(
                "audio", 
                "large.mp3", 
                "audio/mpeg", 
                largeContent
        );
        
        TranscriptionRequest request = TranscriptionRequest.builder()
                .file(largeFile)
                .build();

        // Act & Assert
        TranscriptionResponse response = speechToTextService.transcribeAudio(request);
        
        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertNotNull(response.getErrorMessage());
        assertTrue(response.getErrorMessage().contains("exceeds maximum allowed size"));
    }

    @Test
    void testTranscribeResourceFile_Success() {
        // Arrange
        when(mockResult.getOutput()).thenReturn("Resource file transcription result.");
        when(mockResponse.getResult()).thenReturn(mockResult);
        when(audioTranscriptionModel.call(any(AudioTranscriptionPrompt.class))).thenReturn(mockResponse);

        // Act
        TranscriptionResponse response = speechToTextService.transcribeResourceFile(null);

        // Assert
        assertNotNull(response);
        assertEquals("Resource file transcription result.", response.getTranscription());
        assertEquals("whisper-1", response.getModel());
        assertEquals("json", response.getResponseFormat());
        
        verify(audioTranscriptionModel).call(any(AudioTranscriptionPrompt.class));
    }

    @Test
    void testTranscribeAudioAsync_Success() {
        // Arrange
        MultipartFile file = new MockMultipartFile(
                "audio", 
                "async.mp3", 
                "audio/mpeg", 
                "async test content".getBytes()
        );
        
        TranscriptionRequest request = TranscriptionRequest.builder()
                .file(file)
                .build();

        when(mockResult.getOutput()).thenReturn("Async transcription result.");
        when(mockResponse.getResult()).thenReturn(mockResult);
        when(audioTranscriptionModel.call(any(AudioTranscriptionPrompt.class))).thenReturn(mockResponse);

        // Act & Assert
        assertDoesNotThrow(() -> {
            var future = speechToTextService.transcribeAudioAsync(request);
            assertNotNull(future);
        });
    }
}