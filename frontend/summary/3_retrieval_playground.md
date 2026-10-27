# Feature 3: Dual Retrieval Strategy Comparison Playground

---

## 📌 1. Purpose & Business Objective
In production RAG systems, tuning retrieval is the single most critical factor determining answer accuracy:
1. **No single retrieval algorithm is optimal for all domains**:
   - Vector similarity struggles with acronyms, part numbers, and exact product names.
   - BM25 keyword matching fails on conceptual questions and synonyms.
   - Multi-query expansion and RRF improve recall but add latency.
   - Cross-encoders provide superior accuracy but consume higher compute.
2. **Engineers lack visual debugging tools**: Comparing retrieval models typically requires writing custom Python benchmarking scripts in Jupyter Notebooks.

This feature provides an interactive visual workbench that executes queries across any two retrieval strategies simultaneously, giving instant side-by-side visibility into ranking performance, relevance scores, and latency.

---

## 🛠️ 2. What We Implemented ("What We Did")

### A. Dual Engine Comparison Workbench (`StrategyComparison.jsx`)
- Built a split-screen workbench allowing independent selection of **Strategy A** (Cyan theme) and **Strategy B** (Purple theme).
- Supported retrieval modes:
  1. **Vector Similarity (Cosine)**
  2. **Multi-Query Expansion**
  3. **Reciprocal Rank Fusion (RRF)**
  4. **Hybrid Search (BM25 + Dense)**
  5. **Cross-Encoder Reranker**
- Single-click **"Benchmark Query"** button executes both strategies in parallel via `Promise.all` or sequential calls.

### B. High-Precision Latency & Telemetry Tracking
- Measures exact round-trip execution latency in milliseconds (`performance.now()`).
- Displays total candidate chunks retrieved and average relevance score per algorithm.

### C. Ranked Result Cards (`RankedResultCard.jsx`)
- Built cards for each retrieved candidate displaying:
  - Numerical rank badge (`Rank #1`, `Rank #2`, etc.).
  - Algorithm-specific score (cosine similarity, RRF score, or cross-encoder probability).
  - Source file name and path.
  - Formatted text snippet preview with character length.

---

## 💡 3. Why We Are Using This Approach ("Why We Chose This")

| What We Used | Why We Used It (Technical & Business Rationale) | What Would Happen If We Didn't |
|---|---|---|
| **Side-by-Side Dual Column View** | Allows engineers to immediately see differences in ranking order (e.g., whether Hybrid search promoted a keyword-rich chunk to Rank #1 that Vector similarity buried at Rank #8). | Developers must test one strategy, copy outputs to a text file, run the second strategy, and manually compare them. |
| **Reciprocal Rank Fusion (RRF)** | Merges multiple ranked lists using reciprocal ranking ($RRF = \sum \frac{1}{60 + rank}$) without needing to normalize scores from completely different distributions. | Results from different query variations cannot be combined cleanly, leading to arbitrary chunk selection. |
| **Hybrid BM25 + Vector Search** | Combines sparse inverted index token matching (BM25) with dense semantic embeddings. Ensures that exact names (*"Tesla Roadster"*, *"H100"*) are matched alongside conceptual meaning (*"electric sports car"*). | Acronyms, product models, and exact identifiers are missed if embedding cosine distance doesn't register a close match. |
| **Real-Time Latency Telemetry** | Displays latency in milliseconds so developers can evaluate the trade-off between retrieval quality and speed (e.g., RRF takes 250ms vs. Vector 40ms). | Teams deploy computationally heavy retrieval pipelines without realizing they are degrading API response times. |

---

## 🔄 4. Step-by-Step Technical Execution Flow

```
1. Engineer selects "Vector Similarity" for Strategy A and "Hybrid BM25" for Strategy B
   │
   ▼
2. Types query: "What was NVIDIA's first graphics accelerator?"
   │
   ▼
3. Clicks "Benchmark Query"
   │
   ├── Client captures start timestamp startA = performance.now()
   ├── retrievalApi.search({ query, strategy: 'vector', k: 5 }) runs
   │   └── Response received -> latency computed -> Column A updates
   │
   ├── Client captures start timestamp startB = performance.now()
   ├── retrievalApi.search({ query, strategy: 'hybrid', k: 5 }) runs
   │   └── Response received -> latency computed -> Column B updates
   │
   ▼
4. Screen displays side-by-side ranked result cards with scores and latency metrics
```

---

## 📂 Source Files
- [StrategyComparison.jsx](file:///c:/Users/garg0/Downloads/Projects/nikita/rag-for-beginners/frontend/src/components/playground/StrategyComparison.jsx)
- [RankedResultCard.jsx](file:///c:/Users/garg0/Downloads/Projects/nikita/rag-for-beginners/frontend/src/components/playground/RankedResultCard.jsx)
- [retrievalApi.js](file:///c:/Users/garg0/Downloads/Projects/nikita/rag-for-beginners/frontend/src/services/retrievalApi.js)
