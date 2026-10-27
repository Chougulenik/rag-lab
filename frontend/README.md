# Enterprise RAG Frontend

A modern, production-grade React 18 single-page application built for interacting with the Enterprise RAG Retrieval and Ingestion backend engine.

---

## 🚀 Key Features

1. **Conversational RAG Chat Interface**
   - Real-time token-by-token streaming via Server-Sent Events (SSE) / Fetch `ReadableStream`.
   - Multi-turn conversational query contextualization.
   - Interactive citation badges (`[1]`, `[2]`) that open a slide-over modal revealing the exact document chunk and relevance score.
   - Dynamic parameter controls: Retrieval Strategy selector, Top-K chunk slider, and Model Temperature.
   - Pre-loaded synthetic benchmark questions for quick evaluation.

2. **Knowledge Base & Document Management**
   - Real-time document catalog synchronized with the ChromaDB vector database.
   - Drag-and-drop document upload (`.txt`, `.md`, `.pdf`).
   - Pluggable chunking strategy selection on upload:
     - **Recursive Character**: Fast, length-bounded chunking with overlap.
     - **Semantic**: Embedding distance drop percentile chunking.
     - **Agentic**: LLM-guided context boundary detection.
   - Chunk Inspector: Deep-dive view of individual chunks, character counts, and embedding metadata.
   - Directory Re-indexing trigger to sync local document storage.

3. **Dual Retrieval Strategy Playground**
   - Side-by-side benchmarking tool comparing any two retrieval strategies simultaneously (e.g. Cosine Vector Similarity vs. Reciprocal Rank Fusion).
   - Real-time latency tracking (ms) per retrieval strategy.
   - Ranked result cards displaying chunk rank, source file, similarity/RRF score, and content snippet.

---

## 🛠️ Architecture & Project Structure

```
frontend/
├── public/                     # Static public assets
├── src/
│   ├── components/
│   │   ├── common/             # Atomic design system: Button, Badge, Card, Modal, Spinner
│   │   ├── layout/             # AppShell, Navbar with ChromaDB live status badge
│   │   ├── chat/               # ChatContainer, MessageBubble, CitationBadge, CitationModal, StrategySelector
│   │   ├── documents/          # DocumentTable, DocumentUploadModal, ChunkViewerModal
│   │   └── playground/         # StrategyComparison, RankedResultCard
│   ├── context/
│   │   ├── ChatContext.jsx     # Chat state, SSE streaming stream reader, conversation history
│   │   └── DocumentContext.jsx # Knowledge base catalog, indexing status, upload dispatch
│   ├── services/
│   │   ├── apiClient.js        # Axios instance configured with timeout and error interceptors
│   │   ├── documentApi.js      # REST client for document operations (/documents)
│   │   ├── retrievalApi.js     # REST client for retrieval benchmarking (/retrieval/query)
│   │   └── chatApi.js          # REST & SSE streaming client (/chat/stream, /chat/completions)
│   ├── styles/
│   │   ├── theme.css           # Glassmorphism design tokens, dark palette, typography
│   │   └── index.css           # Global layout reset, ambient glow, custom scrollbars
│   ├── App.jsx                 # Provider composition & tab routing
│   └── main.jsx                # React 18 DOM mount
├── index.html                  # HTML5 entry with Google Fonts (Inter, JetBrains Mono)
├── vite.config.js              # Vite bundler configuration & /api proxy to FastAPI (port 8000)
└── package.json                # React, Lucide icons, Axios, Vite dependencies
```

---

## 💻 Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
The application will launch at **`http://localhost:5173`**. Requests made to `/api/v1` are automatically proxied to the backend at `http://127.0.0.1:8000`.

### 3. Build for Production
```bash
npm run build
```
Creates an optimized production bundle in the `dist/` folder ready for CDN or static file hosting.
