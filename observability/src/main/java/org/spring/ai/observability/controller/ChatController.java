package org.spring.ai.observability.controller;

import org.spring.ai.observability.service.ChatService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping
    public String chatMessage(@RequestParam(value = "message", defaultValue = "Please tell me a quick information about Samarkand") String message) {
        return chatService.chatMessage(message);
    }
}
