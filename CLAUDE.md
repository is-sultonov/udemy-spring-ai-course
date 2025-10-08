# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains Spring AI practice projects for the Udemy course "Mastering Spring AI - Build AI with Java". It demonstrates vector database integrations using Spring AI framework with different vector store implementations.

## Architecture

The repository follows a multi-module structure with separate Spring Boot applications:

- **vector-database-cromadb/**: ChromaDB vector store implementation
- **vector-database-redisdb/**: Redis vector store implementation

Each module is a standalone Spring Boot application with:
- **Controller layer**: REST endpoints for chat and document operations
- **Service layer**: Business logic for vector operations and AI chat
- **Configuration**: Vector store and AI model configuration

## Technology Stack

- **Java 21** with Gradle build system
- **Spring Boot 3.5.5**
- **Spring AI 1.0.1-1.0.3** for AI integrations
- **OpenAI API** for embeddings and chat completions
- **Vector Stores**: ChromaDB, Redis
- **Lombok** for boilerplate reduction

## Common Development Commands

### Build and Run
```bash
# Build a specific module
cd vector-database-cromadb
./gradlew build

# Run application
./gradlew bootRun

# Run tests
./gradlew test
```

### Docker Services
```bash
# Start ChromaDB (for cromadb module)
cd vector-database-cromadb
docker-compose up -d

# Stop services
docker-compose down
```

## Environment Configuration

### Required Environment Variables
- `OPEN_AI_KEY`: OpenAI API key for embeddings and chat

### Application Ports
- **vector-database-cromadb**: 8090
- **vector-database-redisdb**: 9090

### External Services
- **ChromaDB**: localhost:8000
- **Redis**: localhost:6380 (username: default, password: mypassword)

## API Endpoints

### ChromaDB Module
- `GET /api/v1/croma?message={query}`: Chat with vector store
- `GET /api/v1/document/load`: Load documents into vector store

### Redis Module
- `GET /api/v1/chat/redis?userPrompt={query}`: Chat with Redis vector store

## Vector Store Configuration

Both modules use:
- **Embedding model**: text-embedding-ada-002
- **Similarity threshold**: 0.8
- **Top-K results**: 1
- **Temperature**: 0.8 for chat responses

## Development Patterns

- Each vector store implementation follows the same service pattern using Spring AI's `VectorStore` interface
- Controllers use `@RequestParam` for query parameters
- Services implement similarity search with configurable thresholds
- Configuration is externalized in `application.yaml` files
- **Data Loading**: `FileInitializerService` with `@EventListener(ApplicationReadyEvent)` loads documents from `src/main/resources/static/input.txt` on startup
- **Async Processing**: Uses `CompletableFuture.runAsync()` with virtual threads for non-blocking data loading

## Testing

Test files are located in `src/test/java/` following Spring Boot test conventions. Use `./gradlew test` to run the test suite.