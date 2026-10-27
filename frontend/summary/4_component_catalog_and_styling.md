# Feature 4: Component Catalog, Design System & API Architecture

---

## 📌 1. Purpose & Business Objective
Enterprise AI applications demand more than basic prototypes:
1. **Visual credibility & user trust**: Clunky, unstyled web pages feel amateur and reduce executive confidence in AI capabilities.
2. **Maintainability & DRY Code**: Repeatedly writing buttons, modal logic, and error handlers leads to fragmented codebases.
3. **Resilient Network Layer**: LLM calls are subject to timeouts, rate limits, and network errors that must be intercepted and reported clearly.

This feature establishes an enterprise design system, reusable atomic UI library, centralized state management, and an API client.

---

## 🛠️ 2. What We Implemented ("What We Did")

### A. Enterprise Glassmorphism Design System (`theme.css` & `index.css`)
- Defined CSS custom properties for dark mode palettes, gradients, and typography.
- Implemented glassmorphism aesthetics (`backdrop-filter: blur(16px)`, translucent surfaces, subtle border glows).
- Configured font loading for **Inter** (high readability for interface text) and **JetBrains Mono** (monospace clarity for chunks and citations).
- Added customized slim scrollbars and ambient background radial glow elements.

### B. Reusable Atomic UI Component Suite (`src/components/common/`)
- **`Button.jsx`**: Supports multiple variants (`primary`, `secondary`, `outline`, `ghost`, `danger`), loading spinners, and icon integration.
- **`Badge.jsx`**: Consistent status tags with semantic colors (`success`, `warning`, `error`, `info`, `accent`).
- **`Card.jsx`**: Elevated glassmorphic container with hover transitions.
- **`Modal.jsx`**: Accessible modal dialog featuring Escape key listeners, backdrop blur, and body scroll lock.
- **`Spinner.jsx`**: Animated circular loader for asynchronous states.

### C. Application Shell & Navigation (`Navbar.jsx` & `AppShell.jsx`)
- Header with branding, tab navigation switcher (`Conversational RAG`, `Knowledge Base`, `Retrieval Playground`), and real-time ChromaDB status indicators.
- Responsive container (`1440px` max-width) ensuring clean presentation on desktop and wide monitors.

### D. Centralized State Stores (`ChatContext.jsx` & `DocumentContext.jsx`)
- Built dedicated React Context providers separating conversation lifecycle from knowledge base administration.
- Provided custom hooks `useChat()` and `useDocuments()` for clean access across all component levels.

### E. Resilient API Client Layer (`apiClient.js`)
- Configured Axios instance with 45-second timeout thresholds designed for long-running LLM inferences.
- Added response error interceptors extracting nested FastAPI validation errors (`detail` or `message`) into human-readable error messages.

---

## 💡 3. Why We Are Using This Approach ("Why We Chose This")

| What We Used | Why We Used It (Technical & Business Rationale) | What Would Happen If We Didn't |
|---|---|---|
| **Vanilla CSS Design Tokens (`theme.css`)** | Provides zero runtime overhead, instant style compilation, and universal theme variable access without bulky CSS-in-JS libraries. | Heavy CSS frameworks increase bundle size and slow initial page loads. |
| **Separated React Context Stores** | Decouples chat messages from document uploads. Updating a chat turn doesn't re-render document tables, ensuring 60fps UI performance. | Storing all application state in a single monolithic context causes sluggish typing and unnecessary re-renders. |
| **Centralized Axios Interceptor** | Standardizes error parsing across all endpoints. If the backend returns a 422 validation error or a 500 exception, the interceptor extracts the exact error string for the UI. | Every component would need repetitive `try/catch` blocks with fragile error property checks. |
| **Vite Dev Server Proxy** | Forwards `/api` requests to `http://127.0.0.1:8000`, eliminating browser Cross-Origin Resource Sharing (CORS) blocks during local development. | Browsers block API requests due to origin mismatch between port 5173 and port 8000. |

---

## 🔄 4. Step-by-Step Technical Execution Flow

```
1. Browser loads index.html -> loads Inter & JetBrains Mono fonts
   │
   ▼
2. main.jsx mounts App.jsx -> wraps tree in DocumentProvider & ChatProvider
   │
   ▼
3. App.jsx renders AppShell.jsx
   ├── Navbar queries DocumentContext -> displays active ChromaDB chunk count badge
   └── Tab state switches between ChatContainer, DocumentTable, and StrategyComparison
   │
   ▼
4. Any API request routes through apiClient.js -> proxied by vite.config.js to port 8000
   └── On failure: interceptor extracts error message -> displays clean error banner in UI
```

---

## 📂 Source Files
- [theme.css](file:///c:/Users/garg0/Downloads/Projects/nikita/rag-for-beginners/frontend/src/styles/theme.css)
- [index.css](file:///c:/Users/garg0/Downloads/Projects/nikita/rag-for-beginners/frontend/src/styles/index.css)
- [Button.jsx](file:///c:/Users/garg0/Downloads/Projects/nikita/rag-for-beginners/frontend/src/components/common/Button.jsx)
- [Badge.jsx](file:///c:/Users/garg0/Downloads/Projects/nikita/rag-for-beginners/frontend/src/components/common/Badge.jsx)
- [Card.jsx](file:///c:/Users/garg0/Downloads/Projects/nikita/rag-for-beginners/frontend/src/components/common/Card.jsx)
- [Modal.jsx](file:///c:/Users/garg0/Downloads/Projects/nikita/rag-for-beginners/frontend/src/components/common/Modal.jsx)
- [Spinner.jsx](file:///c:/Users/garg0/Downloads/Projects/nikita/rag-for-beginners/frontend/src/components/common/Spinner.jsx)
- [Navbar.jsx](file:///c:/Users/garg0/Downloads/Projects/nikita/rag-for-beginners/frontend/src/components/layout/Navbar.jsx)
- [AppShell.jsx](file:///c:/Users/garg0/Downloads/Projects/nikita/rag-for-beginners/frontend/src/components/layout/AppShell.jsx)
- [ChatContext.jsx](file:///c:/Users/garg0/Downloads/Projects/nikita/rag-for-beginners/frontend/src/context/ChatContext.jsx)
- [DocumentContext.jsx](file:///c:/Users/garg0/Downloads/Projects/nikita/rag-for-beginners/frontend/src/context/DocumentContext.jsx)
- [apiClient.js](file:///c:/Users/garg0/Downloads/Projects/nikita/rag-for-beginners/frontend/src/services/apiClient.js)
