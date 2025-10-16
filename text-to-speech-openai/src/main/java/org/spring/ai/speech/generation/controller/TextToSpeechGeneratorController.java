package org.spring.ai.speech.generation.controller;

import java.io.IOException;
import java.io.UncheckedIOException;

import lombok.RequiredArgsConstructor;
import org.spring.ai.speech.generation.service.TextToSpeechGeneratorService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/v1/tts")
@RequiredArgsConstructor
public class TextToSpeechGeneratorController {

    private final TextToSpeechGeneratorService textToSpeechGeneratorService;

    @GetMapping
    public byte[] generateTextToSpeech(
        @RequestParam(value = "userMessage", defaultValue = "Hello Open AI Text to Speech generator model how are your?")
        String userPrompt) {
        return textToSpeechGeneratorService.generateTextToSpeech(userPrompt);
    }

    @GetMapping(value = "/stream", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public StreamingResponseBody generateTextToSpeechStream(@RequestParam(value = "userMessage", defaultValue = "Hello Open AI Text to Speech generator model how are your?")
                                                 String userPrompt) {
        Flux<byte[]> audioStream = textToSpeechGeneratorService.generateTextToSpeechStream(userPrompt);

        return outputStream -> audioStream.toStream().forEach(bytes -> {
            try {
                outputStream.write(bytes);
                outputStream.flush();
            } catch (IOException e) {
                throw new UncheckedIOException(e);
            }
        });

    }

}
