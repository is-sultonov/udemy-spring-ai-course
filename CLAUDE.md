# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains Spring AI practice projects for the Udemy course "Mastering Spring AI - Build AI with Java". It demonstrates comprehensive Spring AI capabilities including vector database integrations, image generation, text-to-speech, and speech-to-text functionality through 7 independent Spring Boot applications.

**Course Link**: https://www.udemy.com/course/mastering-spring-ai-build-ai-with-java/

## Architecture

The repository follows a multi-module structure with 7 independent Spring Boot applications:

**Vector Database Implementations:**
- **vector-database-cromadb/**: ChromaDB vector store implementation
- **vector-database-redisdb/**: Redis vector store implementation  
- **vector-database-cassandradb/**: CassandraDB vector store implementation
- **vectore-database-neo4jdb/**: Neo4j vector store implementation (in development)

**AI Model Implementations:**
- **image-generation-openai/**: OpenAI DALL-E image generation
- **text-to-speech-openai/**: OpenAI text-to-speech synthesis
- **speech-to-text-openai/**: OpenAI Whisper speech-to-text transcription

Each module is a standalone Spring Boot application with:
- **Controller layer**: REST endpoints for chat and document operations
- **Service layer**: Business logic for vector operations and AI chat
- **Configuration**: Vector store and AI model configuration
- **Event Listeners**: File loading on application startup

## Technology Stack

- **Java 21** with Gradle build system
- **Spring Boot 3.5.5-3.5.6**
- **Spring AI 1.0.1-1.0.3** for AI integrations
- **OpenAI API** for embeddings, chat completions, image generation, TTS, and speech transcription
- **Vector Stores**: ChromaDB, Redis, CassandraDB
- **Lombok** for boilerplate reduction
- **Docker** for running external services
- **Micrometer/Prometheus** for metrics and monitoring
- **Spring Boot Actuator** for health checks and observability

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

# Start CassandraDB (from root directory)
docker-compose up -d cassandra

# Stop services
docker-compose down
```

### HTTP Testing
Use the included .http files for testing endpoints:
- `vector-database-cromadb/chroma-db-vector-store.http`
- `vector-database-redisdb/redis-vectore-store-chat-client.http`
- `vector-database-cassandradb/cassandra-vector-store.http`
- `vector-database-cassandradb/test-duplicate-prevention.http`
- `text-to-speech-openai/tts.request.http`
- `speech-to-text-openai/speech-to-text-api.http`
- `speech-to-text-openai/speech-to-text-api-test.http`

### Frontend Development (Speech-to-Text Module)
The speech-to-text module includes a full React frontend:
```bash
cd speech-to-text-openai/src/main/resources/static
npm install
npm run dev    # Development server at http://localhost:3000
npm run build  # Production build
npm test       # Run test suite
```

## Environment Configuration

### Required Environment Variables
- `OPEN_AI_KEY`: OpenAI API key for embeddings, chat, image generation, TTS, and speech transcription
- `SPRING_PROFILE`: Active Spring profile (default, dev, test, prod)

**SECURITY WARNING**: Never commit API keys to the repository. The speech-to-text module currently has an API key in `application.yaml` that should be removed and configured as an environment variable.

### Application Ports
- **vector-database-cromadb**: 8090
- **vector-database-redisdb**: 9090
- **vector-database-cassandradb**: 8080
- **image-generation-openai**: 8080
- **text-to-speech-openai**: 8080
- **speech-to-text-openai**: 8080

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

### Speech-to-Text Module (Port 8080)
- `GET /api/v1/speech/resource`: Legacy endpoint - transcribes default resource file
- `GET /api/v1/speech/transcribe/resource?filename={file}`: Transcribe specific resource file
- `POST /api/v1/speech/transcribe`: Upload and transcribe audio file (sync)
- `POST /api/v1/speech/transcribe/async`: Upload and transcribe audio file (async)
- `GET /api/v1/speech/health`: Service health check endpoint

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

### Enhanced Module Configuration
- **Speech-to-Text**: File upload limits (25MB), allowed formats (mp3,wav,m4a,flac,etc.), processing timeouts
- **Audio Processing**: Configurable response formats, language support, temperature settings
- **Monitoring**: Profile-based logging levels, health check detail exposure, metrics collection

## Development Patterns

- Each vector store implementation follows Spring AI's `VectorStore` interface
- Controllers use `@RequestParam` for query parameters and `@RequestBody` for complex requests
- Services implement similarity search with configurable thresholds
- Configuration externalized in `application.yaml` files with profile-specific overrides
- **Data Loading**: Event listeners (`@EventListener(ApplicationReadyEvent)`) load documents on startup
- **Async Processing**: Uses `CompletableFuture.runAsync()` with Virtual Thread executors for non-blocking operations
- **File Structure**: Controllers in `/controller`, services in `/service`, listeners in `/listener`, DTOs in `/dto`, config in `/config`
- **Error Handling**: Global exception handlers with RFC 9457 Problem Details standard
- **Validation**: Jakarta Bean Validation with custom validators for file uploads
- **Resource Loading**: Proper Spring `ResourceLoader` and `@Value` patterns for classpath resources
- **Security**: Environment variable injection for API keys, CORS configuration, file upload restrictions
- **Observability**: Custom metrics with Micrometer, structured logging, health checks

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

### Audio Processing Features

#### Text-to-Speech Module
The TTS module provides both synchronous and streaming audio generation:
- **Synchronous**: Returns complete byte array for audio file download
- **Streaming**: Uses `StreamingResponseBody` with Reactor `Flux<byte[]>` for real-time audio streaming
- **Error Handling**: Converts `IOException` to `UncheckedIOException` during streaming

#### Speech-to-Text Module
The STT module provides comprehensive audio transcription capabilities:
- **File Upload Support**: MultipartFile upload with validation (25MB max)
- **Async Processing**: CompletableFuture with Virtual Thread executors for large files
- **Multiple Response Formats**: JSON, text, SRT, VTT, verbose_json
- **Language Support**: Configurable language specification for transcription
- **Resource Loading**: Proper Spring resource loading with classpath support
- **Comprehensive Validation**: File type, size, and content validation
- **Metrics Integration**: Custom metrics for transcription requests, success/failure rates, and processing duration
- **Health Checks**: Custom health endpoint with detailed service status

## Observability & Monitoring

### Health Checks
- **Custom Health Endpoints**: Service-specific health checks (e.g., `/api/v1/speech/health`)
- **Actuator Health**: Standard Spring Boot health endpoints at `/actuator/health`
- **Environment-specific Details**: Health check detail exposure based on active profile

### Metrics
All modules with enhanced monitoring include:
- **Custom Metrics**: Request counters, success/failure rates, processing duration histograms
- **Prometheus Integration**: Metrics exposure at `/actuator/prometheus`
- **Micrometer Support**: Standard and custom meters for application monitoring

### Logging
- **Structured Logging**: Consistent log format with correlation IDs
- **Profile-based Levels**: Debug for development, INFO/WARN for production
- **Performance Logging**: Request/response timing and processing duration

## Testing

Test files located in `src/test/java/` following Spring Boot conventions. Use `./gradlew test` to run test suites for individual modules.

### Test Categories
- **Unit Tests**: Service layer logic with Mockito
- **Integration Tests**: API endpoint testing with TestContainers
- **HTTP Client Tests**: Ready-to-use `.http` files for manual/automated API testing
- **Frontend Tests**: React component testing (speech-to-text module)

## Learning Resources

This is a practice repository for the Udemy course "Mastering Spring AI - Build AI with Java". Each module demonstrates specific Spring AI concepts:

- **Vector Databases**: ChromaDB, Redis, CassandraDB integrations
- **AI Models**: OpenAI GPT, DALL-E, Whisper integration patterns
- **RAG Implementation**: Document loading, embedding, similarity search
- **Production Features**: Health checks, metrics, error handling, validation