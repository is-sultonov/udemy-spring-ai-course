package org.spring.ai.vectordatabse.cassandradb.listener;

import java.nio.file.Files;
import java.nio.file.Path;
import java.security.MessageDigest;
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
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationContext;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileLoaderEventListener {

    @Value("${vector.data.files:classpath:static/input.txt}")
    private String[] dataFilePaths;

    private final VectorStore vectorStore;
    private final ApplicationContext applicationContext;
    private final Executor executor = Executors.newVirtualThreadPerTaskExecutor();

    @EventListener
    public void initialize(ApplicationReadyEvent event) {
        CompletableFuture.runAsync(this::loadVectorStoreDataFiles, executor).join();
    }

    private void loadVectorStoreDataFiles() {
        log.info("Starting vector store data loading process");
        int totalFilesProcessed = 0;
        int totalDocumentsLoaded = 0;
        
        for (String filePath : dataFilePaths) {
            try {
                Resource resource = applicationContext.getResource(filePath.trim());
                if (!resource.exists()) {
                    log.warn("File not found: {}", filePath);
                    continue;
                }
                
                Path actualPath = resource.getFile().toPath();
                String fileName = actualPath.getFileName().toString();
                String fileHash = calculateFileHash(actualPath);
                
                log.info("Processing file: {} with hash: {}", fileName, fileHash);
                
                // Check if this specific file content has already been loaded
                if (isFileAlreadyLoaded(fileHash)) {
                    log.info("File '{}' with hash '{}' already loaded, skipping", fileName, fileHash);
                    continue;
                }
                
                log.info("Loading new file content: {}", fileName);
                
                try (Stream<String> lines = Files.lines(actualPath)) {
                    List<Document> list = lines
                        .filter(line -> !line.trim().isEmpty()) // Skip empty lines
                        .map(line -> new Document(line, Map.of(
                            "source_file", fileName,
                            "file_hash", fileHash,
                            "loaded_at", String.valueOf(System.currentTimeMillis()),
                            "file_type", detectFileType(fileName),
                            "file_path", filePath
                        )))
                        .toList();

                    if (list.isEmpty()) {
                        log.warn("No content found in file: {}", fileName);
                        continue;
                    }

                    TokenTextSplitter splitter = new TokenTextSplitter();

                    list.forEach(document -> {
                        List<Document> split = splitter.split(document);
                        vectorStore.add(split);
                    });

                    log.info("Successfully loaded {} documents from file '{}'", list.size(), fileName);
                    totalDocumentsLoaded += list.size();
                    totalFilesProcessed++;
                }
                
            } catch (Exception ex) {
                log.error("Error loading file '{}': {}", filePath, ex.getMessage(), ex);
            }
        }
        
        log.info("Vector store loading completed: {} files processed, {} documents loaded", 
                totalFilesProcessed, totalDocumentsLoaded);
    }
    
    private String detectFileType(String fileName) {
        String lowerCase = fileName.toLowerCase();
        if (lowerCase.contains("book")) return "books";
        if (lowerCase.contains("article")) return "articles";
        if (lowerCase.contains("doc")) return "documents";
        return "general";
    }
    
    private String calculateFileHash(Path filePath) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] fileBytes = Files.readAllBytes(filePath);
        byte[] hashBytes = digest.digest(fileBytes);
        
        StringBuilder hexString = new StringBuilder();
        for (byte b : hashBytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
    
    private boolean isFileAlreadyLoaded(String fileHash) {
        try {
            // Search for any document with this file hash
            List<Document> existingDocs = vectorStore.similaritySearch(
                SearchRequest.builder()
                    .query("dummy") // Content doesn't matter, we're filtering by metadata
                    .topK(1)
                    .filterExpression("file_hash == '" + fileHash + "'")
                    .build()
            );
            
            return !existingDocs.isEmpty();
            
        } catch (Exception e) {
            log.warn("Could not check for existing file hash, proceeding with loading: {}", e.getMessage());
            return false; // If we can't check, proceed with loading
        }
    }

}
