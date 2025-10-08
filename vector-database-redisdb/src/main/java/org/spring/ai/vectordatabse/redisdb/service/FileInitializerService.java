package org.spring.ai.vectordatabse.redisdb.service;

import java.nio.file.Files;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import java.util.stream.Stream;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileInitializerService {

    @Value("classpath:static/input.txt")
    private Resource resource;

    private final VectorStore vectorStore;
    private final Executor executor = Executors.newVirtualThreadPerTaskExecutor();

    @EventListener
    public void initialize(ApplicationReadyEvent event) {
        CompletableFuture.runAsync(this::loadVectorStoreDataFiles, executor).join();
    }

    private void loadVectorStoreDataFiles() {
        log.info("Loading vector store data files");
        try (Stream<String> lines = Files.lines(resource.getFile().toPath())) {

            List<Document> list = lines
                .map(line -> new Document(line, Map.of("meta1", "meta2")))
                .toList();

            TokenTextSplitter splitter = new TokenTextSplitter();

            list.forEach(document -> {
                List<Document> split = splitter.split(document);
                vectorStore.add(split);
            });

            log.info("Loaded {} vector store data files", list.size());
        } catch (Exception ex) {
            log.error("Error loading vector store data files: {}", ex.getMessage(), ex);
        }
    }

}
