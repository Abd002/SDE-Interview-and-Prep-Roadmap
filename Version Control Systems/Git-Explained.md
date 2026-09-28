# Git — Explained for Beginners

> **What you'll learn:** what version control is and how Git works *inside*: the working tree, staging area and commits; why commits are **snapshots identified by hashes**; what **branches** and **HEAD** really are; how **merging** (fast-forward and three-way) and **conflicts** work; **rebase**; **remotes** (clone, fetch, pull, push); how to **undo** things safely; and team **workflows**. Every concept shows the real `git` commands **and** a small C++ model of what Git does internally.
>
> **Prerequisites:** none. A longer command reference: [Git.md](./Git.md).

## Table of Contents
0. [What is version control?](#0-what-is-version-control)
1. [The three areas: working tree, staging area, repository](#1-the-three-areas-working-tree-staging-area-repository)
2. [Commits are snapshots identified by hashes](#2-commits-are-snapshots-identified-by-hashes)
3. [Branches and HEAD](#3-branches-and-head)
4. [Merging and conflicts](#4-merging-and-conflicts)
5. [Rebase](#5-rebase)
6. [Remotes: clone, fetch, pull, push](#6-remotes-clone-fetch-pull-push)
7. [Undoing changes](#7-undoing-changes)
8. [Workflows and best practices](#8-workflows-and-best-practices)
9. [Cheat sheet](#cheat-sheet)

---

## 0. What is version control?

**In one sentence:** a version control system (VCS) records **every change** to a set of files over time, so you can see who changed what and why, go back to any earlier version, and let many people work on the same project safely.

### In plain words
Without version control, projects end up as `report_final.docx`, `report_final2.docx`, `report_FINAL_really.docx`, and emailing files around. A VCS is like an unlimited, organized **"save game" system** for a whole folder: each save has a message, an author and a date, and you can create **parallel timelines** (branches) to try ideas without breaking the main one.

### How it works
- **Centralized VCS** (SVN, Perforce): one central server has the history; you need it for most operations.
- **Distributed VCS** (**Git**, Mercurial): **every clone has the complete history**. You can commit, branch and view history offline, then sync with others.
- Git was created by Linus Torvalds in 2005 for the Linux kernel; it's now the standard. Hosting platforms (GitHub, GitLab, [Bitbucket](./Bitbucket.md)) add collaboration features on top: pull requests, code review, CI/CD, issue tracking.

---

## 1. The three areas: working tree, staging area, repository

**In one sentence:** Git has three places your changes live: the **working tree** (files you edit), the **staging area / index** (changes selected for the next commit), and the **repository** (committed history in the `.git` folder).

### In plain words
Packing boxes for a move:
- **Working tree** = your room, where you rearrange things freely.
- **Staging area** = the open box by the door: you choose exactly which items go into this box.
- **Commit** = sealing and labeling the box ("kitchen stuff, 3 June"). Sealed boxes are kept forever in the storage unit (**repository**).

Staging lets you make **focused commits**: you changed 5 files but only commit the 2 that belong to "fix login bug".

### How it works
```bash
git init                          # create a repository (.git folder)
git status                        # what's modified, what's staged
git add main.cpp                  # stage one file (git add -p: stage only parts of a file)
git diff                          # changes NOT yet staged
git diff --staged                 # changes staged for the next commit
git commit -m "Fix login timeout" # seal the staged snapshot into history
git log --oneline --graph         # view history
```

### Modern C++ example — the three areas as a model
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <vector>

using Files = std::map<std::string, std::string>;       // filename -> content

struct Commit { std::string message; Files snapshot; };

struct Repo {
    Files working_tree;                                  // what you edit
    Files staging;                                       // what the next commit will contain
    std::vector<Commit> history;                         // sealed snapshots

    void add(const std::string& file) { staging[file] = working_tree.at(file); }
    void commit(const std::string& msg) { history.push_back({msg, staging}); }
    void status() const {
        for (const auto& [f, content] : working_tree) {
            auto it = staging.find(f);
            std::cout << "  " << f << ": "
                      << (it == staging.end() ? "untracked" : it->second == content ? "staged/clean" : "modified, not staged")
                      << '\n';
        }
    }
};

int main() {
    Repo repo;
    repo.working_tree = {{"login.cpp", "timeout=10"}, {"notes.txt", "todo"}};
    repo.add("login.cpp");                              // only the file that belongs in this commit
    repo.commit("Add login");
    repo.working_tree["login.cpp"] = "timeout=30";      // edit after committing
    std::cout << "git status:\n";
    repo.status();
    std::cout << "commit #1 contains " << repo.history[0].snapshot.size() << " file(s): login.cpp = "
              << repo.history[0].snapshot.at("login.cpp") << '\n';
}
```

**Output:**
```text
git status:
  login.cpp: modified, not staged
  notes.txt: untracked
commit #1 contains 1 file(s): login.cpp = timeout=10
```

### Interview answer
"Git tracks three areas: the working tree you edit, the index or staging area where you assemble the next commit, and the repository of committed snapshots. `git add` moves changes into the index and `git commit` records the index as a new commit, which enables small, focused commits."

---

## 2. Commits are snapshots identified by hashes

**In one sentence:** each commit stores a **snapshot of the whole project** (not just differences), plus author, message and a pointer to its **parent** commit, and it's identified by a **hash** (SHA-1, or SHA-256) of all that content.

### In plain words
Each commit is a **photograph** of the entire project, with a caption and a note saying "this photo comes after photo X". The photo's ID is a **fingerprint computed from its content**: change one pixel and you get a completely different fingerprint. That makes history tamper-evident — changing an old commit changes its ID and the IDs of all commits after it.

### How it works
Git is a **content-addressed** store. Its four object types:
| Object | Contains |
|---|---|
| **blob** | File contents (no name) |
| **tree** | A directory: names → blob/tree hashes |
| **commit** | Top-level tree hash, parent commit hash(es), author, date, message |
| **tag** | A named, annotated pointer to a commit |

- Identical files are stored **once** (same content → same hash), so unchanged files cost nothing in a new commit.
- `git cat-file -p <hash>` shows any object; `git log` walks parent pointers backward.
- Git compresses objects and packs deltas in "packfiles" for storage, but *conceptually* every commit is a full snapshot.

### Modern C++ example — content-addressed objects and a hash chain
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cstdint>
#include <format>
#include <iostream>
#include <map>
#include <string>

// Stand-in for SHA-1: a stable 32-bit FNV-1a hash, shown as 8 hex digits.
std::string hash_of(const std::string& content) {
    std::uint32_t h = 2166136261u;
    for (unsigned char c : content) { h ^= c; h *= 16777619u; }
    return std::format("{:08x}", h);
}

class ObjectStore {
public:
    std::string put(const std::string& content) {        // store once per unique content
        std::string id = hash_of(content);
        objects_.emplace(id, content);
        return id;
    }
    std::size_t size() const { return objects_.size(); }
private:
    std::map<std::string, std::string> objects_;
};

int main() {
    ObjectStore store;
    std::string readme = store.put("blob:# My project");
    std::string main1  = store.put("blob:int main() {}");
    std::string tree1  = store.put("tree:README.md=" + readme + ";main.cpp=" + main1);
    std::string c1     = store.put("commit:tree=" + tree1 + ";parent=none;msg=Initial commit");

    std::string main2  = store.put("blob:int main() { return 0; }");                 // only main.cpp changed
    std::string readme_again = store.put("blob:# My project");                         // same content -> same id
    std::string tree2  = store.put("tree:README.md=" + readme_again + ";main.cpp=" + main2);
    std::string c2     = store.put("commit:tree=" + tree2 + ";parent=" + c1 + ";msg=Return 0");

    std::cout << "commit " << c2 << " -> parent " << c1 << '\n';
    std::cout << "README unchanged, reused blob: " << (readme == readme_again ? "yes" : "no") << '\n';
    std::cout << "objects stored: " << store.size() << " (the README blob is stored only once)\n";

    // Tamper with history: change the first commit's message -> its id changes, breaking the chain.
    std::string tampered = hash_of("commit:tree=" + tree1 + ";parent=none;msg=Initial commit!!");
    std::cout << "edited old commit gets a new id: " << tampered << " != " << c1 << '\n';
}
```

**Output:**
```text
commit 60fcb87a -> parent 41c3f383
README unchanged, reused blob: yes
objects stored: 7 (the README blob is stored only once)
edited old commit gets a new id: 6fbe5565 != 41c3f383
```

### Interview answer
"Git is a content-addressed object database of blobs, trees, commits and tags. A commit records a full snapshot via its root tree plus parent pointers and metadata, and is named by the hash of its content, so identical files are deduplicated and history is tamper-evident: changing any commit changes its hash and all descendants'."

---

## 3. Branches and HEAD

**In one sentence:** a **branch** is just a **movable label pointing at a commit**, and **HEAD** is a pointer to the branch (or commit) you currently have checked out; committing moves the current branch forward.

### In plain words
Commits are pages in a notebook, each linked to the page before. A branch is a **sticky bookmark** saying "the feature-login story is at *this* page". Creating a branch is just adding a bookmark — no copying — which is why Git branches are instant and cheap. **HEAD** is your finger: "this is the bookmark I'm reading and writing on now".

### How it works
```bash
git branch feature-login          # create a new label at the current commit
git switch feature-login          # move HEAD to it (older: git checkout feature-login)
git switch -c bugfix-42           # create + switch in one step
git branch                        # list branches (* marks HEAD)
git log --oneline --graph --all   # see where every label points
```
- A new commit's parent is the commit HEAD points to; then the current branch label moves to the new commit.
- **Detached HEAD:** HEAD points directly at a commit (e.g. after `git checkout <hash>`); new commits aren't on any branch unless you create one.

### Modern C++ example — branches are pointers
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <string>
#include <vector>

struct Commit { std::string msg; int parent; };

struct Repo {
    std::vector<Commit> commits;                          // index = commit id
    std::map<std::string, int> branches;                  // branch name -> commit id
    std::string head = "main";

    void commit(const std::string& msg) {
        int parent = branches.contains(head) ? branches[head] : -1;
        commits.push_back({msg, parent});
        branches[head] = static_cast<int>(commits.size()) - 1;   // the CURRENT branch moves forward
    }
    void branch(const std::string& name) { branches[name] = branches[head]; }   // just a new label
    void switch_to(const std::string& name) { head = name; }
    void log() const {
        std::cout << "log of " << head << ":";
        for (int c = branches.at(head); c != -1; c = commits[c].parent) std::cout << " [" << c << ' ' << commits[c].msg << ']';
        std::cout << '\n';
    }
};

int main() {
    Repo r;
    r.commit("init");
    r.commit("add README");
    r.branch("feature");                 // costs nothing: one integer
    r.switch_to("feature");
    r.commit("start feature");
    r.switch_to("main");
    r.commit("hotfix");
    for (const auto& [name, id] : r.branches) std::cout << name << " -> commit " << id << '\n';
    r.log();
    r.switch_to("feature");
    r.log();
}
```

**Output:**
```text
feature -> commit 2
main -> commit 3
log of main: [3 hotfix] [1 add README] [0 init]
log of feature: [2 start feature] [1 add README] [0 init]
```

### Interview answer
"A Git branch is a lightweight movable reference to a commit, and HEAD references the currently checked-out branch. Creating a branch just writes a pointer, and each commit advances the current branch; a detached HEAD points straight at a commit."

---

## 4. Merging and conflicts

**In one sentence:** merging combines the work of two branches: if one branch is simply ahead, Git **fast-forwards** the label; otherwise it does a **three-way merge** using the branches' **common ancestor**, and asks you to resolve **conflicts** where both sides changed the same lines.

### In plain words
Two people edited copies of the same document. To combine them you look at **three** versions: the **original** (common ancestor), **yours** and **theirs**. If only one person changed a paragraph, take their version. If both changed the *same* paragraph differently, a human must decide — that's a **conflict**.

### How it works
```bash
git switch main
git merge feature          # bring feature's commits into main
# if conflicts: edit the files, remove the markers, then
git add file.cpp
git commit                 # completes the merge
git merge --abort          # or give up and return to before the merge
```
- **Fast-forward:** main hasn't moved since feature branched off → just move the main label forward. No new commit.
- **Three-way merge:** both moved → Git finds the **merge base**, combines changes, and creates a **merge commit** with **two parents**.
- **Conflict markers** in the file:
  ```text
  <<<<<<< HEAD
  timeout = 30;
  =======
  timeout = 60;
  >>>>>>> feature
  ```
- Reduce conflicts: small, short-lived branches; merge/rebase `main` into your branch often; consistent formatting (clang-format).

### Modern C++ example — three-way merge with conflict detection
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <set>
#include <string>

using Config = std::map<std::string, std::string>;       // each key = one "line" of a file

Config three_way_merge(const Config& base, const Config& ours, const Config& theirs, std::set<std::string>& conflicts) {
    std::set<std::string> keys;
    for (const auto* v : {&base, &ours, &theirs}) for (const auto& [k, _] : *v) keys.insert(k);
    Config result;
    auto get = [](const Config& c, const std::string& k) { auto it = c.find(k); return it == c.end() ? std::string("<none>") : it->second; };
    for (const auto& k : keys) {
        std::string b = get(base, k), o = get(ours, k), t = get(theirs, k);
        std::string chosen;
        if (o == t)      chosen = o;                          // both agree (or neither changed)
        else if (o == b) chosen = t;                          // only theirs changed -> take theirs
        else if (t == b) chosen = o;                          // only ours changed -> take ours
        else { conflicts.insert(k); chosen = "<<<<<<< ours: " + o + " ======= theirs: " + t + " >>>>>>>"; }
        if (chosen != "<none>") result[k] = chosen;
    }
    return result;
}

int main() {
    Config base   {{"timeout", "10"}, {"retries", "3"}, {"log", "info"}};
    Config main_b {{"timeout", "30"}, {"retries", "3"}, {"log", "info"}};                 // main changed timeout
    Config feature{{"timeout", "60"}, {"retries", "5"}, {"log", "info"}, {"cache", "on"}};  // feature: timeout, retries, cache

    std::set<std::string> conflicts;
    Config merged = three_way_merge(base, main_b, feature, conflicts);
    for (const auto& [k, v] : merged) std::cout << k << " = " << v << '\n';
    std::cout << conflicts.size() << " conflict(s) to resolve by hand\n";
}
```

**Output:**
```text
cache = on
log = info
retries = 5
timeout = <<<<<<< ours: 30 ======= theirs: 60 >>>>>>>
1 conflict(s) to resolve by hand
```

### Interview answer
"If the target branch hasn't diverged, Git fast-forwards the branch pointer. Otherwise it performs a three-way merge using the merge base: changes made on only one side are taken automatically, and overlapping different changes become conflicts marked in the file for manual resolution, after which a merge commit with two parents is created."

---

## 5. Rebase

**In one sentence:** `git rebase` **replays your commits on top of another branch**, creating new commits with new hashes, so history looks like a straight line instead of containing merge commits.

### In plain words
You wrote three chapters based on an old version of the book's outline. Meanwhile the editor updated the outline. Rebasing is **rewriting your three chapters as if you had started from the new outline**: same ideas, but now they come *after* the latest changes, in a neat sequence.

### How it works
```bash
git switch feature
git rebase main             # replay feature's commits onto the tip of main
# resolve conflicts commit by commit: fix, git add, git rebase --continue (or --abort)
git rebase -i HEAD~3        # interactive: squash, reorder, reword the last 3 commits
git push --force-with-lease # needed after rebasing a branch you already pushed
```
| | Merge | Rebase |
|---|---|---|
| History | True, with merge commits (may look busy) | Linear and clean |
| Commit hashes | Unchanged | **New** hashes for replayed commits |
| Safety | Never rewrites history | Rewrites history |
| Conflicts | Resolved once | May be resolved per replayed commit |

**Golden rule:** never rebase commits that **others have already based work on** (shared/public branches); rebase your own local or feature branches only.

### Modern C++ example — replaying commits onto a new base
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <cstdint>
#include <format>
#include <iostream>
#include <string>
#include <vector>

struct Commit { std::string id, msg; };

std::string new_id(const std::string& parent, const std::string& msg) {   // the id hashes the PARENT too
    std::uint32_t h = 2166136261u;
    for (unsigned char c : parent + "|" + msg) { h ^= c; h *= 16777619u; }
    return std::format("{:07x}", h & 0xfffffff);
}

int main() {
    std::vector<Commit> main_branch{{"a1", "init"}, {"b2", "main: update deps"}, {"c3", "main: fix typo"}};
    std::vector<Commit> feature_only{{"x7", "feat: add parser"}, {"y8", "feat: add tests"}};   // branched from a1

    std::vector<Commit> rebased = main_branch;
    for (const auto& c : feature_only) {                    // replay each commit on the new tip
        Commit replayed{new_id(rebased.back().id, c.msg), c.msg};
        std::cout << "replay " << c.id << " (" << c.msg << ") -> new commit " << replayed.id << '\n';
        rebased.push_back(replayed);
    }
    std::cout << "linear history:";
    for (const auto& c : rebased) std::cout << ' ' << c.id;
    std::cout << '\n';
}
```

**Output:**
```text
replay x7 (feat: add parser) -> new commit cda667d
replay y8 (feat: add tests) -> new commit d5d7a92
linear history: a1 b2 c3 cda667d d5d7a92
```
Same changes, new identities — which is exactly why rebasing shared history confuses everyone who still has the old commits.

### Interview answer
"Rebase re-applies a branch's commits onto a new base, producing new commits and a linear history, whereas merge preserves the true topology with merge commits. Interactive rebase can squash and reorder commits. Because it rewrites hashes, I only rebase private branches and use --force-with-lease when updating a pushed branch."

---

## 6. Remotes: clone, fetch, pull, push

**In one sentence:** a **remote** is another copy of the repository (usually on GitHub/GitLab/Bitbucket) that you synchronize with: **clone** copies it, **fetch** downloads new commits, **pull** = fetch + merge/rebase, and **push** uploads your commits.

### In plain words
Your laptop has a full copy of the project's history. The company server has another. **Fetch** is checking the server's mailbox for new letters without opening them into your work; **pull** is fetching *and* merging them into your current work; **push** is mailing your new letters to the server.

### How it works
```bash
git clone https://bitbucket.org/team/app.git    # full copy + a remote named "origin"
git remote -v                                   # list remotes
git fetch origin                                # update origin/main etc. (remote-tracking branches)
git pull --rebase origin main                   # fetch + rebase your local commits on top
git push -u origin feature-login                # publish a branch and set upstream
```
- **Remote-tracking branches** (`origin/main`) are your local, read-only record of where the remote's branches were at the last fetch.
- A push is **rejected** if the remote has commits you don't have ("non-fast-forward") → fetch/pull first, integrate, then push.
- Forks: your own server-side copy of someone else's repository, used for open-source contributions via pull requests.

### Modern C++ example — why a push gets rejected, and how pull fixes it
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <algorithm>
#include <iostream>
#include <string>
#include <vector>

using History = std::vector<std::string>;             // commits in order

bool is_prefix(const History& a, const History& b) {   // is a an ancestor-line of b?
    return a.size() <= b.size() && std::equal(a.begin(), a.end(), b.begin());
}

bool push(History& remote, const History& local) {
    if (!is_prefix(remote, local)) return false;       // remote has commits we don't: non-fast-forward
    remote = local;
    return true;
}

int main() {
    History remote{"c1", "c2"};
    History ana = remote, ben = remote;                 // both clone

    ben.push_back("ben-fix");
    std::cout << "ben pushes: " << (push(remote, ben) ? "accepted" : "rejected") << '\n';

    ana.push_back("ana-feature");
    std::cout << "ana pushes: " << (push(remote, ana) ? "accepted" : "rejected (fetch first!)") << '\n';

    // ana: git pull --rebase  -> take remote history, replay her commit on top
    History fetched = remote;
    fetched.push_back("ana-feature'");
    ana = fetched;
    std::cout << "ana pushes after pull --rebase: " << (push(remote, ana) ? "accepted" : "rejected") << '\n';
    std::cout << "remote history:";
    for (const auto& c : remote) std::cout << ' ' << c;
    std::cout << '\n';
}
```

**Output:**
```text
ben pushes: accepted
ana pushes: rejected (fetch first!)
ana pushes after pull --rebase: accepted
remote history: c1 c2 ben-fix ana-feature'
```

### Interview answer
"Remotes are other copies of the repository. Clone copies one and sets up origin; fetch downloads new objects and updates remote-tracking branches without touching my work; pull is fetch plus merge or rebase; push uploads my commits and is rejected if it wouldn't be a fast-forward, in which case I integrate the remote changes first."

---

## 7. Undoing changes

**In one sentence:** Git offers different "undo" tools depending on *where* the mistake is: **`restore`** for uncommitted file changes, **`reset`** to move a branch back (rewrites local history), and **`revert`** to add a new commit that undoes an old one (safe for shared history).

### In plain words
- `restore` = erase what you wrote on the page before saving.
- `reset` = tear out the last few pages of *your own* notebook.
- `revert` = in a *shared* notebook, you can't tear out pages others have read, so you add a new page saying "cancel what page 12 said".

### How it works
| Situation | Command |
|---|---|
| Discard edits in a file | `git restore file.cpp` |
| Unstage a file (keep edits) | `git restore --staged file.cpp` |
| Fix the last commit's message/content (not pushed) | `git commit --amend` |
| Undo last commit, keep changes staged | `git reset --soft HEAD~1` |
| Undo last commit, keep changes unstaged | `git reset HEAD~1` (mixed, default) |
| Throw away last commit **and** its changes | `git reset --hard HEAD~1` ⚠️ |
| Undo a commit that's already pushed/shared | `git revert <hash>` (new inverse commit) |
| Save work-in-progress temporarily | `git stash` / `git stash pop` |
| "I lost a commit!" | `git reflog` — every position HEAD had, to recover it |
| Find which commit introduced a bug | `git bisect start/bad/good` — binary search over history |

### Modern C++ example — reset vs. revert
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <string>
#include <vector>

struct Commit { std::string msg; int balance_change; };

int balance(const std::vector<Commit>& h) { int b = 0; for (const auto& c : h) b += c.balance_change; return b; }
void show(const char* label, const std::vector<Commit>& h) {
    std::cout << label << ":";
    for (const auto& c : h) std::cout << " [" << c.msg << "]";
    std::cout << "  -> balance " << balance(h) << '\n';
}

int main() {
    std::vector<Commit> history{{"deposit 100", 100}, {"buggy fee", -30}, {"deposit 50", 50}};
    show("original       ", history);

    auto reset = history;                        // git reset --hard HEAD~2  (rewrites history)
    reset.resize(1);
    show("reset (local)  ", reset);              // later commits are gone -> dangerous if shared

    auto revert = history;                       // git revert <buggy fee>  (adds an inverse commit)
    revert.push_back({"Revert \"buggy fee\"", +30});
    show("revert (shared)", revert);             // history intact, effect undone
}
```

**Output:**
```text
original       : [deposit 100] [buggy fee] [deposit 50]  -> balance 120
reset (local)  : [deposit 100]  -> balance 100
revert (shared): [deposit 100] [buggy fee] [deposit 50] [Revert "buggy fee"]  -> balance 150
```

### Interview answer
"For uncommitted changes I use restore; for local commits, amend or reset with soft, mixed or hard depending on whether to keep the changes; for commits already shared, revert, which adds an inverse commit instead of rewriting history. Reflog recovers 'lost' commits, stash parks work in progress, and bisect finds the commit that introduced a bug."

---

## 8. Workflows and best practices

**In one sentence:** teams agree on a **branching workflow** (how branches are created, reviewed and released) and on commit hygiene so collaboration stays smooth.

### How it works
| Workflow | Idea | Good for |
|---|---|---|
| **GitHub flow / feature branches** | Short-lived branch per change → pull request → review + CI → merge to `main` → deploy | Most web teams, continuous delivery |
| **Trunk-based development** | Everyone integrates into `main` at least daily; incomplete work hidden behind feature flags | High-velocity teams, CI/CD |
| **Git flow** | `main` + `develop` + feature/release/hotfix branches | Versioned releases (apps, libraries) with release cycles |
| **Forking workflow** | Contributors fork, push to their fork, open PRs upstream | Open source |

Best practices:
- **Commit messages:** imperative subject ≤ ~50 chars ("Add retry to payment client"), blank line, then *why*. Conventional Commits (`feat:`, `fix:`) help automate changelogs.
- **Small, atomic commits** — one logical change each; the build passes at every commit (makes `bisect` and `revert` easy).
- **Short-lived branches**, frequent integration, **pull requests with review** and required CI checks, protected `main`.
- **`.gitignore`** for build outputs (`build/`, `*.o`), IDE files and secrets; never commit passwords/keys (rotate them if you do — history keeps them). Use **Git LFS** for large binaries.
- **Tags** for releases: `git tag -a v1.4.0 -m "Release 1.4.0"`; semantic versioning.
- Hooks (pre-commit: format + lint) and signed commits where required.

### Interview answer
"I use short-lived feature branches merged through reviewed pull requests with required CI checks into a protected main — GitHub flow or trunk-based development with feature flags — or Git flow when shipping versioned releases. Commits are small, atomic and well described, build outputs and secrets are git-ignored, and releases are tagged."

---

## Cheat sheet

| Concept | Remember |
|---|---|
| Three areas | Working tree → `git add` → staging → `git commit` → repository |
| Commit | Full snapshot + parent(s) + metadata, named by its hash |
| Branch | Movable pointer to a commit; HEAD = where you are |
| Merge | Fast-forward, or three-way with merge base; conflicts need a human |
| Rebase | Replay commits on a new base; new hashes; don't rebase shared history |
| Remotes | clone, fetch (download), pull (fetch + integrate), push (upload) |
| Undo | restore (files), reset (local commits), revert (shared commits), reflog (rescue) |
| Workflow | Feature branches + PRs + CI; small commits; tags for releases |
