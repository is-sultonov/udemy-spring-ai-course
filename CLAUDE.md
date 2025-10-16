# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains Spring AI practice projects for the Udemy course "Mastering Spring AI - Build AI with Java". It demonstrates comprehensive Spring AI capabilities including vector database integrations, image generation, and text-to-speech functionality through multiple independent Spring Boot applications.

## Architecture

The repository follows a multi-module structure with 6 independent Spring Boot applications:

**Vector Database Implementations:**
- **vector-database-cromadb/**: ChromaDB vector store implementation
- **vector-database-redisdb/**: Redis vector store implementation  
- **vector-database-cassandradb/**: CassandraDB vector store implementation
- **vectore-database-neo4jdb/**: Neo4j vector store implementation (in development)

**AI Model Implementations:**
- **image-generation-openai/**: OpenAI DALL-E image generation
- **text-to-speech-openai/**: OpenAI text-to-speech synthesis

Each module is a standalone Spring Boot application with:
- **Controller layer**: REST endpoints for chat and document operations
- **Service layer**: Business logic for vector operations and AI chat
- **Configuration**: Vector store and AI model configuration
- **Event Listeners**: File loading on application startup

## Technology Stack

- **Java 21** with Gradle build system
- **Spring Boot 3.5.5-3.5.6**
- **Spring AI 1.0.1-1.0.3** for AI integrations
- **OpenAI API** for embeddings and chat completions
- **Vector Stores**: ChromaDB, Redis, CassandraDB
- **Lombok** for boilerplate reduction
- **Docker** for running external services

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

# Clean build
./gradlew clean build
```

### Docker Services
```bash
# Start ChromaDB (for cromadb module)
cd vector-database-cromadb
docker-compose up -d

# Start CassandraDB (for cassandradb module)
cd ../
docker-compose up -d cassandra

# Stop services
docker-compose down
```

### HTTP Testing
Use the included .http files for testing endpoints:
- `vector-database-cromadb/chroma-db-vector-store.http`
- `vector-database-redisdb/redis-vectore-store-chat-client.http`

## Environment Configuration

### Required Environment Variables
- `OPEN_AI_KEY`: OpenAI API key for embeddings and chat

### Application Ports
- **vector-database-cromadb**: 8090
- **vector-database-redisdb**: 9090
- **vector-database-cassandradb**: 8080
- **image-generation-openai**: 8080
- **text-to-speech-openai**: 8080

### External Services
- **ChromaDB**: localhost:8000
- **Redis**: localhost:6380 (username: default, password: mypassword)
- **CassandraDB**: localhost:9042 (datacenter1)

## API Endpoints

### ChromaDB Module (Port 8090)
- `GET /api/v1/croma?message={query}`: Chat with vector store
- `GET /api/v1/document/load`: Load documents into vector store

### Redis Module (Port 9090)
- `GET /api/v1/chat/redis?userPrompt={query}`: Chat with Redis vector store

### CassandraDB Module (Port 8080)
- `GET /api/v1/chat/cassandra?userMessage={query}`: Chat with CassandraDB vector store
- `GET /api/v1/document/load`: Load documents with advanced duplicate prevention

### Image Generation Module (Port 8080)
- `POST /api/v1/image/generate`: Generate images with OpenAI DALL-E

### Text-to-Speech Module (Port 8080) 
- `GET /api/v1/tts?userMessage={text}`: Convert text to speech with OpenAI TTS (returns byte array)
- `GET /api/v1/tts/stream?userMessage={text}`: Stream audio response for real-time playback

## Vector Store Configuration

All modules use:
- **Embedding model**: text-embedding-ada-002
- **Chat temperature**: 0.8
- **Schema initialization**: Enabled in all vector stores
- **Input data**: Located in `src/main/resources/static/input.txt`

### Vector Store Specific Settings
- **ChromaDB**: Custom host/port configuration
- **Redis**: Custom index names, prefixes, and connection settings
- **CassandraDB**: Custom keyspace, table names, and column configurations

## Development Patterns

- Each vector store implementation follows Spring AI's `VectorStore` interface
- Controllers use `@RequestParam` for query parameters
- Services implement similarity search with configurable thresholds
- Configuration externalized in `application.yaml` files
- **Data Loading**: Event listeners (`@EventListener(ApplicationReadyEvent)`) load documents on startup
- **Async Processing**: Uses `CompletableFuture.runAsync()` with Virtual Thread executors for non-blocking operations
- **File Structure**: Controllers in `/controller`, services in `/service`, listeners in `/listener`

## Advanced Features

### Duplicate Prevention (CassandraDB Module)
The CassandraDB implementation includes sophisticated duplicate document prevention:
- **SHA-256 File Hashing**: Generates unique hash for each document file
- **Metadata Enrichment**: Adds source_file, file_hash, loaded_at, file_type metadata
- **Similarity Threshold Filtering**: Excludes documents with >0.95 similarity threshold
- **Configurable File Paths**: Uses `@Value("${vector.data.files}")` for flexible file loading

### Virtual Thread Integration
All modules leverage Java 21 Virtual Threads for scalable async processing:
```java
CompletableFuture.runAsync(() -> {
    // Document processing logic
}, Executors.newVirtualThreadPerTaskExecutor());
```

### Text Processing Pipeline
- **TokenTextSplitter**: Configurable token-based text chunking
- **Document Enhancement**: Automatic metadata addition during loading
- **Similarity Search**: Configurable thresholds (0.8 default, 0.95 for duplicates)

### Streaming Audio Support (Text-to-Speech Module)
The TTS module provides both synchronous and streaming audio generation:
- **Synchronous**: Returns complete byte array for audio file download
- **Streaming**: Uses `StreamingResponseBody` with Reactor `Flux<byte[]>` for real-time audio streaming
- **Error Handling**: Converts `IOException` to `UncheckedIOException` during streaming

## Testing

Test files located in `src/test/java/` following Spring Boot conventions. Use `./gradlew test` to run test suites for individual modules.