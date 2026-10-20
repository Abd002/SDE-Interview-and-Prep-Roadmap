/* Layer H: Operating System & Hardware */
N({ id: "cpu", g: "H1", n: "CPU cores & caches", ab: "core L1 L2 L3 cache SIMD registers", loc: ["CPU"], own: "Hardware",
  p: "All computation happens here; memory is far slower than the CPU.",
  s: "Several cores, each with registers and private L1/L2 caches, sharing an L3. A cache miss to DRAM costs ~100 ns; an SSD read ~100 µs; data layout decides speed.",
  ex: "Column stores and vectorized engines are fast largely because they keep data in CPU caches.", rel: ["vectorized"] });
N({ id: "threads", g: "H1", n: "Processes & threads", ab: "process thread PCB fork", loc: ["OS", "RAM"], own: "Kernel",
  p: "Run many activities at once with isolation where needed.",
  s: "A process has its own address space; threads inside it share memory but have their own stacks and registers.",
  impl: "PostgreSQL uses a process per connection; MySQL uses a thread per connection (or a thread pool).", rel: ["conpool"] });
N({ id: "sched", g: "H1", n: "CPU scheduling & context switches", ab: "scheduler CFS EEVDF round robin context switch", loc: ["OS", "CPU"], own: "Kernel scheduler",
  p: "More runnable threads than cores.",
  s: "The scheduler picks which thread runs on each core (Linux CFS, EEVDF since 6.6). A context switch saves one thread's registers and loads another's: pure overhead, plus cache and TLB pollution.",
  f: ["A latch holder that gets descheduled makes spinning waiters burn CPU."], rel: ["spinlock"] });
N({ id: "modes", g: "H1", n: "User mode, kernel mode & system calls", ab: "syscall kernel mode privilege read write", loc: ["OS", "CPU"], own: "Kernel",
  p: "Processes must not touch hardware or other processes directly.",
  s: "Applications run in user mode. To do I/O they make system calls (read, pwrite, fsync, send, mmap), which switch the CPU into kernel mode.", cx: "A syscall costs roughly 0.1–1 µs plus the work it does." });
N({ id: "interrupts", g: "H1", n: "Interrupts & DMA", ab: "interrupt IRQ DMA direct memory access", loc: ["CPU", "OS"], own: "Hardware + kernel",
  p: "Devices finish I/O asynchronously; copying data byte by byte through the CPU is wasteful.",
  s: "DMA lets the SSD or NIC copy data straight into RAM; an interrupt (or polling) tells the kernel the transfer is done." });
N({ id: "vmem", g: "H2", n: "Virtual memory", ab: "virtual address physical address address space", loc: ["OS", "RAM"], own: "Kernel + MMU",
  p: "Give every process its own large, isolated address space.",
  s: "Programs use virtual addresses. The MMU translates them to physical frames using per-process page tables. Pages not in RAM cause page faults.",
  mis: "A virtual-memory page (often 4 KB, or 2 MB huge pages) is not a database page; a buffer pool frame occupies one or more VM pages.", rel: ["page", "frame"] });
N({ id: "ospt", g: "H2", n: "OS page tables", ab: "page table entry PTE multi-level", loc: ["RAM", "OS"], own: "Kernel (walked by the MMU)",
  p: "Map virtual pages to physical frames.",
  s: "Multi-level tree of page table entries (present bit, frame number, dirty, accessed, permissions).",
  mis: "Not the DBMS buffer pool page table, which maps database page IDs to buffer frames in user space.", rel: ["pagetable"] });
N({ id: "tlb", g: "H2", n: "TLB", ab: "translation lookaside buffer TLB shootdown huge pages", loc: ["CPU"], own: "Hardware",
  p: "Walking the page table on every memory access would be too slow.",
  s: "A small cache of recent virtual → physical translations. Changing mappings on a multi-core machine needs TLB shootdowns (inter-processor interrupts), one reason mmap-based DBMSs struggle." });
