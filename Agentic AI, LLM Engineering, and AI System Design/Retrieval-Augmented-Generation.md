# Retrieval-Augmented Generation (RAG) — Grounding LLM Answers in Your Own Data

> **What you'll learn:** how a RAG system works end to end: **ingestion** (parsing, cleaning, dedup, metadata), **chunking**, **embeddings** and similarity, **dense vs. sparse (BM25) vs. hybrid** retrieval, **vector indexes** (HNSW, IVF) and **vector databases**, **query rewriting**, **reranking** and top-k, **grounded answers with citations and abstention**, **multi-tenant ACL filtering and freshness**, how to **evaluate retrieval** (recall@k, precision@k, MRR, nDCG) and **answers** (faithfulness, correctness, relevance), and **when to use RAG vs. long context vs. fine-tuning**. Each part has a runnable C++ example.
>
> **Prerequisites:** [LLM and Generative AI Fundamentals](./LLM-and-Generative-AI-Fundamentals.md) and [Hash Tables](../Data%20Structures/Hash-Tables.md) / [Trees](../Data%20Structures/Trees.md) basics. Related: [LLM and Agent Evaluation](../Testing%2C%20Reliability%20%26%20Observability/LLM-and-Agent-Evaluation.md).

## Table of Contents
1. [Answer evaluation: faithfulness, factual correctness, and relevance](#1-answer-evaluation-faithfulness-factual-correctness-and-relevance)
2. [Chunking approaches: fixed-size, semantic, hierarchical, and overlap](#2-chunking-approaches-fixed-size-semantic-hierarchical-and-overlap)
3. [Dense vs. sparse retrieval (BM25) and hybrid search](#3-dense-vs-sparse-retrieval-bm25-and-hybrid-search)
4. [Embeddings: similarity metrics, dimension, and model selection](#4-embeddings-similarity-metrics-dimension-and-model-selection)
5. [Grounded responses, source citations, and abstention when evidence is missing](#5-grounded-responses-source-citations-and-abstention-when-evidence-is-missing)
6. [Ingestion pipelines: parsing, cleaning, deduplication, and metadata](#6-ingestion-pipelines-parsing-cleaning-deduplication-and-metadata)
7. [Multi-tenant retrieval, ACL-aware filtering, and data freshness](#7-multi-tenant-retrieval-acl-aware-filtering-and-data-freshness)
8. [Query rewriting, expansion, routing, and decomposition](#8-query-rewriting-expansion-routing-and-decomposition)
9. [RAG vs. long-context prompting vs. fine-tuning: when to use which](#9-rag-vs-long-context-prompting-vs-fine-tuning-when-to-use-which)
10. [Reranking, contextual compression, and top-k selection](#10-reranking-contextual-compression-and-top-k-selection)
11. [Retrieval evaluation: recall@k, precision@k, MRR, and nDCG](#11-retrieval-evaluation-recallk-precisionk-mrr-and-ndcg)
12. [Vector databases and indexing / update / deletion strategies](#12-vector-databases-and-indexing--update--deletion-strategies)
13. [Vector indexes: approximate nearest neighbors, HNSW, and IVF](#13-vector-indexes-approximate-nearest-neighbors-hnsw-and-ivf)
14. [Cheat sheet](#cheat-sheet)

**The pipeline in one picture:**
```text
OFFLINE:  sources -> parse/clean/dedup (6) -> chunk (2) -> embed (4) -> index (12, 13) + keyword index (3)
ONLINE:   question -> rewrite/route (8) -> filter by tenant/ACL (7) -> hybrid retrieve (3) -> rerank/top-k (10)
          -> prompt with sources -> grounded answer + citations or abstain (5)
QUALITY:  retrieval metrics (11) + answer metrics (1); choose RAG vs. alternatives (9)
```

Suggested order: **9 → 6 → 2 → 4 → 3 → 13 → 12 → 8 → 10 → 5 → 7 → 11 → 1**.

---

## 1. Answer evaluation: faithfulness, factual correctness, and relevance

**In one sentence:** evaluate RAG answers on **faithfulness / groundedness** (every claim is supported by the retrieved sources), **factual correctness** (matches the reference answer / ground truth), and **answer relevance** (actually addresses the question) — separately from retrieval quality, so you know *which* stage to fix.

### In plain words
A student's essay can fail in three ways: they made things up that aren't in the textbook (not faithful), they copied the textbook but the textbook was wrong or they misread it (not correct), or they wrote a lovely answer to a different question (not relevant).

### How it works
| Metric | Question | How to measure |
|---|---|---|
| **Faithfulness / groundedness** | Is every claim supported by the context? | split answer into claims; check each against the sources (NLI model or LLM judge); score = supported / total |
| **Factual correctness** | Does it match the truth? | compare with a reference answer (exact match / F1 for short answers; judge for long) |
| **Answer relevance** | Does it answer *this* question? | judge rating, or generate questions from the answer and compare to the original |
| **Citation accuracy** | Do cited sources support the cited sentence? | check each (sentence, citation) pair |
| **Abstention correctness** | Did it say "I don't know" when the answer isn't in the corpus? | include unanswerable questions in the set |

- **Diagnose by combining:** low retrieval recall + low correctness → fix retrieval; good recall + low faithfulness → fix the prompt/model.
- Tools: RAGAS, TruLens, DeepEval, LangSmith evaluators; calibrate LLM judges against human labels ([LLM-as-judge](./Evaluation-and-Testing.md#7-llm-as-judge-rubrics-calibration-bias-and-limitations)).

#### Modern C++ example — claim-level faithfulness, correctness vs. a reference, and a stage diagnosis
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iomanip>
#include <iostream>
#include <string>
#include <vector>

bool supported(const std::string& claim, const std::vector<std::string>& context) {   // stand-in for an NLI model / judge
    for (auto& c : context) if (c.find(claim) != std::string::npos) return true;
    return false;
}

int main() {
    std::vector<std::string> context{"Refunds are issued within 14 days of receiving the return.", "Shipping is free for orders over 500 EGP."};
    std::vector<std::string> claims{"within 14 days", "free for orders over 500 EGP", "refunds go to a store credit by default"};
    int ok = 0;
    for (auto& c : claims) { bool s = supported(c, context); ok += s; std::cout << (s ? "supported   " : "UNSUPPORTED ") << c << '\n'; }
    double faithfulness = double(ok) / claims.size();
    bool correct = true;                                       // reference answer: "14 days" -> key fact matches
    double retrieval_recall = 1.0;                             // the gold passage was retrieved
    std::cout << std::fixed << std::setprecision(2) << "faithfulness " << faithfulness << ", correct key fact " << std::boolalpha << correct
              << ", retrieval recall " << retrieval_recall << '\n';
    if (retrieval_recall < 0.8) std::cout << "diagnosis: fix retrieval (chunking, hybrid search, reranking)\n";
    else if (faithfulness < 0.9) std::cout << "diagnosis: retrieval fine, generation adds unsupported claims -> tighten prompt, require citations\n";
    else std::cout << "diagnosis: healthy\n";
}
```

**Output:**
```text
supported   within 14 days
supported   free for orders over 500 EGP
UNSUPPORTED refunds go to a store credit by default
faithfulness 0.67, correct key fact true, retrieval recall 1.00
diagnosis: retrieval fine, generation adds unsupported claims -> tighten prompt, require citations
```

### Interview answer
"I evaluate RAG answers separately from retrieval. Faithfulness checks that every claim in the answer is supported by the retrieved context — I split the answer into claims and verify each with an NLI model or a calibrated LLM judge. Factual correctness compares against reference answers, and answer relevance checks it actually addresses the question; I also check citation accuracy and include unanswerable questions to test abstention. Combining these with retrieval recall tells me where to fix: poor recall means retrieval, good recall but low faithfulness means the prompt or model."

---

## 2. Chunking approaches: fixed-size, semantic, hierarchical, and overlap

**In one sentence:** documents are split into **chunks** that get embedded and retrieved individually; **fixed-size** chunks (e.g. 300–800 tokens) are simple, **structure/semantic** chunking splits at headings, paragraphs or topic shifts, **hierarchical** (parent–child) chunking retrieves small precise chunks but returns their larger parent for context, and **overlap** (10–20%) prevents facts being cut in half.

### In plain words
Cutting a cookbook into index cards: one card per recipe is better than cutting every 500 words (which might split "add salt" from "to the soup"). Keep a little overlap between cards, and remember which chapter each card came from.

### How it works
| Approach | How | Pros / cons |
|---|---|---|
| **Fixed-size** | N tokens, with overlap | simple, predictable; cuts mid-sentence/topic |
| **Recursive / structural** | split by headings → paragraphs → sentences until under the size | respects document structure; most common default |
| **Semantic** | split where embedding similarity between adjacent sentences drops | topic-coherent chunks; more compute |
| **Hierarchical (parent–child / small-to-big)** | index small chunks, return the parent section | precise matching + enough context |
| **Special content** | tables, code, slides kept whole; add title/section headers to each chunk ("contextual chunk headers") | avoids meaningless fragments |

- **Too small:** missing context, many chunks; **too large:** diluted embeddings, wasted prompt tokens. Tune chunk size on your **retrieval eval** ([section 11](#11-retrieval-evaluation-recallk-precisionk-mrr-and-ndcg)).
- Store metadata per chunk: document ID, section path, position, page, timestamps, ACLs.

#### Modern C++ example — fixed-size chunks with overlap vs. heading-aware chunks with section metadata
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

std::vector<std::string> words_of(const std::string& s) { std::istringstream in(s); std::vector<std::string> w; std::string t; while (in >> t) w.push_back(t); return w; }

int main() {
    std::string doc = "# Returns\nYou can return items within 30 days. Items must be unused.\n"
                      "# Refunds\nRefunds are paid to the original card within 14 days after we receive the item.\n";

    auto w = words_of(doc);
    const std::size_t size = 10, overlap = 3;
    std::cout << "fixed-size (" << size << " words, overlap " << overlap << "):\n";
    for (std::size_t start = 0; start < w.size(); start += size - overlap) {
        std::string chunk;
        for (std::size_t i = start; i < std::min(w.size(), start + size); ++i) chunk += w[i] + " ";
        std::cout << "  [" << chunk << "]\n";
        if (start + size >= w.size()) break;
    }

    std::cout << "heading-aware:\n";
    std::istringstream lines(doc); std::string line, section;
    while (std::getline(lines, line)) {
        if (line.rfind("# ", 0) == 0) { section = line.substr(2); continue; }
        std::cout << "  {section: \"" << section << "\"} \"" << section << ": " << line << "\"\n";   // header prepended for context
    }
}
```

**Output:**
```text
fixed-size (10 words, overlap 3):
  [# Returns You can return items within 30 days. Items ]
  [30 days. Items must be unused. # Refunds Refunds are ]
  [Refunds Refunds are paid to the original card within 14 ]
  [card within 14 days after we receive the item. ]
heading-aware:
  {section: "Returns"} "Returns: You can return items within 30 days. Items must be unused."
  {section: "Refunds"} "Refunds: Refunds are paid to the original card within 14 days after we receive the item."
```

### Interview answer
"Chunking decides what can be retrieved. Fixed-size chunks with 10 to 20 percent overlap are simple but cut across sentences and topics; recursive or structural chunking splits on headings, paragraphs and sentences and is my usual default; semantic chunking splits at topic shifts; and hierarchical chunking indexes small chunks for precise matching but returns the parent section for context. I keep tables and code intact, prepend the document title and section path to each chunk, store rich metadata, and tune chunk size and overlap against a retrieval evaluation set rather than guessing."

---

## 3. Dense vs. sparse retrieval (BM25) and hybrid search

**In one sentence:** **sparse** retrieval (BM25, keyword-based) matches **exact terms** and excels at names, codes and rare words; **dense** retrieval (embeddings) matches **meaning** and handles paraphrases; **hybrid** search runs both and fuses the rankings (e.g. **Reciprocal Rank Fusion**), usually beating either alone.

### In plain words
Two librarians: one finds every book containing the exact words you said (great for "error E-4012"), the other understands what you mean even with different words (great for "my parcel never came" ≈ "delivery not received"). Ask both and merge their lists.

### How it works
- **BM25:** score = Σ over query terms of `IDF(t) × tf·(k1+1) / (tf + k1·(1 − b + b·len/avg_len))` — rewards rare terms (IDF), saturates repeated terms (k1 ≈ 1.2), normalizes by length (b ≈ 0.75). Engines: Elasticsearch/OpenSearch, Lucene, Postgres full-text, Tantivy.
- **Dense:** embed query and chunks; cosine/dot-product similarity; ANN index ([section 13](#13-vector-indexes-approximate-nearest-neighbors-hnsw-and-ivf)).
- **Weaknesses:** sparse misses synonyms/paraphrases and other languages; dense misses exact IDs, rare terms, and new jargon.
- **Hybrid fusion:** **RRF** score = Σ 1 / (k + rank) with k ≈ 60 (rank-based, no score calibration needed), or a weighted sum of normalized scores. Most vector DBs support hybrid natively (Weaviate, Qdrant, Elasticsearch, OpenSearch, pgvector + full-text).
- Learned sparse models (SPLADE) sit in between.

#### Modern C++ example — BM25 and a toy dense similarity on the same query, fused with Reciprocal Rank Fusion
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <cmath>
#include <iomanip>
#include <iostream>
#include <map>
#include <sstream>
#include <string>
#include <vector>

std::vector<std::string> tok(const std::string& s) { std::istringstream in(s); std::vector<std::string> v; std::string t; while (in >> t) v.push_back(t); return v; }

int main() {
    std::vector<std::string> docs{"error E4012 means the payment gateway timed out",
                                  "my parcel never arrived and delivery was not received",
                                  "payment failed please retry the payment later",
                                  "track your delivery status from the orders page"};
    std::string query = "delivery not received error E4012";
    // BM25
    double avg = 0; for (auto& d : docs) avg += tok(d).size(); avg /= docs.size();
    const double k1 = 1.2, b = 0.75, N = docs.size();
    std::vector<double> bm25(docs.size(), 0);
    for (auto& term : tok(query)) {
        int df = 0; for (auto& d : docs) { auto t = tok(d); df += std::count(t.begin(), t.end(), term) > 0; }
        if (!df) continue;
        double idf = std::log(1 + (N - df + 0.5) / (df + 0.5));
        for (std::size_t i = 0; i < docs.size(); ++i) {
            auto t = tok(docs[i]); double tf = std::count(t.begin(), t.end(), term);
            bm25[i] += idf * tf * (k1 + 1) / (tf + k1 * (1 - b + b * t.size() / avg));
        }
    }
    std::vector<double> dense{0.41, 0.83, 0.37, 0.62};          // cosine(query, doc) from an embedding model (illustrative)
    auto ranks = [](const std::vector<double>& s) { std::vector<int> idx(s.size()); for (std::size_t i = 0; i < s.size(); ++i) idx[i] = i;
                                                    std::sort(idx.begin(), idx.end(), [&](int a, int b) { return s[a] > s[b]; }); return idx; };
    auto rb = ranks(bm25), rd = ranks(dense);
    std::map<int, double> rrf;
    for (int r = 0; r < int(docs.size()); ++r) { rrf[rb[r]] += 1.0 / (60 + r + 1); rrf[rd[r]] += 1.0 / (60 + r + 1); }
    std::cout << std::fixed << std::setprecision(3);
    for (std::size_t i = 0; i < docs.size(); ++i) std::cout << "doc" << i << " bm25=" << bm25[i] << " dense=" << dense[i] << " rrf=" << rrf[i] << "  " << docs[i] << '\n';
    std::cout << "top by BM25: doc" << rb[0] << ", top by dense: doc" << rd[0] << ", hybrid top-2: doc" << ranks({rrf[0], rrf[1], rrf[2], rrf[3]})[0] << ", doc" << ranks({rrf[0], rrf[1], rrf[2], rrf[3]})[1] << '\n';
}
```

**Output:**
```text
doc0 bm25=2.408 dense=0.410 rrf=0.032  error E4012 means the payment gateway timed out
doc1 bm25=2.950 dense=0.830 rrf=0.033  my parcel never arrived and delivery was not received
doc2 bm25=0.000 dense=0.370 rrf=0.031  payment failed please retry the payment later
doc3 bm25=0.693 dense=0.620 rrf=0.032  track your delivery status from the orders page
top by BM25: doc1, top by dense: doc1, hybrid top-2: doc1, doc0
```

BM25 scores doc0 only because of the rare code **E4012** (high IDF) and doc1 on the literal words "delivery … not received"; dense retrieval adds meaning (doc3 "track your delivery" scores well without the exact phrase). The fused top-2 covers **both** intents in the query — the delivery complaint and the error code.

### Interview answer
"Sparse retrieval like BM25 scores exact term matches weighted by rarity, with term-frequency saturation and length normalization; it's excellent for names, product codes and error IDs but misses paraphrases. Dense retrieval embeds query and chunks and matches meaning, handling synonyms and even other languages, but can miss exact identifiers and rare jargon. Hybrid search runs both and fuses them, typically with Reciprocal Rank Fusion, which only needs ranks, and it usually outperforms either alone — then a reranker orders the fused candidates."

---

## 4. Embeddings: similarity metrics, dimension, and model selection

**In one sentence:** an **embedding model** maps text to a fixed-length vector so that similar meanings are close; you compare vectors with **cosine similarity** (or dot product on normalized vectors, or Euclidean distance), choose a **dimension** that balances quality vs. storage/speed, and select the model by **retrieval quality on your data**, languages, max input length, cost and hosting.

### In plain words
Every sentence gets GPS coordinates in a "meaning map". "Refund my money" and "I want my payment back" land in the same neighbourhood; "weather in Cairo" is in another city.

### How it works
- **Metrics:** cosine = `a·b / (|a||b|)` (direction only); dot product (equals cosine if vectors are normalized — most models normalize); Euclidean (L2) distance. **Use what the model was trained for** and keep it consistent with the index.
- **Dimension:** typical 384–3,072. Bigger = often better quality but more memory (`N × d × 4 bytes` for float32) and slower search. **Matryoshka** models let you truncate dimensions; **quantization** (int8, binary, product quantization) shrinks storage.
- **Selection criteria:** retrieval quality on *your* eval (MTEB leaderboard is a starting point only), multilingual support (e.g. Arabic + English), max tokens per input, latency/cost, hosted vs. open (e.g. OpenAI text-embedding-3, Cohere Embed, Voyage, Google, BGE/E5/GTE/Nomic open models).
- **Practicalities:** the same model must embed queries and documents (some use query/document prefixes or separate modes); changing models means **re-embedding everything** (plan a versioned index); domain fine-tuning of embeddings can help.

#### Modern C++ example — cosine vs. dot product vs. L2, normalization, and memory cost by dimension
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cmath>
#include <iomanip>
#include <iostream>
#include <vector>

using Vec = std::vector<double>;
double dot(const Vec& a, const Vec& b) { double s = 0; for (std::size_t i = 0; i < a.size(); ++i) s += a[i] * b[i]; return s; }
double norm(const Vec& a) { return std::sqrt(dot(a, a)); }
double cosine(const Vec& a, const Vec& b) { return dot(a, b) / (norm(a) * norm(b)); }
double l2(const Vec& a, const Vec& b) { double s = 0; for (std::size_t i = 0; i < a.size(); ++i) s += (a[i] - b[i]) * (a[i] - b[i]); return std::sqrt(s); }
Vec normalize(Vec a) { double n = norm(a); for (auto& x : a) x /= n; return a; }

int main() {
    Vec refund{0.9, 0.1, 0.2}, payment_back{1.8, 0.3, 0.35}, weather{0.1, 0.9, 0.3};    // payment_back = same direction, longer
    std::cout << std::fixed << std::setprecision(3);
    std::cout << "cosine(refund, payment_back) = " << cosine(refund, payment_back) << "   cosine(refund, weather) = " << cosine(refund, weather) << '\n';
    std::cout << "dot raw      = " << dot(refund, payment_back) << " vs " << dot(refund, weather) << "  (length affects raw dot)\n";
    std::cout << "dot normalized = " << dot(normalize(refund), normalize(payment_back)) << "  (== cosine)\n";
    std::cout << "L2(refund, payment_back) = " << l2(refund, payment_back) << "  (large: L2 is sensitive to length unless normalized)\n";

    const double n_chunks = 10'000'000;
    for (int d : {384, 1024, 3072}) {
        double gb_f32 = n_chunks * d * 4 / 1e9, gb_int8 = n_chunks * d / 1e9;
        std::cout << std::setprecision(1) << "dim " << d << ": " << gb_f32 << " GB float32, " << gb_int8 << " GB int8 for 10M chunks\n" << std::setprecision(3);
    }
}
```

**Output:**
```text
cosine(refund, payment_back) = 0.998   cosine(refund, weather) = 0.271
dot raw      = 1.720 vs 0.240  (length affects raw dot)
dot normalized = 0.998  (== cosine)
L2(refund, payment_back) = 0.934  (large: L2 is sensitive to length unless normalized)
dim 384: 15.4 GB float32, 3.8 GB int8 for 10M chunks
dim 1024: 41.0 GB float32, 10.2 GB int8 for 10M chunks
dim 3072: 122.9 GB float32, 30.7 GB int8 for 10M chunks
```

### Interview answer
"Embedding models turn text into vectors where semantic similarity becomes geometric closeness. I compare with cosine similarity, or dot product on normalized vectors — which is the same thing — and use whatever metric the model was trained for, consistently with the index. Dimension trades quality against memory and speed: 10 million chunks at 1,024 float32 dimensions is about 40 GB, so quantization or Matryoshka truncation can matter. I choose the model by retrieval metrics on our own labelled queries, plus language coverage like Arabic and English, input length, cost and hosting, and version the index because switching models means re-embedding everything."

---

## 5. Grounded responses, source citations, and abstention when evidence is missing

**In one sentence:** instruct the model to **answer only from the provided sources**, **cite** the source ID for each claim, and **abstain** ("I couldn't find this in the documents") when evidence is missing or weak — then **verify** citations in code and gate on retrieval confidence before even calling the model.

### In plain words
An honest research assistant: every sentence has a footnote you can check, and when the library doesn't have the answer they say so instead of guessing.

### How it works
- **Prompt:** numbered sources (`[S1] … [S2] …`) with titles/URLs; rules: use only these sources, cite `[S#]` after each claim, say you don't know if they're insufficient, don't use outside knowledge.
- **Retrieval-confidence gate:** if the top reranker score is below a threshold → abstain or ask a clarifying question without generating.
- **Citation verification:** each cited source exists and supports the sentence (string overlap, NLI, or judge); drop or flag unsupported sentences.
- **Structured output:** `{answer, citations: [{source_id, quote}], confidence}` makes verification easy; quotes let users check quickly.
- **UX:** show sources as links with highlighted passages; distinguish "not found" from "error".
- Measure abstention on unanswerable questions ([answer evaluation](#1-answer-evaluation-faithfulness-factual-correctness-and-relevance)).

#### Modern C++ example — gate on retrieval score, build a cited answer, and verify each citation's quote exists in its source
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Hit { std::string id, text; double score; };
struct Citation { std::string sentence, source_id, quote; };

std::string answer(const std::string& q, const std::vector<Hit>& hits, const std::vector<Citation>& model_output) {
    if (hits.empty() || hits[0].score < 0.5) return "Q: " + q + "\nA: I couldn't find this in the knowledge base. (top score too low -> abstained, model not called)\n";
    std::map<std::string, std::string> by_id; for (auto& h : hits) by_id[h.id] = h.text;
    std::string out = "Q: " + q + "\nA:";
    for (auto& c : model_output) {
        auto it = by_id.find(c.source_id);
        bool ok = it != by_id.end() && it->second.find(c.quote) != std::string::npos;
        out += ok ? " " + c.sentence + " [" + c.source_id + "]" : " (removed unsupported sentence citing " + c.source_id + ")";
    }
    return out + "\n";
}

int main() {
    std::vector<Hit> hits{{"S1", "Refunds are paid to the original card within 14 days.", 0.86}, {"S2", "Returns are accepted for 30 days.", 0.71}};
    std::vector<Citation> out{{"Refunds go back to your original card within 14 days.", "S1", "within 14 days"},
                              {"You have 30 days to return an item.", "S2", "30 days"},
                              {"Express refunds take 24 hours.", "S2", "24 hours"}};
    std::cout << answer("How do refunds work?", hits, out);
    std::cout << answer("What is the CEO's salary?", {{"S9", "Our team is based in Cairo.", 0.21}}, {});
}
```

**Output:**
```text
Q: How do refunds work?
A: Refunds go back to your original card within 14 days. [S1] You have 30 days to return an item. [S2] (removed unsupported sentence citing S2)
Q: What is the CEO's salary?
A: I couldn't find this in the knowledge base. (top score too low -> abstained, model not called)
```

### Interview answer
"I give the model numbered sources and instruct it to answer only from them, cite a source ID — ideally with a supporting quote — for each claim, and say it doesn't know when the sources are insufficient. Before generating, I gate on retrieval confidence: if the best reranked score is too low I abstain or ask a clarifying question. After generating, I verify citations in code — the source exists and the quote or claim is supported — and remove or flag unsupported sentences. The UI shows the cited passages, and the eval set includes unanswerable questions so abstention is measured, not hoped for."

---

## 6. Ingestion pipelines: parsing, cleaning, deduplication, and metadata

**In one sentence:** the ingestion pipeline turns raw sources (PDFs, HTML, Office docs, wikis, tickets, databases) into clean, deduplicated, metadata-rich chunks: **connect → parse (incl. tables/OCR) → clean → dedupe → chunk → enrich with metadata → embed → index**, running **incrementally** on changes, with the same care as any data pipeline.

### In plain words
Before books go on the library shelves you remove duplicate copies, tear out the ads, fix smudged pages, and put a label on each spine (author, date, section, who may borrow it). Bad shelving = nobody finds anything.

### How it works
| Stage | Details |
|---|---|
| **Connect** | connectors to S3, SharePoint, Confluence, Google Drive, Git, databases; capture source ID, URL, permissions, modified time |
| **Parse** | PDF/Office/HTML → text + structure (headings, lists, tables); OCR for scans; layout-aware parsers (Unstructured, Docling, Textract, Document AI) |
| **Clean** | remove boilerplate (nav bars, footers, cookie banners), fix encoding/whitespace, normalize Unicode, strip hidden text |
| **Deduplicate** | exact (content hash) and near-duplicate (MinHash/SimHash, embedding similarity) — duplicates waste top-k slots |
| **Metadata** | doc ID, title, section path, page, language, created/updated time, author, product/version, tenant, **ACLs** |
| **Index** | chunk, embed, upsert by stable chunk IDs; delete chunks of removed docs ([section 12](#12-vector-databases-and-indexing--update--deletion-strategies)) |

- **Incremental:** change detection by modified time / content hash; event-driven (webhooks, queues) for freshness.
- **Quality checks:** empty or garbled text rates, parse failures, chunk length distribution; DLQ for failures ([data pipelines](../Data%20Engineering%20%26%20Analytics/Data-Pipelines-and-Processing.md)).
- **Security:** scan for PII/secrets, carry ACLs end-to-end, treat documents as potentially containing injections.

#### Modern C++ example — clean, deduplicate by normalized content hash, attach metadata, and skip unchanged documents
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cctype>
#include <functional>
#include <iostream>
#include <map>
#include <regex>
#include <set>
#include <string>
#include <vector>

struct RawDoc { std::string id, source, html, modified; std::vector<std::string> acl; };

std::string clean(const std::string& html) {
    std::string t = std::regex_replace(html, std::regex(R"(<(nav|footer)[\s\S]*?</\1>)"), "");    // boilerplate
    t = std::regex_replace(t, std::regex(R"(<[^>]+>)"), " ");
    return std::regex_replace(std::regex_replace(t, std::regex(R"(\s+)"), " "), std::regex(R"(^ | $)"), "");
}
std::size_t content_hash(std::string s) { for (auto& c : s) c = std::tolower(static_cast<unsigned char>(c)); return std::hash<std::string>{}(s); }

int main() {
    std::map<std::string, std::string> last_indexed{{"kb-3", "2026-10-01"}};          // doc id -> modified time already indexed
    std::vector<RawDoc> batch{
        {"kb-1", "confluence", "<nav>Home | Docs</nav><h1>Refunds</h1><p>Refunds take 14 days.</p><footer>(c) NileShop</footer>", "2026-10-15", {"group:support"}},
        {"kb-2", "gdrive", "<h1>REFUNDS</h1>  <p>Refunds take 14 days.</p>", "2026-10-16", {"group:support"}},
        {"kb-3", "confluence", "<h1>Shipping</h1><p>2-5 days.</p>", "2026-10-01", {"group:all"}},
        {"kb-4", "sharepoint", "<h1>Salaries</h1><p>Band table...</p>", "2026-10-16", {"group:hr"}},
    };
    std::set<std::size_t> seen;
    for (auto& d : batch) {
        if (last_indexed.count(d.id) && last_indexed[d.id] == d.modified) { std::cout << d.id << ": unchanged, skip\n"; continue; }
        auto text = clean(d.html);
        auto h = content_hash(text);
        if (!seen.insert(h).second) { std::cout << d.id << ": near-duplicate of an earlier doc, skip\n"; continue; }
        std::cout << d.id << ": index \"" << text << "\" {source:" << d.source << ", modified:" << d.modified << ", acl:" << d.acl[0] << "}\n";
    }
}
```

**Output:**
```text
kb-1: index "Refunds Refunds take 14 days." {source:confluence, modified:2026-10-15, acl:group:support}
kb-2: near-duplicate of an earlier doc, skip
kb-3: unchanged, skip
kb-4: index "Salaries Band table..." {source:sharepoint, modified:2026-10-16, acl:group:hr}
```

### Interview answer
"Ingestion is a data pipeline: connectors pull from sources with IDs, URLs, permissions and modified times; layout-aware parsers extract text, headings and tables, with OCR for scans; cleaning removes boilerplate and normalizes text; exact and near-duplicate detection keeps duplicates from wasting top-k slots; and every chunk gets metadata — document, section, page, timestamps, language, tenant and ACLs — before embedding and upserting with stable IDs. It runs incrementally on changes, deletes chunks for removed documents, monitors parse quality with a dead-letter queue for failures, and scans for PII and secrets."

---

## 7. Multi-tenant retrieval, ACL-aware filtering, and data freshness

**In one sentence:** in a shared RAG system every query must be **filtered by tenant and by the user's document permissions inside the retrieval query** (pre-filtering, not after generation), ACLs and content must be kept **fresh** as documents and permissions change, and answers should prefer **recent, valid** sources.

### In plain words
A shared office printer room: everyone can use the printer, but you can only pick up *your* company's documents, and only the ones you're cleared to read — and yesterday's revoked access must stop working today.

### How it works
- **Tenant isolation options:** separate index/collection per tenant (strong isolation, simpler deletion, more overhead) vs. shared index with a mandatory `tenant_id` filter (efficient; must never be forgotten — enforce in the data-access layer, not the prompt) ([tenant isolation](./Security-Privacy-and-Safety.md#9-tenant-isolation-and-permission-aware-retrieval)).
- **ACL-aware filtering:** store allowed users/groups per chunk; filter at query time with the **caller's identity** (from auth, never from the model). **Pre-filter** in the vector DB; post-filtering after top-k can return too few results and is risky.
- **Permission freshness:** sync ACL changes quickly (events from the source system), or check permissions live against the source for top results ("late binding").
- **Content freshness:** incremental ingestion, `updated_at` metadata, recency boosting, expiry for time-bound docs (prices, policies), show "last updated" in answers.
- **Caches** must be keyed by tenant and permission set too ([cache strategies](./Production-Reliability-and-Observability.md#1-cache-strategies-prompt-response-embedding-and-retrieval-caching)).

#### Modern C++ example — pre-filter by tenant and ACL groups, then boost fresh documents
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <cmath>
#include <iomanip>
#include <iostream>
#include <set>
#include <string>
#include <vector>

struct Chunk { std::string id, tenant; std::set<std::string> groups; double similarity; int age_days; };
struct Caller { std::string user, tenant; std::set<std::string> groups; };                 // from the auth token, not the model

int main() {
    std::vector<Chunk> index{{"acme/pricing-2026", "acme", {"sales"}, 0.82, 10}, {"acme/pricing-2024", "acme", {"sales"}, 0.85, 700},
                             {"acme/salaries", "acme", {"hr"}, 0.90, 30}, {"globex/pricing", "globex", {"sales"}, 0.95, 5},
                             {"acme/faq", "acme", {"all"}, 0.60, 90}};
    Caller c{"omar", "acme", {"sales", "all"}};
    std::vector<std::pair<double, std::string>> results;
    for (auto& ch : index) {
        if (ch.tenant != c.tenant) continue;                                                  // tenant filter in the query
        bool allowed = std::any_of(ch.groups.begin(), ch.groups.end(), [&](auto& g) { return c.groups.count(g); });
        if (!allowed) continue;                                                               // ACL pre-filter
        double freshness = std::exp(-ch.age_days / 365.0);                                    // decay over ~a year
        results.push_back({0.8 * ch.similarity + 0.2 * freshness, ch.id});
    }
    std::sort(results.rbegin(), results.rend());
    std::cout << std::fixed << std::setprecision(3) << "results for " << c.user << "@" << c.tenant << ":\n";
    for (auto& [s, id] : results) std::cout << "  " << id << " score=" << s << '\n';
    std::cout << "never visible: globex/pricing (other tenant), acme/salaries (hr only)\n";
}
```

**Output:**
```text
results for omar@acme:
  acme/pricing-2026 score=0.851
  acme/pricing-2024 score=0.709
  acme/faq score=0.636
never visible: globex/pricing (other tenant), acme/salaries (hr only)
```

The 2026 price list now outranks the slightly more similar but two-year-old one.

### Interview answer
"Every retrieval runs with the caller's identity from authentication — never from model output — and applies tenant and ACL filters inside the vector query as pre-filters, so unauthorized chunks are never candidates. I choose between per-tenant indexes for strong isolation and easy deletion, or a shared index with a mandatory tenant filter enforced in the data-access layer. ACL and content changes sync via events, with live permission checks on top results for sensitive sources; freshness comes from incremental ingestion, updated-at metadata, recency boosting and expiry of time-bound documents. Caches are keyed by tenant and permissions too."

---

## 8. Query rewriting, expansion, routing, and decomposition

**In one sentence:** users' raw questions are often vague, conversational or multi-part, so before retrieval you can **rewrite** them (resolve "it"/"that" from chat history, fix typos), **expand** them (synonyms, multiple paraphrases, HyDE), **route** them to the right index or tool, and **decompose** complex questions into sub-questions retrieved separately.

### In plain words
A good librarian first figures out what you actually mean ("the blue one we talked about" → "the 2026 pricing PDF"), tries a few different search terms, knows which room to look in, and splits "compare A and B" into two separate lookups.

### How it works
| Technique | Example |
|---|---|
| **Conversational rewrite** | history "Tell me about the Pro plan" + "how much is it?" → "Price of the Pro plan" |
| **Expansion / multi-query** | generate 3 paraphrases, retrieve for each, fuse with RRF |
| **HyDE** | generate a hypothetical answer, embed *it* to search (helps short queries) |
| **Routing** | classifier or LLM decides: product docs index vs. HR policies vs. SQL tool vs. no retrieval |
| **Decomposition** | "Compare refund policies of Egypt and UAE" → two sub-queries → combine |
| **Step-back** | ask a more general question first to fetch background |

- Costs an extra (small, fast) model call — cache rewrites; evaluate whether it improves recall ([section 11](#11-retrieval-evaluation-recallk-precisionk-mrr-and-ndcg)).
- Keep the **original query** too (in fusion and in the final prompt) so rewriting can't drift.

#### Modern C++ example — rewrite with history, route by keywords, and decompose a comparison question
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

std::string rewrite(const std::string& q, const std::string& last_topic) {          // stand-in for a small rewrite model
    std::string out = q;
    if (auto p = out.find(" it"); p != std::string::npos) out.replace(p, 3, " the " + last_topic);
    return out;
}
std::string route(const std::string& q) {
    if (q.find("salary") != std::string::npos || q.find("leave") != std::string::npos) return "hr_policies_index";
    if (q.find("how many") != std::string::npos || q.find("revenue") != std::string::npos) return "sql_analytics_tool";
    return "product_docs_index";
}
std::vector<std::string> decompose(const std::string& q) {
    auto p = q.find(" vs ");
    if (p == std::string::npos) return {q};
    std::string topic = "refund policy in ";
    return {topic + q.substr(q.find("in ") + 3, p - q.find("in ") - 3), topic + q.substr(p + 4)};
}

int main() {
    std::string q1 = rewrite("how much does it cost per month?", "Pro plan");
    std::cout << "rewrite: " << q1 << " -> route: " << route(q1) << '\n';
    std::cout << "route: \"how many orders were refunded last week?\" -> " << route("how many orders were refunded last week?") << '\n';
    std::cout << "route: \"annual leave days for new staff\" -> " << route("annual leave days for new staff") << '\n';
    for (auto& sub : decompose("refund policy in Egypt vs UAE")) std::cout << "sub-query: " << sub << " -> " << route(sub) << '\n';
}
```

**Output:**
```text
rewrite: how much does the Pro plan cost per month? -> route: product_docs_index
route: "how many orders were refunded last week?" -> sql_analytics_tool
route: "annual leave days for new staff" -> hr_policies_index
sub-query: refund policy in Egypt -> product_docs_index
sub-query: refund policy in UAE -> product_docs_index
```

### Interview answer
"Raw user queries are often conversational or underspecified, so I add a query-understanding step: a small model rewrites follow-ups into standalone questions using chat history; expansion generates paraphrases or a hypothetical answer, HyDE-style, and fuses results; a router picks the right index, a SQL tool, or no retrieval; and complex or comparative questions are decomposed into sub-queries retrieved separately and then combined. I keep the original query in the mix to avoid drift, cache rewrites, and keep each technique only if it improves recall on the eval set."

---

## 9. RAG vs. long-context prompting vs. fine-tuning: when to use which

**In one sentence:** use **RAG** for large, changing or permissioned knowledge needing citations; **long-context prompting** (paste the whole document) for a **small, static corpus or a single long document** where simplicity matters; and **fine-tuning** for **behaviour** (format, style, narrow skills), not for facts — and combine them when needed.

### In plain words
- RAG: a librarian who fetches the right pages from a huge library.
- Long context: handing someone the entire (short) book.
- Fine-tuning: training the person's habits — not stuffing new facts into their memory.

### How it works
| | RAG | Long context | Fine-tuning |
|---|---|---|---|
| Corpus size | unlimited | up to the window (~100K–1M+ tokens) | n/a (learned) |
| Freshness | re-index in minutes | always current (send latest doc) | stale until retrained |
| Per-request cost | low (few chunks) | high (all tokens every time; prompt caching helps) | low at inference |
| Citations / ACLs | ✅ per chunk | ⚠️ coarse | ❌ |
| Quality risks | retrieval misses | "lost in the middle", distraction | hallucinated "facts", forgetting |
| Complexity | pipeline + index + evals | lowest | data + training + evals |

**Rules of thumb:** a single 50-page contract → long context; a 2M-document knowledge base with permissions → RAG; consistent JSON extraction from a narrow domain at scale → fine-tune a small model (perhaps with RAG for reference data). Also see [Prompting vs. RAG vs. fine-tuning](./LLM-and-Generative-AI-Fundamentals.md#6-prompting-vs-rag-vs-fine-tuning-decision-criteria-and-trade-offs).

#### Modern C++ example — per-request cost of long context vs. RAG for different corpus sizes, with a fit check
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iomanip>
#include <iostream>

int main() {
    const double price_per_m_input = 3.0, cached_discount = 0.1;     // cached input billed at 10% (illustrative)
    const int window = 200'000, rag_tokens = 4'000;                    // RAG sends ~8 chunks of 500 tokens
    std::cout << std::fixed << std::setprecision(4);
    for (int corpus : {30'000, 150'000, 5'000'000}) {
        bool fits = corpus + 2'000 <= window;
        double rag = rag_tokens / 1e6 * price_per_m_input;
        std::cout << corpus << " tokens corpus: RAG $" << rag << "/req";
        if (fits) {
            double lc = corpus / 1e6 * price_per_m_input, lc_cached = lc * cached_discount;
            std::cout << ", long-context $" << lc << "/req ($" << lc_cached << " with prompt caching)";
            std::cout << (corpus <= 50'000 ? " -> long context is simplest" : " -> RAG cheaper; long context ok for low volume");
        } else std::cout << ", long-context: does not fit -> RAG";
        std::cout << '\n';
    }
}
```

**Output:**
```text
30000 tokens corpus: RAG $0.0120/req, long-context $0.0900/req ($0.0090 with prompt caching) -> long context is simplest
150000 tokens corpus: RAG $0.0120/req, long-context $0.4500/req ($0.0450 with prompt caching) -> RAG cheaper; long context ok for low volume
5000000 tokens corpus: RAG $0.0120/req, long-context: does not fit -> RAG
```

### Interview answer
"RAG is for large, frequently changing or permissioned knowledge where we need citations — updating means re-indexing, and each request only pays for a few chunks. Long-context prompting is the simplest option when the corpus is small and fairly static, or the task is about one long document; it avoids retrieval misses but costs more per request, though prompt caching helps, and accuracy can drop for facts buried in the middle. Fine-tuning changes behaviour — format, tone, a narrow skill or a cheaper model — and is the wrong tool for facts. They combine: a fine-tuned small model can still use RAG for reference data."

---

## 10. Reranking, contextual compression, and top-k selection

**In one sentence:** retrieve a **generous candidate set** cheaply (e.g. top 50 from hybrid search), **rerank** it with a more accurate **cross-encoder** (scores query + passage together), keep the **top-k** that actually help (often 3–10, or by score threshold), and optionally **compress** them (extract only the relevant sentences) to save tokens and reduce distraction.

### In plain words
A quick first sweep pulls 50 maybe-relevant files off the shelf; then an expert reads each one carefully with your question in mind and hands you the best five, with the important paragraphs highlighted.

### How it works
- **Bi-encoder (retrieval):** query and documents embedded **separately** → fast, indexable, less precise.
- **Cross-encoder (reranker):** model reads **(query, passage) together** → much better relevance, too slow for millions of docs but fine for ~50–200 candidates. Options: Cohere Rerank, Voyage rerank, BGE-reranker, ms-marco cross-encoders, or an LLM as reranker.
- **Top-k selection:** fixed k, or **score threshold** + max k; ensure diversity (avoid 5 near-identical chunks — MMR, maximal marginal relevance); order the final chunks (most relevant first or last).
- **Contextual compression:** extract only relevant sentences per chunk (LLM or extractive model), or merge adjacent chunks into one passage.
- Trade-off: reranking adds ~50–300 ms; measure recall@k/nDCG before and after ([section 11](#11-retrieval-evaluation-recallk-precisionk-mrr-and-ndcg)).

#### Modern C++ example — rerank candidates, apply a score threshold with MMR-style deduplication, and compress to relevant sentences
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iomanip>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

struct Cand { std::string id, text; double retrieval, rerank; };

std::string compress(const std::string& text, const std::string& keyword) {          // keep sentences mentioning the topic
    std::istringstream in(text); std::string s, out;
    while (std::getline(in, s, '.')) if (s.find(keyword) != std::string::npos) out += s + ".";
    return out;
}

int main() {
    std::vector<Cand> c{{"d7", "Our office is in Cairo. Refunds take 14 days. We love cats.", 0.71, 0.92},
                        {"d2", "Refunds take 14 days for card payments.", 0.80, 0.90},          // near-duplicate of d7's key fact
                        {"d9", "Shipping is free over 500 EGP.", 0.83, 0.20},
                        {"d4", "Cash on delivery refunds are paid as store credit.", 0.62, 0.81},
                        {"d5", "Careers: we are hiring engineers.", 0.60, 0.05}};
    std::sort(c.begin(), c.end(), [](auto& a, auto& b) { return a.rerank > b.rerank; });
    std::cout << std::fixed << std::setprecision(2) << "after rerank:";
    for (auto& x : c) std::cout << ' ' << x.id << '(' << x.rerank << ')';
    std::cout << "\nselected (rerank >= 0.5, max 3, skip near-duplicates):\n";
    std::vector<std::string> kept_facts; int k = 0;
    for (auto& x : c) {
        if (x.rerank < 0.5 || k == 3) break;
        auto comp = compress(x.text, "efund");
        bool dup = std::any_of(kept_facts.begin(), kept_facts.end(), [&](auto& f) { return comp.find("14 days") != std::string::npos && f.find("14 days") != std::string::npos; });
        if (dup) { std::cout << "  skip " << x.id << " (redundant)\n"; continue; }
        kept_facts.push_back(comp); ++k;
        std::cout << "  " << x.id << ": \"" << comp << "\" (compressed from " << x.text.size() << " to " << comp.size() << " chars)\n";
    }
}
```

**Output:**
```text
after rerank: d7(0.92) d2(0.90) d4(0.81) d9(0.20) d5(0.05)
selected (rerank >= 0.5, max 3, skip near-duplicates):
  d7: " Refunds take 14 days." (compressed from 59 to 22 chars)
  skip d2 (redundant)
  d4: "Cash on delivery refunds are paid as store credit." (compressed from 50 to 50 chars)
```

Note how **d9** ranked highest in first-stage retrieval but the reranker correctly pushed it down for a refund question.

### Interview answer
"First-stage retrieval with bi-encoders and BM25 is fast but imprecise, so I retrieve a generous candidate set — say 50 — and rerank with a cross-encoder that reads query and passage together, which is far more accurate and affordable on that small set. Then I select the final context by score threshold with a max k, removing near-duplicates with MMR so the slots carry diverse evidence, and optionally compress chunks to only the relevant sentences to save tokens and reduce distraction. I check the latency cost and measure recall and nDCG before and after to justify it."

---

## 11. Retrieval evaluation: recall@k, precision@k, MRR, and nDCG

**In one sentence:** with a labelled set of queries and their **relevant chunks**, measure **recall@k** (did we retrieve the relevant ones in the top k?), **precision@k** (how much of the top k is relevant?), **MRR** (how high is the *first* relevant result?), and **nDCG@k** (are the *most* relevant results ranked highest, with graded relevance?).

### In plain words
You ask the search engine 100 questions you already know the answers to, and check: did the right page show up in the first 5 results (recall), how much of the first page was junk (precision), how far did you scroll to the first good hit (MRR), and were the *best* pages at the very top (nDCG)?

### How it works
| Metric | Formula (per query, then averaged) | Use |
|---|---|---|
| **recall@k** | relevant ∩ top-k / total relevant | main RAG metric: if it's not retrieved, the model can't use it |
| **precision@k** | relevant ∩ top-k / k | noise in the context |
| **MRR** | 1 / rank of first relevant (0 if none) | single-answer lookups |
| **nDCG@k** | DCG = Σ rel_i / log2(i+1); divided by ideal DCG | graded relevance + rank order |
| **hit rate@k** | 1 if any relevant in top-k | simple sanity metric |

- **Build the set:** real user queries (from logs), labelled by experts or with LLM help + human review; include hard, ambiguous and unanswerable queries ([golden datasets](./Evaluation-and-Testing.md#4-golden-datasets-and-representative-real-world-test-cases)).
- Use it to tune chunk size, embedding model, hybrid weights, k, and reranking — and as a **regression test** on every change ([LLM and Agent Evaluation](../Testing%2C%20Reliability%20%26%20Observability/LLM-and-Agent-Evaluation.md#4-hallucination-grounding-task-success-and-retrieval-metrics)).

#### Modern C++ example — compute recall@k, precision@k, MRR and nDCG@k for a few labelled queries
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <cmath>
#include <iomanip>
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Query { std::vector<std::string> ranked; std::map<std::string, int> relevance; };   // graded: 2 = perfect, 1 = partial

int main() {
    std::vector<Query> qs{
        {{"d1", "d4", "d2", "d9", "d7"}, {{"d4", 2}, {"d2", 1}}},
        {{"d3", "d8", "d5", "d6", "d1"}, {{"d6", 2}}},
        {{"d2", "d7", "d3", "d4", "d5"}, {{"d11", 2}}},                    // relevant doc never retrieved
    };
    const int k = 5;
    double recall = 0, precision = 0, mrr = 0, ndcg = 0;
    for (auto& q : qs) {
        int hits = 0; double dcg = 0, rr = 0;
        for (int i = 0; i < k; ++i) {
            auto it = q.relevance.find(q.ranked[i]);
            if (it == q.relevance.end()) continue;
            ++hits; dcg += it->second / std::log2(i + 2);
            if (rr == 0) rr = 1.0 / (i + 1);
        }
        std::vector<int> ideal; for (auto& [d, r] : q.relevance) ideal.push_back(r);
        std::sort(ideal.rbegin(), ideal.rend());
        double idcg = 0; for (std::size_t i = 0; i < ideal.size() && i < std::size_t(k); ++i) idcg += ideal[i] / std::log2(i + 2);
        recall += double(hits) / q.relevance.size(); precision += double(hits) / k; mrr += rr; ndcg += dcg / idcg;
    }
    double n = qs.size();
    std::cout << std::fixed << std::setprecision(3) << "recall@5=" << recall / n << " precision@5=" << precision / n << " MRR=" << mrr / n << " nDCG@5=" << ndcg / n << '\n';
    std::cout << "query 3 has recall 0 -> inspect: missing from index? bad chunking? vocabulary mismatch (try hybrid)?\n";
}
```

**Output:**
```text
recall@5=0.667 precision@5=0.200 MRR=0.250 nDCG@5=0.367
query 3 has recall 0 -> inspect: missing from index? bad chunking? vocabulary mismatch (try hybrid)?
```

### Interview answer
"I build a labelled set of real queries with their relevant chunks, ideally graded, including hard and unanswerable cases. Recall@k is the key RAG metric — if the evidence isn't in the top k, generation can't use it; precision@k tells me how much noise I'm sending; MRR measures how high the first relevant hit is; and nDCG rewards putting the most relevant results first with graded relevance. I use these to tune chunking, embedding models, hybrid weights, k and reranking, run them as regression tests on every pipeline change, and inspect zero-recall queries to find indexing or vocabulary gaps."

---

## 12. Vector databases and indexing / update / deletion strategies

**In one sentence:** a **vector database** stores embeddings with IDs and **metadata**, builds ANN indexes for fast similarity search with **filters**, and must handle the full lifecycle: **upserts** by stable chunk IDs, **deletions** (tombstones + compaction), **re-indexing** when the embedding model changes (blue/green indexes), backups, and multi-tenancy.

### In plain words
A warehouse for "meaning coordinates": every item has a barcode (ID), a label (metadata), and a shelf position (vector). When products change you replace them by barcode; discontinued items get a "removed" sticker first and are physically cleared out during the weekly tidy-up.

### How it works
- **Options:** dedicated (Pinecone, Weaviate, Qdrant, Milvus/Zilliz, Chroma), extensions/engines (Postgres **pgvector**, Elasticsearch/OpenSearch k-NN, Redis, MongoDB Atlas Vector Search), cloud (Vertex AI Vector Search, Azure AI Search, Amazon OpenSearch / S3 Vectors). pgvector is a great default when you already run Postgres and have millions — not billions — of vectors.
- **Stable IDs:** `chunk_id = doc_id + chunk_index (+ content hash)`; **upsert** so re-ingesting a doc replaces its chunks; delete stale chunks when a doc shrinks.
- **Deletes:** usually soft (tombstone) and filtered at query time, then **compaction** rebuilds segments; required for GDPR "right to erasure" ([privacy-aware retention](./Memory-State-and-Context-Management.md#6-privacy-aware-memory-retention-and-data-minimization)).
- **Re-indexing:** new embedding model → build a **new index in parallel**, backfill, evaluate, switch an alias (blue/green), then drop the old one.
- **Filtering:** metadata filters (tenant, ACL, date) combined with ANN — check how your DB does it (pre-filter vs. filtered HNSW traversal).
- **Ops:** memory sizing, replicas for QPS, backups, monitoring recall/latency.

#### Modern C++ example — upsert by stable chunk IDs, tombstone deletes, compaction, and an alias switch for re-indexing
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <set>
#include <string>
#include <vector>

struct Record { std::vector<float> vec; std::string text; bool deleted = false; };

class Collection {
public:
    std::string name;
    std::map<std::string, Record> records;
    explicit Collection(std::string n) : name(std::move(n)) {}
    void upsert_document(const std::string& doc_id, const std::vector<std::string>& chunks) {
        for (auto& [id, r] : records) if (id.rfind(doc_id + "#", 0) == 0) r.deleted = true;     // old chunks of this doc
        for (std::size_t i = 0; i < chunks.size(); ++i) records[doc_id + "#" + std::to_string(i)] = {{0.1f * i}, chunks[i], false};
    }
    void delete_document(const std::string& doc_id) { for (auto& [id, r] : records) if (id.rfind(doc_id + "#", 0) == 0) r.deleted = true; }
    int live() const { int n = 0; for (auto& [id, r] : records) n += !r.deleted; return n; }
    int compact() { int removed = 0; for (auto it = records.begin(); it != records.end();) if (it->second.deleted) { it = records.erase(it); ++removed; } else ++it; return removed; }
};

int main() {
    Collection v1("kb_v1_embed-small");
    v1.upsert_document("refunds", {"Refunds take 14 days.", "Card refunds go to the card.", "Cash refunds are store credit."});
    v1.upsert_document("refunds", {"Refunds take 10 days.", "Card refunds go to the card."});    // doc edited, now 2 chunks
    v1.upsert_document("gdpr-user-77", {"Notes about user 77."});
    v1.delete_document("gdpr-user-77");                                                          // erasure request
    std::cout << v1.name << ": " << v1.records.size() << " stored, " << v1.live() << " live\n";
    std::cout << "compaction physically removed " << v1.compact() << " records\n";

    std::map<std::string, std::string> alias{{"kb_current", v1.name}};
    Collection v2("kb_v2_embed-large");
    v2.upsert_document("refunds", {"Refunds take 10 days.", "Card refunds go to the card."});    // backfill with the new model
    bool eval_passed = true;                                                                     // recall@5 0.86 -> 0.91 on the golden set
    if (eval_passed) alias["kb_current"] = v2.name;
    std::cout << "alias kb_current -> " << alias["kb_current"] << " (old index kept for rollback, then dropped)\n";
}
```

**Output:**
```text
kb_v1_embed-small: 4 stored, 2 live
compaction physically removed 2 records
alias kb_current -> kb_v2_embed-large (old index kept for rollback, then dropped)
```

Here re-upserting "refunds" overwrote `#0` and `#1` in place and tombstoned the now-extra `#2`, and the erased user note was tombstoned — compaction removed both.

### Interview answer
"A vector database stores embeddings with IDs and metadata and serves filtered approximate nearest-neighbour search; pgvector is a good default at millions of vectors if we already run Postgres, with dedicated engines like Qdrant, Weaviate, Milvus or Pinecone for larger scale or features. The lifecycle matters as much as search: stable chunk IDs derived from document ID and position so re-ingestion upserts and stale chunks get removed; deletes are tombstones filtered at query time, then compacted — which is also how we honour erasure requests; and changing the embedding model means building a new index in parallel, evaluating it and switching an alias, keeping the old one for rollback. Plus replicas, backups and recall and latency monitoring."

---

## 13. Vector indexes: approximate nearest neighbors, HNSW, and IVF

**In one sentence:** exact nearest-neighbour search compares the query with **every** vector (O(N·d)), so at scale we use **approximate nearest neighbour (ANN)** indexes that trade a little **recall** for huge speedups: **HNSW** (a multi-layer proximity graph you greedily walk) and **IVF** (cluster vectors with k-means and only search the closest clusters), often combined with **quantization** (PQ, int8) to save memory.

### In plain words
- **IVF:** to find the nearest café, first pick the 3 closest neighbourhoods, then check only cafés there.
- **HNSW:** like taking motorways to get near your destination, then main roads, then side streets — each level has fewer, longer-range links.

### How it works
| Index | Build | Query | Knobs | Notes |
|---|---|---|---|---|
| **Flat (exact)** | none | scan all | — | perfect recall; fine up to ~100K–1M vectors (or with GPUs) |
| **IVF** | k-means into `nlist` clusters, assign vectors | search `nprobe` nearest clusters | nlist, nprobe | fast build, low memory; recall depends on nprobe; IVF-PQ for billions |
| **HNSW** | insert nodes into layered graph, connect to M neighbours | greedy descent from the top layer, beam search (`ef_search`) at layer 0 | M, ef_construction, ef_search | best recall/latency trade-off; memory-heavy; incremental inserts; deletes are tricky |
| **PQ / quantization** | compress vectors into codes | approximate distances | bits, subvectors | 4–32× smaller, some recall loss; re-score top results with full vectors |

- **Measure recall@k vs. exact search** at your target latency; tune `ef_search` / `nprobe` upward until recall is acceptable.
- Libraries: FAISS, hnswlib, ScaNN, DiskANN (SSD-based for huge datasets); vector DBs wrap these.

#### Modern C++ example — exact search vs. an IVF index (k-means clusters + nprobe), measuring recall and work done
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <random>
#include <set>
#include <vector>

using Vec = std::vector<float>;
float dist2(const Vec& a, const Vec& b) { float s = 0; for (std::size_t i = 0; i < a.size(); ++i) s += (a[i] - b[i]) * (a[i] - b[i]); return s; }

int main() {
    std::mt19937 rng(7);
    std::normal_distribution<float> noise(0, 1);
    const int N = 4000, D = 16, K = 10, nlist = 40;
    std::vector<Vec> data(N, Vec(D));
    for (auto& v : data) { int c = rng() % 20; for (int d = 0; d < D; ++d) v[d] = c * 0.5f * ((d % 3) - 1) + noise(rng); }

    std::vector<Vec> centroids(data.begin(), data.begin() + nlist);           // k-means (a few iterations)
    std::vector<int> assign(N);
    for (int it = 0; it < 5; ++it) {
        for (int i = 0; i < N; ++i) { int best = 0; for (int c = 1; c < nlist; ++c) if (dist2(data[i], centroids[c]) < dist2(data[i], centroids[best])) best = c; assign[i] = best; }
        std::vector<Vec> sum(nlist, Vec(D, 0)); std::vector<int> cnt(nlist, 0);
        for (int i = 0; i < N; ++i) { ++cnt[assign[i]]; for (int d = 0; d < D; ++d) sum[assign[i]][d] += data[i][d]; }
        for (int c = 0; c < nlist; ++c) if (cnt[c]) for (int d = 0; d < D; ++d) centroids[c][d] = sum[c][d] / cnt[c];
    }
    std::vector<std::vector<int>> lists(nlist);
    for (int i = 0; i < N; ++i) lists[assign[i]].push_back(i);

    double total_recall[3] = {0, 0, 0}; long work[3] = {0, 0, 0};
    const int nprobes[3] = {1, 4, 10}, Q = 50;
    for (int q = 0; q < Q; ++q) {
        Vec query(D); for (auto& x : query) x = noise(rng) * 1.5f;
        std::vector<std::pair<float, int>> all; for (int i = 0; i < N; ++i) all.push_back({dist2(query, data[i]), i});
        std::partial_sort(all.begin(), all.begin() + K, all.end());
        std::set<int> truth; for (int i = 0; i < K; ++i) truth.insert(all[i].second);
        std::vector<std::pair<float, int>> cd; for (int c = 0; c < nlist; ++c) cd.push_back({dist2(query, centroids[c]), c});
        std::sort(cd.begin(), cd.end());
        for (int p = 0; p < 3; ++p) {
            std::vector<std::pair<float, int>> cand;
            for (int c = 0; c < nprobes[p]; ++c) for (int i : lists[cd[c].second]) cand.push_back({dist2(query, data[i]), i});
            work[p] += nlist + cand.size();
            std::sort(cand.begin(), cand.end());
            int hit = 0; for (int i = 0; i < K && i < int(cand.size()); ++i) hit += truth.count(cand[i].second);
            total_recall[p] += double(hit) / K;
        }
    }
    std::cout << "exact search: recall 1.00, " << N << " distance computations per query\n";
    for (int p = 0; p < 3; ++p)
        std::cout << "IVF nprobe=" << nprobes[p] << ": recall@" << K << " " << int(total_recall[p] / Q * 100 + 0.5) << "%, ~" << work[p] / Q << " distance computations per query\n";
}
```

**Output:**
```text
exact search: recall 1.00, 4000 distance computations per query
IVF nprobe=1: recall@10 66%, ~198 distance computations per query
IVF nprobe=4: recall@10 97%, ~537 distance computations per query
IVF nprobe=10: recall@10 100%, ~1095 distance computations per query
```

Raising `nprobe` buys recall with more work — the same dial as `ef_search` in HNSW.

### Interview answer
"Exact search compares the query with every vector, which is too slow at millions or billions, so we use approximate nearest-neighbour indexes. IVF clusters vectors with k-means and searches only the nprobe closest clusters — cheap to build and memory-friendly, often combined with product quantization for billions of vectors. HNSW builds a layered proximity graph and greedily descends from sparse long-range layers to a dense bottom layer, with ef_search controlling the beam — typically the best recall-latency trade-off but memory-hungry. I tune nprobe or ef_search by measuring recall@k against exact search at the target latency, and re-score quantized results with full vectors."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Answer eval | faithfulness (claims supported) · correctness (vs. reference) · relevance · citation accuracy · abstention |
| Chunking | structural/recursive default; 10–20% overlap; parent–child; keep tables/code whole; headers in chunks; tune on evals |
| Sparse vs. dense | BM25 = exact terms/IDs; embeddings = meaning; hybrid + RRF (Σ 1/(60+rank)) usually best |
| Embeddings | cosine / dot on normalized; dimension vs. memory (N·d·4 bytes); choose on your data; re-embed on model change |
| Grounding | numbered sources, cite per claim, abstain; retrieval-score gate; verify citations in code |
| Ingestion | connect → parse → clean → dedupe → chunk → metadata (incl. ACLs) → embed → upsert; incremental; DLQ |
| Multi-tenant | identity from auth; tenant + ACL **pre-filter** in the query; sync permission changes; freshness boost/expiry |
| Query understanding | rewrite follow-ups, expand/HyDE, route to index/tool, decompose; keep original query |
| RAG vs. alternatives | RAG = large/changing/permissioned + citations; long context = small static; fine-tune = behaviour |
| Rerank / top-k | retrieve ~50 → cross-encoder rerank → threshold + max k + MMR → compress |
| Retrieval metrics | recall@k (key), precision@k, MRR, nDCG@k; labelled real queries; regression-test changes |
| Vector DB lifecycle | stable chunk IDs, upsert, tombstone + compaction, blue/green re-index via alias, filters, backups |
| ANN indexes | flat (exact) · IVF (clusters, nprobe) · HNSW (graph, M/ef) · PQ (compress); tune vs. measured recall |
