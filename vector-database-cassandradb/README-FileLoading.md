# Enhanced File Loading System for Vector Store

## Overview

This enhanced file loading system provides robust, content-hash-based duplicate detection and support for multiple data files. It prevents duplicate data loading and can handle any number of source files.

## Key Features

### ✅ **Content Hash-Based Duplicate Detection**
- Calculates SHA-256 hash of file content
- Prevents loading same content multiple times
- Detects file changes automatically
- Works with any file content, not dependent on specific text

### ✅ **Multiple File Support**
- Configure multiple data sources via `application.yaml`
- Supports classpath and file system paths
- Each file tracked independently
- Automatic file type detection

### ✅ **Rich Metadata Tracking**
- `source_file`: Original filename
- `file_hash`: SHA-256 content hash
- `loaded_at`: Loading timestamp
- `file_type`: Auto-detected file type
- `file_path`: Original file path

## Configuration

### application.yaml
```yaml
vector:
  data:
    files: 
      - "classpath:static/input.txt"
      - "classpath:static/articles.txt"
      - "file:/absolute/path/to/external-data.txt"
      - "classpath:data/books/fantasy.txt"
```

### Configuration Examples

#### Single File (Default)
```yaml
vector:
  data:
    files: 
      - "classpath:static/input.txt"
```

#### Multiple Files
```yaml
vector:
  data:
    files: 
      - "classpath:static/books.txt"
      - "classpath:static/articles.txt"
      - "classpath:static/documents.txt"
```

#### Mixed Sources
```yaml
vector:
  data:
    files: 
      - "classpath:static/internal-data.txt"
      - "file:/external/data/books.txt"
      - "file:///absolute/path/articles.txt"
```

## How It Works

### 1. File Processing Flow
```
Application Startup
    ↓
For Each Configured File:
    ↓
Calculate SHA-256 Hash
    ↓
Check if Hash Exists in Vector Store
    ↓
If Not Exists: Load and Process
    ↓
If Exists: Skip Loading
    ↓
Continue to Next File
```

### 2. Duplicate Detection Logic
```java
// Check for existing documents with same file hash
List<Document> existingDocs = vectorStore.similaritySearch(
    SearchRequest.builder()
        .query("dummy")
        .topK(1)
        .filterExpression("file_hash == '" + fileHash + "'")
        .build()
);
```

### 3. Document Metadata Structure
```java
Map.of(
    "source_file", "input.txt",
    "file_hash", "a1b2c3d4e5f6...",
    "loaded_at", "1697123456789",
    "file_type", "books",
    "file_path", "classpath:static/input.txt"
)
```

## Use Cases

### ✅ **Scenario 1: Application Restart**
- **Problem**: Same data loaded multiple times
- **Solution**: Hash-based detection skips already loaded content
- **Result**: No duplicates

### ✅ **Scenario 2: File Content Changed**
- **Problem**: Updated file should replace old data
- **Solution**: New hash detected, loads updated content
- **Result**: Fresh data without manual intervention

### ✅ **Scenario 3: Multiple Data Sources**
- **Problem**: Different files with different types of data
- **Solution**: Configure multiple file paths
- **Result**: All sources loaded with proper metadata

### ✅ **Scenario 4: Development vs Production**
- **Problem**: Different data sources in different environments
- **Solution**: Environment-specific configuration
- **Result**: Flexible deployment

## Log Messages

### Successful Loading
```
INFO  - Starting vector store data loading process
INFO  - Processing file: input.txt with hash: a1b2c3d4e5f6...
INFO  - Loading new file content: input.txt
INFO  - Successfully loaded 99 documents from file 'input.txt'
INFO  - Vector store loading completed: 1 files processed, 99 documents loaded
```

### Duplicate Detection
```
INFO  - Processing file: input.txt with hash: a1b2c3d4e5f6...
INFO  - File 'input.txt' with hash 'a1b2c3d4e5f6...' already loaded, skipping
```

## Benefits vs Previous Approach

| Aspect | Old Approach | New Approach |
|--------|-------------|-------------|
| **Duplicate Detection** | Hardcoded "The Great Gatsby" search | Content hash-based |
| **File Support** | Single file only | Multiple files |
| **Content Agnostic** | ❌ Dependent on specific text | ✅ Works with any content |
| **Change Detection** | ❌ Manual intervention needed | ✅ Automatic hash comparison |
| **Scalability** | ❌ Limited to one data source | ✅ Unlimited data sources |
| **Metadata** | ❌ Basic metadata | ✅ Rich metadata tracking |
| **Configuration** | ❌ Hardcoded paths | ✅ Configurable via YAML |

## Maintenance

### Clear All Data
```bash
docker exec cassandra-vector cqlsh -e "TRUNCATE springframework.cassandra_vector_store;"
```

### Check Data Count
```bash
docker exec cassandra-vector cqlsh -e "SELECT COUNT(*) FROM springframework.cassandra_vector_store;"
```

### View File Metadata
Use the `/api/v1/data/status` endpoint or query Cassandra directly to see loaded file information.

## Future Enhancements

- Support for file patterns (*.txt)
- Incremental loading for large files
- File modification time tracking
- Scheduled re-loading
- File deletion detection and cleanup