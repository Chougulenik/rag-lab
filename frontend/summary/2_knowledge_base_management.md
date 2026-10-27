# Feature 2: Knowledge Base Management & Chunk Ingestion

---

## 📌 1. Purpose & Business Objective
A RAG system is only as good as the documents it ingests and the way those documents are segmented. 
In real-world applications:
1. **Documents change frequently**: New contracts, product specs, and technical whitepapers are continuously added.
2. **Chunking is not one-size-fits-all**: Splitting a document purely by character count often chops sentences in half or breaks table rows, ruining embedding quality.
3. **Black-box storage breeds bugs**: Engineers and admins need full visibility into how many chunks were generated, their boundaries, and how much text was ingested.

This feature provides a self-service management portal where documents can be inspected, ingested with customized chunking logic, and monitored in real time.

---

## 🛠️ 2. What We Implemented ("What We Did")

### A. Real-Time Knowledge Base Catalog (`DocumentTable.jsx`)
- Built a responsive table displaying all documents stored in the ChromaDB vector database.
- Columns display:
  - Source file name and full system path.
  - Total chunks generated.
  - Character count.
  - Interactive **"Inspect Chunks"** action button.
- Built a client-side search input that filters documents in real time without triggering redundant server requests.

### B. Drag-and-Drop Ingestion Modal with Strategy Selection (`DocumentUploadModal.jsx`)
- Implemented an intuitive drag-and-drop file target accepting `.txt`, `.md`, and `.pdf` files.
- Provided a Chunking Strategy selector exposing three distinct algorithms:
  1. **Recursive Character Splitter**: Configurable `chunk_size` (200–4000) and `chunk_overlap` (0–500).
  2. **Semantic Similarity Splitter**: Embeds sentences and detects thematic shifts using percentile cosine distance drops.
  3. **Agentic Chunking**: Prompts an LLM to identify natural document sections and context boundaries.
- Packaged parameters into `FormData` and dispatched via `documentApi.uploadDocument()`.

### C. Chunk Inspector Drawer Modal (`ChunkViewerModal.jsx`)
- Built an inspection modal rendering individual text chunks generated for any document.
- Displays sequential chunk headers (`CHUNK #1`, `CHUNK #2`), character lengths, and full monospace text.

### D. Single-Click Directory Re-indexing
- Added a **"Re-index Docs Directory"** action that triggers a server-side scan of the local `docs/` folder.
- Synchronizes the vector store whenever source files are added or updated on disk.

---

## 💡 3. Why We Are Using This Approach ("Why We Chose This")

| What We Used | Why We Used It (Technical & Business Rationale) | What Would Happen If We Didn't |
|---|---|---|
| **Multiple Chunking Algorithms** | Different documents require different splitting logic: code and legal contracts need semantic boundaries, while manuals work well with overlapping recursive character splits. Giving users a choice prevents broken context. | Using a single naive splitter produces truncated sentences and poor vector recall across complex documents. |
| **Configurable Chunk Overlap** | Sliding window overlap (e.g., 100 characters) ensures that context spanning chunk boundaries is not lost between adjacent embeddings. | If a critical fact spans the boundary between Chunk A and Chunk B, neither chunk has enough meaning to match the query. |
| **Granular Chunk Inspector Modal** | Allows developers and admins to verify chunk boundaries directly from the browser without running manual python scripts or opening sqlite databases. | Debugging poor search results requires digging into raw database tables or running console scripts. |
| **Asynchronous Re-indexing with Loading States** | Indexing large PDFs can take several seconds. Using non-blocking requests with animated spinners keeps the UI responsive. | The entire webpage would freeze while embeddings are generated. |
| **Instant Client-Side Filtering** | Filters documents in memory with zero network latency, providing an instantaneous search experience. | Every keystroke would trigger server round-trips, causing lag and server load. |

---

## 🔄 4. Step-by-Step Technical Execution Flow

```
1. Admin drags a file into DocumentUploadModal.jsx and selects "Semantic Chunking"
   │
   ▼
2. DocumentUploadModal bundles file + strategy into FormData and calls documentApi.uploadDocument()
   │
   ▼
3. Backend receives file -> runs SemanticChunker -> generates embeddings -> commits to ChromaDB
   │
   ▼
4. Upload finishes -> DocumentContext automatically triggers:
   ├── fetchDocuments() -> updates catalog table
   └── fetchStats() -> updates live ChromaDB count in Navbar
   │
   ▼
5. Admin clicks "Inspect Chunks" on DocumentTable -> ChunkViewerModal displays generated chunks
```

---

## 📂 Source Files
- [DocumentTable.jsx](file:///c:/Users/garg0/Downloads/Projects/nikita/rag-for-beginners/frontend/src/components/documents/DocumentTable.jsx)
- [DocumentUploadModal.jsx](file:///c:/Users/garg0/Downloads/Projects/nikita/rag-for-beginners/frontend/src/components/documents/DocumentUploadModal.jsx)
- [ChunkViewerModal.jsx](file:///c:/Users/garg0/Downloads/Projects/nikita/rag-for-beginners/frontend/src/components/documents/ChunkViewerModal.jsx)
- [DocumentContext.jsx](file:///c:/Users/garg0/Downloads/Projects/nikita/rag-for-beginners/frontend/src/context/DocumentContext.jsx)
- [documentApi.js](file:///c:/Users/garg0/Downloads/Projects/nikita/rag-for-beginners/frontend/src/services/documentApi.js)
