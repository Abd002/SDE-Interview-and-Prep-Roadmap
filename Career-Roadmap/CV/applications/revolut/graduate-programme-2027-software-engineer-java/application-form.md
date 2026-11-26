# Revolut: Graduate Programme 2027 Software Engineer (Java): application answers

Prepared 26 Nov 2026; every fact comes from [facts.md](../../../facts.md). Revolut's form is short; answer only what it asks.

| Field | What to enter |
|---|---|
| Name / email / phone | Abdelrahman Khalifa · abdelrahman.khalifa.gad@gmail.com · +20 114 250 5042 |
| Current location | Cairo, Egypt |
| Preferred location / hub | United Arab Emirates (Dubai). If it allows a second choice: Poland |
| CV | [Abdelrahman-Khalifa-CV.pdf](Abdelrahman-Khalifa-CV.pdf) |
| LinkedIn / GitHub | https://www.linkedin.com/in/abd002 · https://github.com/Abd002 |
| Do you require visa sponsorship? | **Yes** |
| Degree / university | B.Sc. Computer and Systems Engineering, Minia University, Egypt |
| Graduation year | 2025 |
| Grade | 84.6%, Very Good with Honors (Egyptian scale; 85%+ is Excellent). If it asks for a UK-style class: 2:1 equivalent, and add the percentage in any free-text box |
| Programme start | September 2027 |
| How did you hear about us? | LinkedIn |
| Salary expectation (if asked) | Open to the standard graduate package for the hub |

## "Why Revolut?" (if asked; paste between the lines)

---

I like building backend systems that have to be correct, and in a bank correctness isn't optional. At EKSON I run a Node.js and MongoDB backend that sends commands and firmware updates to machines, so I've learned that a failed request has to fail safely. In my own key-value store, raftkv, every write is checksummed and synced to disk before it is acknowledged. I want to do that work at Revolut's scale, in a team that ships fast and tests properly. Your graduate programme is also one of the few that welcomes international graduates and helps with the move, which matters to me as an engineer from Egypt.

---

## Before the coding test
- Revise Java 17+: records, `Optional`, streams, `Map`/`Set` choices, `equals`/`hashCode`, `ExecutorService` and `CompletableFuture`.
- Be ready to explain locking in the CMU 15-445 Count-Min Sketch (one `std::mutex` per row) and how you'd do the same in Java (`ReentrantLock` or `synchronized` per row, or `LongAdder` counters).
