/* Computer Systems Atlas — rendering and interaction. Data comes from data/*.js (window.ATLAS). */
(function () {
  "use strict";
  var A = window.ATLAS;
  var SVGNS = "http://www.w3.org/2000/svg";
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- index the data ---------- */
  var layerById = {}, groupById = {}, nodeById = {}, cmpById = {}, scenById = {};
  A.layers.forEach(function (l) { l.groups = []; l.kind = "layer"; layerById[l.id] = l; });
  A.groups.forEach(function (g) { g.nodes = []; g.kind = "group"; g.L = layerById[g.layer]; groupById[g.id] = g; g.L.groups.push(g); });
  A.nodes.forEach(function (n) { n.steps = n.h; delete n.h; n.kind = "node"; n.G = groupById[n.g]; n.L = n.G.L; n.out = []; n.inc = []; nodeById[n.id] = n; n.G.nodes.push(n); });
  A.edges.forEach(function (e, i) {
    e.i = i; e.A = nodeById[e.a]; e.B = nodeById[e.b];
    if (!e.A || !e.B) { console.warn("Edge with unknown end", e); return; }
    e.A.out.push(e); e.B.inc.push(e);
  });
  A.edges = A.edges.filter(function (e) { return e.A && e.B; });
  A.comparisons.forEach(function (c) { cmpById[c.id] = c; });
  A.scenarios.forEach(function (s) { scenById[s.id] = s; });
  /* nodes that appear as options in a comparison get a link to it */
  A.comparisons.forEach(function (c) { c.opts.forEach(function (o) { var id = typeof o === "string" ? o : o.node; var n = nodeById[id]; if (n) { n.cmps = n.cmps || []; if (n.cmps.indexOf(c.id) < 0) n.cmps.push(c.id); } }); });
  A.nodes.forEach(function (n) { if (n.cmp) { n.cmps = n.cmps || []; if (n.cmps.indexOf(n.cmp) < 0) n.cmps.unshift(n.cmp); } });

  var LOC = {
    RAM: { n: "RAM", d: "Volatile memory; lost on crash", v: "--loc-ram" },
    DISK: { n: "Disk / SSD", d: "Persistent storage; survives restarts", v: "--loc-disk" },
    CPU: { n: "CPU", d: "Computation, registers, caches", v: "--loc-cpu" },
    OS: { n: "OS / kernel", d: "Kernel-managed resources and interfaces", v: "--loc-os" },
    NET: { n: "Network", d: "Messages between machines", v: "--loc-net" },
    MULTI: { n: "Multi-node", d: "Spans several machines", v: "--loc-multi" },
    LOGIC: { n: "Logical", d: "An abstraction with no single physical place", v: "--loc-logic" }
  };
  var LOCORDER = ["RAM", "DISK", "CPU", "OS", "NET", "MULTI", "LOGIC"];
  var ETYPE = {
    data: { n: "Data flow", d: "Data moves along this arrow" },
    ctrl: { n: "Control flow / call", d: "One component calls or drives another" },
    dep: { n: "Depends on / built from", d: "Uses or is made of" },
    repl: { n: "Replication", d: "Copies of data flow between nodes" },
    recov: { n: "Recovery", d: "Used to rebuild state after a failure" },
    rel: { n: "Related concept", d: "Cross-link: compare or contrast" }
  };

  /* ---------- study status (browser + optional account sync) ---------- */
  var STATUS = [["", "Not started"], ["learning", "Learning"], ["understood", "Understood"], ["revision", "Needs revision"]];
  var status = {};
  try { status = JSON.parse(localStorage.getItem("atlas-status-v1") || "{}") || {}; } catch (e) { status = {}; }
  var dbDoc = null, syncState = "This browser only", writeTimer = null, writing = Promise.resolve();
  function saveStatus() {
    try { localStorage.setItem("atlas-status-v1", JSON.stringify(status)); } catch (e) { /* storage unavailable */ }
    if (dbDoc) {
      clearTimeout(writeTimer);
      writeTimer = setTimeout(function () {
        var snapshot = JSON.parse(JSON.stringify(status));
        writing = writing.then(function () { return dbDoc.set({ s: snapshot }); }).then(function () { syncState = "Saved to your account"; updateSync(); }, function () { syncState = "Saved in this browser (account save failed)"; updateSync(); });
      }, 900);
    }
  }
  function updateSync() { var el = document.querySelector(".sync"); if (el) el.textContent = syncState; }
  function connectAccount() {
    if (!window.claude || typeof window.claude.use !== "function") return;
    Promise.all([window.claude.use("db"), window.claude.use("user")]).then(function (r) {
      var db = r[0], user = r[1];
      if (!db || !user) return null;
      return user.id().then(function (uid) {
        if (!uid) return null;
        var ref = db.doc("data/users/" + uid + "/status");
        return ref.get().then(function (snap) {
          if (snap.exists) { var d = snap.data(); if (d && d.s && typeof d.s === "object") { Object.keys(d.s).forEach(function (k) { status[k] = d.s[k]; }); } }
          dbDoc = ref; syncState = "Synced with your account"; updateSync(); refreshStatus();
          try { localStorage.setItem("atlas-status-v1", JSON.stringify(status)); } catch (e) { }
        });
      });
    }).catch(function () { /* stay on browser storage */ });
  }

  /* ---------- layout ---------- */
  var GEO = { W: 5400, colGap: 120, rowGap: 60, halfGap: 50, pad: 30, head: 150, gh: 54, row: 36, chip: 30, cg: 22, target: 340, maxCol: 520 };
  /* DBMS on the left, distributed systems on the right, clients on top, OS at the bottom */
  var ARR = { left: [["B", "C"], ["D", "F"], ["E", "G"]], right: [["I", "K"], ["J", "L"], ["M", "N"]] };
  var collapsed = {};
  try { collapsed = JSON.parse(localStorage.getItem("atlas-collapsed-v1") || "{}") || {}; } catch (e) { collapsed = {}; }
  var world = { w: GEO.W, h: 1000 };

  function groupHeight(g) { return collapsed[g.id] ? GEO.gh : GEO.gh + g.nodes.length * GEO.row + 8; }
  function layoutLayer(L, x, y, w) {
    L.x = x; L.y = y; L.w = w;
    var inner = w - 2 * GEO.pad;
    var ncol = Math.max(1, Math.min(L.groups.length, Math.round((inner + GEO.cg) / (GEO.target + GEO.cg))));
    var cw = Math.min(GEO.maxCol, (inner - (ncol - 1) * GEO.cg) / ncol);
    var colH = []; for (var i = 0; i < ncol; i++) colH.push(0);
    L.groups.forEach(function (g) {
      var c = 0; for (var j = 1; j < ncol; j++) if (colH[j] < colH[c] - 1) c = j;
      g.x = x + GEO.pad + c * (cw + GEO.cg); g.y = y + GEO.head + colH[c]; g.w = cw; g.h = groupHeight(g);
      g.nodes.forEach(function (n, k) { n.x = g.x + 10; n.y = g.y + GEO.gh + k * GEO.row; n.w = cw - 20; n.h = GEO.chip; });
      colH[c] += g.h + GEO.cg;
    });
    L.h = GEO.head + Math.max.apply(null, colH) - GEO.cg + GEO.pad;
    return L.h;
  }
  function natW(id) { var n = layerById[id].groups.length; return n * (GEO.target + GEO.cg) - GEO.cg + 2 * GEO.pad; }
  function layout() {
    var colW = 0;
    ARR.left.concat(ARR.right).forEach(function (row) { var w = row.reduce(function (s, id) { return s + natW(id); }, 0) + (row.length - 1) * GEO.halfGap; if (w > colW) colW = w; });
    GEO.W = 2 * colW + GEO.colGap;
    var a = layerById.A; layoutLayer(a, 0, 0, GEO.W);
    var top = a.h + GEO.rowGap;
    function column(rows, x0) {
      var y = top;
      rows.forEach(function (row) {
        var nat = row.reduce(function (s, id) { return s + natW(id); }, 0), free = colW - (row.length - 1) * GEO.halfGap, hmax = 0, x = x0;
        row.forEach(function (id) { var w = natW(id) * free / nat; var h = layoutLayer(layerById[id], x, y, w); if (h > hmax) hmax = h; x += w + GEO.halfGap; });
        row.forEach(function (id) { layerById[id].h = hmax; });
        y += hmax + GEO.rowGap;
      });
      return y;
    }
    var yl = column(ARR.left, 0), yr = column(ARR.right, colW + GEO.colGap);
    var h = layerById.H; layoutLayer(h, 0, Math.max(yl, yr), GEO.W);
    world.h = h.y + h.h; world.w = GEO.W;
  }

  /* ---------- SVG helpers ---------- */
  function el(tag, attrs, parent) {
    var e = document.createElementNS(SVGNS, tag);
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function trunc(s, max) { return s.length <= max ? s : s.slice(0, Math.max(1, max - 1)) + "…"; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  var svg = $("map"), stage = $("stage");
  var defs = el("defs", null, svg);
  Object.keys(ETYPE).forEach(function (t) {
    var m = el("marker", { id: "mk-" + t, viewBox: "0 0 10 10", refX: "8.5", refY: "5", markerWidth: "4.2", markerHeight: "4.2", orient: "auto-start-reverse", markerUnits: "strokeWidth" }, defs);
    el("path", { d: "M0,0 L10,5 L0,10 z", "class": "mk-" + t }, m);
  });
  var gWorld = el("g", { id: "world" }, svg);
  var gBack = el("g", null, gWorld), gEdges = el("g", null, gWorld), gFront = el("g", null, gWorld), gLabels = el("g", null, gWorld), gScen = el("g", null, gWorld);

  var dom = { layers: {}, groups: {}, nodes: {} };
  function build() {
    A.layers.forEach(function (L) {
      var g = el("g", { "class": "layer", "data-kind": "layer", "data-id": L.id, style: "--h:" + L.hue }, gBack);
      var r = el("rect", { "class": "lbody", rx: 22 }, g);
      var t = el("text", { "class": "ltitle", "data-kind": "layer", "data-id": L.id, role: "button", tabindex: "0", "aria-label": "Layer " + L.n }, g); t.textContent = L.n;
      var code = el("text", { "class": "lcode" }, g); code.textContent = "LAYER " + L.id;
      var tag = el("text", { "class": "ltag" }, g); tag.textContent = L.tag;
      dom.layers[L.id] = { g: g, r: r, t: t, tag: tag, code: code };
      L.groups.forEach(function (G) {
        var gg = el("g", { "class": "group", "data-kind": "group", "data-id": G.id, style: "--h:" + L.hue }, gBack);
        var gr = el("rect", { "class": "gbody", rx: 12 }, gg);
        var head = el("g", { "class": "ghead", "data-kind": "group", "data-id": G.id, role: "button", tabindex: "0", "aria-label": "Subsystem " + G.n }, gg);
        var hr = el("rect", null, head);
        var gt = el("text", { "class": "gtitle" }, head);
        var gc = el("text", { "class": "gcount", "text-anchor": "end" }, head);
        var tog = el("text", { "class": "gtoggle", "text-anchor": "middle", "data-kind": "toggle", "data-id": G.id }, gg);
        var fg = el("g", { "class": "group", "data-id": G.id, style: "--h:" + L.hue }, gFront);
        dom.groups[G.id] = { g: gg, fg: fg, r: gr, head: head, hr: hr, t: gt, c: gc, tog: tog };
        G.nodes.forEach(function (n) {
          var ng = el("g", { "class": "node", "data-kind": "node", "data-id": n.id, tabindex: "0", role: "button", "aria-label": n.n }, fg);
          var nr = el("rect", { "class": "nbody", rx: 7 }, ng);
          var st = el("rect", { "class": "nstat", rx: 2 }, ng);
          var nt = el("text", { "class": "ntext" }, ng);
          var dots = (n.loc || []).map(function (c) { var d = el("circle", { "class": "ldot", r: 5, style: "fill:var(" + LOC[c].v + ")" }, ng); var ti = el("title", null, d); ti.textContent = LOC[c].n; return d; });
          var tt = el("title", null, ng); tt.textContent = n.n + " — " + (n.loc || []).map(function (c) { return LOC[c].n; }).join(", ");
          dom.nodes[n.id] = { g: ng, r: nr, st: st, t: nt, dots: dots };
        });
      });
    });
  }
  function place() {
    A.layers.forEach(function (L) {
      var d = dom.layers[L.id];
      attrs(d.r, { x: L.x, y: L.y, width: L.w, height: L.h });
      attrs(d.code, { x: L.x + 30, y: L.y + 42 });
      attrs(d.t, { x: L.x + 28, y: L.y + 96 });
      attrs(d.tag, { x: L.x + 30, y: L.y + 134 });
      var maxTag = Math.floor((L.w - 60) / 15.5); d.tag.textContent = trunc(L.tag, maxTag);
      d.g.style.setProperty("--tsz0", Math.min(84, Math.floor((L.w - 70) / (L.n.length * 0.47))) + "px");
      L.groups.forEach(function (G) {
        var g = dom.groups[G.id];
        attrs(g.r, { x: G.x, y: G.y, width: G.w, height: G.h });
        attrs(g.hr, { x: G.x, y: G.y, width: G.w - 34, height: GEO.gh });
        attrs(g.t, { x: G.x + 14, y: G.y + 34 });
        g.t.textContent = trunc(G.n, Math.floor((G.w - 78) / 10.6));
        attrs(g.c, { x: G.x + G.w - 36, y: G.y + 33 }); g.c.textContent = G.nodes.length;
        attrs(g.tog, { x: G.x + G.w - 17, y: G.y + 34 }); g.tog.textContent = collapsed[G.id] ? "▸" : "▾";
        var tt = g.tog.querySelector("title") || el("title", null, g.tog); tt.textContent = collapsed[G.id] ? "Expand" : "Collapse";
        g.g.classList.toggle("collapsed", !!collapsed[G.id]); g.fg.classList.toggle("collapsed", !!collapsed[G.id]);
        G.nodes.forEach(function (n) {
          var nd = dom.nodes[n.id];
          attrs(nd.r, { x: n.x, y: n.y, width: n.w, height: n.h });
          attrs(nd.st, { x: n.x + 3, y: n.y + 5, width: 4, height: n.h - 10 });
          var dotsW = nd.dots.length * 12;
          attrs(nd.t, { x: n.x + 13, y: n.y + 20 });
          nd.t.textContent = trunc(n.n, Math.floor((n.w - 22 - dotsW) / 7.9));
          nd.dots.forEach(function (c, i) { attrs(c, { cx: n.x + n.w - 10 - (nd.dots.length - 1 - i) * 12, cy: n.y + n.h / 2 }); });
        });
      });
    });
    drawMinimap();
  }
  function attrs(e, o) { for (var k in o) e.setAttribute(k, o[k]); }

  /* ---------- camera ---------- */
  var cam = { x: 0, y: 0, k: 0.3 }, anim = null;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function viewport() {
    var w = stage.clientWidth, h = stage.clientHeight, l = 0, r = 0, b = 0;
    var wide = w > 760;
    if (wide && !$("panel").hidden) r = Math.min(460, w);
    if (wide && !$("side").hidden) l = Math.min(380, w);
    if (!wide && (!$("panel").hidden || !$("side").hidden)) b = h * 0.62;
    return { x: l, y: 0, w: Math.max(80, w - l - r), h: Math.max(80, h - b) };
  }
  function fitK() { var v = viewport(); return Math.min((v.w - 40) / world.w, (v.h - 40) / world.h); }
  function kMin() { return fitK() * 0.6; }
  var K_MAX = 3.2;
  function level(k) { k = k == null ? cam.k : k; return k < 0.42 ? 0 : k < 0.9 ? 1 : 2; }
  var lastLevel = -1;
  function apply() {
    gWorld.setAttribute("transform", "translate(" + cam.x + "," + cam.y + ") scale(" + cam.k + ")");
    document.documentElement.style.setProperty("--inv", (1 / cam.k).toFixed(4));
    var s = 40 * cam.k; stage.style.backgroundSize = s + "px " + s + "px"; stage.style.backgroundPosition = cam.x + "px " + cam.y + "px";
    var lv = level();
    if (lv !== lastLevel) {
      svg.classList.remove("lod0", "lod1", "lod2"); svg.classList.add("lod" + lv); lastLevel = lv;
      $("lvl").textContent = "L" + lv; $("mmlvl").textContent = ["Overview", "Subsystems", "Concepts"][lv];
      drawEdges(); drawScenario();
    }
    if (state && state.scen) resizeScenarioDots();
    updateMinimapView();
  }
  function setCam(x, y, k) { cam.x = x; cam.y = y; cam.k = k; apply(); }
  function flyTo(tx, ty, tk, ms) {
    if (anim) cancelAnimationFrame(anim.raf);
    var v = viewport();
    var vcx = v.x + v.w / 2, vcy = v.y + v.h / 2;
    var c0 = { x: (vcx - cam.x) / cam.k, y: (vcy - cam.y) / cam.k, k: cam.k };
    var c1 = { x: (vcx - tx) / tk, y: (vcy - ty) / tk, k: tk };
    if (reduceMotion || ms === 0) { setCam(tx, ty, tk); return; }
    var t0 = performance.now(), dur = ms || 520;
    var step = function (now) {
      var t = Math.min(1, (now - t0) / dur), e = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      var k = Math.exp(Math.log(c0.k) + (Math.log(c1.k) - Math.log(c0.k)) * e);
      var cx = c0.x + (c1.x - c0.x) * e, cy = c0.y + (c1.y - c0.y) * e;
      setCam(vcx - cx * k, vcy - cy * k, k);
      if (t < 1) anim.raf = requestAnimationFrame(step); else anim = null;
    };
    anim = { raf: requestAnimationFrame(step) };
  }
  function fitRect(r, opt) {
    opt = opt || {};
    var v = viewport(), pad = opt.pad == null ? 40 : opt.pad;
    var k = Math.min((v.w - 2 * pad) / r.w, (v.h - 2 * pad) / r.h);
    if (opt.minK) k = Math.max(k, opt.minK);
    if (opt.maxK) k = Math.min(k, opt.maxK);
    k = Math.max(kMin(), Math.min(K_MAX, k));
    var cx = r.x + r.w / 2, cy = r.y + r.h / 2;
    flyTo(v.x + v.w / 2 - cx * k, v.y + v.h / 2 - cy * k, k, opt.ms);
  }
  function home(ms) {
    var v = viewport(), mmH = stage.clientWidth > 760 ? $("minimap").offsetHeight + 12 : 0;
    var k = Math.min((v.w - 48) / world.w, (v.h - 32 - mmH) / world.h);
    flyTo(v.x + (v.w - world.w * k) / 2, v.y + 16, k, ms);
  }
  function zoomBy(f, sx, sy) {
    var k = Math.max(kMin(), Math.min(K_MAX, cam.k * f));
    if (sx == null) { var v = viewport(); sx = v.x + v.w / 2; sy = v.y + v.h / 2; }
    var wx = (sx - cam.x) / cam.k, wy = (sy - cam.y) / cam.k;
    setCam(sx - wx * k, sy - wy * k, k);
  }

  /* pan / zoom input */
  var pointers = {}, drag = null, moved = false;
  stage.addEventListener("wheel", function (ev) {
    ev.preventDefault(); if (anim) { cancelAnimationFrame(anim.raf); anim = null; }
    var rect = stage.getBoundingClientRect();
    var dy = ev.deltaMode === 1 ? ev.deltaY * 16 : ev.deltaY;
    var dx = ev.deltaMode === 1 ? ev.deltaX * 16 : ev.deltaX;
    if (!ev.ctrlKey && (ev.shiftKey || Math.abs(dx) > Math.abs(dy))) { setCam(cam.x - (dx || dy), cam.y, cam.k); return; }
    zoomBy(Math.exp(-dy * (ev.ctrlKey ? 0.01 : 0.0016)), ev.clientX - rect.left, ev.clientY - rect.top);
  }, { passive: false });
  stage.addEventListener("pointerdown", function (ev) {
    if (ev.button !== 0 && ev.pointerType === "mouse") return;
    pointers[ev.pointerId] = { x: ev.clientX, y: ev.clientY };
    var ids = Object.keys(pointers);
    if (ids.length === 1) { drag = { x: ev.clientX, y: ev.clientY, cx: cam.x, cy: cam.y }; moved = false; }
    else if (ids.length === 2) { var p = pointers[ids[0]], q = pointers[ids[1]]; drag = { pinch: true, d: Math.hypot(p.x - q.x, p.y - q.y), k: cam.k, mx: (p.x + q.x) / 2, my: (p.y + q.y) / 2, cx: cam.x, cy: cam.y }; moved = true; }
    if (anim) { cancelAnimationFrame(anim.raf); anim = null; }
  });
  window.addEventListener("pointermove", function (ev) {
    if (!pointers[ev.pointerId]) return;
    pointers[ev.pointerId] = { x: ev.clientX, y: ev.clientY };
    if (!drag) return;
    var rect = stage.getBoundingClientRect();
    if (drag.pinch) {
      var ids = Object.keys(pointers); if (ids.length < 2) return;
      var p = pointers[ids[0]], q = pointers[ids[1]];
      var d = Math.hypot(p.x - q.x, p.y - q.y), mx = (p.x + q.x) / 2 - rect.left, my = (p.y + q.y) / 2 - rect.top;
      var k = Math.max(kMin(), Math.min(K_MAX, drag.k * d / drag.d));
      var wx = (drag.mx - rect.left - drag.cx) / drag.k, wy = (drag.my - rect.top - drag.cy) / drag.k;
      setCam(mx - wx * k, my - wy * k, k);
    } else {
      var dx = ev.clientX - drag.x, dy = ev.clientY - drag.y;
      if (!moved && Math.hypot(dx, dy) > 5) { moved = true; stage.classList.add("dragging"); try { stage.setPointerCapture(ev.pointerId); } catch (e) { } }
      if (moved) setCam(drag.cx + dx, drag.cy + dy, cam.k);
    }
  });
  function endPointer(ev) {
    delete pointers[ev.pointerId];
    if (Object.keys(pointers).length === 0) { drag = null; stage.classList.remove("dragging"); }
    else if (drag && drag.pinch) { var id = Object.keys(pointers)[0]; drag = { x: pointers[id].x, y: pointers[id].y, cx: cam.x, cy: cam.y }; }
  }
  window.addEventListener("pointerup", endPointer); window.addEventListener("pointercancel", endPointer);

  /* clicks on the map */
  svg.addEventListener("click", function (ev) {
    if (moved) { moved = false; return; }
    var t = ev.target.closest("[data-kind],[data-edge],[data-step]");
    if (!t) { if (!state.scen) clearSelection(); return; }
    if (t.hasAttribute("data-step")) { goStep(+t.getAttribute("data-step")); return; }
    if (t.hasAttribute("data-edge")) { showEdges(t.getAttribute("data-edge").split(",").map(Number)); return; }
    var kind = t.getAttribute("data-kind"), id = t.getAttribute("data-id");
    if (kind === "toggle") { toggleGroup(id); return; }
    if (kind === "group" && level() === 0) { select("group", id, true); return; }
    select(kind, id, kind !== "node" || level() < 2);
  });
  svg.addEventListener("keydown", function (ev) {
    if (ev.key !== "Enter" && ev.key !== " ") return;
    var t = ev.target.closest("[data-kind]"); if (!t) return;
    ev.preventDefault(); select(t.getAttribute("data-kind"), t.getAttribute("data-id"), true);
  });
  svg.addEventListener("dblclick", function (ev) {
    var t = ev.target.closest("[data-kind]");
    if (t && t.getAttribute("data-kind") === "group") { ev.preventDefault(); toggleGroup(t.getAttribute("data-id")); }
  });

  function toggleGroup(id) {
    collapsed[id] = !collapsed[id]; if (!collapsed[id]) delete collapsed[id];
    try { localStorage.setItem("atlas-collapsed-v1", JSON.stringify(collapsed)); } catch (e) { }
    layout(); place(); drawEdges(); drawScenario();
  }

  /* ---------- selection state ---------- */
  var state = { sel: null, focus: null, scen: null, step: 0, showAll: false };
  function itemOf(kind, id) { return kind === "layer" ? layerById[id] : kind === "group" ? groupById[id] : nodeById[id]; }
  function rectOf(it) { return { x: it.x, y: it.y, w: it.w, h: it.h }; }
  function nodesIn(sel) {
    if (!sel) return [];
    var it = itemOf(sel.kind, sel.id);
    if (sel.kind === "node") return [it];
    if (sel.kind === "group") return it.nodes.slice();
    var out = []; it.groups.forEach(function (g) { out = out.concat(g.nodes); }); return out;
  }
  function incidentEdges(sel) {
    var set = {}, ns = nodesIn(sel), inSel = {};
    ns.forEach(function (n) { inSel[n.id] = 1; });
    ns.forEach(function (n) { n.out.concat(n.inc).forEach(function (e) {
      if (sel.kind === "layer" && inSel[e.a] && inSel[e.b]) return; /* layer view: only cross-layer links */
      set[e.i] = e; }); });
    return Object.keys(set).map(function (k) { return set[k]; });
  }
  function select(kind, id, fly) {
    var it = itemOf(kind, id); if (!it) return;
    state.sel = { kind: kind, id: id };
    if (kind === "node" && collapsed[it.g]) toggleGroup(it.g);
    renderPanel(); applyClasses(); drawEdges();
    if (fly) {
      if (kind === "node") fitRect({ x: it.G.x - 20, y: it.G.y - 20, w: it.G.w + 40, h: it.G.h + 40 }, { minK: 1.0, maxK: 1.2 });
      else if (kind === "group") fitRect(rectOf(it), { pad: 30, minK: 0.95, maxK: 1.5 });
      else fitRect(rectOf(it), { pad: 30, maxK: 1.1 });
    }
  }
  function clearSelection() { state.sel = null; $("panel").hidden = true; applyClasses(); drawEdges(); }
  function setFocus(on) {
    state.focus = on && state.sel ? { kind: state.sel.kind, id: state.sel.id } : null;
    applyClasses(); drawEdges(); renderPanel();
    if (state.focus) { var it = itemOf(state.focus.kind, state.focus.id); fitRect(rectOf(it), { pad: 40, maxK: 1.3 }); }
  }
  function applyClasses() {
    Object.keys(dom.nodes).forEach(function (id) { var g = dom.nodes[id].g; g.classList.remove("sel", "nb", "dim", "scen"); });
    Object.keys(dom.groups).forEach(function (id) { dom.groups[id].g.classList.remove("sel", "dim"); dom.groups[id].fg.classList.remove("dim"); });
    Object.keys(dom.layers).forEach(function (id) { dom.layers[id].g.classList.remove("sel", "dim"); });
    var sel = state.sel;
    if (sel) {
      if (sel.kind === "node") dom.nodes[sel.id].g.classList.add("sel");
      if (sel.kind === "group") dom.groups[sel.id].g.classList.add("sel");
      if (sel.kind === "layer") dom.layers[sel.id].g.classList.add("sel");
      incidentEdges(sel).forEach(function (e) { [e.A, e.B].forEach(function (n) { if (!(sel.kind === "node" && n.id === sel.id)) dom.nodes[n.id].g.classList.add("nb"); }); });
    }
    if (state.focus) {
      var keep = {}, keepG = {}, keepL = {};
      nodesIn(state.focus).forEach(function (n) { keep[n.id] = 1; });
      incidentEdges(state.focus).forEach(function (e) { keep[e.a] = 1; keep[e.b] = 1; });
      Object.keys(keep).forEach(function (id) { keepG[nodeById[id].g] = 1; keepL[nodeById[id].L.id] = 1; });
      A.nodes.forEach(function (n) { if (!keep[n.id]) dom.nodes[n.id].g.classList.add("dim"); });
      A.groups.forEach(function (g) { if (!keepG[g.id]) { dom.groups[g.id].g.classList.add("dim"); } });
      A.layers.forEach(function (l) { if (!keepL[l.id]) dom.layers[l.id].g.classList.add("dim"); });
    }
    if (state.scen) scenById[state.scen].steps.forEach(function (s) { dom.nodes[s.n].g.classList.add("scen"); });
    refreshStatus();
  }
  function refreshStatus() {
    var c = { learning: 0, understood: 0, revision: 0 };
    A.nodes.forEach(function (n) {
      var g = dom.nodes[n.id] && dom.nodes[n.id].g; var s = status[n.id] || "";
      if (g) { g.classList.remove("st-learning", "st-understood", "st-revision"); if (s) g.classList.add("st-" + s); }
      if (c[s] != null) c[s]++;
    });
    $("progress").textContent = c.understood + "/" + A.nodes.length + " understood";
    $("progress").title = c.learning + " learning · " + c.revision + " need revision";
  }

  /* ---------- edges ---------- */
  function visibleBox(n) {
    var lv = level();
    if (lv === 2 && !collapsed[n.g]) return { key: "n:" + n.id, x: n.x, y: n.y, w: n.w, h: n.h };
    if (lv >= 1) return { key: "g:" + n.g, x: n.G.x, y: n.G.y, w: n.G.w, h: Math.max(n.G.h, GEO.gh) };
    return { key: "l:" + n.L.id, x: n.L.x, y: n.L.y, w: n.L.w, h: n.L.h };
  }
  function clipPt(r, tx, ty) {
    var cx = r.x + r.w / 2, cy = r.y + r.h / 2, dx = tx - cx, dy = ty - cy;
    if (!dx && !dy) return [cx, cy];
    var s = Math.min(Math.abs((r.w / 2) / (dx || 1e-9)), Math.abs((r.h / 2) / (dy || 1e-9)), 1);
    return [cx + dx * s, cy + dy * s];
  }
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; }
  function curve(ra, rb, key) {
    var ca = [ra.x + ra.w / 2, ra.y + ra.h / 2], cb = [rb.x + rb.w / 2, rb.y + rb.h / 2];
    var p1 = clipPt(ra, cb[0], cb[1]), p2 = clipPt(rb, ca[0], ca[1]);
    var dx = p2[0] - p1[0], dy = p2[1] - p1[1], dist = Math.hypot(dx, dy) || 1;
    var sign = (hash(key) & 1) ? 1 : -1, off = Math.min(160, dist * 0.18) * sign;
    var c = [(p1[0] + p2[0]) / 2 - dy / dist * off, (p1[1] + p2[1]) / 2 + dx / dist * off];
    return { d: "M" + p1[0].toFixed(1) + "," + p1[1].toFixed(1) + " Q" + c[0].toFixed(1) + "," + c[1].toFixed(1) + " " + p2[0].toFixed(1) + "," + p2[1].toFixed(1),
      mid: [0.25 * p1[0] + 0.5 * c[0] + 0.25 * p2[0], 0.25 * p1[1] + 0.5 * c[1] + 0.25 * p2[1]] };
  }
  function bundle(list, anyType) {
    var map = {}, order = [];
    list.forEach(function (e) {
      var a = visibleBox(e.A), b = visibleBox(e.B);
      if (a.key === b.key) return;
      var k = a.key + ">" + b.key + (anyType ? "" : ">" + e.t);
      if (!map[k]) { map[k] = { a: a, b: b, t: e.t, edges: [], key: k }; order.push(k); }
      map[k].edges.push(e);
    });
    return order.map(function (k) { return map[k]; });
  }
  var placedLabels = [];
  function drawEdges() {
    gEdges.textContent = ""; gLabels.textContent = "";
    var lv = level();
    var hiSel = state.focus || state.sel;
    var hi = hiSel ? incidentEdges(hiSel) : [];
    var hiIdx = {}; hi.forEach(function (e) { hiIdx[e.i] = 1; });
    var base = (state.showAll ? A.edges : A.edges.filter(function (e) { return e.m; })).filter(function (e) { return !hiIdx[e.i]; });
    if (state.focus) base = [];
    if (state.scen) base = base.filter(function () { return state.showAll; });
    var baseB = bundle(base, lv === 0 && !state.showAll), hiB = bundle(hi);
    var showBaseLabels = lv === 0 && !hiSel && !state.showAll && !state.scen;
    placedLabels = [];
    if (lv === 0) A.layers.forEach(function (L) { var fs = parseFloat(dom.layers[L.id].g.style.getPropertyValue("--tsz0")) || 72; placedLabels.push({ x0: L.x, x1: L.x + 40 + L.n.length * fs * 0.5, y0: L.y, y1: L.y + 150 }); });
    baseB.forEach(function (b) { drawBundle(b, "base", showBaseLabels); });
    hiB.forEach(function (b) { drawBundle(b, "hi", lv === 2 || hiB.length <= 28); });
  }
  function drawBundle(b, cls, label) {
    var c = curve(b.a, b.b, b.key);
    var idx = b.edges.map(function (e) { return e.i; }).join(",");
    var hitp = el("path", { "class": "ehit", d: c.d, "data-edge": idx }, gEdges);
    var t = el("title", null, hitp); t.textContent = b.edges.map(function (e) { return e.A.n + " → " + e.B.n + (e.l ? " (" + e.l + ")" : ""); }).join("\n");
    el("path", { "class": "edge " + cls + " e-" + b.t, d: c.d, "marker-end": "url(#mk-" + b.t + ")" }, gEdges);
    if (b.t === "repl") el("path", { "class": "edge " + cls + " e-repl-in", d: c.d }, gEdges);
    if (label) {
      var txt = b.edges[0].l || "";
      if (b.edges.length > 1) txt = (txt ? txt + " " : "") + "+" + (b.edges.length - 1);
      var fs = (cls === "base" ? 13 : 12) / cam.k, half = txt.length * fs * 0.29 + 4 / cam.k, box = { x0: c.mid[0] - half, x1: c.mid[0] + half, y0: c.mid[1] - fs * 0.7, y1: c.mid[1] + fs * 0.7 };
      if (txt && placedLabels.some(function (q) { return q.x0 < box.x1 && box.x0 < q.x1 && q.y0 < box.y1 && box.y0 < q.y1; })) txt = "";
      if (txt) placedLabels.push(box);
      if (txt) { var lt = el("text", { "class": "elabel" + (cls === "base" ? " big" : ""), x: c.mid[0], y: c.mid[1], "text-anchor": "middle", "dominant-baseline": "central" }, gLabels); lt.textContent = txt; }
    }
  }

  /* ---------- scenarios ---------- */
  function drawScenario() {
    gScen.textContent = "";
    if (!state.scen) return;
    var s = scenById[state.scen], pts = [], seen = {};
    s.steps.forEach(function (st, i) {
      var n = nodeById[st.n], b = visibleBox(n);
      var p = b.key.charAt(0) === "n" ? [b.x + 2, b.y + b.h / 2] : [b.x + b.w / 2, b.y + b.h / 2];
      if (seen[b.key] != null && level() < 2) { pts.push({ p: p, i: i, dup: true }); return; }
      seen[b.key] = i; pts.push({ p: p, i: i });
    });
    var d = pts.map(function (q, i) { return (i ? "L" : "M") + q.p[0].toFixed(1) + "," + q.p[1].toFixed(1); }).join(" ");
    el("path", { "class": "spath", d: d }, gScen);
    var r = 13 / cam.k;
    pts.forEach(function (q) {
      if (q.dup && q.i !== state.step) return;
      var g = el("g", { "class": "sdot" + (q.i === state.step ? " cur" : ""), "data-step": q.i }, gScen);
      var off = (q.i % 2 ? 1 : -1) * 0;
      el("circle", { cx: q.p[0] + off, cy: q.p[1], r: q.i === state.step ? r * 1.25 : r }, g);
      var t = el("text", { x: q.p[0] + off, y: q.p[1] }, g); t.textContent = q.i + 1;
    });
  }
  function resizeScenarioDots() {
    var r = 13 / cam.k;
    Array.prototype.forEach.call(gScen.querySelectorAll(".sdot"), function (g) { var c = g.firstChild; c.setAttribute("r", g.classList.contains("cur") ? r * 1.25 : r); });
  }
  function startScenario(id) {
    state.scen = id; state.step = 0; state.focus = null;
    $("btnScen").setAttribute("aria-pressed", "true");
    renderSide(); applyClasses(); drawEdges(); drawScenario(); goStep(0);
  }
  function stopScenario() {
    state.scen = null; applyClasses(); drawEdges(); drawScenario(); renderSide();
  }
  function goStep(i) {
    var s = scenById[state.scen]; if (!s) return;
    state.step = Math.max(0, Math.min(s.steps.length - 1, i));
    var n = nodeById[s.steps[state.step].n];
    state.sel = { kind: "node", id: n.id };
    if (collapsed[n.g]) toggleGroup(n.g);
    applyClasses(); drawEdges(); drawScenario(); renderSide(); renderPanel();
    var prev = s.steps[Math.max(0, state.step - 1)], pn = nodeById[prev.n];
    var x0 = Math.min(n.x, pn.x), y0 = Math.min(n.y, pn.y), x1 = Math.max(n.x + n.w, pn.x + pn.w), y1 = Math.max(n.y + n.h, pn.y + pn.h);
    var v = viewport(), both = { x: x0 - 60, y: y0 - 80, w: x1 - x0 + 120, h: y1 - y0 + 160 };
    if (Math.min((v.w - 80) / both.w, (v.h - 80) / both.h) >= 0.92) fitRect(both, { minK: 0.92, maxK: 1.2 });
    else fitRect({ x: n.x - 120, y: n.y - 140, w: n.w + 240, h: n.h + 280 }, { minK: 0.95, maxK: 1.2 });
    var li = document.querySelector('.steps li[data-i="' + state.step + '"]'); if (li && li.scrollIntoView) li.scrollIntoView({ block: "nearest" });
  }
  function renderSide() {
    var side = $("side");
    if (!$("btnScen").getAttribute("aria-pressed") || $("btnScen").getAttribute("aria-pressed") === "false") { side.hidden = true; return; }
    side.hidden = false;
    var h = '<div class="phead"><button class="close" data-act="closeSide" aria-label="Close scenarios">×</button>';
    if (!state.scen) {
      h += '<div class="ptitle" style="font-size:22px">Scenarios</div><div class="own">Step through what happens end to end. The path is drawn on the map.</div></div><div class="pbody">';
      A.scenarios.forEach(function (s) { h += '<button class="scen" data-scen="' + s.id + '"><b>' + esc(s.n) + '</b><span>' + esc(s.d) + ' · ' + s.steps.length + ' steps</span></button>'; });
      h += "</div>";
    } else {
      var s = scenById[state.scen];
      h += '<div class="crumbs"><button data-act="scenList">All scenarios</button></div><div class="ptitle" style="font-size:21px">' + esc(s.n) + '</div><div class="own">' + esc(s.d) + '</div></div><div class="pbody"><ol class="steps">';
      s.steps.forEach(function (st, i) {
        var n = nodeById[st.n];
        h += '<li data-i="' + i + '" class="' + (i === state.step ? "cur" : "") + '"><span class="no">' + (i + 1) + '</span><span><span class="sn">' + esc(n.n) + ' <span class="pill"><i style="background:hsl(' + n.L.hue + ' 55% 50%)"></i>' + esc(n.L.n) + '</span></span><span class="st">' + esc(st.t) + '</span></span></li>';
      });
      h += '</ol></div><div class="snav"><button class="act" data-act="prev">← Previous</button><button class="act" data-act="next">Next →</button><button class="act" data-act="exitScen">Exit</button></div>';
    }
    side.innerHTML = h;
  }
  $("side").addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-scen],[data-act],li[data-i]"); if (!b) return;
    if (b.hasAttribute("data-scen")) return startScenario(b.getAttribute("data-scen"));
    if (b.hasAttribute("data-i")) return goStep(+b.getAttribute("data-i"));
    var a = b.getAttribute("data-act");
    if (a === "prev") goStep(state.step - 1);
    if (a === "next") goStep(state.step + 1);
    if (a === "exitScen" || a === "scenList") { stopScenario(); }
    if (a === "closeSide") { stopScenario(); $("btnScen").setAttribute("aria-pressed", "false"); renderSide(); }
  });

  /* ---------- details panel ---------- */
  function locChips(codes) { return (codes || []).map(function (c) { return '<span class="loc" title="' + esc(LOC[c].d) + '"><i style="background:var(' + LOC[c].v + ')"></i>' + esc(LOC[c].n) + "</span>"; }).join(""); }
  function edgeIcon(t) {
    var dash = { data: "", ctrl: "5 3", dep: "1.5 3", repl: "", recov: "6 2 1.5 2", rel: "2 2.5" }[t];
    return '<svg width="20" height="10" viewBox="0 0 20 10" aria-hidden="true"><path d="M1 5 H15" stroke="var(--e-' + t + ')" stroke-width="' + (t === "repl" ? 3.4 : 2) + '" stroke-dasharray="' + dash + '" fill="none"/><path d="M14 1.5 L19 5 L14 8.5 z" fill="var(--e-' + t + ')"/></svg>';
  }
  function linkRow(e, from) {
    var other = from ? e.B : e.A;
    var dir = from ? "→" : "←";
    return '<button class="lk" data-go="' + other.id + '">' + (from ? edgeIcon(e.t) : '<span style="transform:scaleX(-1);display:inline-flex">' + edgeIcon(e.t) + "</span>") + '<span><span class="lkn">' + (from ? "to " : "from ") + esc(other.n) + '</span><span class="lks">' + esc(e.l || ETYPE[e.t].n) + ' · <span class="pill"><i style="background:hsl(' + other.L.hue + ' 55% 50%)"></i>' + esc(other.L.n) + "</span></span></span></button>";
  }
  function sec(title, body) { return body ? '<div class="sec"><h3>' + title + "</h3>" + body + "</div>" : ""; }
  function list(arr, cls, ordered) { if (!arr || !arr.length) return ""; var t = ordered ? "ol" : "ul"; return "<" + t + (cls ? ' class="' + cls + '"' : "") + ">" + arr.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</" + t + ">"; }
  function para(s) { return s ? "<p>" + esc(s) + "</p>" : ""; }
  function crumbs(it) {
    var h = '<div class="crumbs"><button data-home="1">Overview</button>';
    if (it.kind !== "layer") h += ' › <button data-sel="layer:' + it.L.id + '">' + esc(it.L.n) + "</button>";
    if (it.kind === "node") h += ' › <button data-sel="group:' + it.g + '">' + esc(it.G.n) + "</button>";
    return h + "</div>";
  }
  function renderPanel() {
    var p = $("panel");
    if (!state.sel) { p.hidden = true; return; }
    var it = itemOf(state.sel.kind, state.sel.id);
    var focusOn = state.focus && state.focus.kind === state.sel.kind && state.focus.id === state.sel.id;
    var h = '<button class="close" data-act="close" aria-label="Close details">×</button><div class="phead">' + crumbs(it);
    var hue = it.kind === "layer" ? it.hue : it.L.hue;
    h += '<div class="ptitle" style="color:hsl(' + hue + ' 50% var(--lay-title-l))">' + esc(it.n) + "</div>";
    if (it.kind === "node") {
      if (it.ab) h += '<div class="pab">' + esc(it.ab) + "</div>";
      h += '<div class="chips">' + locChips(it.loc) + "</div>";
      if (it.ln) h += '<div class="lnote">📍 ' + esc(it.ln) + "</div>";
      if (it.own) h += '<div class="own">Owner: ' + esc(it.own) + " · Layer " + it.L.id + " › " + esc(it.G.n) + "</div>";
    } else if (it.kind === "group") {
      h += '<div class="own">Subsystem of ' + esc(it.L.n) + " · " + it.nodes.length + " concepts</div>";
    } else {
      h += '<div class="own">' + esc(it.tag) + "</div><div class=\"chips\">" + locChips(it.loc) + "</div>";
    }
    h += '<div class="actions"><button class="act" data-act="zoom">Zoom to</button><button class="act' + (focusOn ? " on" : "") + '" data-act="focus">' + (focusOn ? "Exit focus" : "Focus on this") + "</button>";
    if (it.kind === "group") h += '<button class="act" data-act="toggle">' + (collapsed[it.id] ? "Expand" : "Collapse") + "</button>";
    if (it.cmps) it.cmps.forEach(function (c) { h += '<button class="act" data-cmp="' + c + '">⇄ ' + esc(cmpById[c].n.split(" (")[0]) + "</button>"; });
    h += "</div>";
    if (it.kind === "node") {
      var cur = status[it.id] || "";
      h += '<div class="status" role="group" aria-label="Study status">' + STATUS.map(function (s) { return '<button data-status="' + s[0] + '" aria-pressed="' + (cur === s[0]) + '">' + s[1] + "</button>"; }).join("") + '</div><div class="sync" style="margin-top:4px">' + esc(syncState) + "</div>";
    }
    h += '</div><div class="pbody">';
    if (it.kind === "node") h += nodeBody(it);
    else if (it.kind === "group") h += groupBody(it);
    else h += layerBody(it);
    h += "</div>";
    p.innerHTML = h; p.hidden = false;
  }
  function nodeBody(n) {
    var h = "";
    h += sec("Problem it solves", para(n.p));
    h += sec("Simple explanation", para(n.s));
    if (n.an) h += sec("Analogy", '<p class="callout">' + esc(n.an) + "</p>");
    h += sec("Inputs → outputs", para(n.io));
    h += sec("How it works", list(n.steps, "", true));
    if (n.art) h += sec("Picture it", "<pre>" + esc(n.art) + "</pre>");
    h += sec("Data structures involved", para(n.ds));
    h += sec("Algorithms involved", para(n.al));
    h += sec("Time & space", para(n.cx));
    if ((n.pro && n.pro.length) || (n.con && n.con.length)) h += '<div class="sec two"><div><h3>Advantages</h3>' + (list(n.pro, "pro") || "<p>—</p>") + "</div><div><h3>Disadvantages</h3>" + (list(n.con, "con") || "<p>—</p>") + "</div></div>";
    h += sec("Failure & edge cases", list(n.f));
    var cross = n.out.concat(n.inc).filter(function (e) { return e.A.L !== e.B.L; });
    h += sec("Interactions with other layers", cross.length ? '<div class="links">' + cross.map(function (e) { return linkRow(e, e.A === n); }).join("") + "</div>" : "");
    var altBody = para(n.alt);
    if (n.cmps) altBody += n.cmps.map(function (c) { return '<button class="tagbtn" data-cmp="' + c + '">⇄ ' + esc(cmpById[c].n) + "</button>"; }).join("");
    h += sec("Alternatives & comparisons", altBody);
    h += sec("Practical example", para(n.ex));
    if (n.mis) h += sec("Easy to confuse", '<p class="callout">' + esc(n.mis) + "</p>");
    if (n.impl) h += sec("Implementation-dependent", para(n.impl));
    var same = n.out.concat(n.inc).filter(function (e) { return e.A.L === e.B.L; });
    var relIds = (n.rel || []).filter(function (r) { return nodeById[r]; });
    var relBody = (same.length ? '<div class="links">' + same.map(function (e) { return linkRow(e, e.A === n); }).join("") + "</div>" : "") +
      (relIds.length ? '<div style="margin-top:8px">' + relIds.map(function (r) { return '<button class="tagbtn" data-go="' + r + '">' + esc(nodeById[r].n) + "</button>"; }).join("") + "</div>" : "");
    h += sec("Related topics", relBody);
    var sc = A.scenarios.filter(function (s) { return s.steps.some(function (st) { return st.n === n.id; }); });
    if (sc.length) h += sec("Appears in scenarios", sc.map(function (s) { return '<button class="tagbtn" data-scen="' + s.id + '">▶ ' + esc(s.n) + "</button>"; }).join(""));
    return h;
  }
  function groupBody(g) {
    var h = sec("What this subsystem does", para(g.d));
    h += sec("Concepts", g.nodes.map(function (n) { return '<button class="lk" data-go="' + n.id + '"><span style="display:flex;gap:3px;margin-top:5px">' + (n.loc || []).map(function (c) { return '<i style="width:7px;height:7px;border-radius:50%;background:var(' + LOC[c].v + ')"></i>'; }).join("") + '</span><span><span class="lkn">' + esc(n.n) + '</span><span class="lks">' + esc(trunc(n.p || "", 110)) + "</span></span></button>"; }).join(""));
    var cross = incidentEdges({ kind: "group", id: g.id }).filter(function (e) { return e.A.L !== e.B.L; });
    h += sec("Connections to other layers", summarize(cross, g.nodes));
    return h;
  }
  function summarize(edges, inside) {
    if (!edges.length) return "";
    var ins = {}; inside.forEach(function (n) { ins[n.id] = 1; });
    var byL = {};
    edges.forEach(function (e) { var other = ins[e.a] ? e.B : e.A; (byL[other.L.id] = byL[other.L.id] || []).push({ e: e, from: !!ins[e.a] }); });
    return Object.keys(byL).map(function (lid) {
      var L = layerById[lid];
      return '<div style="margin:8px 0 2px"><button class="tagbtn" data-sel="layer:' + lid + '" style="margin:0"><span class="pill"><i style="background:hsl(' + L.hue + ' 55% 50%)"></i></span> ' + esc(L.n) + ' <span class="ncount">' + byL[lid].length + "</span></button></div><div class=\"links\">" + byL[lid].map(function (x) { return linkRow(x.e, x.from); }).join("") + "</div>";
    }).join("");
  }
  function layerBody(L) {
    var h = sec("What this layer does", para(L.d));
    h += sec("Owned by", para(L.own));
    h += sec("Subsystems", L.groups.map(function (g) { return '<div style="margin-bottom:10px"><button class="tagbtn" data-sel="group:' + g.id + '" style="font-weight:600">' + esc(g.n) + ' <span class="ncount">' + g.nodes.length + "</span></button><div>" + g.nodes.map(function (n) { return '<button class="tagbtn" data-go="' + n.id + '" style="font-size:12px;padding:2px 8px">' + esc(n.n) + "</button>"; }).join("") + "</div></div>"; }).join(""));
    var ns = nodesIn({ kind: "layer", id: L.id });
    var cross = incidentEdges({ kind: "layer", id: L.id });
    var counts = {}; cross.forEach(function (e) { var o = e.A.L.id === L.id ? e.B.L : e.A.L; counts[o.id] = (counts[o.id] || 0) + 1; });
    h += sec("Talks to these layers", Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; }).map(function (lid) { var o = layerById[lid]; return '<button class="tagbtn" data-sel="layer:' + lid + '"><span class="pill"><i style="background:hsl(' + o.hue + ' 55% 50%)"></i></span> ' + esc(o.n) + ' <span class="ncount">' + counts[lid] + " links</span></button>"; }).join(""));
    h += sec("Key cross-layer links", summarize(cross.filter(function (e) { return e.m; }), ns));
    return h;
  }
  $("panel").addEventListener("click", function (ev) {
    var b = ev.target.closest("button"); if (!b) return;
    if (b.hasAttribute("data-go")) return select("node", b.getAttribute("data-go"), true);
    if (b.hasAttribute("data-sel")) { var p = b.getAttribute("data-sel").split(":"); return select(p[0], p[1], true); }
    if (b.hasAttribute("data-home")) { clearSelection(); setFocus(false); return home(); }
    if (b.hasAttribute("data-cmp")) return openCompare(b.getAttribute("data-cmp"));
    if (b.hasAttribute("data-scen")) { $("btnScen").setAttribute("aria-pressed", "true"); return startScenario(b.getAttribute("data-scen")); }
    if (b.hasAttribute("data-status")) { var v = b.getAttribute("data-status"); if (v) status[state.sel.id] = v; else delete status[state.sel.id]; saveStatus(); refreshStatus(); renderPanel(); return; }
    var a = b.getAttribute("data-act");
    if (a === "close") { clearSelection(); if (state.focus) setFocus(false); }
    if (a === "zoom") { var it = itemOf(state.sel.kind, state.sel.id); fitRect(state.sel.kind === "node" ? { x: it.x - 40, y: it.y - 60, w: it.w + 80, h: it.h + 120 } : rectOf(it), { pad: 30, maxK: 1.6, minK: state.sel.kind === "node" ? 1.05 : 0 }); }
    if (a === "focus") setFocus(!(state.focus && state.focus.id === state.sel.id));
    if (a === "toggle") { toggleGroup(state.sel.id); renderPanel(); }
  });
  function showEdges(idxs) {
    var es = idxs.map(function (i) { return A.edges[i]; }).filter(Boolean);
    if (!es.length) return;
    var p = $("panel"), h = '<button class="close" data-act="close" aria-label="Close details">×</button><div class="phead"><div class="crumbs"><button data-home="1">Overview</button> › connection</div><div class="ptitle">' + (es.length > 1 ? es.length + " connections" : "Connection") + '</div><div class="own">' + esc(ETYPE[es[0].t].n) + " — " + esc(ETYPE[es[0].t].d) + '</div></div><div class="pbody">';
    es.forEach(function (e) {
      h += '<div class="sec"><div class="links"><button class="lk" data-go="' + e.a + '">' + edgeIcon(e.t) + '<span><span class="lkn">' + esc(e.A.n) + '</span><span class="lks">' + esc(e.A.L.n) + " › " + esc(e.A.G.n) + '</span></span></button><div style="padding:2px 0 2px 32px;color:var(--muted);font-size:13px">' + esc(e.l || ETYPE[e.t].n) + ' ↓</div><button class="lk" data-go="' + e.b + '"><span></span><span><span class="lkn">' + esc(e.B.n) + '</span><span class="lks">' + esc(e.B.L.n) + " › " + esc(e.B.G.n) + "</span></span></button></div></div>";
    });
    p.innerHTML = h + "</div>"; p.hidden = false;
  }

  /* ---------- compare ---------- */
  var curCmp = null;
  function openCompare(id) {
    curCmp = id || curCmp || A.comparisons[0].id;
    var c = cmpById[curCmp];
    var h = '<button class="close" data-act="closeCmp" aria-label="Close comparison">×</button><div class="mlist"><div class="sec" style="margin-top:0"><h3>Comparisons</h3></div>';
    A.comparisons.forEach(function (x) { h += '<button class="mitem' + (x.id === curCmp ? " on" : "") + '" data-c="' + x.id + '">' + esc(x.n) + "</button>"; });
    h += '</div><div class="mview"><div class="ptitle" style="padding-right:30px">' + esc(c.n) + '</div><div class="own">Problem: ' + esc(c.q) + '</div><div class="ctable-wrap"><table class="ctable"><thead><tr><th></th>';
    c.opts.forEach(function (o) {
      var id = typeof o === "string" ? o : o.node, n = nodeById[id], label = typeof o === "string" ? n.n : o.l;
      h += '<th><button data-go="' + id + '">' + esc(label) + '</button><div class="chips" style="margin:6px 0 0">' + locChips(n.loc) + '</div><div class="own" style="margin-top:4px">' + esc(n.L.n) + "</div></th>";
    });
    h += "</tr></thead><tbody>";
    c.rows.forEach(function (r) { h += "<tr><th>" + esc(r[0]) + "</th>" + r[1].map(function (cell) { return "<td>" + esc(cell) + "</td>"; }).join("") + "</tr>"; });
    h += '</tbody></table></div><p class="own" style="margin-top:10px">Click an option to open it on the map; its panel shows how it connects to the rest of the architecture.</p></div>';
    $("modal").innerHTML = h; $("modalBack").hidden = false;
  }
  $("modalBack").addEventListener("click", function (ev) {
    if (ev.target === $("modalBack")) { $("modalBack").hidden = true; return; }
    var b = ev.target.closest("button"); if (!b) return;
    if (b.hasAttribute("data-c")) return openCompare(b.getAttribute("data-c"));
    if (b.hasAttribute("data-go")) { $("modalBack").hidden = true; return select("node", b.getAttribute("data-go"), true); }
    if (b.getAttribute("data-act") === "closeCmp") $("modalBack").hidden = true;
  });

  /* ---------- legend ---------- */
  function renderLegend() {
    var h = '<button class="close" data-act="closeLegend" aria-label="Close legend">×</button><h3>Where it lives</h3>';
    LOCORDER.forEach(function (c) { h += '<div class="lrow"><span class="loc" style="justify-content:center"><i style="background:var(' + LOC[c].v + ')"></i></span><span>' + esc(LOC[c].n) + "<small>" + esc(LOC[c].d) + "</small></span></div>"; });
    h += '<p class="own" style="margin:6px 0 0">A concept can carry several dots: a B+ tree is pages on disk with hot pages cached in RAM.</p><h3>Arrows</h3>';
    Object.keys(ETYPE).forEach(function (t) { h += '<div class="lrow"><span>' + edgeIcon(t).replace('width="20"', 'width="44"').replace('viewBox="0 0 20 10"', 'viewBox="0 0 20 10" preserveAspectRatio="none"') + "</span><span>" + esc(ETYPE[t].n) + "<small>" + esc(ETYPE[t].d) + "</small></span></div>"; });
    h += '<h3>Study status</h3><div class="lrow"><span><svg width="44" height="14"><rect x="0" y="2" width="4" height="10" rx="1" fill="var(--st-learning)"/><rect x="10" y="2" width="4" height="10" rx="1" fill="var(--st-understood)"/><rect x="20" y="2" width="4" height="10" rx="1" fill="var(--st-revision)"/></svg></span><span>Learning · Understood · Needs revision<small>Set it in each concept\'s panel; the bar shows on the left of the cell.</small></span></div>';
    h += '<h3>Zoom levels</h3><p class="own" style="margin:0">L0 overview: layers and main data paths. L1: subsystems. L2: every concept with its location dots. Collapse a subsystem with ▾.</p><h3>Layers</h3>';
    A.layers.forEach(function (l) { h += '<button class="layerbtn" data-sel="layer:' + l.id + '"><i style="background:hsl(' + l.hue + ' 55% 50%)"></i><b style="font-family:var(--f-mono);font-size:11px;color:var(--muted)">' + l.id + "</b> " + esc(l.n) + "</button>"; });
    h += '<h3>Keys</h3><p class="own" style="margin:0">/ search · 0 overview · + / − zoom · Esc clear · ← → scenario steps</p>';
    $("legend").innerHTML = h;
  }
  $("legend").addEventListener("click", function (ev) {
    var b = ev.target.closest("button"); if (!b) return;
    if (b.getAttribute("data-act") === "closeLegend") { $("legend").hidden = true; $("btnLegend").setAttribute("aria-pressed", "false"); return; }
    if (b.hasAttribute("data-sel")) { $("legend").hidden = true; $("btnLegend").setAttribute("aria-pressed", "false"); var p = b.getAttribute("data-sel").split(":"); select(p[0], p[1], true); }
  });

  /* ---------- search ---------- */
  var index = [];
  A.layers.forEach(function (l) { index.push({ kind: "layer", id: l.id, n: l.n, hay: (l.n + " " + l.tag + " layer " + l.id).toLowerCase(), sub: "Layer " + l.id, hue: l.hue }); });
  A.groups.forEach(function (g) { index.push({ kind: "group", id: g.id, n: g.n, hay: (g.n + " " + g.d).toLowerCase(), sub: g.L.n, hue: g.L.hue }); });
  A.nodes.forEach(function (n) { index.push({ kind: "node", id: n.id, n: n.n, hay: (n.n + " " + (n.ab || "") + " " + n.id).toLowerCase(), ab: (n.ab || "").toLowerCase(), sub: n.L.n + " › " + n.G.n, hue: n.L.hue, loc: n.loc }); });
  A.comparisons.forEach(function (c) { index.push({ kind: "cmp", id: c.id, n: c.n, hay: (c.n + " compare vs " + c.q).toLowerCase(), sub: "Comparison", hue: 40 }); });
  A.scenarios.forEach(function (s) { index.push({ kind: "scen", id: s.id, n: s.n, hay: (s.n + " scenario " + s.d).toLowerCase(), sub: "Scenario", hue: 40 }); });
  var qEl = $("q"), resEl = $("results"), active = 0, hits = [];
  function search(q) {
    q = q.trim().toLowerCase(); if (!q) return [];
    var toks = q.split(/\s+/);
    return index.map(function (it) {
      var name = it.n.toLowerCase();
      if (!toks.every(function (t) { return it.hay.indexOf(t) >= 0; })) return null;
      var s = 0;
      if (name === q) s = 100; else if (name.indexOf("(" + q + ")") >= 0 || (it.ab && (" " + it.ab + " ").indexOf(" " + q + " ") >= 0 && q.length <= 5 && it.ab.split(" ")[0] === q)) s = 90;
      else if (name.indexOf(q) === 0) s = 80;
      else if ((" " + name).indexOf(" " + q) >= 0) s = 65;
      else if (name.indexOf(q) >= 0) s = 50;
      else if (it.ab && (" " + it.ab + " ").indexOf(" " + q + " ") >= 0) s = 58;
      else if (it.ab && it.ab.indexOf(q) >= 0) s = 35; else s = 20;
      if (it.kind === "node") s += 3;
      return { it: it, s: s };
    }).filter(Boolean).sort(function (a, b) { return b.s - a.s || a.it.n.length - b.it.n.length; }).slice(0, 14).map(function (x) { return x.it; });
  }
  function renderResults() {
    hits = search(qEl.value); active = 0;
    if (!qEl.value.trim()) { resEl.hidden = true; return; }
    resEl.hidden = false;
    resEl.innerHTML = hits.length ? hits.map(function (h, i) {
      return '<div class="res" role="option" id="res-' + i + '" data-i="' + i + '" aria-selected="' + (i === active) + '"><span class="sw" style="background:hsl(' + h.hue + ' 55% 50%)"></span><span><span class="rn">' + esc(h.n) + '</span><span class="rs">' + esc(h.sub) + '</span></span><span class="rk">' + (h.loc ? h.loc.join(" ") : h.kind) + "</span></div>";
    }).join("") : '<div class="res"><span></span><span class="rs">No match. Try an acronym (WAL, LSN, MVCC) or a word (eviction, quorum).</span></div>';
  }
  function choose(i) {
    var h = hits[i]; if (!h) return;
    resEl.hidden = true; qEl.blur();
    if (h.kind === "cmp") return openCompare(h.id);
    if (h.kind === "scen") { $("btnScen").setAttribute("aria-pressed", "true"); return startScenario(h.id); }
    select(h.kind, h.id, true);
    if (h.kind === "node") { var g = dom.nodes[h.id].g; g.classList.add("hit"); setTimeout(function () { g.classList.remove("hit"); }, 1600); }
  }
  qEl.addEventListener("input", renderResults);
  qEl.addEventListener("keydown", function (ev) {
    if (ev.key === "ArrowDown" || ev.key === "ArrowUp") { ev.preventDefault(); active = (active + (ev.key === "ArrowDown" ? 1 : hits.length - 1)) % Math.max(1, hits.length); Array.prototype.forEach.call(resEl.children, function (c, i) { c.setAttribute("aria-selected", i === active); }); var a = $("res-" + active); if (a) a.scrollIntoView({ block: "nearest" }); }
    if (ev.key === "Enter") { ev.preventDefault(); choose(active); }
    if (ev.key === "Escape") { qEl.value = ""; resEl.hidden = true; qEl.blur(); }
  });
  resEl.addEventListener("mousedown", function (ev) { var r = ev.target.closest("[data-i]"); if (r) { ev.preventDefault(); choose(+r.getAttribute("data-i")); } });
  qEl.addEventListener("blur", function () { setTimeout(function () { resEl.hidden = true; }, 150); });
  qEl.addEventListener("focus", function () { if (qEl.value.trim()) renderResults(); });

  /* ---------- minimap ---------- */
  var mm = $("mm"), mmView = null;
  function drawMinimap() {
    mm.textContent = "";
    mm.setAttribute("viewBox", "0 0 " + world.w + " " + world.h);
    A.layers.forEach(function (l) {
      var r = el("rect", { "class": "mm-l", x: l.x, y: l.y, width: l.w, height: l.h, rx: 40, style: "--h:" + l.hue }, mm);
      var t = el("title", null, r); t.textContent = l.n;
      var tx = el("text", { "class": "mm-t", x: l.x + 40, y: l.y + 150, style: "--h:" + l.hue }, mm); tx.textContent = l.id;
    });
    mmView = el("rect", { "class": "mm-v", rx: 20 }, mm);
    updateMinimapView();
  }
  function updateMinimapView() {
    if (!mmView) return;
    var w = stage.clientWidth, h = stage.clientHeight;
    var x = -cam.x / cam.k, y = -cam.y / cam.k;
    attrs(mmView, { x: x, y: y, width: Math.max(20, w / cam.k), height: Math.max(20, h / cam.k) });
  }
  function mmMove(ev) {
    var pt = mm.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
    var m = mm.getScreenCTM(); if (!m) return;
    var p = pt.matrixTransform(m.inverse());
    var v = viewport();
    setCam(v.x + v.w / 2 - p.x * cam.k, v.y + v.h / 2 - p.y * cam.k, cam.k);
  }
  var mmDrag = false;
  mm.addEventListener("pointerdown", function (ev) { mmDrag = true; try { mm.setPointerCapture(ev.pointerId); } catch (e) { } mmMove(ev); ev.stopPropagation(); });
  mm.addEventListener("pointermove", function (ev) { if (mmDrag) mmMove(ev); });
  mm.addEventListener("pointerup", function () { mmDrag = false; });

  /* ---------- toolbar & keys ---------- */
  $("btnHome").addEventListener("click", function () { setFocus(false); clearSelection(); home(); });
  $("zhome").addEventListener("click", function () { home(); });
  $("zin").addEventListener("click", function () { zoomBy(1.35); });
  $("zout").addEventListener("click", function () { zoomBy(1 / 1.35); });
  $("btnAll").addEventListener("click", function () { state.showAll = !state.showAll; this.setAttribute("aria-pressed", state.showAll); drawEdges(); });
  $("btnScen").addEventListener("click", function () {
    var on = this.getAttribute("aria-pressed") !== "true";
    this.setAttribute("aria-pressed", on);
    if (!on) stopScenario(); renderSide();
  });
  $("btnCmp").addEventListener("click", function () { openCompare(); });
  $("btnLegend").addEventListener("click", function () { var lg = $("legend"); lg.hidden = !lg.hidden; this.setAttribute("aria-pressed", !lg.hidden); if (!lg.hidden) renderLegend(); });
  document.addEventListener("keydown", function (ev) {
    var tag = (ev.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") return;
    if (ev.key === "/") { ev.preventDefault(); qEl.focus(); }
    else if (ev.key === "0") home();
    else if (ev.key === "+" || ev.key === "=") zoomBy(1.35);
    else if (ev.key === "-") zoomBy(1 / 1.35);
    else if (ev.key === "Escape") {
      if (!$("modalBack").hidden) { $("modalBack").hidden = true; return; }
      if (!$("legend").hidden) { $("legend").hidden = true; $("btnLegend").setAttribute("aria-pressed", "false"); return; }
      if (state.focus) { setFocus(false); return; }
      clearSelection();
    }
    else if (state.scen && ev.key === "ArrowRight") goStep(state.step + 1);
    else if (state.scen && ev.key === "ArrowLeft") goStep(state.step - 1);
  });
  window.addEventListener("resize", function () { updateMinimapView(); });

  /* ---------- start ---------- */
  layout(); build(); place(); refreshStatus();
  svg.classList.add("lod0");
  home(0);
  setTimeout(function () { $("hint").hidden = true; }, 9000);
  var tok = (location.hash || "").replace("#", "");
  if (tok) {
    if (nodeById[tok]) select("node", tok, true);
    else if (layerById[tok]) select("layer", tok, true);
    else if (groupById[tok]) select("group", tok, true);
    else if (scenById[tok]) { $("btnScen").setAttribute("aria-pressed", "true"); startScenario(tok); }
    else if (cmpById[tok]) openCompare(tok);
  }
  connectAccount();
})();
