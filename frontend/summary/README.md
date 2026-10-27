# Frontend Features & Architecture Summary

This directory provides a comprehensive, feature-by-feature breakdown of all modules, UI components, state management stores, and API clients implemented for the **Enterprise RAG Frontend**.

Every document follows a 5-part architecture framework:
1. **Purpose & Business Objective**: Why this feature is needed in a production RAG system.
2. **What We Implemented ("What We Did")**: Specific UI components, state stores, and algorithms implemented.
3. **Why We Are Using This Approach ("Why We Chose This")**: Technical and architectural rationale compared to naive alternatives.
4. **Step-by-Step Technical Execution Flow**: End-to-end data lifecycle from user action to network layer.
5. **Associated Source Files**: Direct links to all related code files.

---

## 📑 Feature Modules Index

| Document | Feature Focus | What We Did & Why We Used It |
|---|---|---|
| [1. Conversational Chat & Citations](./1_conversational_chat.md) | Multi-turn streaming chat, verified citation badges, chunk inspector, strategy tuner | Explains SSE `ReadableStream` token streaming, conversational query rewriting, interactive citation modals, and on-the-fly strategy selection. |
| [2. Knowledge Base Management](./2_knowledge_base_management.md) | Document catalog, drag-and-drop upload, chunking strategy selector, chunk inspector | Explains live ChromaDB cataloging, recursive vs. semantic vs. agentic chunking algorithms, chunk boundary inspector, and one-click re-indexing. |
| [3. Retrieval Comparison Playground](./3_retrieval_playground.md) | Side-by-side strategy benchmarking, rank comparison, score & latency measurement | Explains dual-engine split testing, RRF ranking math, BM25 hybrid search, and latency benchmarking (ms). |
| [4. Component Catalog & Design System](./4_component_catalog_and_styling.md) | Atomic UI components, glassmorphism theme, React Contexts, typed API clients | Explains zero-runtime CSS tokens, modular React Context state stores, Axios response interceptors, and Vite reverse proxy configurations. |

---

## 🏛️ High-Level Frontend Architecture

```
                                    ┌───────────────────────┐
                                    │       main.jsx        │
                                    └───────────┬───────────┘
                                                │
                                    ┌───────────▼───────────┐
                                    │        App.jsx        │
                                    │  ┌─────────────────┐  │
                                    │  │ DocumentProvider│  │
                                    │  │  ┌────────────┐ │  │
                                    │  │  │ChatProvider│ │  │
                                    └──┴──┴─────┬──────┴─┴──┘
                                                │
                                    ┌───────────▼───────────┐
                                    │       AppShell        │
                                    │  ┌─────────────────┐  │
                                    │  │     Navbar      │  │
                                    │  └────────┬────────┘  │
                                    └───────────┼───────────┘
                        ┌───────────────────────┼───────────────────────┐
                        ▼                       ▼                       ▼
            ┌───────────────────────┐ ┌───────────────────┐ ┌──────────────────────┐
            │     ChatContainer     │ │   DocumentTable   │ │  StrategyComparison  │
            │  (Conversational RAG) │ │  (Knowledge Base) │ │ (Retrieval Benchmark)│
            └───────────┬───────────┘ └─────────┬─────────┘ └──────────┬───────────┘
                        │                       │                      │
                        └───────────────────────┼──────────────────────┘
                                                │
                                    ┌───────────▼───────────┐
                                    │    Services Layer     │
                                    │ ├─ chatApi.js (SSE)   │
                                    │ ├─ documentApi.js     │
                                    │ ├─ retrievalApi.js    │
                                    │ └─ apiClient.js       │
                                    └───────────┬───────────┘
                                                │ /api/v1 (Vite Reverse Proxy)
                                    ┌───────────▼───────────┐
                                    │  FastAPI Backend :8000│
                                    └───────────────────────┘
```

---

## 🎨 Design System Highlights
- **Palette**: Sleek dark mode (`#090d16`, `#0f172a`, `#1e293b`) with ambient indigo and cyan radial glows.
- **Glassmorphism**: Translucent panels with `backdrop-filter: blur(16px)` and subtle border highlights.
- **Typography**: Dual font pairing: **Inter** for clean UI reading and **JetBrains Mono** for code snippets and chunk previews.
- **Micro-interactions**: Smooth button hover elevations, pulsing streaming cursors, and animated modal transitions.
