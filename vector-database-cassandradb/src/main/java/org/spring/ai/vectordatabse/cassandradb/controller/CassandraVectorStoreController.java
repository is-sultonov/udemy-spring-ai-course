package org.spring.ai.vectordatabse.cassandradb.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.spring.ai.vectordatabse.cassandradb.service.CassandraVectorStoreChatService;
import org.springframework.ai.document.Document;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/chat/cassandra")
public class CassandraVectorStoreController {

    private final CassandraVectorStoreChatService cassandraVectorStoreChatService;

    @GetMapping
    public List<Document> findUserPromptAnswer(
        @RequestParam(value = "userPrompt", defaultValue = "find data which info is related to Jigger") String userPrompt
    ) {
        return cassandraVectorStoreChatService.findUserPromptAnswer(userPrompt);
    }

}