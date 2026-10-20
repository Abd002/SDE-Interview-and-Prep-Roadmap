# Computer Systems Atlas

**Open it online:** <https://claude.ai/artifact/QwnhLZycRbykzkrmJC9e7P>

## Run it on your computer

You need Python 3 (no packages) and a browser.

```bash
git clone https://github.com/Abd002/SDE-Interview-and-Prep-Roadmap.git
cd SDE-Interview-and-Prep-Roadmap/Study-Plan/Systems-Atlas
python3 serve.py
```

Your browser opens <http://localhost:8000>. Stop it with `Ctrl+C`. Use another port with `python3 serve.py 9000`. On Windows, type `py serve.py` if `python3` isn't found.

**Without Python:** double-click `index.html` in this folder. It works the same, because all scripts load from the folder itself.

Notes:
- Fonts come from Google Fonts. Offline, the page falls back to your system fonts and still works.
- Study status (learning / understood / needs revision) is saved in your browser when you run it locally. In the online version it's also saved to your account.

One zoomable map of how a computer system runs a database: from the client's SQL query, through query processing, storage, indexes, the buffer pool, transactions and recovery, down to the OS and the hardware, and out across machines with replication, consensus, distributed transactions, LSM storage and distributed execution.

## What's in it

| | |
|---|---|
| **14 layers, 46 subsystems, 269 concepts** | Each concept has a panel: the problem it solves, a simple explanation, where it lives, how it works step by step, complexity, pros and cons, failure cases, links to other layers, alternatives, an example and common confusions. |
| **Where it lives** | Coloured dots on every concept: RAM, disk/SSD, CPU, OS/kernel, network, multi-node, logical. Most concepts carry several (a B+ tree is pages on disk with hot pages cached in RAM). |
| **366 links** | Six arrow styles: data flow, control flow, depends on, replication, recovery, related concept. Click an arrow to see both ends. |
| **17 comparisons** | LRU vs LRU-K vs CLOCK vs LFU, B+ tree vs hash index vs LSM, locks vs latches, MVCC vs 2PL, WAL vs shadow paging, buffer pool vs OS page cache, Raft vs ordinary replication, 2PC vs saga, and more. |
| **8 scenarios** | Reading a SQL query, inserting a record, buffer pool eviction, crash recovery, LSM write and read, network partition, concurrent updates, distributed query. Each step is highlighted on the map. |
| **Study status** | Mark each concept *learning*, *understood* or *needs revision*. Saved to your account when the page can, otherwise in the browser. |

## How to use it

- **Zoom** with the scroll wheel or a pinch; **pan** by dragging. Zooming in shows more: layers → subsystems → every concept.
- **Click** a layer title, a subsystem or a concept to open its panel. *Focus on this* dims everything except it and what it connects to.
- **Search** with `/` (names, acronyms such as WAL, LSN, MVCC, or words such as eviction).
- **Overview** (`0`) returns to the whole system. `Esc` clears the selection.

## Files

| File | What it holds |
|---|---|
| `serve.py` | Local launcher: serves this folder and opens the atlas |
| `index.html` | Page shell and styles |
| `app.js` | Layout, drawing, zoom, panels, search, scenarios, comparisons |
| `data/layers.js` | Data model, layers and subsystems |
| `data/nodes-*.js` | The concepts, one file per group of layers |
| `data/edges.js` | Every link between concepts |
| `data/scenarios.js`, `data/comparisons.js` | Scenario steps and comparison tables |

To add a concept, add an `N({...})` entry in the right `nodes-*.js` file and its links with `E(from, to, type, label)` in `edges.js`. Refresh the browser to see the change.
