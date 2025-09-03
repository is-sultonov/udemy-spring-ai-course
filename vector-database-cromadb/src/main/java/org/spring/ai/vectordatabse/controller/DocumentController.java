package org.spring.ai.vectordatabse.controller;

import org.springframework.ai.document.Document;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

@RestController
@RequestMapping("/api/v1/document")
public class DocumentController {

    @Value("classpath:input.txt")
    private Resource input;

    private final VectorStore vectorStore;

    public DocumentController(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    @GetMapping("/load")
    public String loadDocument() throws IOException, InterruptedException {

        List<Document> list = Files.lines(input.getFile().toPath())
                .map(Document::new)
                .toList();

        TokenTextSplitter splitter = new TokenTextSplitter();
        for (Document document : list) {
            List<Document> split = splitter.split(document);
            vectorStore.add(split);
        }

        return "success";
    }

}
