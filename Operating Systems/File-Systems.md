# File Systems — Explained for Beginners

> **What you'll learn:** what a file system is and how files are stored (blocks, inodes, directories), then the four roadmap topics: **journaling file systems (ext3/ext4)**, **network file systems (NFS, SMB)**, **file system encryption**, and **distributed file systems (HDFS, Ceph)**.
>
> **Prerequisites:** none, but [Processes](./Processes.md) helps.

## Table of Contents
0. [File system basics: blocks, inodes and directories](#0-file-system-basics-blocks-inodes-and-directories)
1. [Journaling file systems (ext3, ext4)](#1-journaling-file-systems-ext3-ext4)
2. [Network file systems (NFS, SMB)](#2-network-file-systems-nfs-smb)
3. [File system encryption](#3-file-system-encryption)
4. [Distributed file systems (HDFS, Ceph)](#4-distributed-file-systems-hdfs-ceph)
5. [Cheat sheet](#cheat-sheet)

---

## 0. File system basics: blocks, inodes and directories

**In one sentence:** a file system is the set of rules and data structures the OS uses to organize raw disk space into named files and folders.

### In plain words
A disk is like a giant notebook with millions of numbered, identical pages and no table of contents. A file system adds:
- a **table of contents** (directories: name → where the file is),
- **index cards** for each file (inodes: size, owner, permissions, and which pages hold the content),
- a **list of empty pages** (free-space bitmap).

### How it works
- **Block:** the smallest unit the file system reads/writes (commonly 4 KB).
- **Inode** (index node, Unix): metadata for one file — size, owner, permissions, timestamps, and pointers to its data blocks. **The file name is not in the inode.**
- **Directory:** a special file containing a list of `(name, inode number)` pairs.
- **Path lookup** `/home/ana/notes.txt`: start at the root directory's inode → find `home` → its inode → find `ana` → … → `notes.txt`'s inode → its data blocks.
- **Hard link:** another name pointing at the same inode. **Symbolic link:** a small file containing a path.
- Common file systems: ext4, XFS, Btrfs (Linux), NTFS (Windows), APFS (macOS), FAT32/exFAT (USB sticks).

```
 directory "ana"                 inode #812                 data blocks
 ┌───────────────────┐       ┌──────────────────┐       ┌──────────┐
 │ notes.txt -> 812  │ ────> │ size: 6000 bytes │ ────> │ block 90 │
 │ photo.jpg -> 977  │       │ owner: ana       │ ────> │ block 91 │
 └───────────────────┘       │ perms: rw-r--r-- │       └──────────┘
                             └──────────────────┘
```

### Modern C++ example — the file system through `std::filesystem` (C++17)
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <filesystem>
#include <fstream>
#include <iostream>

namespace fs = std::filesystem;

int main() {
    fs::path dir = "fs_demo";
    fs::remove_all(dir);                             // start clean
    fs::create_directories(dir / "docs");

    std::ofstream(dir / "docs" / "notes.txt") << "hello file system";
    fs::create_hard_link(dir / "docs" / "notes.txt", dir / "same_file.txt");

    for (const auto& entry : fs::recursive_directory_iterator(dir)) {
        std::cout << entry.path().generic_string()
                  << (entry.is_directory() ? " [dir]" : "")
                  << (entry.is_regular_file() ? " size=" + std::to_string(entry.file_size()) : "")
                  << '\n';
    }
    std::cout << "hard links to notes.txt: "
              << fs::hard_link_count(dir / "docs" / "notes.txt") << '\n';
    fs::remove_all(dir);
}
```

**Output (may vary):**
```text
fs_demo/docs [dir]
fs_demo/docs/notes.txt size=17
fs_demo/same_file.txt size=17
hard links to notes.txt: 2
```
(The listing order depends on the file system.)

### Interview answer
"A file system maps names to data on a block device. On Unix, directories map names to inode numbers, and inodes hold metadata and block pointers. Path resolution walks directory inodes from the root. Hard links are extra names for the same inode; symlinks store a path."

---

## 1. Journaling file systems (ext3, ext4)

**In one sentence:** a journaling file system first writes a note in a log ("journal") describing the change it's about to make, so that after a crash it can finish or undo half-done changes instead of leaving the disk corrupted.

### In plain words
Moving money between two accounts takes two steps: subtract from one, add to the other. If the power goes out between them, money vanishes. A careful bank clerk first writes in a logbook: *"Moving $50 from A to B"*, then does the two steps, then writes *"done"*. After a power cut, the clerk reads the logbook: any entry without "done" is re-done (or ignored if it was never fully written). Nothing is lost or half-finished.

Creating a file also takes several disk writes (allocate an inode, mark blocks used, add a directory entry, write data). A crash in the middle used to require a slow full-disk check (`fsck`) that could take hours. With a journal, recovery takes seconds.

### How it works
1. **Write-ahead:** write the planned changes into the journal (a reserved area of the disk).
2. Write a **commit record** to the journal. Now the transaction is "official".
3. **Checkpoint:** apply the changes to their real locations on disk.
4. Mark the journal entry as free.
5. **On reboot after a crash:** replay committed transactions; discard uncommitted ones.

**ext3/ext4 journaling modes:**
| Mode | What is journaled | Speed | Safety |
|---|---|---|---|
| `journal` | Metadata **and** file data | Slowest | Safest |
| `ordered` (default) | Metadata only, but data is written *before* its metadata commits | Good | Good — no garbage in files |
| `writeback` | Metadata only, no ordering | Fastest | File may contain old garbage after a crash |

**ext4 vs. ext3:** ext4 adds **extents** (store "blocks 1000–1999" as one entry instead of 1000 pointers), **delayed allocation** (decide block placement at flush time → less fragmentation), journal **checksums**, larger file/volume limits, and faster `fsck`.

Other file systems use different techniques for the same goal: **copy-on-write** (Btrfs, ZFS, APFS) never overwrite data in place.

### Modern C++ example — a tiny journal with crash recovery
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Op { std::string key; int value; };
struct Txn { std::vector<Op> ops; bool committed = false; };

class JournaledDisk {
public:
    std::map<std::string, int> disk;      // the "real" data locations
    std::vector<Txn> journal;             // the write-ahead log

    // Step 1+2: log the intent, then the commit record. Step 3: apply.
    void transaction(std::vector<Op> ops, bool crash_before_commit, bool crash_before_apply) {
        journal.push_back({std::move(ops)});
        if (crash_before_commit) { std::cout << "  CRASH before commit!\n"; return; }
        journal.back().committed = true;
        if (crash_before_apply)  { std::cout << "  CRASH after commit, before apply!\n"; return; }
        apply(journal.back());
        journal.pop_back();               // checkpoint done: journal entry freed
    }

    void recover() {                      // run at boot after a crash
        for (auto& t : journal) {
            if (t.committed) { apply(t); std::cout << "  recovery: replayed committed txn\n"; }
            else std::cout << "  recovery: discarded uncommitted txn\n";
        }
        journal.clear();
    }

    void print() const {
        std::cout << "  disk:";
        for (auto& [k, v] : disk) std::cout << ' ' << k << '=' << v;
        std::cout << '\n';
    }

private:
    void apply(const Txn& t) { for (auto& op : t.ops) disk[op.key] = op.value; }
};

int main() {
    JournaledDisk d;
    d.disk = {{"A", 100}, {"B", 0}};

    std::cout << "transfer 50 A->B, crash before commit:\n";
    d.transaction({{"A", 50}, {"B", 50}}, true, false);
    d.recover();
    d.print();                            // nothing changed: all-or-nothing

    std::cout << "transfer 50 A->B, crash after commit:\n";
    d.transaction({{"A", 50}, {"B", 50}}, false, true);
    d.recover();
    d.print();                            // fully applied
}
```

**Output:**
```text
transfer 50 A->B, crash before commit:
  CRASH before commit!
  recovery: discarded uncommitted txn
  disk: A=100 B=0
transfer 50 A->B, crash after commit:
  CRASH after commit, before apply!
  recovery: replayed committed txn
  disk: A=50 B=50
```
The same **write-ahead logging** idea protects databases (see [ACID](../Databases/ACID.md)).

### Common mistakes
- Thinking journaling protects *file contents* by default. In `ordered` mode only metadata is journaled; the application must still call `fsync` to guarantee its own data is durable.

### Interview answer
"A journaling file system writes intended metadata (and optionally data) changes to a log and commits them before applying them in place. After a crash it replays committed transactions and discards incomplete ones, giving consistency without a full fsck. ext4 defaults to ordered mode and adds extents, delayed allocation and journal checksums."

---

## 2. Network file systems (NFS, SMB)

**In one sentence:** a network file system lets a computer use files stored on another computer as if they were on its own disk.

### In plain words
Your family keeps all photos on one computer in the living room. From your laptop you open a folder called `Photos`, and it *looks* local — but every time you open a picture, your laptop quietly asks the living-room computer over Wi-Fi to send it.

### How it works
1. The **server** "exports" (shares) a directory.
2. The **client** "mounts" it at a local path (e.g. `/mnt/photos` or drive `Z:`).
3. When a program calls `open`/`read`/`write` on that path, the OS's file system layer turns the call into **network requests** (RPCs — remote procedure calls) to the server.
4. The client **caches** data and attributes to avoid a network round trip for every read. This creates the key challenge: **cache consistency** — what if two clients edit the same file?

| | NFS | SMB (a.k.a. CIFS, Samba on Linux) |
|---|---|---|
| Origin | Sun Microsystems, Unix world | Microsoft, Windows world |
| Typical use | Linux servers, data centers | Windows file shares, home NAS |
| State | NFSv3 stateless; NFSv4 stateful with locks and delegations | Stateful sessions, file locking, "oplocks/leases" |
| Consistency | **Close-to-open**: changes are flushed on `close`, and `open` re-checks with the server | Server grants leases; revokes them when another client wants the file |
| Auth | UIDs (v3), Kerberos (v4) | Windows accounts / Active Directory / Kerberos |

### Modern C++ example — a simulated NFS client with close-to-open consistency
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <optional>
#include <string>

struct FileServer {                                    // lives on another machine
    std::map<std::string, std::pair<std::string, int>> files; // name -> (content, version)
    int rpc_count = 0;

    std::pair<std::string, int> read(const std::string& n) { ++rpc_count; return files[n]; }
    int getattr(const std::string& n) { ++rpc_count; return files[n].second; }  // version only
    void write(const std::string& n, const std::string& c) {
        ++rpc_count; files[n] = {c, files[n].second + 1};
    }
};

class NfsClient {
public:
    explicit NfsClient(FileServer& s) : server_(s) {}

    std::string open_and_read(const std::string& name) {
        int server_version = server_.getattr(name);          // open(): revalidate
        auto& c = cache_[name];
        if (!c || c->second != server_version) c = server_.read(name);  // refetch if stale
        return c->first;
    }
    void write_and_close(const std::string& name, const std::string& content) {
        server_.write(name, content);                         // close(): flush to server
        cache_.erase(name);
    }

private:
    FileServer& server_;
    std::map<std::string, std::optional<std::pair<std::string, int>>> cache_;
};

int main() {
    FileServer server;
    server.files["todo.txt"] = {"buy milk", 1};
    NfsClient laptop(server), desktop(server);

    std::cout << "laptop reads:  " << laptop.open_and_read("todo.txt") << '\n';
    std::cout << "laptop reads:  " << laptop.open_and_read("todo.txt") << " (from cache)\n";
    desktop.write_and_close("todo.txt", "buy milk and eggs");
    std::cout << "laptop reads:  " << laptop.open_and_read("todo.txt") << " (sees the update)\n";
    std::cout << "total network calls: " << server.rpc_count << '\n';
}
```

**Output:**
```text
laptop reads:  buy milk
laptop reads:  buy milk (from cache)
laptop reads:  buy milk and eggs (sees the update)
total network calls: 6
```

### Common mistakes
- Assuming a network file system behaves exactly like a local disk. Two clients writing the same file at the same time can overwrite each other; file locks and `fsync` may behave differently; the network can disappear mid-write.

### Interview answer
"NFS and SMB let clients mount remote directories and turn file operations into RPCs. They cache aggressively for performance; NFS provides close-to-open consistency, while SMB uses server-granted leases/oplocks that are revoked on conflicting access. NFSv4 and SMB are stateful and support locking and Kerberos."

---

## 3. File system encryption

**In one sentence:** file system encryption scrambles data before it is written to disk and unscrambles it when read, so a stolen disk is useless without the key.

### In plain words
Writing your diary in a secret code. Anyone who steals the diary sees gibberish. You carry the codebook (the **key**) in your head, so when *you* read the diary it translates automatically.

### How it works
Two main flavors:
| | Full-disk encryption (FDE) | File-based encryption (FBE) |
|---|---|---|
| What's encrypted | The whole partition, every block | Individual files/directories, each with its own key |
| Examples | LUKS/dm-crypt (Linux), BitLocker (Windows), FileVault (macOS) | fscrypt (ext4/F2FS, used by Android), eCryptfs, APFS per-file keys |
| Unlock | Once at boot | Per user / per directory |
| Protects against | Stolen or lost device | Also isolates users on the same device |

Key ideas:
- **Symmetric cipher** (usually **AES**): the same key encrypts and decrypts. Disk encryption uses modes like **AES-XTS**, designed so each 512-byte/4 KB sector is encrypted independently (random access still works).
- **Key hierarchy:** your password → (slow key-derivation function like PBKDF2/Argon2) → a key-encryption key → which unlocks the real, random **data key**. Changing your password only re-encrypts the small data key, not the whole disk.
- Encryption at rest does **not** protect data from malware on a running, unlocked system.

### Modern C++ example — an encrypt-on-write / decrypt-on-read layer
> ⚠️ This uses a toy XOR-based stream cipher **only to show where encryption sits**. It is *not secure*. Real code must use a vetted library (e.g. libsodium, OpenSSL) with AES-GCM/XTS or ChaCha20.

```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cstdint>
#include <iostream>
#include <map>
#include <random>
#include <string>

// Toy keystream: a pseudo-random generator seeded by (key, block number).
// Encrypting each block independently mimics how disk encryption allows random access.
std::string xor_block(const std::string& data, std::uint64_t key, std::uint64_t block_no) {
    std::mt19937_64 keystream(key ^ (block_no * 0x9E3779B97F4A7C15ULL));
    std::string out = data;
    for (char& c : out) c = static_cast<char>(c ^ static_cast<char>(keystream()));
    return out;
}

class RawDisk {                                          // what a thief would see
public:
    std::map<std::uint64_t, std::string> blocks;
};

class EncryptedFs {                                      // sits between app and disk
public:
    EncryptedFs(RawDisk& d, std::uint64_t key) : disk_(d), key_(key) {}
    void write(std::uint64_t block, const std::string& plain) {
        disk_.blocks[block] = xor_block(plain, key_, block);   // encrypt on the way down
    }
    std::string read(std::uint64_t block) const {
        return xor_block(disk_.blocks.at(block), key_, block); // decrypt on the way up
    }
private:
    RawDisk& disk_;
    std::uint64_t key_;
};

int main() {
    RawDisk disk;
    EncryptedFs fs(disk, /*key=*/0xC0FFEE);
    fs.write(7, "my bank PIN is 4321");

    std::cout << "app reads:        " << fs.read(7) << '\n';
    std::cout << "raw disk content: " << (disk.blocks[7] == "my bank PIN is 4321" ? "PLAINTEXT!" : "scrambled") << '\n';

    EncryptedFs wrong_key(disk, 0xBAD);
    std::cout << "wrong key reads:  " << (wrong_key.read(7) == fs.read(7) ? "same" : "garbage") << '\n';
}
```

**Output:**
```text
app reads:        my bank PIN is 4321
raw disk content: scrambled
wrong key reads:  garbage
```

### Common mistakes
- Inventing your own cipher (like the toy above) for real data. Always use standard, reviewed algorithms and libraries.
- Storing the key next to the encrypted data.
- Believing disk encryption protects a running, logged-in machine.

### Interview answer
"Encryption at rest is done either at the block layer (full-disk: LUKS, BitLocker) or per file (fscrypt, APFS). It uses symmetric ciphers like AES-XTS per sector, with a key hierarchy where a user secret unlocks a random data key. It protects stolen devices, not running systems."

---

## 4. Distributed file systems (HDFS, Ceph)

**In one sentence:** a distributed file system spreads files across many machines, copying each piece to several of them so the data survives machine failures and can be read in parallel.

### In plain words
A library so big no single building can hold it. So the library splits every book into chapters, stores each chapter in **three different buildings** (in case one floods), and keeps a **catalog** that says which buildings hold which chapter. Many readers can read different chapters in different buildings at the same time.

### How it works
**HDFS (Hadoop Distributed File System):**
- Files are split into large **blocks** (128 MB by default).
- Each block is **replicated** (default 3 copies) on different **DataNodes**, with rack awareness (not all copies in the same rack).
- A central **NameNode** stores the metadata: file → list of blocks → which DataNodes hold them. (It's a single point of failure unless you run HA mode with a standby.)
- Optimized for **write-once, read-many**, huge sequential reads (MapReduce/Spark jobs); poor for many tiny files.

**Ceph:**
- A unified storage system: object storage (RADOS, S3-compatible gateway), block devices (RBD), and a file system (CephFS).
- **No central lookup table for data placement.** The **CRUSH** algorithm computes *where* an object lives from its name using a deterministic hash over the cluster map. Any client can calculate the location itself → no bottleneck.
- Data is stored on **OSDs** (object storage daemons, roughly one per disk); **monitors** keep the cluster map; replication or **erasure coding** protects data.

| | HDFS | Ceph |
|---|---|---|
| Metadata | Central NameNode | Monitors + CRUSH (computed placement); MDS for CephFS |
| Best for | Big-data analytics, large sequential files | General-purpose object/block/file storage (clouds, OpenStack, Kubernetes) |
| Durability | Replication (3×) | Replication or erasure coding |

### Modern C++ example — HDFS-style block placement vs. Ceph-style computed placement
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <cstddef>
#include <format>
#include <functional>
#include <iostream>
#include <map>
#include <string>
#include <vector>

const std::vector<std::string> nodes{"node0", "node1", "node2", "node3", "node4"};
constexpr std::size_t kReplicas = 3;

// ---- HDFS style: a central NameNode REMEMBERS where each block went ----
struct NameNode {
    std::map<std::string, std::vector<std::string>> block_locations;
    std::size_t next = 0;
    void store(const std::string& block) {
        for (std::size_t r = 0; r < kReplicas; ++r)
            block_locations[block].push_back(nodes[(next + r) % nodes.size()]);
        ++next;
    }
};

// ---- Ceph style: ANYONE can COMPUTE the location from the name (like CRUSH) ----
// Rendezvous hashing: score every node with hash(object, node); take the top 3.
std::vector<std::string> compute_placement(const std::string& object) {
    std::vector<std::pair<std::size_t, std::string>> scored;
    for (const auto& n : nodes) scored.emplace_back(std::hash<std::string>{}(object + "/" + n), n);
    std::ranges::sort(scored, std::greater<>{});
    std::vector<std::string> out;
    for (std::size_t i = 0; i < kReplicas; ++i) out.push_back(scored[i].second);
    return out;
}

int main() {
    // A 300 MB file with 128 MB blocks -> 3 blocks
    const std::size_t file_mb = 300, block_mb = 128;
    const std::size_t num_blocks = (file_mb + block_mb - 1) / block_mb;

    NameNode nn;
    for (std::size_t b = 0; b < num_blocks; ++b) nn.store(std::format("video.mp4#blk{}", b));

    std::cout << "HDFS NameNode table:\n";
    for (const auto& [blk, locs] : nn.block_locations)
        std::cout << std::format("  {} -> {}, {}, {}\n", blk, locs[0], locs[1], locs[2]);

    auto a = compute_placement("photo.jpg");
    auto b = compute_placement("photo.jpg");     // a different client, same answer
    std::cout << "Ceph-style: two clients computed the same placement for photo.jpg? "
              << (a == b ? "yes" : "no") << '\n';
}
```

**Output:**
```text
HDFS NameNode table:
  video.mp4#blk0 -> node0, node1, node2
  video.mp4#blk1 -> node1, node2, node3
  video.mp4#blk2 -> node2, node3, node4
Ceph-style: two clients computed the same placement for photo.jpg? yes
```

### Common mistakes
- Storing millions of tiny files in HDFS — every file costs NameNode memory.
- Forgetting that replicas must be on **different failure domains** (different racks/zones), or one power failure loses all copies.

### Interview answer
"Distributed file systems split data into chunks and replicate them across nodes for durability and parallel throughput. HDFS uses a central NameNode for metadata and 128 MB blocks replicated 3× with rack awareness, optimized for batch analytics. Ceph avoids a central lookup by computing placement with CRUSH, and offers object, block and file interfaces with replication or erasure coding."

---

## Cheat sheet

| Topic | Key idea |
|---|---|
| Inode | File metadata + block pointers; name lives in the directory |
| Journaling | Log → commit → apply; replay committed on recovery |
| ext4 | Ordered journaling, extents, delayed allocation |
| NFS / SMB | Remote files via RPC; caching + consistency (close-to-open, leases) |
| Encryption at rest | FDE (LUKS/BitLocker) or per-file (fscrypt); AES-XTS; key hierarchy |
| HDFS | NameNode + DataNodes, 128 MB blocks, 3× replication |
| Ceph | CRUSH computed placement, OSDs, object/block/file |

**Back to:** [README](../README.md)