N({ id: "pagefault", g: "H2", n: "Page faults & demand paging", ab: "page fault minor major demand paging swap", loc: ["OS", "RAM", "DISK"], own: "Kernel",
  p: "Load memory only when it is touched.",
  s: "Accessing a page that is not mapped traps into the kernel. Minor fault: page already in RAM (e.g. page cache), just map it. Major fault: read from disk; the thread blocks.",
  f: ["With mmap, the DBMS cannot control when a thread stalls on a major fault."], rel: ["mmap"] });
N({ id: "osrepl", g: "H2", n: "OS page replacement", ab: "FIFO LRU CLOCK working set swap kswapd", loc: ["OS", "RAM"], own: "Kernel",
  p: "Physical RAM is full; which page should the kernel reclaim?",
  s: "The kernel uses CLOCK-like approximations of LRU (Linux: active/inactive lists, now multi-gen LRU) over all processes' pages and the page cache. Thrashing happens when working sets do not fit.",
  mis: "This manages OS memory for all processes. The DBMS replacer manages only buffer pool frames, using query knowledge the kernel lacks.", cmp: "replacement", rel: ["replacer", "lruk", "clock"] });
N({ id: "allocators", g: "H2", n: "Memory allocators (buddy, slab, fits)", ab: "buddy allocator slab first fit best fit malloc fragmentation", loc: ["OS", "RAM"], own: "Kernel and user-space malloc",
  p: "Hand out memory blocks of many sizes with little fragmentation.",
  s: "Buddy allocator: power-of-two blocks split and merged with their buddy (Linux page frames). Slab: caches of same-size kernel objects. First fit / best fit: search a free list for a hole (classic malloc strategies).",
  con: ["Buddy: internal fragmentation. First fit: external fragmentation."] });
N({ id: "mmap", g: "H2", n: "Memory-mapped files", ab: "mmap msync madvise", loc: ["OS", "RAM", "DISK"], own: "Kernel",
  p: "Access a file as if it were memory.",
  s: "mmap maps file pages into the address space; reads fault them in via the page cache. Tempting as a buffer pool, but the kernel decides when dirty pages are written (breaking WAL ordering), faults stall threads, errors arrive as SIGBUS, and TLB shootdowns hurt scalability.",
  ex: "LMDB and early MongoDB used mmap; most DBMSs avoid it for writes.", rel: ["doublecache", "bpm"] });
N({ id: "fd", g: "H3", n: "File descriptors & VFS", ab: "file descriptor fd open VFS", loc: ["OS"], own: "Kernel",
  p: "A uniform handle for files, sockets and devices.",
  s: "open() returns a small integer; read/write/fsync act on it. The VFS layer dispatches to the right filesystem driver." });
N({ id: "filesystem", g: "H3", n: "Filesystems & metadata", ab: "inode directory extent ext4 XFS", loc: ["DISK", "OS"], own: "Kernel",
  p: "Turn raw blocks into named, growable files.",
  s: "Inodes hold file metadata and block pointers or extents; directories map names to inodes. The DBMS stores its pages inside ordinary files.", rel: ["diskmgr"] });
N({ id: "journalfs", g: "H3", n: "Journaling filesystems", ab: "ext4 journal ordered mode writeback", loc: ["DISK", "OS"], own: "Kernel",
  p: "Keep filesystem metadata consistent after a crash.",
  s: "Write intended changes to a journal, commit, then apply. ext4's default ordered mode journals metadata only. It does not make the database's data durable; the DBMS still needs its own WAL and fsync.",
  mis: "Filesystem journaling protects the filesystem's structure, not your transaction's atomicity.", rel: ["wal", "crashcons"] });
N({ id: "pagecache", g: "H3", n: "OS page cache", ab: "page cache buffer cache file cache", loc: ["RAM", "OS"], own: "Kernel",
  p: "Disk reads are slow; recently used file data should stay in RAM.",
  s: "The kernel caches file pages in free RAM for all processes. Buffered read() copies from it; write() dirties it and the kernel writes back later unless fsync forces it.",
  mis: "The page cache is shared, kernel-managed and policy-blind; the DBMS buffer pool is private and knows about transactions and WAL.", cmp: "bpvscache", rel: ["doublecache"] });
