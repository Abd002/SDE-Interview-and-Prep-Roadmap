# IMC: interview rules and preparation

Summary of IMC's Interview Conduct Policy (received 26 Nov 2026) and its [technology interview guide](https://cdn.sanity.io/files/l1io23s3/production/cf48d9c14a5315785738597ea3dda644331bac99.pdf).

## Rules (breaking them = disqualified, now and in future seasons)
- **No AI tools at all** during assessments and interviews: no chatbots, coding assistants, transcription or meeting-assistant tools.
- **No second device.** Pen and paper only for notes (a CoderPad link the interviewer sends is fine).
- **Seen the question before? Say so immediately.** They have backup questions.
- **Questions are confidential.** Never share them with anyone or post them online.
- **The online test is proctored:** full screen, other apps blocked, no copy/paste, screen recorded and checked by AI, a webcam still every 15 s (webcam needs your separate consent), phone detection, eye-movement checks. No audio. You can ask CampusEU@imc.com for an alternative unmonitored test, and a human reviews any flag.

## What they test
1. **Coding in C++** (your chosen language): fluent syntax and the standard library (`vector`, `unordered_map`, `priority_queue`, `sort`, iterators).
2. **Data structures and algorithms**, with complexity under constraints.
3. **Memory and computer architecture:** stack vs heap, cache locality, alignment, why `vector` beats `list`, RAII and smart pointers.
4. **Concurrency:** threads, mutexes, data races, deadlock, atomics, lock-free basics.
5. **Behaviour, in every round:** think aloud, ask clarifying questions, take hints (they're not tricks), say "I'm not sure" when true.
6. **Motivation:** why trading, why IMC (market making / liquidity provider since 1989), why engineering. Be honest, not rehearsed. Answer behaviour questions with STAR.

## Prep plan
- Daily: 2 timed problems in C++ (Codeforces Div 2 B/C level, or LeetCode medium).
- Revise: *A Tour of C++* (3rd ed.) chapters on containers, concurrency and resource management.
- Your examples: the Count-Min Sketch with a `std::mutex` per row (CMU 15-445); the varlink process isolation for C code (Google Summer of Code); raftkv's fsync-before-ack WAL.
- Learn the basics: bid, ask, spread, market vs limit order, liquidity (the guide's glossary; not required).
