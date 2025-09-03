package org.spring.ai.vectordatabse.controller;

import lombok.RequiredArgsConstructor;
import org.spring.ai.vectordatabse.service.ChatService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/croma")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping()
    public String getDocuments(
            @RequestParam("message") String message
    ) {
        return chatService.chatMessage(message);
    }

}