N({ id: "directio", g: "H3", n: "Direct vs buffered I/O & fsync", ab: "O_DIRECT fsync fdatasync buffered I/O", loc: ["OS", "DISK"], own: "Kernel",
  p: "Control caching and durability of database files.",
  s: "Buffered I/O goes through the page cache. O_DIRECT transfers between the user buffer and the device (aligned I/O), skipping the page cache. Either way, durability needs fsync/fdatasync (or O_DSYNC).",
  f: ["fsync errors were historically reported once and then lost (PostgreSQL 'fsyncgate', 2018)."], mis: "O_DIRECT is not a durability guarantee; the device's volatile cache still needs a flush." });
N({ id: "blocklayer", g: "H3", n: "Block layer & I/O scheduler", ab: "block device bio mq-deadline NVMe queue", loc: ["OS"], own: "Kernel",
  p: "Many requests to one device should be merged, ordered and queued well.",
  s: "The block layer turns file I/O into block requests, merges adjacent ones, and dispatches them through per-CPU queues (blk-mq) to the driver." });
N({ id: "ssd", g: "H3", n: "SSD", ab: "NVMe flash FTL SSD", loc: ["DISK"], own: "Hardware",
  p: "Fast persistent storage.",
  s: "Flash memory behind a flash translation layer (FTL). Reads ~10–100 µs; high parallelism (deep queues); writes go to erased blocks, so the FTL does garbage collection (its own write amplification).",
  f: ["A volatile write cache without power-loss protection can lose acknowledged writes unless flushed."] });
N({ id: "hdd", g: "H3", n: "HDD", ab: "hard disk seek rotational latency", loc: ["DISK"], own: "Hardware",
  p: "Cheap, large persistent storage.",
  s: "Spinning platters; a random read costs a seek + rotation (~5–10 ms), while sequential reads are fast. This gap is why databases love sequential I/O (logs, LSM trees)." });
N({ id: "oslocks", g: "H4", n: "Mutexes & condition variables", ab: "futex pthread mutex condition variable", loc: ["OS", "RAM"], own: "Kernel + threading library",
  p: "Threads must coordinate and sleep while waiting.",
  s: "A mutex gives one owner at a time; a condition variable lets a thread sleep until another signals. On Linux both are built on futexes: no syscall when uncontended.", rel: ["latch"] });
N({ id: "ipc", g: "H4", n: "IPC & shared memory", ab: "pipe shared memory message queue signal", loc: ["OS", "RAM"], own: "Kernel",
  p: "Separate processes must exchange data.",
  s: "Pipes, sockets, message queues, signals, and shared memory (fastest; needs synchronization).",
  ex: "PostgreSQL's backends share the buffer pool through a shared memory segment." });
N({ id: "osdeadlock", g: "H4", n: "Deadlock handling (OS)", ab: "Coffman conditions lock ordering", loc: ["LOGIC"], own: "Kernel and programs",
  p: "Threads waiting on each other's resources forever.",
  s: "Four conditions: mutual exclusion, hold and wait, no preemption, circular wait. Programs usually prevent it by acquiring locks in a fixed global order.",
  mis: "DBMS lock managers detect and abort; OS-level code mostly prevents by ordering.", rel: ["deadlock"] });
N({ id: "sockets", g: "H5", n: "Sockets & kernel buffers", ab: "socket send buffer receive buffer epoll", loc: ["OS", "RAM", "NET"], own: "Kernel",
  p: "Programs need an endpoint for network communication.",
  s: "A socket is a file descriptor; the kernel keeps send and receive buffers for it. send() returns once data is copied into the kernel buffer, not when the peer received it.",
  mis: "A successful send() does not mean the other side processed the request." });
N({ id: "tcpip", g: "H5", n: "TCP/IP", ab: "TCP IP congestion control retransmission", loc: ["OS", "NET"], own: "Kernel network stack",
  p: "Deliver a reliable byte stream over an unreliable packet network.",
  s: "IP routes packets; TCP adds ordering, retransmission, flow control and congestion control on top. A connection can still break, and TCP cannot tell you whether the application acted on your data.", rel: ["tcpudp"] });
