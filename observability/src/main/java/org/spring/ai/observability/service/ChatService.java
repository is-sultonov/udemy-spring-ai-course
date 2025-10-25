package org.spring.ai.observability.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final ChatClient chatClient;

    public ChatService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder
            .defaultSystem("""
                If you do not know the answer to a question or do not have enough information, respond politely and helpfully. Do not guess or make up facts. Instead, say something like:
                “I’m sorry, but I don’t have enough information to answer that accurately. Would you like me to help you find more details?”
                or
                “That’s a great question — unfortunately, I don’t have a definite answer right now. I can suggest where to look or how to find it, if you’d like.
                """)
            .build();
    }

    public String chatMessage(String message) {
        return chatClient
            .prompt()
            .user(message)
            .call().content();
    }

}
