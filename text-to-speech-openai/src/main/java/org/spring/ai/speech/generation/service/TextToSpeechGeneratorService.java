package org.spring.ai.speech.generation.service;

import java.util.Optional;
import javax.swing.text.html.Option;

import org.springframework.ai.openai.OpenAiAudioSpeechModel;
import org.springframework.ai.openai.OpenAiAudioSpeechOptions;
import org.springframework.ai.openai.api.OpenAiAudioApi;
import org.springframework.ai.openai.audio.speech.Speech;
import org.springframework.ai.openai.audio.speech.SpeechModel;
import org.springframework.ai.openai.audio.speech.SpeechPrompt;
import org.springframework.ai.openai.audio.speech.SpeechResponse;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class TextToSpeechGeneratorService {

    private final OpenAiAudioSpeechModel speechModel;

    public TextToSpeechGeneratorService(OpenAiAudioSpeechModel speechModel) {
        this.speechModel = speechModel;
    }

    public byte[] generateTextToSpeech(String text) {
        return speechModel.call(new SpeechPrompt(text,
                OpenAiAudioSpeechOptions
                    .builder()
                    .responseFormat(OpenAiAudioApi.SpeechRequest.AudioResponseFormat.MP3)
                    .voice(OpenAiAudioApi.SpeechRequest.Voice.CORAL)
                    .speed(1.0f)
                    .build()))
            .getResult()
            .getOutput();
    }

    public Flux<byte[]> generateTextToSpeechStream(String userPrompt) {
        Flux<SpeechResponse> speechResponseFlux = speechModel.stream(new SpeechPrompt(userPrompt));
        return speechResponseFlux
            .map(SpeechResponse::getResult)
            .map(Speech::getOutput);
    }
}
