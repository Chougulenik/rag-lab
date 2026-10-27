# Feature 1: Conversational RAG & Interactive Citations

---

## 📌 1. Purpose & Business Objective
Standard LLM applications frequently suffer from two critical enterprise failure modes:
1. **Hallucinations & Ungrounded Claims**: The AI invents facts when it does not know the answer.
2. **"Black Box" Answers**: Users cannot verify where an answer came from, eroding trust in enterprise settings.
3. **Poor Multi-Turn Memory**: Follow-up questions (e.g., *"What did it cost?"*) fail because traditional vector searches only search for the literal words *"What did it cost?"* without understanding that *"it"* refers to GitHub or Tesla.

This feature provides a production-grade, history-aware, streaming conversational interface where every fact is attributed to verified document excerpts.

---

## 🛠️ 2. What We Implemented ("What We Did")

### A. Real-Time Token-by-Token Streaming Engine (`chatApi.js`)
- Built a custom `ReadableStream` parser using the browser's native `fetch` API.
- Implemented Server-Sent Events (SSE) line buffering to handle chunked HTTP transfer encoding (`data: {"type": "token", "content": "..."}`).
- Added custom signal cancellation via `AbortController`, enabling users to instantly halt an in-flight response.

### B. Interactive Citation Badges & Chunk Inspector (`CitationBadge.jsx` & `CitationModal.jsx`)
- Extracted and structured metadata from retrieved chunks into interactive pill badges (`[1] Tesla.txt (94%)`).
- Developed a slide-over modal that opens upon clicking any citation badge, showing:
  - Exact source file path (e.g., `docs/Tesla.txt`).
  - Cosine similarity / relevance score.
  - The exact unmodified text passage that was fed to the LLM.

### C. Conversational Context & Query Rewriter Support (`ChatContext.jsx`)
- Maintained a structured array of conversation turns (`{ role: 'user' | 'assistant', content, citations }`).
- Bundled previous message turns and sent them with each new prompt, allowing the backend to rephrase ambiguous follow-up questions into standalone vector search queries before retrieval.

### D. Dynamic Strategy & Hyperparameter Controller (`StrategySelector.jsx`)
- Provided a UI control bar allowing real-time switching between 5 retrieval strategies:
  1. **Vector Similarity (Cosine)**
  2. **Multi-Query Expansion**
  3. **Reciprocal Rank Fusion (RRF)**
  4. **Hybrid Search (BM25 + Dense)**
  5. **Cross-Encoder Neural Reranking**
- Added Top-K chunk selector (2 to 10 chunks) and temperature tuning (0.0 to 1.0).

### E. Zero-Friction UX & Quick Prompts (`ChatContainer.jsx` & `MessageBubble.jsx`)
- Pre-loaded domain-specific synthetic prompt cards for single-click testing.
- Built auto-scrolling with user scroll lock detection.
- Supported `Shift+Enter` multi-line entry and `Enter` quick submission.
- Added one-click clipboard copying with visual confirmation.

---

## 💡 3. Why We Are Using This Approach ("Why We Chose This")

| What We Used | Why We Used It (Technical & Business Rationale) | What Would Happen If We Didn't |
|---|---|---|
| **SSE Streaming via ReadableStream** | Large LLM responses take 5–15 seconds to generate completely. Streaming tokens provides immediate First Contentful Token within **< 600ms**, dramatically improving perceived performance. | Users stare at a blank spinner for 10+ seconds, assuming the application has frozen. |
| **Interactive Citations Modal** | Enterprise compliance, legal, and financial use cases require proof of origin. Linking every statement to its exact source chunk builds user trust and makes auditing easy. | Users cannot verify whether the AI is hallucinating or referencing actual documents. |
| **Multi-Turn Context Rewriting** | Natural human conversations rely on pronouns and shorthand (*"How much did they pay?"*). Passing history allows an LLM to rewrite this into *"How much did Microsoft pay to acquire GitHub?"* before querying the vector store. | Vector search fails because *"How much did they pay?"* does not contain the keywords "Microsoft" or "GitHub". |
| **Strategy Selector in UI** | Different queries require different retrieval techniques. Exact codes and part numbers favor BM25 hybrid search, while conceptual questions favor multi-query RRF. Giving users control enables optimal retrieval for diverse queries. | A "one-size-fits-all" retrieval engine produces poor relevance on edge-case queries. |
| **Pulsing Streaming Cursor & Copy Button** | High-polish visual micro-interactions provide clear visual feedback on whether the model is actively thinking or completed. | Ambiguous UI state leaves users unsure if generation finished. |

---

## 🔄 4. Step-by-Step Technical Execution Flow

```
1. User enters prompt in ChatContainer.jsx
   │
   ▼
2. ChatContext.sendMessage() dispatches prompt + history to chatApi.streamMessage()
   │
   ▼
3. fetch('/api/v1/chat/stream') opens HTTP connection
   │
   ├── Backend rewrites query using conversation history
   ├── Backend queries ChromaDB using chosen Strategy (e.g., RRF)
   ├── Backend sends citation metadata: data: {"type": "citations", "citations": [...]}
   │   └── ChatContext stores citations in state -> UI renders CitationBadge pills
   │
   └── Backend streams tokens: data: {"type": "token", "content": "..."}
       └── ReadableStream loop pushes tokens -> MessageBubble renders live text
   │
   ▼
4. [DONE] received -> streaming cursor hides -> conversation updated in memory
```

---

## 📂 Source Files
- [ChatContainer.jsx](file:///c:/Users/garg0/Downloads/Projects/nikita/rag-for-beginners/frontend/src/components/chat/ChatContainer.jsx)
- [MessageBubble.jsx](file:///c:/Users/garg0/Downloads/Projects/nikita/rag-for-beginners/frontend/src/components/chat/MessageBubble.jsx)
- [CitationBadge.jsx](file:///c:/Users/garg0/Downloads/Projects/nikita/rag-for-beginners/frontend/src/components/chat/CitationBadge.jsx)
- [CitationModal.jsx](file:///c:/Users/garg0/Downloads/Projects/nikita/rag-for-beginners/frontend/src/components/chat/CitationModal.jsx)
- [StrategySelector.jsx](file:///c:/Users/garg0/Downloads/Projects/nikita/rag-for-beginners/frontend/src/components/chat/StrategySelector.jsx)
- [ChatContext.jsx](file:///c:/Users/garg0/Downloads/Projects/nikita/rag-for-beginners/frontend/src/context/ChatContext.jsx)
- [chatApi.js](file:///c:/Users/garg0/Downloads/Projects/nikita/rag-for-beginners/frontend/src/services/chatApi.js)
