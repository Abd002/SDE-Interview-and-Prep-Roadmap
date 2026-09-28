# Processes — Explained for Beginners

> **What you'll learn:** what a process is, how it differs from a program, what lives inside it, the life cycle of a process, how processes are created, and how they talk to each other.
>
> **Prerequisites:** none. If you can compile a "Hello, World" C++ program, you are ready.
>
> **How to run the examples:** every example is a complete program. Save it as `main.cpp` and run the command written in its first comment line. Examples marked **Linux/macOS** use POSIX system calls (the operating system's own API) and will not compile on plain Windows (use WSL there).

## Table of Contents
1. [What is a process?](#1-what-is-a-process)
2. [Program vs. process](#2-program-vs-process)
3. [What is inside a process (memory layout)](#3-what-is-inside-a-process-memory-layout)
4. [The Process Control Block (PCB)](#4-the-process-control-block-pcb)
5. [Process states (the life cycle)](#5-process-states-the-life-cycle)
6. [Creating processes: `fork` and `exec`](#6-creating-processes-fork-and-exec)
7. [Context switching](#7-context-switching)
8. [Inter-Process Communication (IPC)](#8-inter-process-communication-ipc)
9. [Zombies and orphans](#9-zombies-and-orphans)
10. [Cheat sheet](#cheat-sheet)

---

## 1. What is a process?

**In one sentence:** a process is a program that is *currently running*, together with everything the operating system needs to keep it running.

### In plain words
Think of a recipe book on a shelf. The recipe is just text — it does nothing by itself. When a cook takes the recipe and actually starts cooking, you now have *a cooking activity*: a kitchen counter with ingredients, a current step ("I'm on step 4"), pots on the stove, and so on.

- The **recipe** is the **program** (a file on disk, e.g. `chrome.exe` or `/usr/bin/ls`).
- The **act of cooking** is the **process**.

Two cooks can follow the same recipe at the same time in two kitchens. In the same way, you can open two Notepad windows: that is **one program** but **two processes**.

### How it works
When you double-click an app or type a command:
1. The **operating system (OS)** — the master program that manages the computer (Linux, Windows, macOS) — reads the program file from disk.
2. It gives the new process its own private **memory** (RAM), so it cannot accidentally scribble on other programs' memory.
3. It gives the process a unique number called a **PID** (Process ID).
4. It starts executing the program's instructions from its `main` function.
5. The OS lets many processes take turns on the CPU so that they all *seem* to run at the same time.

### Modern C++ example
Every C++ program you run *is* a process. This program asks the OS "what is my PID?".

```cpp
// g++ -std=c++20 main.cpp && ./a.out      (Linux/macOS)
#include <iostream>
#include <unistd.h>   // getpid(), getppid() — POSIX API

int main() {
    // getpid()  = "my own process ID"
    // getppid() = "the process ID of my parent" (usually your terminal/shell)
    std::cout << "I am a process. My PID is " << getpid() << '\n';
    std::cout << "My parent's PID is " << getppid() << '\n';
}
```

**Output (may vary):**
```text
I am a process. My PID is 48213
My parent's PID is 47990
```
Run it twice: the PID changes each time, because every run is a *new* process.

### Common mistakes
- Saying "a process is a program". A program is passive (a file); a process is active (running).
- Thinking one program = one process. Browsers like Chrome deliberately run *many* processes (one per tab) for safety.

### Interview answer
"A process is an instance of a program in execution. The OS gives each process its own address space, a PID, and bookkeeping information such as registers, open files and scheduling state, and it isolates processes from each other."

---

## 2. Program vs. process

**In one sentence:** a program is a file of instructions sitting on disk; a process is that file loaded into memory and running.

### In plain words
A **song file** (`song.mp3`) versus **the song playing right now** on your speaker. The file never changes; the playing song has a *current position* (1:32 into the track), a volume, and it uses the speaker.

### How it works
| | Program | Process |
|---|---|---|
| Where it lives | Disk (storage) | Memory (RAM) + CPU |
| Lifetime | Permanent until deleted | Starts when launched, ends on exit |
| State | None | Current instruction, variables, open files |
| Count | One file | Can have many running copies |

### Modern C++ example
The program file below is one thing on disk; every time you run it you get a new process with its own separate counter.

```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>

int counter = 0;   // lives inside THIS process's memory only

int main() {
    ++counter;
    // No matter how many times you run the program, it prints 1:
    // each run is a brand-new process with a fresh copy of 'counter'.
    std::cout << "counter = " << counter << '\n';
}
```

**Output:**
```text
counter = 1
```

### Common mistakes
- Expecting a global variable to "remember" its value between runs. It cannot — the process that held it has ended. To remember data between runs, save it in a file or database.

### Interview answer
"A program is a static, passive set of instructions on disk. A process is a dynamic, active entity: the program loaded into memory with its own address space, program counter, stack, heap and OS resources."

---

## 3. What is inside a process (memory layout)

**In one sentence:** every process gets its own private memory, divided into areas for code, global variables, the heap and the stack.

### In plain words
Imagine each process gets its own apartment. The apartment has rooms for different purposes:
- a **bookshelf** with the instruction manual (the **code**),
- a **storage closet** for things that exist the whole time (the **global variables**),
- a **workbench** where you can put big things you ask for while working (the **heap**),
- a **stack of sticky notes** for quick, temporary notes while doing each task (the **stack**).

### How it works
```
 High addresses
 +---------------------+
 |       Stack         |  local variables, function calls — grows DOWN
 |         |           |
 |         v           |
 |                     |
 |         ^           |
 |         |           |
 |       Heap          |  memory from new / make_unique — grows UP
 +---------------------+
 |  BSS (zeroed data)  |  globals with no initial value
 |  Data               |  globals with an initial value
 +---------------------+
 |  Text (code)        |  the compiled machine instructions (read-only)
 +---------------------+
 Low addresses
```
- **Text / code segment:** the machine instructions. Read-only so a bug can't overwrite code.
- **Data segment:** global/static variables that start with a value (`int x = 5;`).
- **BSS segment:** global/static variables that start at zero (`int y;`).
- **Heap:** memory you request at runtime (`new`, `std::make_unique`, `std::vector` growth).
- **Stack:** local variables and the record of "which function called which".

### Modern C++ example
We print the address of one variable from each area. You will see that they are in different regions.

```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <memory>

int initialized_global = 42;   // Data segment
int zero_global;               // BSS segment

void some_function() {}        // Text (code) segment

int main() {
    int local = 7;                                  // Stack
    auto on_heap = std::make_unique<int>(99);       // Heap (freed automatically)

    std::cout << "code   : " << reinterpret_cast<void*>(&some_function) << '\n';
    std::cout << "data   : " << &initialized_global << '\n';
    std::cout << "bss    : " << &zero_global << '\n';
    std::cout << "heap   : " << on_heap.get() << '\n';
    std::cout << "stack  : " << &local << '\n';
}
```

**Output (may vary):**
```text
code   : 0x5581c2a0b1a9
data   : 0x5581c2a0e010
bss    : 0x5581c2a0e018
heap   : 0x5581c3f6feb0
stack  : 0x7ffd4b3a2c5c
```
Notice code/data/bss are close together, the heap is a bit higher, and the stack is far away at the top.

### Common mistakes
- Returning a pointer to a local (stack) variable. When the function returns, that memory is reused, and the pointer becomes garbage ("dangling").
- Forgetting that each process has its **own** layout — two processes can print the *same* address yet point to different physical memory (see [Virtual Memory](../Programming%20Languages%20and%20Concepts/Virtual-Memory.md)).

### Interview answer
"A process's address space has a text segment for code, data and BSS segments for globals, a heap for dynamic allocation that grows upward, and a stack for function frames and locals that grows downward."

---

## 4. The Process Control Block (PCB)

**In one sentence:** the PCB is the OS's "ID card + save file" for a process — a record holding everything needed to pause and later resume it.

### In plain words
A video game save file stores your level, health, inventory and position so you can stop and come back later exactly where you left off. The OS keeps a similar save file for every process so it can pause it (to let another process use the CPU) and resume it later.

### How it works
A PCB typically contains:
| Field | Meaning |
|---|---|
| PID | Unique process number |
| State | Running, ready, waiting… (next section) |
| Program counter | Address of the next instruction to run |
| CPU registers | The CPU's small scratch values at the moment of pausing |
| Memory info | Where this process's memory lives |
| Open files | Which files/sockets the process has open |
| Scheduling info | Priority, CPU time used so far |
| Parent PID | Who created this process |

### Modern C++ example
We can't touch the real PCB (it lives inside the OS kernel), but we can model one to understand it.

```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cstdint>
#include <format>
#include <iostream>
#include <string>
#include <vector>

enum class State { New, Ready, Running, Waiting, Terminated };

struct ProcessControlBlock {
    int pid;
    int parent_pid;
    State state = State::New;
    std::uint64_t program_counter = 0;        // next instruction address
    std::vector<std::uint64_t> registers{};   // saved CPU registers
    std::vector<std::string> open_files{};
    int priority = 0;
};

std::string to_string(State s) {
    switch (s) {
        case State::New: return "New";
        case State::Ready: return "Ready";
        case State::Running: return "Running";
        case State::Waiting: return "Waiting";
        case State::Terminated: return "Terminated";
    }
    return "?";
}

int main() {
    ProcessControlBlock pcb{.pid = 101, .parent_pid = 1};
    pcb.open_files = {"stdin", "stdout", "notes.txt"};
    pcb.state = State::Ready;
    pcb.program_counter = 0x401000;

    std::cout << std::format("PID {} (parent {}) is {} at PC=0x{:x}, {} open files\n",
                             pcb.pid, pcb.parent_pid, to_string(pcb.state),
                             pcb.program_counter, pcb.open_files.size());
}
```

**Output:**
```text
PID 101 (parent 1) is Ready at PC=0x401000, 3 open files
```

### Common mistakes
- Confusing the PCB (OS bookkeeping) with the process's own memory. The PCB lives in *kernel* memory, which the process itself cannot read or change.

### Interview answer
"The PCB is the kernel data structure representing a process. It stores the PID, state, program counter, saved registers, memory-management info, open files and scheduling data. It is what gets saved and restored during a context switch."

---

## 5. Process states (the life cycle)

**In one sentence:** a process moves through states — New → Ready → Running → (Waiting) → Terminated — as it waits for the CPU, uses it, waits for input, and finally exits.

### In plain words
Think of customers at a bank with one teller:
- **New:** you just walked in the door.
- **Ready:** you're in line, ready to be served.
- **Running:** you're at the teller right now.
- **Waiting (Blocked):** the teller says "please go fill out this form" — you step aside until you're done, and don't block the line.
- **Terminated:** you're done and leave.

### How it works
```
          admitted            scheduler picks it
  [New] ──────────> [Ready] ─────────────────────> [Running] ──exit──> [Terminated]
                      ^  ^                            |   |
                      |  └───── time slice over ──────┘   |
                      |                                   | waits for I/O (disk, keyboard, network)
                      └──── I/O finished ─── [Waiting] <──┘
```
- Only **one process per CPU core** can be *Running* at any instant.
- A process asking for slow I/O (reading a file, waiting for a network reply) moves to *Waiting* so the CPU can do other work.

### Modern C++ example
A tiny state machine that enforces legal transitions.

```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <set>
#include <string>

enum class State { New, Ready, Running, Waiting, Terminated };
const std::map<State, std::string> name{{State::New, "New"}, {State::Ready, "Ready"},
    {State::Running, "Running"}, {State::Waiting, "Waiting"}, {State::Terminated, "Terminated"}};

// Which moves are allowed from each state?
const std::map<State, std::set<State>> allowed{
    {State::New, {State::Ready}},
    {State::Ready, {State::Running}},
    {State::Running, {State::Ready, State::Waiting, State::Terminated}},
    {State::Waiting, {State::Ready}},
    {State::Terminated, {}},
};

class Process {
    State state_ = State::New;
public:
    bool move_to(State next) {
        if (!allowed.at(state_).contains(next)) {
            std::cout << "  illegal: " << name.at(state_) << " -> " << name.at(next) << '\n';
            return false;
        }
        std::cout << name.at(state_) << " -> " << name.at(next) << '\n';
        state_ = next;
        return true;
    }
};

int main() {
    Process p;
    p.move_to(State::Ready);
    p.move_to(State::Running);
    p.move_to(State::Waiting);    // asked to read a file
    p.move_to(State::Running);    // not allowed! must go back to Ready first
    p.move_to(State::Ready);      // file read finished
    p.move_to(State::Running);
    p.move_to(State::Terminated);
}
```

**Output:**
```text
New -> Ready
Ready -> Running
Running -> Waiting
  illegal: Waiting -> Running
Waiting -> Ready
Ready -> Running
Running -> Terminated
```

### Common mistakes
- Thinking a Waiting process goes straight back to Running. It goes to Ready and waits its turn again.

### Interview answer
"The classic five-state model is New, Ready, Running, Waiting/Blocked and Terminated. The scheduler moves processes from Ready to Running; a timer interrupt pre-empts Running back to Ready; an I/O request moves Running to Waiting, and I/O completion moves it back to Ready."

---

## 6. Creating processes: `fork` and `exec`

**In one sentence:** on Unix, `fork()` makes an almost-exact copy of the current process, and `exec()` replaces a process's program with a different one.

### In plain words
- `fork()` is like a photocopier for a running process: afterwards there are two identical processes — the **parent** (the original) and the **child** (the copy). The only difference is the value `fork()` returns to each of them.
- `exec()` is like keeping the same apartment but throwing out the old recipe and starting a brand-new one.
- Your terminal runs every command with *fork then exec*: it copies itself, then the copy becomes `ls` (or whatever you typed).

### How it works
1. Parent calls `fork()`.
2. The OS creates the child with a copy of the parent's memory (using **copy-on-write**: pages are only really copied when one side modifies them, which makes fork fast).
3. `fork()` returns:
   - `0` in the child,
   - the child's PID in the parent,
   - `-1` if it failed.
4. The child often calls `exec...()` to run another program.
5. The parent calls `waitpid()` to wait for the child to finish and collect its exit code.

### Modern C++ example (Linux/macOS)
```cpp
// g++ -std=c++20 main.cpp && ./a.out      (Linux/macOS)
#include <iostream>
#include <sys/wait.h>   // waitpid
#include <unistd.h>     // fork, execlp, getpid

int main() {
    std::cout << "Parent starting\n" << std::flush;  // flush so the text isn't copied twice

    pid_t pid = fork();
    if (pid < 0) {
        std::cerr << "fork failed\n";
        return 1;
    }

    if (pid == 0) {
        // ---- CHILD ----
        // Replace this child process with the "echo" program.
        execlp("echo", "echo", "Hello from the child (now running echo)", nullptr);
        // execlp only returns if it FAILED:
        std::cerr << "exec failed\n";
        _exit(127);
    }

    // ---- PARENT ----
    int status = 0;
    waitpid(pid, &status, 0);                         // wait for the child to finish
    if (WIFEXITED(status))
        std::cout << "Child exited with code " << WEXITSTATUS(status) << '\n';
}
```

**Output:**
```text
Parent starting
Hello from the child (now running echo)
Child exited with code 0
```

> **Windows note:** Windows has no `fork`. It uses `CreateProcess`, which creates a new process and loads a program in one step. Portable C++ code usually uses a library (e.g. Boost.Process) or `std::system`.

### Common mistakes
- Forgetting to `flush` output before `fork()`. Buffered text gets copied into the child and printed twice.
- Forgetting `waitpid()` → the child becomes a **zombie** (section 9).
- Code after a successful `exec` never runs — the old program is gone.

### Interview answer
"`fork` duplicates the calling process using copy-on-write; it returns 0 in the child and the child's PID in the parent. `exec` replaces the current process image with a new program. Shells use fork + exec + wait to run commands."

---

## 7. Context switching

**In one sentence:** a context switch is the OS saving the state of the running process and loading the state of another so it can run.

### In plain words
One chef, many dishes. To switch from stirring soup to chopping salad, the chef must remember exactly where they stopped on the soup (a bookmark), put it aside, and pick up the salad work from *its* bookmark. The switching itself isn't cooking — it's overhead. Too much switching wastes time.

### How it works
1. A **timer interrupt** fires (a hardware alarm that goes off every few milliseconds), or the process blocks on I/O.
2. The OS saves the CPU registers and program counter into the current process's PCB.
3. The **scheduler** chooses the next process (see [Scheduling](./Scheduling.md)).
4. The OS loads that process's registers and memory mapping from its PCB.
5. The CPU jumps to where that process left off.

Cost: usually a few microseconds, plus hidden cost — the CPU caches become "cold" (full of the other process's data).

### Modern C++ example
C++20 **coroutines** let a function pause and resume later — a user-space mini version of a context switch. Here a tiny "scheduler" switches between two tasks round-robin.

```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <coroutine>
#include <deque>
#include <iostream>
#include <string>

// A minimal coroutine "task" type. The details are not important for this
// lesson: what matters is that co_await std::suspend_always{} PAUSES the
// function and saves its local variables — just like the OS saves a PCB.
struct Task {
    struct promise_type {
        Task get_return_object() { return Task{std::coroutine_handle<promise_type>::from_promise(*this)}; }
        std::suspend_always initial_suspend() noexcept { return {}; }
        std::suspend_always final_suspend() noexcept { return {}; }
        void return_void() {}
        void unhandled_exception() { std::terminate(); }
    };
    std::coroutine_handle<promise_type> handle;
};

Task worker(std::string name, int steps) {
    for (int i = 1; i <= steps; ++i) {
        std::cout << name << " step " << i << '\n';
        co_await std::suspend_always{};   // "time slice over" — give the CPU back
    }
}

int main() {
    std::deque<std::coroutine_handle<>> ready_queue{
        worker("A", 3).handle, worker("B", 2).handle};

    while (!ready_queue.empty()) {
        auto h = ready_queue.front();
        ready_queue.pop_front();
        h.resume();                        // "context switch" into this task
        if (h.done()) h.destroy();         // task terminated
        else ready_queue.push_back(h);     // back of the ready queue
    }
}
```

**Output:**
```text
A step 1
B step 1
A step 2
B step 2
A step 3
```

### Common mistakes
- Thinking context switches are free. Thousands of processes/threads fighting for a few cores spend real time just switching.

### Interview answer
"A context switch saves the running process's CPU state into its PCB and restores another's. It is triggered by timer interrupts, blocking system calls or higher-priority work. It is pure overhead and also pollutes caches and the TLB, so we try to minimise unnecessary switches."

---

## 8. Inter-Process Communication (IPC)

**In one sentence:** because processes cannot read each other's memory, they talk through OS-provided channels such as pipes, files, shared memory, message queues and sockets.

### In plain words
Two people in separate locked apartments can't reach into each other's rooms. To communicate they can pass notes under the door (**pipe**), share a mailbox (**message queue**), agree to use a shared whiteboard in the hallway (**shared memory**), or phone each other (**socket**).

### How it works
| Method | Idea | Typical use |
|---|---|---|
| Pipe | One-way byte stream parent → child | `ls \| grep txt` in a shell |
| Named pipe (FIFO) | A pipe with a file name, for unrelated processes | Simple local tools |
| Message queue | OS-managed queue of messages | Job dispatch |
| Shared memory | Same physical memory mapped into both processes | Very fast data sharing (needs locking) |
| Socket | Network-style connection, even across machines | Web servers, databases |
| Signals | Tiny notifications (e.g. `SIGTERM` = "please stop") | Stopping/reloading a process |

### Modern C++ example (Linux/macOS)
A **pipe** from parent to child.

```cpp
// g++ -std=c++20 main.cpp && ./a.out      (Linux/macOS)
#include <array>
#include <cstring>
#include <iostream>
#include <string_view>
#include <sys/wait.h>
#include <unistd.h>

int main() {
    std::array<int, 2> fds{};          // fds[0] = read end, fds[1] = write end
    if (pipe(fds.data()) != 0) return 1;

    pid_t pid = fork();
    if (pid == 0) {                    // CHILD: reads
        close(fds[1]);                 // child doesn't write
        std::array<char, 128> buf{};
        ssize_t n = read(fds[0], buf.data(), buf.size() - 1);
        std::cout << "child received: " << std::string_view(buf.data(), n) << std::endl;
        close(fds[0]);
        _exit(0);                      // _exit skips flushing, hence std::endl above
    }

    // PARENT: writes
    close(fds[0]);                     // parent doesn't read
    constexpr std::string_view msg = "hello through the pipe";
    if (write(fds[1], msg.data(), msg.size()) < 0) return 1;
    close(fds[1]);                     // signals "no more data" to the child
    waitpid(pid, nullptr, 0);
    std::cout << "parent done\n";
}
```

**Output:**
```text
child received: hello through the pipe
parent done
```

### Common mistakes
- Not closing the unused end of a pipe. The reader then never sees "end of data" and waits forever.
- Using shared memory without synchronization → corrupted data (see [Thread Synchronization](./Thread-Synchronization.md)).

### Interview answer
"Processes are isolated, so they use IPC: pipes and FIFOs for byte streams, message queues, shared memory for highest throughput (with explicit synchronization), sockets for local or network communication, and signals for simple notifications."

---

## 9. Zombies and orphans

**In one sentence:** a **zombie** is a finished child whose parent hasn't collected its exit code yet; an **orphan** is a still-running child whose parent already died.

### In plain words
- **Zombie:** a student finished the exam and left, but the teacher hasn't collected the paper, so the seat is still marked "occupied".
- **Orphan:** the teacher left early while the student is still writing. Another teacher (the `init`/`systemd` process, PID 1) adopts the student and collects the paper at the end.

### How it works
- When a child exits, the OS keeps a small entry (PID + exit code) until the parent calls `wait`/`waitpid`. Until then, it is a zombie.
- Too many zombies can exhaust the PID table.
- Orphans are adopted by PID 1, which always waits on them, so they don't stay zombies.

### Modern C++ example (Linux/macOS)
We create a zombie on purpose, show it with `ps`, then clean it up.

```cpp
// g++ -std=c++20 main.cpp && ./a.out      (Linux/macOS)
#include <cstdlib>
#include <iostream>
#include <string>
#include <sys/wait.h>
#include <unistd.h>

int main() {
    pid_t pid = fork();
    if (pid == 0) _exit(0);             // child exits immediately

    sleep(1);                           // parent does NOT wait yet -> child is a zombie
    std::string cmd = "ps -o stat= -p " + std::to_string(pid);
    std::cout << "child state before wait: " << std::flush;
    [[maybe_unused]] int rc = std::system(cmd.c_str());   // prints "Z" (zombie)

    waitpid(pid, nullptr, 0);           // reap the zombie
    std::cout << "reaped. zombie is gone.\n";
}
```

**Output (may vary):**
```text
child state before wait: Z
reaped. zombie is gone.
```

### Common mistakes
- Long-running servers that `fork` for each request but never call `waitpid` slowly fill up with zombies. Fix: `waitpid` in a `SIGCHLD` handler, or ignore `SIGCHLD`.

### Interview answer
"A zombie is a terminated process whose entry remains in the process table until its parent reaps it with wait. An orphan is a running process whose parent exited; it is re-parented to init/systemd, which reaps it."

---

## Cheat sheet

| Term | One-liner |
|---|---|
| Process | A running program with its own memory and PID |
| PID | Unique number the OS gives each process |
| PCB | Kernel record with everything needed to pause/resume a process |
| States | New → Ready ⇄ Running → Terminated, plus Waiting for I/O |
| `fork` | Copy the current process (returns 0 in the child) |
| `exec` | Replace the current process's program |
| `wait`/`waitpid` | Parent collects the child's exit status |
| Context switch | Save one process's CPU state, load another's |
| IPC | Pipes, message queues, shared memory, sockets, signals |
| Zombie / Orphan | Dead-but-not-reaped child / live child with a dead parent |

**Next:** [Threads](./Threads.md) — lighter-weight "workers" *inside* a process.
