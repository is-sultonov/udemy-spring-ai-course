package org.spring.ai.vectordatabse.cassandradb.service;

import java.util.List;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CassandraVectorStoreChatService {

    private final VectorStore vectorStore;

    public List<Document> findUserPromptAnswer(String userPrompt) {
        log.debug("findUserPromptAnswer for userPrompt {}", userPrompt);
        List<Document> documents = vectorStore.similaritySearch(
            SearchRequest.builder()
                .query(userPrompt)
                .topK(1)
                .similarityThreshold(0.9)
                .build()
        );
        log.info("findUserPromptAnswer for userPrompt {}", documents.size());
        return documents;
    }
}