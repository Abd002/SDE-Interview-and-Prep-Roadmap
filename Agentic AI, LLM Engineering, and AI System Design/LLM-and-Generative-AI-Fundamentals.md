# LLM and Generative AI Fundamentals — How Models Work, How They're Trained, and How to Choose and Use Them

> **What you'll learn:** how **transformers, attention, embeddings and autoregressive generation** work; what **tokens, context windows and output limits** are; how **inference parameters** (temperature, top-p, seed, stop sequences) change outputs; the training stages (**pretraining, instruction tuning, fine-tuning, alignment**); why models **hallucinate** and how **grounding** helps; **closed- vs. open-weight** models and **hosted vs. self-hosted** inference; how to **select a model**; and when to use **prompting vs. RAG vs. fine-tuning**. Each part has a runnable C++ example built on tiny, transparent toy models.
>
> **Prerequisites:** basic linear algebra (vectors, dot products) and [Complexity Analysis](../Problem-solving%20and%20Coding/Complexity-Analysis.md). Next: [Prompt Engineering and Structured Outputs](./Prompt-Engineering-and-Structured-Outputs.md).

## Table of Contents
1. [Closed-weight vs. open-weight models; hosted APIs vs. self-hosting](#1-closed-weight-vs-open-weight-models-hosted-apis-vs-self-hosting)
2. [Hallucinations, uncertainty, grounding, and model limitations](#2-hallucinations-uncertainty-grounding-and-model-limitations)
3. [Inference parameters: temperature, top-p, seed, and stop sequences](#3-inference-parameters-temperature-top-p-seed-and-stop-sequences)
4. [Model selection: capability, latency, context, cost, privacy, and deployment](#4-model-selection-capability-latency-context-cost-privacy-and-deployment)
5. [Pretraining vs. instruction tuning vs. fine-tuning vs. alignment](#5-pretraining-vs-instruction-tuning-vs-fine-tuning-vs-alignment)
6. [Prompting vs. RAG vs. fine-tuning: decision criteria and trade-offs](#6-prompting-vs-rag-vs-fine-tuning-decision-criteria-and-trade-offs)
7. [Tokens, tokenization, context windows, and output limits](#7-tokens-tokenization-context-windows-and-output-limits)
8. [Transformers, attention, embeddings, and autoregressive generation](#8-transformers-attention-embeddings-and-autoregressive-generation)
9. [Cheat sheet](#cheat-sheet)

Read **8 → 7 → 3 → 5** first if LLMs are new to you; the rest builds on them.

---

## 1. Closed-weight vs. open-weight models; hosted APIs vs. self-hosting

**In one sentence:** **closed-weight** models (e.g. Anthropic Claude, OpenAI GPT, Google Gemini) are only usable through the provider's **API**, while **open-weight** models (e.g. Meta Llama, Mistral, Qwen, Google Gemma, DeepSeek) publish their weights so you can **self-host** or fine-tune them — trading convenience and frontier capability against control, privacy and cost at scale.

### In plain words
Closed-weight is a restaurant: great food, no kitchen work, but you eat on their premises with their menu. Open-weight is a recipe book: you can cook it at home, change the recipe and keep everything private — but you buy the kitchen and do the cooking.

### How it works
| | Hosted API (closed or open models) | Self-hosted open-weight |
|---|---|---|
| Setup | API key, minutes | GPUs, serving stack (vLLM, TGI, SGLang, llama.cpp, Ollama), ops |
| Capability | typically the frontier models | strong and improving; smaller models need more care |
| Data | sent to the provider (check retention/training terms, regions, zero-data-retention options) | stays in your network |
| Cost | per token; great for spiky or low volume | per GPU-hour; can win at high, steady volume with good utilization |
| Latency / scale | provider handles it (rate limits apply) | you tune batching, quantization, caching |
| Customization | prompting, provider fine-tuning APIs | full fine-tuning, LoRA adapters, quantization, any decoding tweak |
| Lock-in | API differences (use an abstraction layer) | model licence terms (read them: some restrict commercial use or scale) |

- Middle grounds: open models through **managed APIs** (Amazon Bedrock, Google Vertex AI, Azure AI Foundry, Together, Groq), and private deployments of closed models inside your cloud account.
- "Open-weight" ≠ "open source": training data and code are usually not released; licences vary.

#### Modern C++ example — monthly cost of a hosted API vs. a self-hosted GPU deployment across volumes
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cmath>
#include <iomanip>
#include <iostream>

int main() {
    // Illustrative numbers: API $3 / 1M input tokens, $15 / 1M output tokens.
    // Self-hosted: one GPU node $2.50/hour serves ~1,500 tokens/s output at good batching; 2 nodes minimum for HA.
    const double in_price = 3.0 / 1e6, out_price = 15.0 / 1e6, gpu_hour = 2.50, node_tokens_per_s = 1500;
    std::cout << std::fixed << std::setprecision(0);
    for (double requests_per_day : {1'000.0, 50'000.0, 1'000'000.0}) {
        double in_tokens = requests_per_day * 30 * 1500, out_tokens = requests_per_day * 30 * 400;
        double api = in_tokens * in_price + out_tokens * out_price;
        double peak_out_per_s = out_tokens / (30 * 86400) * 3;                       // assume peak = 3x average
        double nodes = std::max(2.0, std::ceil(peak_out_per_s / node_tokens_per_s));
        double self = nodes * gpu_hour * 24 * 30 + 4000;                               // + ~$4k/month engineering/ops share
        std::cout << requests_per_day << " req/day: API ~$" << api << "/month, self-hosted ~$" << self << "/month (" << nodes << " GPU nodes) -> "
                  << (api < self ? "API" : "self-host") << '\n';
    }
}
```

**Output:**
```text
1000 req/day: API ~$315/month, self-hosted ~$7600/month (2 GPU nodes) -> API
50000 req/day: API ~$15750/month, self-hosted ~$7600/month (2 GPU nodes) -> self-host
1000000 req/day: API ~$315000/month, self-hosted ~$22000/month (10 GPU nodes) -> self-host
```

Real decisions also weigh quality differences (a smaller self-hosted model may need more tokens or fail more tasks), privacy rules and team expertise — cost alone is rarely the deciding factor.

### Interview answer
"Closed-weight models are available only through the provider's API — usually the most capable, with no infrastructure, but data leaves our network and we're bound to their pricing and limits. Open-weight models publish weights, so we can self-host with vLLM or TGI, keep data private, fine-tune and control decoding, at the cost of GPUs and operations; their licences vary. Hosted APIs win for low or spiky volume and fast iteration; self-hosting can win at high steady volume, strict data residency, or heavy customization. Managed hosting of open models is a middle ground, and I keep an abstraction layer to avoid lock-in."

---

## 2. Hallucinations, uncertainty, grounding, and model limitations

**In one sentence:** LLMs generate **plausible text, not verified facts**, so they can **hallucinate** (confident, wrong or invented content); you reduce it with **grounding** (give sources and require citations), **abstention** ("say I don't know"), **verification** (tools, checks, a second pass), and by knowing the **limits**: knowledge cutoff, weak arithmetic/precise counting, long-context recall, and sensitivity to prompt wording.

### In plain words
A very well-read person who never says "I don't know" — if you ask about a book they never read, they'll describe a believable plot. Hand them the actual book and ask them to quote page numbers, and they become reliable.

### How it works
**Why hallucinations happen:** the model predicts likely next tokens; training rewards fluent answers; missing or outdated knowledge (training cutoff); ambiguous prompts; long contexts where relevant facts get lost ("lost in the middle"); pressure to answer a question that has no answer in the context.

**Mitigations**
| Technique | How |
|---|---|
| **Grounding / RAG** | put retrieved sources in the prompt; instruct "answer only from the sources" ([RAG](./Retrieval-Augmented-Generation.md)) |
| **Citations** | require a source ID per claim; verify cited passages support the claim |
| **Abstention** | explicitly allow "I don't know / not in the documents"; reward it in evals |
| **Tools for facts** | calculators, code execution, database queries, search instead of memory |
| **Verification** | self-check or a second model/judge checking claims against sources; constrained outputs (schemas, enums) |
| **Uncertainty signals** | log-probabilities (where available), agreement across samples (self-consistency), retrieval scores |
| **Evaluation** | measure groundedness and hallucination rate continuously ([metrics](../Testing%2C%20Reliability%20%26%20Observability/LLM-and-Agent-Evaluation.md#4-hallucination-grounding-task-success-and-retrieval-metrics)) |

**Other limitations to design around:** knowledge cutoff (use retrieval for recent facts), non-determinism, character-level tasks (tokenization hides letters — see [section 7](#7-tokens-tokenization-context-windows-and-output-limits)), prompt sensitivity, bias inherited from data, and vulnerability to [prompt injection](../Security%20Engineering%20%26%20Authentication/LLM-and-Agent-Security.md#3-prompt-injection-vs-instruction-following-untrusted-retrieved-content).

#### Modern C++ example — self-consistency as an uncertainty signal, plus abstention when sources don't contain the answer
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <map>
#include <string>
#include <vector>

// Several sampled answers from the same (fake) model. Agreement ~ confidence.
std::pair<std::string, double> majority(const std::vector<std::string>& samples) {
    std::map<std::string, int> votes;
    for (auto& s : samples) ++votes[s];
    auto best = std::max_element(votes.begin(), votes.end(), [](auto& a, auto& b) { return a.second < b.second; });
    return {best->first, double(best->second) / samples.size()};
}

std::string grounded_answer(const std::string& question, const std::map<std::string, std::string>& sources) {
    for (auto& [id, text] : sources)
        if (question.find("refund window") != std::string::npos && text.find("refund") != std::string::npos)
            return text + " [" + id + "]";
    return "I can't find this in the provided documents.";          // abstain instead of guessing
}

int main() {
    auto [a1, c1] = majority({"14 days", "14 days", "14 days", "14 days", "30 days"});
    auto [a2, c2] = majority({"1987", "1991", "1989", "1987", "1993"});
    std::cout << "Q: refund window?      samples agree " << c1 * 100 << "% -> '" << a1 << "' (likely reliable)\n";
    std::cout << "Q: founding year?      samples agree " << c2 * 100 << "% -> '" << a2 << "' (LOW confidence: verify or abstain)\n";

    std::map<std::string, std::string> docs{{"policy-3", "Customers can request a refund within 14 days of delivery."}, {"faq-1", "Shipping takes 2-5 days."}};
    std::cout << "grounded: " << grounded_answer("What is the refund window?", docs) << '\n';
    std::cout << "grounded: " << grounded_answer("Who is the CEO?", docs) << '\n';
}
```

**Output:**
```text
Q: refund window?      samples agree 80% -> '14 days' (likely reliable)
Q: founding year?      samples agree 40% -> '1987' (LOW confidence: verify or abstain)
grounded: Customers can request a refund within 14 days of delivery. [policy-3]
grounded: I can't find this in the provided documents.
```

### Interview answer
"LLMs predict plausible tokens, so they can produce confident falsehoods, especially for missing or recent knowledge, ambiguous questions, and facts buried in long contexts. I reduce hallucinations by grounding answers in retrieved sources with required citations that I verify, explicitly allowing and rewarding abstention, using tools for facts and math, and adding verification steps or judges. Uncertainty can be estimated from agreement across samples, log-probs or retrieval scores. And I measure groundedness and hallucination rates continuously instead of trusting spot checks."

---

## 3. Inference parameters: temperature, top-p, seed, and stop sequences

**In one sentence:** at each step the model outputs **probabilities over the vocabulary**; **temperature** sharpens or flattens them, **top-p (nucleus sampling)** keeps only the smallest set of tokens whose probabilities add up to p, **top-k** keeps the k most likely, a **seed** makes sampling repeatable (where supported), **stop sequences** end generation at chosen strings, and **max tokens** caps output length.

### In plain words
Choosing the next word is like drawing from a bag of word tiles where common words have more tiles. Low temperature: you almost always pick the most common word (predictable). High temperature: rare words get more tiles (creative, risky). Top-p: throw away the rarest tiles before drawing.

### How it works
- **Logits → softmax:** `p_i = exp(z_i / T) / Σ exp(z_j / T)`. T → 0 ≈ **greedy** (argmax); T = 1 = model's distribution; T > 1 flatter.
- **Top-p = 0.9:** sort tokens by probability, keep the top until cumulative ≥ 0.9, renormalize, sample.
- **Top-k:** keep the k most likely tokens.
- **Seed:** fixes the random generator for **best-effort** reproducibility (batching, hardware and provider updates can still change outputs).
- **Stop sequences:** e.g. `"\n\nUser:"`, `"</answer>"` — stop as soon as one is generated (not included in the output).
- **Max output tokens:** caps cost and latency; truncated answers report a finish/stop reason like `max_tokens`/`length` — handle it.
- Others: frequency/presence penalties (reduce repetition), logit bias, constrained/structured decoding (only allow tokens that keep JSON valid).
- **Guidance:** extraction, classification, code, tool calls → low temperature (0–0.3); brainstorming, creative writing → higher (0.7–1.0). Many reasoning models fix or limit these parameters — check the provider docs.

#### Modern C++ example — softmax with temperature, top-p filtering, seeded sampling, and a stop sequence
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <cmath>
#include <iomanip>
#include <iostream>
#include <numeric>
#include <random>
#include <string>
#include <vector>

std::vector<double> softmax(const std::vector<double>& logits, double T) {
    std::vector<double> p(logits.size());
    double mx = *std::max_element(logits.begin(), logits.end()), sum = 0;
    for (std::size_t i = 0; i < logits.size(); ++i) sum += p[i] = std::exp((logits[i] - mx) / T);
    for (auto& x : p) x /= sum;
    return p;
}

std::vector<double> top_p(std::vector<double> p, double top) {
    std::vector<std::size_t> idx(p.size());
    std::iota(idx.begin(), idx.end(), 0);
    std::sort(idx.begin(), idx.end(), [&](auto a, auto b) { return p[a] > p[b]; });
    double cum = 0; std::vector<double> out(p.size(), 0);
    for (auto i : idx) { if (cum >= top) break; out[i] = p[i]; cum += p[i]; }
    for (auto& x : out) x /= cum;
    return out;
}

int main() {
    const std::vector<std::string> vocab{"Cairo", "Giza", "Alexandria", "Luxor", "pizza"};
    const std::vector<double> logits{4.0, 2.5, 2.0, 1.0, -1.0};            // "The capital of Egypt is ..."
    std::cout << std::fixed << std::setprecision(3);
    for (double T : {0.2, 1.0, 2.0}) {
        auto p = softmax(logits, T);
        std::cout << "T=" << T << ":";
        for (std::size_t i = 0; i < vocab.size(); ++i) std::cout << ' ' << vocab[i] << '=' << p[i];
        std::cout << '\n';
    }
    auto nucleus = top_p(softmax(logits, 1.0), 0.9);
    std::cout << "top-p 0.9 keeps:";
    for (std::size_t i = 0; i < vocab.size(); ++i) if (nucleus[i] > 0) std::cout << ' ' << vocab[i];
    std::cout << " (\"pizza\" can never be sampled)\n";

    auto sample = [&](unsigned seed) {
        std::mt19937 rng(seed);
        std::discrete_distribution<int> d(nucleus.begin(), nucleus.end());
        std::string out; for (int i = 0; i < 5; ++i) out += vocab[d(rng)] + " ";
        return out;
    };
    std::cout << "seed 7: " << sample(7) << "| seed 7 again: " << sample(7) << "| seed 8: " << sample(8) << '\n';

    std::string generated = "Answer: Cairo.</answer>\nUser: and the population?";
    auto stop = generated.find("</answer>");
    std::cout << "with stop sequence \"</answer>\": \"" << generated.substr(0, stop) << "\"\n";
}
```

**Output:**
```text
T=0.200: Cairo=0.999 Giza=0.001 Alexandria=0.000 Luxor=0.000 pizza=0.000
T=1.000: Cairo=0.707 Giza=0.158 Alexandria=0.096 Luxor=0.035 pizza=0.005
T=2.000: Cairo=0.466 Giza=0.220 Alexandria=0.171 Luxor=0.104 pizza=0.038
top-p 0.9 keeps: Cairo Giza Alexandria ("pizza" can never be sampled)
seed 7: Cairo Cairo Alexandria Cairo Cairo | seed 7 again: Cairo Cairo Alexandria Cairo Cairo | seed 8: Cairo Cairo Cairo Giza Cairo 
with stop sequence "</answer>": "Answer: Cairo."
```

### Interview answer
"At each step the model produces logits that softmax turns into probabilities. Temperature rescales the logits — near zero is effectively greedy and deterministic, higher is more diverse and risky; top-p keeps the smallest set of tokens covering probability p and top-k the k best, cutting off the unlikely tail. A seed makes sampling repeatable on a best-effort basis, stop sequences end generation at delimiters, and max tokens caps length, so I check the finish reason for truncation. I use low temperature for extraction, classification, code and tool calls, higher for creative tasks, and structured decoding when output must be valid JSON."

---

## 4. Model selection: capability, latency, context, cost, privacy, and deployment

**In one sentence:** pick the **smallest, cheapest, fastest model that passes your evaluation** for the task, considering **capability** (on *your* eval set, not leaderboards), **latency** (time to first token, tokens/s), **context window**, **cost** per task (not per token), **privacy/compliance** (data handling, region), **deployment** options and **features** (tool calling, structured output, vision, caching).

### In plain words
You don't hire a senior surgeon to apply plasters. Test candidates on the real job, then pick the cheapest one who does it well enough — and keep the expert for the hard cases.

### How it works
| Criterion | Questions |
|---|---|
| **Capability** | pass rate on *your* golden set; reasoning depth, coding, tool-use reliability, languages (e.g. Arabic), vision |
| **Latency** | TTFT and output speed at your concurrency; streaming support |
| **Context** | window size and **effective** recall at that length; output token limit |
| **Cost** | **cost per successful task** = tokens × price ÷ success rate (+ retries); prompt caching discounts, batch APIs |
| **Privacy / compliance** | data retention, training use, regions, certifications (SOC 2, HIPAA), on-prem/VPC options |
| **Deployment** | hosted API, cloud marketplace (Bedrock/Vertex/Azure), self-hosting; rate limits and quotas |
| **Features** | function calling, JSON schema outputs, system prompts, prompt caching, fine-tuning, batch |

- **Routing / cascades:** a small model handles easy requests; escalate to a large model when confidence is low or the task is hard — often cutting cost several-fold with the same quality.
- Re-evaluate when new models ship; keep the model ID **pinned** per release ([versioning](./Production-Reliability-and-Observability.md#6-model-and-prompt-versioning-release-controls-and-rollback)).

#### Modern C++ example — choose by cost per successful task under latency and privacy constraints
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iomanip>
#include <iostream>
#include <string>
#include <vector>

struct Model { std::string name; double success_rate, in_per_m, out_per_m; int ttft_ms; bool eu_data_residency; };

int main() {
    std::vector<Model> candidates{                                   // success rates from OUR golden set; prices illustrative
        {"large-frontier", 0.96, 15.0, 75.0, 1400, true},
        {"medium", 0.93, 3.0, 15.0, 600, true},
        {"small", 0.71, 0.25, 1.25, 250, true},
        {"cheap-no-eu", 0.92, 0.5, 2.0, 400, false},
    };
    const double in_tokens = 3000, out_tokens = 500;                 // per task
    const int max_ttft_ms = 1000; const bool need_eu = true; const double min_success = 0.90;
    std::cout << std::fixed << std::setprecision(4);
    std::string best; double best_cost = 1e9;
    for (auto& m : candidates) {
        double cost_per_call = in_tokens / 1e6 * m.in_per_m + out_tokens / 1e6 * m.out_per_m;
        double cost_per_success = cost_per_call / m.success_rate;
        std::string why = m.success_rate < min_success ? "fails quality bar" : m.ttft_ms > max_ttft_ms ? "too slow" : (need_eu && !m.eu_data_residency) ? "no EU residency" : "eligible";
        std::cout << m.name << ": $" << cost_per_success << " per successful task, TTFT " << m.ttft_ms << " ms -> " << why << '\n';
        if (why == "eligible" && cost_per_success < best_cost) { best_cost = cost_per_success; best = m.name; }
    }
    std::cout << "choose: " << best << " (consider routing easy requests to 'small' and escalating hard ones)\n";
}
```

**Output:**
```text
large-frontier: $0.0859 per successful task, TTFT 1400 ms -> too slow
medium: $0.0177 per successful task, TTFT 600 ms -> eligible
small: $0.0019 per successful task, TTFT 250 ms -> fails quality bar
cheap-no-eu: $0.0027 per successful task, TTFT 400 ms -> no EU residency
choose: medium (consider routing easy requests to 'small' and escalating hard ones)
```

### Interview answer
"I select models empirically: build a golden set for the task and measure pass rate, then compare cost per successful task — tokens times price divided by success rate — time to first token and throughput at our concurrency, effective context length, and required features like tool calling or structured outputs. Privacy and deployment constraints, like data residency or self-hosting, filter the list first. I pick the smallest model that clears the quality bar, often with a router that escalates hard requests to a larger model, pin model versions, and re-run the evaluation when new models appear."

---

## 5. Pretraining vs. instruction tuning vs. fine-tuning vs. alignment

**In one sentence:** **pretraining** teaches a model language and world knowledge by predicting the next token on huge text corpora; **instruction tuning** (supervised fine-tuning on prompt–response pairs) teaches it to follow instructions; **alignment** (RLHF, DPO, Constitutional AI) shapes it to be helpful, honest and harmless using preference feedback; and **fine-tuning** later adapts a model to *your* task, format or style.

### In plain words
School years reading every book in the library (pretraining), then job training on how to answer customers (instruction tuning), then a manager's feedback on which answers were good and which were rude (alignment), and finally on-the-job training at your specific company (fine-tuning).

### How it works
| Stage | Data | Objective | Who does it |
|---|---|---|---|
| **Pretraining** | trillions of tokens of web, books, code | next-token prediction (self-supervised) | model labs; huge compute |
| **Instruction tuning (SFT)** | curated (instruction, ideal answer) pairs, conversations, tool-use traces | imitate good responses | labs (and you, for custom models) |
| **Alignment / preference tuning** | human or AI preference comparisons (A better than B), principles | RLHF (reward model + RL), **DPO**, Constitutional AI / RLAIF | labs |
| **Your fine-tuning** | hundreds–thousands of task examples | specialize: format, tone, domain, a narrow skill, smaller/faster model (distillation) | you, via provider APIs or open weights |

**Fine-tuning methods:** full fine-tuning (all weights), **parameter-efficient** (LoRA / QLoRA adapters — train small matrices, swap per task), distillation (train a small model on a big model's outputs).

**When fine-tuning helps:** consistent output format/style, domain jargon, classification/extraction at scale with a small model, latency/cost reduction. **When it doesn't:** adding fresh or frequently changing knowledge (use RAG), or fixing a missing capability. It can also degrade other abilities ("catastrophic forgetting") and needs an eval set to prove it helped.

#### Modern C++ example — the same "model" at three stages: completion, instruction following, preference-aligned
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <vector>

// Toy illustration of what each stage changes. Real models learn this from data, not rules.
std::string base_model(const std::string& prompt) {                     // continues text like a document
    return prompt + " Write a haiku about the Nile. Write a haiku about the desert. Write a haiku about...";
}
std::string instruction_tuned(const std::string& prompt) {              // learned the chat/instruction format
    if (prompt.find("haiku about the Nile") != std::string::npos) return "Silver river flows / ancient stones remember it / palms lean to listen";
    return "Sure — here is an answer.";
}
std::string aligned(const std::string& prompt) {                        // preference-tuned: helpful, honest, harmless
    if (prompt.find("password of my colleague") != std::string::npos) return "I can't help get into someone else's account, but I can explain how to request access from IT.";
    return instruction_tuned(prompt);
}

int main() {
    std::string p1 = "Write a haiku about the Nile.";
    std::cout << "pretrained only:   " << base_model(p1) << '\n';
    std::cout << "instruction-tuned: " << instruction_tuned(p1) << '\n';
    std::string p2 = "Find the password of my colleague's email.";
    std::cout << "instruction-tuned: " << instruction_tuned(p2) << '\n';
    std::cout << "aligned:           " << aligned(p2) << '\n';

    // A fine-tuning dataset is just many (input, ideal output) pairs for YOUR task:
    std::vector<std::pair<std::string, std::string>> sft{
        {"Invoice: ACME Ltd, total 1,250.00 EGP, due 2026-11-01", R"({"vendor":"ACME Ltd","total":1250.00,"currency":"EGP","due":"2026-11-01"})"},
        {"Bill from Nile Tech, amount EGP 990, pay by 5 Dec 2026", R"({"vendor":"Nile Tech","total":990.00,"currency":"EGP","due":"2026-12-05"})"},
    };
    std::cout << "fine-tuning example: " << sft[0].first << "\n  -> " << sft[0].second << '\n';
}
```

**Output:**
```text
pretrained only:   Write a haiku about the Nile. Write a haiku about the Nile. Write a haiku about the desert. Write a haiku about...
instruction-tuned: Silver river flows / ancient stones remember it / palms lean to listen
instruction-tuned: Sure — here is an answer.
aligned:           I can't help get into someone else's account, but I can explain how to request access from IT.
fine-tuning example: Invoice: ACME Ltd, total 1,250.00 EGP, due 2026-11-01
  -> {"vendor":"ACME Ltd","total":1250.00,"currency":"EGP","due":"2026-11-01"}
```

### Interview answer
"Pretraining learns language and knowledge by next-token prediction over huge corpora; instruction tuning, supervised fine-tuning on prompt and ideal-answer pairs, turns that into an assistant that follows instructions; alignment with preference data — RLHF, DPO or Constitutional AI — makes it more helpful, honest and harmless. Fine-tuning on our own examples, often with LoRA, specializes a model for format, tone, a narrow task or a cheaper model through distillation. It's not the right tool for fresh or changing knowledge — that's RAG — and it needs an eval set to show improvement without regressions."

---

## 6. Prompting vs. RAG vs. fine-tuning: decision criteria and trade-offs

**In one sentence:** start with **prompting** (fastest, cheapest to change), add **RAG** when the model needs **your private or changing knowledge** with citations, and use **fine-tuning** when you need **behaviour** — consistent format, style, a narrow skill, or a smaller/faster model — that prompting can't reliably achieve; they combine well.

### In plain words
- Prompting: giving a smart temp worker clear instructions.
- RAG: also handing them the company handbook to look things up.
- Fine-tuning: sending them on a training course so the habits stick without instructions.

### How it works
| Need | Prompting | RAG | Fine-tuning |
|---|---|---|---|
| Fresh / private / changing knowledge | ❌ (context only) | ✅ update the index, no retraining | ❌ stale quickly |
| Citations / auditability | ⚠️ | ✅ | ❌ |
| Consistent format / tone / style | ⚠️ (few-shot helps) | — | ✅ |
| Narrow task at low cost/latency | ⚠️ big model | — | ✅ small fine-tuned model |
| Time to first version | hours | days | weeks (data + evals) |
| Change cost | edit prompt | re-index docs | retrain + re-evaluate |
| Risk | prompt brittleness | retrieval misses, injection via docs | data quality, forgetting, maintenance |

**Practical path:** prompt engineering + evals → add RAG for knowledge → add tools for actions/facts → fine-tune (or distill) only when evals show a behaviour gap or cost/latency demands it. **Long-context prompting** (just paste all the docs) is an option for small, static corpora — simpler than RAG but costlier per request and weaker at needle-finding at scale ([RAG vs. long context](./Retrieval-Augmented-Generation.md#9-rag-vs-long-context-prompting-vs-fine-tuning-when-to-use-which)).

#### Modern C++ example — a decision helper for which technique (or combination) to use
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

struct UseCase { std::string name; bool private_or_changing_knowledge, needs_citations, strict_format_or_style, high_volume_narrow_task, corpus_small_static; };

std::string recommend(const UseCase& u) {
    std::vector<std::string> parts{"prompting + evals"};
    if (u.private_or_changing_knowledge || u.needs_citations) parts.push_back(u.corpus_small_static ? "long-context (paste docs)" : "RAG");
    if (u.strict_format_or_style || u.high_volume_narrow_task) parts.push_back("fine-tune / distill a smaller model");
    std::string out;
    for (std::size_t i = 0; i < parts.size(); ++i) out += (i ? " + " : "") + parts[i];
    return out;
}

int main() {
    std::vector<UseCase> cases{
        {"HR policy Q&A with sources (policies change monthly)", true, true, false, false, false},
        {"marketing tagline brainstorming", false, false, false, false, false},
        {"extract fields from 2M invoices/day into JSON", false, false, true, true, false},
        {"support bot for a 20-page product manual", true, true, false, false, true},
        {"legal clause classifier in the firm's style, with precedents", true, true, true, false, false},
    };
    for (auto& c : cases) std::cout << c.name << "\n  -> " << recommend(c) << '\n';
}
```

**Output:**
```text
HR policy Q&A with sources (policies change monthly)
  -> prompting + evals + RAG
marketing tagline brainstorming
  -> prompting + evals
extract fields from 2M invoices/day into JSON
  -> prompting + evals + fine-tune / distill a smaller model
support bot for a 20-page product manual
  -> prompting + evals + long-context (paste docs)
legal clause classifier in the firm's style, with precedents
  -> prompting + evals + RAG + fine-tune / distill a smaller model
```

### Interview answer
"I start with prompting and an eval set because it's fastest to iterate. If the model needs private or frequently changing knowledge, or answers must cite sources, I add RAG — updating knowledge is just re-indexing. Fine-tuning is for behaviour: strict formats, tone, a narrow high-volume task, or distilling into a smaller, cheaper, faster model — not for facts that change. For a small static corpus, long-context prompting can replace RAG. They combine well, and each step is justified by an eval gap or a cost or latency target."

---

## 7. Tokens, tokenization, context windows, and output limits

**In one sentence:** models read and write **tokens** (sub-word pieces from a tokenizer such as BPE), the **context window** is the maximum number of tokens (input + output) the model can attend to in one request, and **output limits** cap how many tokens it may generate — which together drive **cost, latency and what fits**.

### In plain words
Tokens are like syllables or Lego bricks of text: common words are one brick, rare words are several. The context window is the size of the table you can lay bricks on; once it's full, something has to come off.

### How it works
- **Tokenization (BPE / SentencePiece):** start from bytes/characters and repeatedly **merge the most frequent adjacent pairs** into new tokens. Common English words ≈ 1 token; rare words, code, numbers, and many non-English scripts (e.g. Arabic) often take more tokens per word → higher cost.
- **Rule of thumb (English):** ~1 token ≈ 4 characters ≈ 0.75 words — use the provider's token-counting API for exact numbers.
- **Context window:** modern models support from ~32K to 1M+ tokens; it includes the system prompt, tools/schemas, conversation history, retrieved documents **and** the output. Longer inputs cost more and are slower (attention is roughly quadratic in length in standard transformers), and recall can drop for facts in the **middle** of long contexts.
- **Output limit:** separate max (e.g. 4K–64K+ tokens); hitting it truncates output — check the stop/finish reason.
- **Budgeting:** reserve tokens for the answer; trim history, summarize, retrieve fewer/better chunks ([context management](./Memory-State-and-Context-Management.md#1-context-compaction-summaries-and-memory-retrieval)); use **prompt caching** for long, repeated prefixes.
- **Tokenization quirks:** counting letters, reversing words or exact character edits are hard because the model sees tokens, not characters.

#### Modern C++ example — a tiny BPE tokenizer learning merges, and a context-window budget check
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <vector>

using Seq = std::vector<std::string>;

Seq split_chars(const std::string& w) { Seq s; for (char c : w) s.push_back(std::string(1, c)); return s; }

int main() {
    std::vector<std::string> corpus{"lower", "lowest", "newer", "newest", "low", "low", "new", "new"};
    std::vector<Seq> words;
    for (auto& w : corpus) words.push_back(split_chars(w));
    for (int merge = 1; merge <= 5; ++merge) {                         // learn 5 merges (BPE training)
        std::map<std::pair<std::string, std::string>, int> pairs;
        for (auto& w : words) for (std::size_t i = 0; i + 1 < w.size(); ++i) ++pairs[{w[i], w[i + 1]}];
        auto best = pairs.begin();
        for (auto it = pairs.begin(); it != pairs.end(); ++it) if (it->second > best->second) best = it;
        auto [a, b] = best->first;
        std::cout << "merge " << merge << ": '" << a << "' + '" << b << "' (seen " << best->second << "x)\n";
        for (auto& w : words) {
            Seq out;
            for (std::size_t i = 0; i < w.size(); ++i)
                if (i + 1 < w.size() && w[i] == a && w[i + 1] == b) { out.push_back(a + b); ++i; } else out.push_back(w[i]);
            w = out;
        }
    }
    std::cout << "tokens: ";
    for (std::size_t i = 0; i < 4; ++i) { std::cout << corpus[i] << "=["; for (std::size_t j = 0; j < words[i].size(); ++j) std::cout << (j ? "|" : "") << words[i][j]; std::cout << "] "; }
    std::cout << '\n';

    const int window = 128'000, system_and_tools = 3'500, history = 40'000, retrieved = 70'000, reserve_output = 8'000;
    int used = system_and_tools + history + retrieved + reserve_output;
    std::cout << "context budget: " << used << " / " << window << " tokens -> "
              << (used <= window ? "fits" : "OVER by " + std::to_string(used - window) + ": summarize history or retrieve fewer chunks") << '\n';
}
```

**Output:**
```text
merge 1: 'e' + 'w' (seen 4x)
merge 2: 'l' + 'o' (seen 4x)
merge 3: 'lo' + 'w' (seen 4x)
merge 4: 'n' + 'ew' (seen 4x)
merge 5: 'e' + 'r' (seen 2x)
tokens: lower=[low|er] lowest=[low|e|s|t] newer=[new|er] newest=[new|e|s|t] 
context budget: 121500 / 128000 tokens -> fits
```

### Interview answer
"Models work on tokens produced by sub-word tokenizers like BPE, which merge frequent character pairs, so common English words are about one token while rare words, code and many non-English scripts cost more. The context window bounds input plus output tokens per request — system prompt, tool schemas, history, retrieved documents and the answer — and longer contexts cost more, run slower and can lose facts in the middle. I budget tokens explicitly, reserve room for the output, check finish reasons for truncation, summarize or retrieve selectively, and use prompt caching for long repeated prefixes."

---

## 8. Transformers, attention, embeddings, and autoregressive generation

**In one sentence:** an LLM is a **transformer**: tokens become **embedding vectors**, stacked layers of **self-attention** (each token mixes information from relevant earlier tokens) and feed-forward networks refine them, and the model generates **autoregressively** — predicting one next token at a time, appending it, and repeating.

### In plain words
Reading a sentence, each word "looks back" at the words that matter for understanding it: in "the bank of the river", *bank* pays attention to *river*. The model does this in many layers, then guesses the next word, writes it down, and repeats — one word at a time.

### How it works
- **Embeddings:** each token ID maps to a vector (e.g. 4,096 numbers); similar meanings end up close together. **Positional information** (e.g. RoPE) tells the model token order. (Separate **embedding models** produce one vector per text for search/RAG — [embeddings](./Retrieval-Augmented-Generation.md#4-embeddings-similarity-metrics-dimension-and-model-selection).)
- **Self-attention:** for each token compute a **query** Q, **key** K and **value** V (learned projections). Attention weights = `softmax(Q·Kᵀ / √d)`; output = weights · V. A **causal mask** blocks attending to future tokens. **Multi-head** attention runs several attentions in parallel to capture different relations.
- **Transformer block:** attention → feed-forward (MLP) with residual connections and normalization; dozens of blocks stacked. Many large models use **mixture-of-experts (MoE)** MLPs that activate only some parameters per token.
- **Generation:** the last position's output → logits over the vocabulary → sample ([section 3](#3-inference-parameters-temperature-top-p-seed-and-stop-sequences)) → append → repeat. The **KV cache** stores past keys/values so each new token is cheap; this is why **time to first token** (processing the prompt, "prefill") differs from **per-token speed** ("decode").
- **Cost intuition:** standard attention is O(n²) in sequence length; serving tricks: KV cache, batching (continuous batching in vLLM), quantization (8/4-bit), speculative decoding, FlashAttention.

#### Modern C++ example — scaled dot-product attention with a causal mask, and greedy autoregressive generation
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cmath>
#include <iomanip>
#include <iostream>
#include <map>
#include <string>
#include <vector>

using Vec = std::vector<double>;
double dot(const Vec& a, const Vec& b) { double s = 0; for (std::size_t i = 0; i < a.size(); ++i) s += a[i] * b[i]; return s; }

int main() {
    // 1) Attention for the last token "bank" over ["the", "river", "bank"] (toy 2-d vectors; Q=K=V=embedding).
    std::vector<std::string> tokens{"the", "river", "bank"};
    std::vector<Vec> emb{{0.1, 0.0}, {0.9, 0.8}, {0.8, 0.9}};
    const Vec& q = emb[2];
    double scale = std::sqrt(2.0);
    std::vector<double> w(3); double sum = 0;
    for (int j = 0; j < 3; ++j) sum += w[j] = std::exp(dot(q, emb[j]) / scale);   // causal: only j <= current position
    std::cout << std::fixed << std::setprecision(2) << "attention weights of 'bank':";
    for (int j = 0; j < 3; ++j) std::cout << ' ' << tokens[j] << '=' << (w[j] /= sum);
    Vec out{0, 0};
    for (int j = 0; j < 3; ++j) for (int d = 0; d < 2; ++d) out[d] += w[j] * emb[j][d];
    std::cout << "\nnew 'bank' vector = (" << out[0] << ", " << out[1] << ")  <- mixed with 'river' context\n";

    // 2) Autoregressive generation with a toy next-token table (stands in for the whole network).
    std::map<std::string, std::map<std::string, double>> next{
        {"<s>", {{"The", 0.9}, {"A", 0.1}}}, {"The", {{"Nile", 0.6}, {"river", 0.4}}},
        {"Nile", {{"flows", 0.7}, {"is", 0.3}}}, {"flows", {{"north", 0.8}, {"south", 0.2}}}, {"north", {{"</s>", 1.0}}}};
    std::string tok = "<s>", text;
    for (int step = 1; step <= 10 && tok != "</s>"; ++step) {
        auto& dist = next[tok];
        auto best = dist.begin();
        for (auto it = dist.begin(); it != dist.end(); ++it) if (it->second > best->second) best = it;   // greedy (temperature -> 0)
        tok = best->first;
        if (tok != "</s>") text += (text.empty() ? "" : " ") + tok;
        std::cout << "step " << step << ": + '" << tok << "' (p=" << best->second << ")\n";
    }
    std::cout << "generated: \"" << text << "\"\n";
}
```

**Output:**
```text
attention weights of 'bank': the=0.16 river=0.42 bank=0.42
new 'bank' vector = (0.73, 0.71)  <- mixed with 'river' context
step 1: + 'The' (p=0.90)
step 2: + 'Nile' (p=0.60)
step 3: + 'flows' (p=0.70)
step 4: + 'north' (p=0.80)
step 5: + '</s>' (p=1.00)
generated: "The Nile flows north"
```

### Interview answer
"Text is split into tokens, each mapped to an embedding vector with positional information. Transformer blocks apply self-attention — every token builds a query and compares it with the keys of earlier tokens, softmax of the scaled dot products gives weights, and it takes a weighted mix of their values, with a causal mask and several heads — followed by feed-forward layers and residual connections, stacked many times. Generation is autoregressive: the final hidden state gives logits for the next token, we sample one, append it and repeat, with a KV cache so each step only processes the new token. That's why prefill drives time to first token and decode drives tokens per second, and attention cost grows quadratically with context length."

---

## Cheat sheet

| Topic | Remember |
|---|---|
| Closed vs. open weight | API-only frontier vs. downloadable weights (licences vary); hosted vs. self-hosted = convenience vs. control/privacy/scale cost |
| Hallucination | plausible ≠ true; ground with sources + citations, allow abstention, tools for facts, verify, measure |
| Uncertainty | self-consistency, log-probs, retrieval scores |
| Temperature / top-p / top-k | sharpen/flatten · nucleus cut-off · k best; low T for extraction/code/tools |
| Seed / stop / max tokens | best-effort repeatability · end at delimiters · cap length, check finish reason |
| Model selection | your evals, cost per **successful** task, TTFT, context, privacy, features; route small → large |
| Training stages | pretraining (next token) → SFT (instructions) → alignment (RLHF/DPO/CAI) → your fine-tuning (LoRA, distillation) |
| Prompt vs. RAG vs. fine-tune | instructions · knowledge + citations · behaviour/format/cheaper model; combine |
| Tokens | BPE sub-words; ~4 chars ≈ 1 token in English; non-English/code cost more |
| Context window | input + output; long = costly, slower, "lost in the middle"; budget and reserve output |
| Transformer | embeddings + positions → (attention + MLP) × N → logits |
| Attention | softmax(QKᵀ/√d)·V, causal mask, multi-head, O(n²) |
| Generation | autoregressive, KV cache, prefill (TTFT) vs. decode (tokens/s), batching, quantization |
