# Bitbucket — Explained for Beginners

> **What you'll learn:** what Bitbucket is, how it relates to Git, its main features — **repositories and workspaces, pull requests and code review, branch permissions and merge checks, Bitbucket Pipelines (CI/CD), Jira integration** — Cloud vs. Data Center, and how it compares to GitHub and GitLab. Includes a real `bitbucket-pipelines.yml` for a C++ project and C++ models of merge checks and a pipeline.
>
> **Prerequisites:** [Git](./Git-Explained.md).

## Table of Contents
1. [What is Bitbucket?](#1-what-is-bitbucket)
2. [Repositories, workspaces and projects](#2-repositories-workspaces-and-projects)
3. [Pull requests, code review and merge checks](#3-pull-requests-code-review-and-merge-checks)
4. [Bitbucket Pipelines (CI/CD)](#4-bitbucket-pipelines-cicd)
5. [Jira and Atlassian integration](#5-jira-and-atlassian-integration)
6. [Bitbucket Cloud vs. Data Center, and vs. GitHub/GitLab](#6-bitbucket-cloud-vs-data-center-and-vs-githubgitlab)
7. [Cheat sheet](#cheat-sheet)

---

## 1. What is Bitbucket?

**In one sentence:** Bitbucket is Atlassian's **Git repository hosting and collaboration platform** — a server where teams store their Git repositories and review, test and ship code together.

### In plain words
Git is the **notebook system** that records every change on your computer. Bitbucket is the **shared office library** where the team keeps the official copy of the notebooks, with a front desk that checks every change (reviews), a machine that automatically tests it (Pipelines), and a direct line to the project-planning board (Jira).

### How it works
- You use normal Git commands against a Bitbucket **remote**: `git clone git@bitbucket.org:team/app.git`, `git push`, `git pull`.
- Bitbucket adds: web UI for code/history, **pull requests** with inline review, **branch permissions**, **Pipelines** CI/CD, **Deployments** tracking, access control (users, groups, SSH keys, access tokens), and deep **Jira/Confluence** integration.
- It's especially common in companies already using Atlassian tools (Jira, Confluence).
- (Historically it also supported Mercurial; Bitbucket is Git-only since 2020.)

---

## 2. Repositories, workspaces and projects

**In one sentence:** in Bitbucket Cloud, a **workspace** is the top-level container for a team or company, **projects** group related repositories inside it, and **repositories** hold the Git code.

### In plain words
Workspace = the company building. Projects = departments (floors). Repositories = the individual filing cabinets on each floor. Permissions can be set per building, per floor, or per cabinet.

### How it works
```bash
# clone with SSH (add your public key in Personal settings -> SSH keys)
git clone git@bitbucket.org:acme-workspace/payments-service.git
# or HTTPS with an app password / access token
git clone https://bitbucket.org/acme-workspace/payments-service.git
```
- Repository settings: default branch, **branching model** (e.g. `feature/`, `bugfix/`, `release/`, `hotfix/` prefixes), branch permissions, merge strategies (merge commit, squash, fast-forward), webhooks, access keys for deploy servers.
- Permissions: **read, write, admin** at workspace/project/repository level; groups for teams.
- Forks for contributors without write access.

### Modern C++ example — permission inheritance: workspace → project → repository
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <optional>
#include <string>

enum class Access { None = 0, Read = 1, Write = 2, Admin = 3 };
const char* name(Access a) {
    switch (a) { case Access::None: return "none"; case Access::Read: return "read";
                 case Access::Write: return "write"; case Access::Admin: return "admin"; }
    return "?";
}

struct Level { std::map<std::string, Access> grants; };            // user/group -> access

// The effective access is the HIGHEST granted at any level (repository, project or workspace).
Access effective(const std::string& user, const Level& workspace, const Level& project, const Level& repo) {
    Access best = Access::None;
    for (const Level* l : {&workspace, &project, &repo})
        if (auto it = l->grants.find(user); it != l->grants.end() && it->second > best) best = it->second;
    return best;
}

int main() {
    Level workspace{{{"ana", Access::Admin}, {"ben", Access::Read}, {"cara", Access::Read}}};
    Level payments_project{{{"ben", Access::Write}}};              // ben develops on the payments project
    Level payments_repo{{{"cara", Access::Write}}};                // cara only contributes to this repo

    for (const char* user : {"ana", "ben", "cara", "dan"})
        std::cout << user << " on payments-service: " << name(effective(user, workspace, payments_project, payments_repo)) << '\n';
}
```

**Output:**
```text
ana on payments-service: admin
ben on payments-service: write
cara on payments-service: write
dan on payments-service: none
```

### Interview answer
"Bitbucket Cloud organizes code as workspaces containing projects containing Git repositories, with read, write and admin permissions at each level, SSH keys or access tokens for authentication, configurable branching models and merge strategies, and forks for outside contributors."

---

## 3. Pull requests, code review and merge checks

**In one sentence:** a **pull request (PR)** asks to merge one branch into another; teammates review the diff and comment inline, and **merge checks** (required approvals, passing builds, resolved tasks) plus **branch permissions** decide whether it may be merged.

### In plain words
Before a new chapter goes into the official book, it goes on the **editor's desk**: two editors must sign off, the spell-checker (the build) must pass, and every sticky note (task) must be addressed. Only then can it be added — and nobody is allowed to slip pages into the official book directly.

### How it works
1. Push a branch: `git push -u origin feature/PAY-123-refund-api`.
2. Open a PR in the UI (source → destination branch, description, reviewers). Bitbucket shows the diff, commits and build status.
3. Reviewers add **inline comments**, **tasks** (must-fix to-dos), and **approve** or **request changes**.
4. Push more commits to update the PR.
5. **Merge checks** (Premium features on Cloud can *enforce* them): minimum number of approvals, approval from **default reviewers / code owners**, **successful builds**, **no unresolved tasks**, no changes requested.
6. **Branch permissions** protect `main`/`release/*`: prevent direct pushes, force-pushes (history rewrites) and deletion; only allow merges via PR.
7. Merge with a chosen strategy (merge commit, squash, fast-forward); optionally delete the source branch.

### Modern C++ example — evaluating merge checks for a pull request
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <set>
#include <string>
#include <vector>

struct PullRequest {
    std::string title;
    std::set<std::string> approvals;
    bool changes_requested = false;
    int open_tasks = 0;
    std::string build_status;           // "SUCCESSFUL", "FAILED", "INPROGRESS"
};

struct MergeChecks {
    int min_approvals = 2;
    std::set<std::string> code_owners{"lead-ana"};      // at least one must approve

    std::vector<std::string> failures(const PullRequest& pr) const {
        std::vector<std::string> f;
        if (static_cast<int>(pr.approvals.size()) < min_approvals)
            f.push_back("needs " + std::to_string(min_approvals) + " approvals (has " + std::to_string(pr.approvals.size()) + ")");
        bool owner_ok = false;
        for (const auto& o : code_owners) owner_ok = owner_ok || pr.approvals.contains(o);
        if (!owner_ok) f.push_back("needs a code owner approval");
        if (pr.changes_requested) f.push_back("a reviewer requested changes");
        if (pr.open_tasks > 0) f.push_back(std::to_string(pr.open_tasks) + " unresolved task(s)");
        if (pr.build_status != "SUCCESSFUL") f.push_back("last build is " + pr.build_status);
        return f;
    }
};

void evaluate(const MergeChecks& checks, const PullRequest& pr) {
    auto f = checks.failures(pr);
    std::cout << pr.title << ": " << (f.empty() ? "MERGE ALLOWED" : "merge blocked") << '\n';
    for (const auto& reason : f) std::cout << "  - " << reason << '\n';
}

int main() {
    MergeChecks checks;
    PullRequest pr{"PAY-123 Add refund API", {"ben"}, false, 1, "FAILED"};
    evaluate(checks, pr);

    pr.approvals.insert("lead-ana");     // code owner approves
    pr.open_tasks = 0;                   // author resolves the task
    pr.build_status = "SUCCESSFUL";      // fix pushed, Pipelines passes
    evaluate(checks, pr);
}
```

**Output:**
```text
PAY-123 Add refund API: merge blocked
  - needs 2 approvals (has 1)
  - needs a code owner approval
  - 1 unresolved task(s)
  - last build is FAILED
PAY-123 Add refund API: MERGE ALLOWED
```

### Interview answer
"In Bitbucket, changes go through pull requests with inline comments, tasks, approvals and build status. Branch permissions block direct and force pushes to protected branches, and merge checks can require a minimum number of approvals, code-owner or default-reviewer approval, successful builds and no unresolved tasks before merging with the chosen strategy."

---

## 4. Bitbucket Pipelines (CI/CD)

**In one sentence:** Bitbucket Pipelines is the built-in **CI/CD** service: a `bitbucket-pipelines.yml` file in the repository defines **steps** that run in Docker containers on every push or pull request — build, test, and deploy.

### In plain words
A robot that, every time someone hands in a change, automatically builds the project, runs all the tests and, if everything is green on `main`, ships it to the servers — and reports a ✅ or ❌ on the pull request.

### How it works
- Configuration lives **in the repo** (`bitbucket-pipelines.yml`), so it's versioned and reviewed like code.
- Each **step** runs in a fresh Docker container (`image:`); steps can share **artifacts** and **caches**, run in **parallel**, and have manual triggers.
- Triggers: `default` (every push), `branches:` (per branch pattern), `pull-requests:`, `tags:`, `custom:` (manual/scheduled).
- **Deployments**: steps marked `deployment: staging/production` track what's deployed where; use **repository/deployment variables** (secured) for secrets.
- **Pipes**: reusable integrations (deploy to AWS, Kubernetes, Slack notifications…).
- Runners: Atlassian-hosted, or **self-hosted runners** for special hardware or private networks.

A real pipeline for a C++/CMake project:
```yaml
# bitbucket-pipelines.yml
image: gcc:13

definitions:
  caches:
    build-cache: build
  steps:
    - step: &build-and-test
        name: Build and test
        caches: [build-cache]
        script:
          - apt-get update && apt-get install -y cmake
          - cmake -S . -B build -DCMAKE_BUILD_TYPE=Release -DCMAKE_CXX_FLAGS="-Wall -Wextra -Werror"
          - cmake --build build -j
          - ctest --test-dir build --output-on-failure
        artifacts:
          - build/app

pipelines:
  pull-requests:
    '**':                                  # every PR must build and pass tests
      - step: *build-and-test
      - step:
          name: Sanitizers
          script:
            - apt-get update && apt-get install -y cmake
            - cmake -S . -B asan -DCMAKE_CXX_FLAGS="-fsanitize=address,undefined -g"
            - cmake --build asan -j && ctest --test-dir asan --output-on-failure
  branches:
    main:
      - step: *build-and-test
      - step:
          name: Deploy to staging
          deployment: staging
          script:
            - ./scripts/deploy.sh staging  # uses secured deployment variables
      - step:
          name: Deploy to production
          deployment: production
          trigger: manual                  # a human clicks "Run"
          script:
            - ./scripts/deploy.sh production
```

### Modern C++ example — how a pipeline runs: sequential steps, stop on first failure, manual gate
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <functional>
#include <iostream>
#include <string>
#include <vector>

struct Step {
    std::string name;
    std::function<bool()> script;           // returns true on success (exit code 0)
    bool manual = false;
};

void run_pipeline(const std::string& trigger, const std::vector<Step>& steps, bool manual_approved) {
    std::cout << "Pipeline for " << trigger << ":\n";
    for (const auto& s : steps) {
        if (s.manual && !manual_approved) { std::cout << "  [paused]  " << s.name << " (waiting for manual trigger)\n"; return; }
        bool ok = s.script();
        std::cout << "  [" << (ok ? "passed" : "FAILED") << "]  " << s.name << '\n';
        if (!ok) { std::cout << "  pipeline FAILED -> PR shows a red build, merge checks block the merge\n"; return; }
    }
    std::cout << "  pipeline SUCCESSFUL\n";
}

int main() {
    bool tests_pass = false;
    std::vector<Step> main_pipeline{
        {"Build and test", [&] { return tests_pass; }},
        {"Deploy to staging", [] { return true; }},
        {"Deploy to production", [] { return true; }, /*manual=*/true},
    };
    run_pipeline("commit a1b2c3 on main", main_pipeline, false);
    tests_pass = true;                                                  // the fix is pushed
    run_pipeline("commit d4e5f6 on main", main_pipeline, false);
    run_pipeline("commit d4e5f6 on main (release approved)", main_pipeline, true);
}
```

**Output:**
```text
Pipeline for commit a1b2c3 on main:
  [FAILED]  Build and test
  pipeline FAILED -> PR shows a red build, merge checks block the merge
Pipeline for commit d4e5f6 on main:
  [passed]  Build and test
  [passed]  Deploy to staging
  [paused]  Deploy to production (waiting for manual trigger)
Pipeline for commit d4e5f6 on main (release approved):
  [passed]  Build and test
  [passed]  Deploy to staging
  [passed]  Deploy to production
  pipeline SUCCESSFUL
```

### Interview answer
"Bitbucket Pipelines is CI/CD defined in a versioned bitbucket-pipelines.yml: steps run in Docker containers, triggered by pushes, pull requests, branches, tags or manually, with caches, artifacts, parallel steps, secured variables, reusable pipes, deployment environments with manual gates, and optional self-hosted runners. Build results feed PR merge checks."

---

## 5. Jira and Atlassian integration

**In one sentence:** Bitbucket links code to work items: mentioning a **Jira issue key** (like `PAY-123`) in branch names, commits or PR titles connects them, so Jira shows the branches, commits, PRs, builds and deployments for each issue — and can even move the issue's status automatically.

### In plain words
Every task card on the project board automatically gets a list of "here's the code that implements this card, here's its review, and here's when it went live". Managers see progress without asking developers, and developers find the *why* behind any line of code.

### How it works
```bash
git switch -c feature/PAY-123-refund-api          # branch name contains the issue key
git commit -m "PAY-123 Add refund endpoint"         # commit message contains the key
# Smart commits (if enabled): perform Jira actions from the commit message
git commit -m "PAY-123 #comment Endpoint done #time 2h #in-progress"
```
- Jira's **development panel** shows linked branches, commits, PRs, build and deployment status.
- **Automation rules:** e.g. PR created → move issue to "In Review"; PR merged → "Done".
- Create a branch directly from a Jira issue.
- Confluence pages can embed code snippets and link to repos; Bitbucket also integrates with Slack/Teams and IDEs.

### Modern C++ example — extracting Jira issue keys from branches and commits
```cpp
// g++ -std=c++20 main.cpp && ./a.out
#include <iostream>
#include <map>
#include <regex>
#include <set>
#include <string>
#include <vector>

// Jira keys look like PROJECT-123: uppercase project code, dash, number.
std::set<std::string> issue_keys(const std::string& text) {
    static const std::regex key(R"(\b[A-Z][A-Z0-9]+-\d+\b)");
    std::set<std::string> keys;
    for (auto it = std::sregex_iterator(text.begin(), text.end(), key); it != std::sregex_iterator(); ++it)
        keys.insert(it->str());
    return keys;
}

int main() {
    const std::vector<std::string> activity{
        "branch: feature/PAY-123-refund-api",
        "commit: PAY-123 Add refund endpoint",
        "commit: PAY-123 PAY-130 Validate refund amount",
        "commit: fix typo in README",
        "pull request: PAY-123 Refund API",
    };
    std::map<std::string, std::vector<std::string>> development_panel;       // issue -> linked activity
    for (const auto& a : activity)
        for (const auto& k : issue_keys(a)) development_panel[k].push_back(a);

    for (const auto& [issue, items] : development_panel) {
        std::cout << issue << " (" << items.size() << " linked):\n";
        for (const auto& i : items) std::cout << "  " << i << '\n';
    }
}
```

**Output:**
```text
PAY-123 (4 linked):
  branch: feature/PAY-123-refund-api
  commit: PAY-123 Add refund endpoint
  commit: PAY-123 PAY-130 Validate refund amount
  pull request: PAY-123 Refund API
PAY-130 (1 linked):
  commit: PAY-123 PAY-130 Validate refund amount
```

### Interview answer
"Bitbucket integrates tightly with Jira: issue keys in branch names, commit messages and PR titles link development activity to issues, Jira's development panel shows branches, commits, PRs, builds and deployments, smart commits can comment or transition issues, and automation can move issues through the workflow as PRs are opened and merged."

---

## 6. Bitbucket Cloud vs. Data Center, and vs. GitHub/GitLab

**Deployment options**
| | Bitbucket Cloud | Bitbucket Data Center |
|---|---|---|
| Hosting | SaaS at bitbucket.org, managed by Atlassian | Self-managed on your servers/cloud (clustered for high availability) |
| CI/CD | Bitbucket Pipelines | Usually Bamboo, Jenkins or others |
| Good for | Teams wanting zero maintenance | Strict compliance, data residency, air-gapped networks, huge scale |
(Bitbucket **Server**, the single-node self-hosted edition, reached end of support in 2024; Data Center is its successor.)

**Compared with other platforms**
| | Bitbucket | GitHub | GitLab |
|---|---|---|---|
| Owner | Atlassian | Microsoft | GitLab Inc. |
| Strength | Jira/Confluence integration, enterprise Atlassian shops | Largest community & open source, Actions marketplace, Copilot | All-in-one DevOps platform, strong self-hosting |
| CI/CD | Pipelines | GitHub Actions | GitLab CI/CD |
| Self-hosted | Data Center | GitHub Enterprise Server | GitLab Self-Managed (incl. free edition) |
| Code review | Pull requests | Pull requests | Merge requests |

All three host plain Git, so moving between them mostly means moving the repository (full history comes along) and translating CI configuration.

### Interview answer
"Bitbucket is Atlassian's Git hosting platform, available as Cloud with built-in Pipelines or as self-managed Data Center. Its main differentiator is deep Jira and Confluence integration; GitHub leads in community and ecosystem, and GitLab in all-in-one DevOps and self-hosting. Because all use Git, the workflow concepts — branches, pull requests, reviews, CI — transfer directly."

---

## Cheat sheet

| Concept | One-liner |
|---|---|
| Bitbucket | Atlassian's Git hosting + collaboration (Cloud or Data Center) |
| Workspace → project → repository | Hierarchy for organizing code and permissions |
| Pull request | Review, inline comments, tasks, approvals, build status |
| Branch permissions | Block direct/force pushes and deletion on protected branches |
| Merge checks | Required approvals, code owners, green builds, no open tasks |
| Pipelines | CI/CD in `bitbucket-pipelines.yml`; Docker steps; deployments; manual gates |
| Jira integration | Issue keys in branches/commits/PRs; development panel; smart commits |
