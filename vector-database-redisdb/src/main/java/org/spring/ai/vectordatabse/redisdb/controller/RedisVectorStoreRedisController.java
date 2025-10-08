package org.spring.ai.vectordatabse.redisdb.controller;

import lombok.RequiredArgsConstructor;
import org.spring.ai.vectordatabse.redisdb.service.RedisVectorStoreChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/chat/redis")
public class RedisVectorStoreRedisController {

    private final RedisVectorStoreChatService redisVectorStoreChatService;

    @GetMapping
    public ResponseEntity<?> findUserPromptAnswer(
        @RequestParam(value = "userPrompt", defaultValue = "find data which info is related to Jigger") String userPrompt
    ) {
        return ResponseEntity.ok(redisVectorStoreChatService.findUserPromptAnswer(userPrompt));
    }

}
