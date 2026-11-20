/* Kerstboom-app: logica. Alle inhoud staat in content.js. */
(() => {
  "use strict";
  const C = window.CONTENT;
  const N = C.stops.length;
  const KEY = "kerstboom-v20";
  const NS = "http://www.w3.org/2000/svg";
  const $ = (s, r = document) => r.querySelector(s);
  const body = document.body;

  /* ---------------- state ---------------- */
  const defaults = () => ({ lit: false, intro: false, done: 0, proef: {}, missie: {}, mok: {}, hype: {}, shown: {}, seen: {}, revealed: {}, cadeau: {}, fake: "" });
  let S = defaults();
  try { S = Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  if (location.hash === "#reset") { S = defaults(); save(); try { history.replaceState(null, "", location.pathname); } catch (e) {} }

  /* ---------------- helpers ---------------- */
  const el = (tag, attrs = {}, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  const esc = (t = "") => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const mapsUrl = (adres, mode) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(adres)}&travelmode=${mode === "auto" ? "driving" : "walking"}`;
  const lum = (hex) => { const n = parseInt(hex.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; };
  const fgFor = (hex) => (lum(hex) > 0.62 ? "#1d2236" : "#ffffff");
  const imgUrl = (f, w = 900) => {
    if (!f) return "";
    if (f.startsWith("commons:")) return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(f.slice(8).trim().replace(/ /g, "_"))}?width=${w}`;
    return f;
  };
  const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  const KNOP_STANDAARD = {"laatZien": "Laat zien", "weZijnEr": "We zijn er", "tikPakje": "Tik op het pakje.", "eetsmakelijk": "Eetsmakelijk!", "verder": "Verder", "slaapLekker": "Slaap lekker", "opPad": "Op pad!", "looproute": "Looproute", "terugHotel": "Terug naar het hotel", "routeHotel": "Route naar het hotel", "binnen": "We zijn binnen", "kiesMuziek": "Kies de muziek", "opReis": "Op reis!", "proost": "Proost!", "klaarDoor": "Klaar, door!", "opKamer": "We zijn op de kamer", "proeflijst": "Proeflijst", "informatie": "Informatie", "eten": "Eten", "drinken": "Drinken", "fotoideeen": "Fotoideeën", "cadeautje": "Cadeautje!", "ingepakt": "Nog ingepakt", "nog": "Nog", "dePiek": "DE PIEK", "lampje": "LAMPJE", "van": "VAN"};
  const T = (k) => ((C.knoppen || {})[k] ?? KNOP_STANDAARD[k] ?? k);
  const imgTag = (f, cls, w, fokus) => `<img class="${cls}" src="${esc(imgUrl(f, w))}"${fokus ? ` style="object-position:${esc(fokus)}"` : ""} alt="" loading="lazy" onerror="this.onerror=null;this.src='${BLANK}'">`;
  const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const nowMin = () => {
    if (S.fake && /^\d{1,2}:\d{2}$/.test(S.fake)) return toMin(S.fake);
    const d = new Date(); return d.getHours() * 60 + d.getMinutes();
  };
  const isTheDay = () => {
    if (S.fake) return true;
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` === C.datum;
  };
  const pal = ["#f2b8c6", "#8fd3c7", "#f0d36b", "#c7b3ef", "#9ec1f0", "#f4a76a"];
  const ICON = {
    check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    checkDark: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#1f2433" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    gift: '<svg viewBox="0 0 32 32"><rect x="5" y="13" width="22" height="15" rx="2" fill="#e57a7a"/><rect x="3" y="9" width="26" height="6" rx="2" fill="#c8373d"/><rect x="14" y="9" width="4" height="19" fill="#fbf5ea"/><path d="M16 9c-3-6-9-5-7-1 1 2 7 1 7 1zm0 0c3-6 9-5 7-1-1 2-7 1-7 1z" fill="none" stroke="#c8373d" stroke-width="2"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    bell: '<svg viewBox="0 0 24 24"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" fill="currentColor"/><path d="M10 20.5a2 2 0 0 0 4 0" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M12 21s7-6.3 7-11.5A7 7 0 0 0 5 9.5C5 14.7 12 21 12 21z" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="9.5" r="2.5" fill="currentColor"/></svg>',
    cam: '<svg viewBox="0 0 24 24"><path d="M4 8h3l2-2.5h6L17 8h3v11H4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="13.5" r="3.6" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    fork: '<svg viewBox="0 0 24 24"><path d="M7 3v7a2 2 0 0 0 2 2v9M11 3v7a2 2 0 0 1-2 2M9 3v6M16 21V3c2.5 1.5 3 5 3 8h-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    cup: '<svg viewBox="0 0 24 24"><path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16M8 3c0 1.5 1 1.5 1 3.5M12 3c0 1.5 1 1.5 1 3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 11v6M12 7.5v.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    walk: '<svg viewBox="0 0 24 24"><circle cx="13" cy="4.5" r="2" fill="currentColor"/><path d="M10 21l2-6-2.5-2.5L11 8l3 1.5 2 3.5M12 15l3 6M9.5 12.5L7 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  };
  const BOX = `<svg class="box shake" viewBox="0 0 200 190">
      <rect x="28" y="78" width="144" height="104" rx="8" fill="#e04b54"/>
      <rect x="90" y="78" width="20" height="104" fill="#fbf5ea"/>
      <g class="lid"><rect x="16" y="52" width="168" height="34" rx="8" fill="#c8373d"/><rect x="90" y="52" width="20" height="34" fill="#fbf5ea"/>
      <path d="M100 52c-14-30-48-28-38-6 6 12 38 6 38 6zm0 0c14-30 48-28 38-6-6 12-38 6-38 6z" fill="none" stroke="#fbf5ea" stroke-width="9" stroke-linecap="round"/></g>
    </svg>`;
  const CAR = `<svg class="car" viewBox="0 0 84 40"><path d="M6 28 L10 16 Q14 8 26 8 L52 8 Q60 8 66 16 L76 20 Q80 22 80 28 Z" fill="#e04b54"/><path d="M24 12 L48 12 L54 19 L18 19 Z" fill="#cfe3ff" opacity=".85"/><circle cx="22" cy="30" r="7" fill="#1f2433"/><circle cx="62" cy="30" r="7" fill="#1f2433"/><circle cx="22" cy="30" r="3" fill="#9aa6bd"/><circle cx="62" cy="30" r="3" fill="#9aa6bd"/><rect x="74" y="20" width="6" height="4" rx="2" fill="#ffe9a8"/></svg>`;

  /* ---------------- sound ---------------- */
  let audio;
  const chime = (notes = [784, 988, 1175, 1568], gap = 0.11) => {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const t0 = audio.currentTime + 0.02;
      notes.forEach((f, i) => {
        const o = audio.createOscillator(), g = audio.createGain();
        o.type = "sine"; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t0 + i * gap);
        g.gain.exponentialRampToValueAtTime(0.18, t0 + i * gap + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + i * gap + 1.2);
        o.connect(g).connect(audio.destination);
        o.start(t0 + i * gap); o.stop(t0 + i * gap + 1.3);
      });
    } catch (e) {}
  };

  /* ---------------- tree geometry ---------------- */
  const tiers = [
    { top: 90, bottom: 200, hw: 82, sc: 4 },
    { top: 145, bottom: 300, hw: 122, sc: 5 },
    { top: 225, bottom: 408, hw: 156, sc: 6 },
    { top: 310, bottom: 505, hw: 182, sc: 7 },
  ];
  const halfW = (y) => tiers.reduce((w, t) => (y >= t.top && y <= t.bottom ? Math.max(w, (t.hw * (y - t.top)) / (t.bottom - t.top)) : w), 0);
  const tierPath = ({ top, bottom, hw, sc }) => {
    const cx = 200, L = cx - hw, h = bottom - top, w = (2 * hw) / sc;
    let d = `M${cx} ${top} C${cx - hw * 0.25} ${top + h * 0.35},${cx - hw * 0.72} ${bottom - h * 0.22},${L} ${bottom}`;
    for (let i = 1; i <= sc; i++) d += ` A${w / 2} ${w * 0.42} 0 0 0 ${L + i * w} ${bottom}`;
    return d + ` C${cx + hw * 0.72} ${bottom - h * 0.22},${cx + hw * 0.25} ${top + h * 0.35},${cx} ${top}Z`;
  };
  const smooth = (p) => {
    let d = `M${p[0].x} ${p[0].y}`;
    for (let i = 0; i < p.length - 1; i++) {
      const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
      d += ` C${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6},${p2.x - (p3.x - p1.x) / 6} ${p2.y - (p3.y - p1.y) / 6},${p2.x} ${p2.y}`;
    }
    return d;
  };
  const starPts = (cx, cy, R, r) => Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2, rad = i % 2 ? r : R;
    return `${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`;
  }).join(" ");

  const svg = $("#tree"), fsvg = $("#treeFx"), bsvg = $("#treeBack");
  // schermvullend: in een app op het beginscherm rekent iOS de statusbalk soms niet mee
  const appEl = $("#app");
  const vw = () => appEl.clientWidth || window.innerWidth;
  const vh = () => appEl.clientHeight || window.innerHeight;
  function fitApp() {
    const standalone = navigator.standalone || (window.matchMedia && matchMedia("(display-mode: standalone)").matches);
    const portrait = window.innerHeight > window.innerWidth;
    const sh = portrait ? Math.max(screen.height, screen.width) : Math.min(screen.height, screen.width);
    appEl.style.height = standalone && sh - window.innerHeight > 8 && sh - window.innerHeight < 140 ? `${sh}px` : "";
  }
  fitApp();
  const yBot = 498, yTop = 94;
  const way = C.stops.map((s, i) => {
    if (i === 0) return { x: 200, y: yBot };
    if (i === N - 1) return { x: 200, y: yTop };
    const y = yBot - (i / (N - 1)) * (yBot - yTop);
    return { x: 200 + (i % 2 ? -1 : 1) * halfW(y) * 0.74, y };
  });
  let bulbs = [], wayLen = [], ornEls = [], starEl, drops = [], twinkles = [];

  function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  let warmEl;
  const mixHex = (h1, h2, t) => {
    const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const a = p(h1), b = p(h2);
    return "#" + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, "0")).join("");
  };
  // kleurlagen: licht van links, schaduw rechts
  const TONES = {
    lit: { sh: "#56634d", base: "#b0b08b", mid: "#8e9776", hi: "#efe8d0", snow: "#fdfbf4", snowSh: "#b9c2c9" },
    mid: { sh: "#22403e", base: "#5d7d6b", mid: "#4b6c60", hi: "#b8c2a2", snow: "#f1f5f8", snowSh: "#8fa6b4" },
    shade: { sh: "#0f252e", base: "#2d5261", mid: "#254656", hi: "#7da2ad", snow: "#cfe0ea", snowSh: "#5f7f93" },
  };
  function buildTree() {
    svg.innerHTML = ""; fsvg.innerHTML = ""; bsvg.innerHTML = "";
    const R = rng(1212);
    const toneFor = (u) => { const v = u + (R() - 0.5) * 0.55; return v < -0.28 ? "lit" : v < 0.22 ? "mid" : "shade"; };
    // een pluk naalden: waaier van spitse blaadjes die door de zwaartekracht hangen
    function tuft(g, rx, ry, ang, len, T, n = 7, shadow = true, snowy = false) {
      let dSh = "", dBase = "", dMid = "", dHi = "", dSnow = "", dSnowSh = "";
      const leaf = (bx, by, a, L, w, droop) => {
        const ca = Math.cos(a), sa = Math.sin(a);
        const tx = bx + ca * L, ty = by + sa * L + droop;
        const cx = bx + ca * L * 0.5, cy = by + sa * L * 0.5 + droop * 0.35, nx = -sa * w, ny = ca * w;
        return `M${bx.toFixed(1)} ${by.toFixed(1)}Q${(cx + nx).toFixed(1)} ${(cy + ny).toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)}Q${(cx - nx).toFixed(1)} ${(cy - ny).toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}Z`;
      };
      const strands = [];
      for (let k = 0; k < n; k++) {
        const f = n === 1 ? 0 : k / (n - 1) - 0.5;
        const a = ang + f * 1.15 + (R() - 0.5) * 0.28;
        const L = len * (0.62 + R() * 0.42) * (1 - Math.abs(f) * 0.3);
        strands.push({ a, L, w: 3.6 + R() * 2.8, droop: L * (0.2 + R() * 0.16) });
      }
      // dikke kern bij de aanhechting
      const body = leaf(rx, ry, ang, len * 0.55, len * 0.22, len * 0.08);
      strands.forEach((s) => {
        const p = leaf(rx, ry, s.a, s.L, s.w, s.droop);
        dSh += leaf(rx + 1.5, ry + 3.5, s.a, s.L, s.w, s.droop); dBase += p;
      });
      // onderkant iets donkerder, bovenkant licht (sneeuw en licht)
      const sorted = [...strands].sort((p, q) => Math.sin(p.a) - Math.sin(q.a));
      sorted.slice(Math.floor(n * 0.55)).forEach((s) => { dMid += leaf(rx + Math.cos(s.a) * 3, ry + Math.sin(s.a) * 3 + 1.5, s.a + 0.05, s.L * 0.9, s.w * 0.8, s.droop); });
      sorted.slice(0, Math.max(1, Math.floor(n * 0.45))).forEach((s) => {
        const o = s.L * 0.18;
        dHi += leaf(rx + Math.cos(s.a) * o, ry + Math.sin(s.a) * o - 0.8, s.a - 0.04, s.L * 0.72, s.w * 0.55, s.droop * 0.8);
      });
      if (snowy) {
        // sneeuw die bovenop de pluk ligt: dikke, ronde kussentjes
        sorted.slice(0, Math.max(2, Math.ceil(n * 0.5))).forEach((s, j) => {
          const o = s.L * (0.08 + R() * 0.12), L2 = s.L * (0.5 + R() * 0.25);
          const bx = rx + Math.cos(s.a) * o, by = ry + Math.sin(s.a) * o - 1.6;
          dSnow += leaf(bx, by, s.a - 0.06, L2, s.w * 1.05, s.droop * 0.55);
          dSnowSh += leaf(bx + 0.6, by + 1.8, s.a - 0.02, L2 * 0.95, s.w * 0.9, s.droop * 0.6);
          if (j < 2) { const cx = bx + Math.cos(s.a) * L2 * 0.4, cy = by + Math.sin(s.a) * L2 * 0.4 - 1; dSnow += `M${(cx - 3).toFixed(1)} ${cy.toFixed(1)}a3 2.4 0 1 0 6 0a3 2.4 0 1 0 -6 0Z`; }
        });
      }
      if (shadow) el("path", { d: dSh, fill: T.sh, opacity: ".75" }, g);
      el("path", { d: body + dBase, fill: T.base }, g);
      el("path", { d: dMid, fill: T.mid }, g);
      el("path", { d: dHi, fill: T.hi, opacity: (0.75 + R() * 0.25).toFixed(2) }, g);
      if (snowy) {
        el("path", { d: dSnowSh, fill: T.snowSh, opacity: ".8" }, g);
        el("path", { d: dSnow, fill: T.snow }, g);
      }
    }

    el("defs", {}, svg).innerHTML = `
      <radialGradient id="starGlow"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".95"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient>
      <radialGradient id="treeWarm"><stop offset="0" stop-color="#ffc77a" stop-opacity=".5"/><stop offset=".45" stop-color="#ff9e6b" stop-opacity=".16"/><stop offset="1" stop-color="#ff9e6b" stop-opacity="0"/></radialGradient>
      <radialGradient id="lampGlow"><stop offset="0" stop-color="#ffd27a" stop-opacity=".9"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
      <linearGradient id="ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3c4" stop-opacity=".0"/><stop offset=".35" stop-color="#fff3c4" stop-opacity=".55"/><stop offset="1" stop-color="#fff3c4" stop-opacity="0"/></linearGradient>
      <linearGradient id="patchG" x1="0" x2="1"><stop offset="0" stop-color="#f1e9d8"/><stop offset=".45" stop-color="#e6ebee"/><stop offset="1" stop-color="#c3d8e4"/></linearGradient>
      <linearGradient id="trunkG" x1="0" x2="1"><stop offset="0" stop-color="#8a7260"/><stop offset=".45" stop-color="#5f4c40"/><stop offset="1" stop-color="#3b3030"/></linearGradient>
      <pattern id="grain" width="64" height="64" patternUnits="userSpaceOnUse"><image href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAF7klEQVR42uVbTVcqPQzuuutuulFEwQuCKKjgRVFE/f+/or+hu94NPSc3Jm3a6fDec97ZMDNMPyZNkydPMkqBQxv7ro09BO92x+uNNvZSKaWCdx/a2Bl49hDPg3djcP8enH+g/i+U8ID9oPsb5v5eFRxc//GFtqrxoY29ZsbaoOd2Hcf5DN6dEfdvuAav6PqqcuBbdcJDOk9t7Kj5qhGreNXnywbvfifmeEFth+DdtO8V+F0jNKxxzDOPwbt94v9Zc60L3l3Gzjm10ca+dej/nOnzuUOf36ivpxaCeNLGLtC928RqvPWk9gdirEFOA4N3Q6LdS1ZjtLF3pfufs6zYJQXvtl2tO+rvLDGnVfBudTyflnR6Fby7K1U7zjcH7/ZR8gJB/pIISBu7krhS4Zjz1J/PxCBrYcdbbewAgiPOVXJgJHh3n1mEDTh/xcYR/LdC13dK9eeqKHd0ydmZ1HPU1pJqE9GuaBt8ouuZNnbbwGVOBc8MuwCxJoAtJWUsnBQU5VQQ9bdMWPirgkX7AOePiXldUnaqRHJPKbdEGcdmRqluS75mxnv44U+Dd2Nt7BJc73I+VjRIPzbnsYOwZ7Cjt8Qgg5x0Uz6ZaDdP4YycSmJDe3Tde+FLfwfvXo7tnpti7BRS7AqVI07ggi7G3R6KMbU29ruV+qW0KiJOGK0F7x4qVZkCZUvi3nmR9S6cxFap08f/rBo3HnQjQWOUfeC2EabJctqkjf06PreAeKHiXYa1QnjJqPuCi+lTL46NaNwaUhKmhgfshfLjPEWXQKXjfPYwpoBYpctWmIDzs8IJfZSAK0rzgndnwbsR/h/3Hby75oxjXKwSt510SX0Y1FYuNdP/unfkBgzhN+WactuGYnuQ2xxIBE+5xKzk0R7aUSpGMa5FgxFWvobbS7HFmTF3wbubuphZLtBNZhKXwn7eUoApwlspWMtqOReKRtYY+/gc/66NnRAGbKTUybzCWzKXkaOlj5bzqzZNxWF0bey40QuuiHsPkrgDhsTVfDoHlFIosifUuiql7HKSfYAcAEZ2wkk95uj3WvsC/XkkUUswyl/unCM6uA6P0eMBGk/Ov1IJjh5W/71CiNc/PACXbWkwwdHxd4ERIjSuEu3Rxq4LtHebtU05UCJ8wbsC8nOt/sOjhPfoJBCABhcwCUIBJrhS0JhxmeSMwNsKmApm/kJRHNmIWGPQ9quhoJeZ/y/U/+GI9iJ4Nz/ils/OeEPq9iDTS/FwFQQrzucNqHihBgv0k05qGEv09gJgjpDbaJYElXB/NYEUt/LQs2CbAu1TDXiTTO4l1XEJKOG2D+YMhb7//J8yTDgC7NjXGNuX4N1SGzuCrjJ4N0uFvzjtro2dqODdIrornGbqyp7mMspQxbkUFxfv/yur/HQqRBa8mwbvboN3E0HfY449SlaJpNxNoirrkGizTrzQHQeignevUV0RF7hJ1SsF794FgrxvqQHDynbPcKVicFJUsCBEfMG7cS13KFbx4N0DW4xcWCWaC8kpBogqtoLxPiZ3SU6Aiv21sXNu0hR/j6s8pKUuMYCJ2CGV3o5gCft/LkkrcbVVGR9JDqHUi0hhMxfxVSNJbKxwqWyPXmRC1QbVJj0TVSwjlSMscJY3FVfXGqu+LbQ0aGqV2PwUGKJ11/qE0q2pWvD3mfB2KRDcO0WQtOAVW9Q0SBK80oFualLsKeOIDVmLytHoVSIBGzWbXUwUUh4aa9srdpkM7XYFBYbdGWWHYBtcaRKTP8mosSuHFj+egC+Xi8m1sYOSLciVxtV83kPuXRxSYslDtSnclze5rVHRdqh+FlsPa1GneALBu2kqvc18yXXWwCtNpV+uRfwfMQW1WNrY6Q8V5XBzKpOcQnAQVKG6H1x8MSspzoyGNGeI49Zpyit0KVTusk/jAgCXPDlZBXqNBEvcJPfpbKkXapL6gsQCKGScU2rKJTczFSYXqiSDS0BlqWCy2enc3uuLDzySmjuBdd+V1C1TgZw29ktE3pT615LKLi55kjK6LesJtbEzqnDrD5LgbQyMr+qFAAAAAElFTkSuQmCC" width="64" height="64"/></pattern>
      <radialGradient id="ornSh"><stop offset="0" stop-color="#06131a" stop-opacity=".45"/><stop offset="1" stop-color="#06131a" stop-opacity="0"/></radialGradient>
      <radialGradient id="softSh"><stop offset="0" stop-color="#5d7598" stop-opacity=".6"/><stop offset="1" stop-color="#5d7598" stop-opacity="0"/></radialGradient>
      <filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.2"/></filter>`;

    warmEl = el("ellipse", { cx: 200, cy: 330, rx: 270, ry: 300, fill: "url(#treeWarm)", class: "tree-warm" }, bsvg);

    // sneeuwplek met stenen, takjes, lantaarns en cadeaus
    let patch = "";
    for (let k = 0; k <= 48; k++) {
      const t = (k / 48) * Math.PI * 2, wob = 1 + Math.sin(t * 5 + 1) * 0.04 + Math.sin(t * 11) * 0.025 + (R() - 0.5) * 0.03;
      patch += `${k ? "L" : "M"}${(200 + Math.cos(t) * 198 * wob).toFixed(1)} ${(586 + Math.sin(t) * 24 * wob).toFixed(1)}`;
    }
    el("g", {}, svg).innerHTML = `
      <path d="M-900 600 Q-300 586 -120 596 Q200 566 520 596 Q700 586 1300 600 L1300 2400 L-900 2400Z" fill="#dfe8f6"/>
      <path d="M-900 650 Q-300 630 -120 640 Q200 616 520 640 Q700 630 1300 650 L1300 2400 L-900 2400Z" fill="#eef3fb"/>
      <path d="M-900 720 Q-200 690 200 712 Q600 690 1300 720 L1300 2400 L-900 2400Z" fill="#f6f9fe"/>
      <ellipse cx="206" cy="596" rx="206" ry="24" fill="#5d7598" opacity=".35" filter="url(#blur)"/>
      <path d="${patch}Z" fill="#9fbad0"/>
      <path d="${patch}Z" fill="url(#patchG)" transform="translate(-3 -3)"/>
      <ellipse cx="204" cy="580" rx="120" ry="11" fill="#7f97b4" opacity=".55" filter="url(#blur)"/>
      <path d="M40 598 Q70 590 96 596 M300 600 Q330 592 362 598" stroke="#aec4d6" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>
      <g><ellipse cx="88" cy="594" rx="9" ry="5" fill="#7d8188"/><ellipse cx="86" cy="592" rx="5" ry="2.4" fill="#b7bbc2"/>
         <ellipse cx="318" cy="598" rx="12" ry="6" fill="#6e747d"/><ellipse cx="315" cy="595.5" rx="7" ry="2.8" fill="#aab0b8"/>
         <ellipse cx="248" cy="600" rx="6" ry="3.2" fill="#80858c"/><ellipse cx="247" cy="599" rx="3.4" ry="1.4" fill="#c1c5cb"/></g>
      <path d="M58 600 l14 -4 M66 598 l4 -5 M336 588 l12 3 M344 589 l2 5" stroke="#6b5444" stroke-width="2" stroke-linecap="round"/>
      <g class="lantern" transform="translate(44 576) scale(.9)">
        <path d="M-9 -22 H9 L7 -27 H-7Z" fill="#2c2f3f"/><rect x="-10" y="-22" width="20" height="26" rx="3" fill="#2c2f3f"/>
        <rect x="-7" y="-19" width="14" height="20" rx="2" fill="#ffd98a"/>
        <rect x="-11" y="4" width="22" height="4" rx="2" fill="#2c2f3f"/><path d="M-4 -27 Q0 -33 4 -27" fill="none" stroke="#2c2f3f" stroke-width="2"/>
      </g>
      <g class="lantern" transform="translate(360 582) scale(.78)">
        <path d="M-9 -22 H9 L7 -27 H-7Z" fill="#2c2f3f"/><rect x="-10" y="-22" width="20" height="26" rx="3" fill="#2c2f3f"/>
        <rect x="-7" y="-19" width="14" height="20" rx="2" fill="#ffd98a"/>
        <rect x="-11" y="4" width="22" height="4" rx="2" fill="#2c2f3f"/><path d="M-4 -27 Q0 -33 4 -27" fill="none" stroke="#2c2f3f" stroke-width="2"/>
      </g>
      <path d="M186 492 C189 526 186 552 177 568 C168 578 152 582 138 585 C150 588 166 588 180 582 C184 586 190 590 197 590 L203 590 C210 590 216 586 220 582 C234 588 250 588 262 585 C248 582 232 578 223 568 C214 552 211 526 214 492Z" fill="url(#trunkG)"/>
      <path d="M190 500 C192 528 190 548 184 562" stroke="#a48b76" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>
      <path d="M150 586 Q176 578 196 590 Q222 578 254 586" fill="none" stroke="#eef2f4" stroke-width="4" stroke-linecap="round" opacity=".9"/>
      ${gift(96, 560, 38, 30, "#c9503a", "#f1e6cf")}
      ${gift(132, 574, 22, 16, "#6f9aa4", "#f1e6cf")}
      ${gift(266, 566, 32, 26, "#d9a54a", "#8e2f25")}
      <path d="M86 590 Q110 584 134 590 Q150 586 160 591 M258 594 Q282 588 304 594" stroke="#f6f3ec" stroke-width="5" fill="none" stroke-linecap="round"/>`;

    // de boom: rijen plukken, onderaan beginnen zodat hogere rijen eroverheen hangen
    const treeG = el("g", {}, svg);
    [...tiers].reverse().forEach((t) => el("path", { d: tierPath({ ...t, hw: t.hw * 0.8, bottom: t.bottom - 12 }), fill: "#1d3336" }, treeG));
    const rows = [], dropSites = [];
    for (let y = 108; y <= 500; y += 21 + R() * 7) rows.push(y);
    rows.reverse().forEach((y) => {
      const reach = Math.max(12, halfW(y + 14) * (0.9 + R() * 0.2));
      const n = Math.max(2, Math.round((2 * reach) / 30));
      const xs = [];
      for (let k = 0; k < n; k++) xs.push(-reach + (2 * reach * (k + 0.5 + (R() - 0.5) * 0.55)) / n);
      xs.sort((p, q) => Math.abs(q) - Math.abs(p)).forEach((x) => {
        const u = x / reach;
        const ang = Math.PI / 2 - u * 1.08 + (R() - 0.5) * 0.3;
        const len = 26 + R() * 14 + Math.abs(u) * 10 + (y / 500) * 8;
        const tx0 = 200 + x * 0.7, ty0 = y - 6 + R() * 4;
        const snowy = R() < 0.42 - u * 0.12;
        tuft(treeG, tx0, ty0, ang, len, TONES[toneFor(u)], 6 + Math.floor(R() * 3), true, snowy);
        if (snowy && R() < 0.28) dropSites.push({ x: tx0 + Math.cos(ang) * len * 0.75, y: ty0 + Math.sin(ang) * len * 0.75 + 6 });
      });
    });
    // spits bovenin
    tuft(treeG, 201, 116, -Math.PI / 2 - 0.12, 22, TONES.lit, 4, true, true);
    tuft(treeG, 199, 116, -Math.PI / 2 + 0.25, 20, TONES.mid, 4);
    tuft(treeG, 200, 120, Math.PI / 2 + 0.9, 16, TONES.lit, 4);
    tuft(treeG, 200, 120, Math.PI / 2 - 0.9, 16, TONES.shade, 4);
    // korrel voor een geschilderd gevoel
    el("path", { d: [...tiers].map((t) => tierPath({ ...t, hw: t.hw + 12, bottom: t.bottom + 12 })).join(" "), fill: "url(#grain)", opacity: ".55", "pointer-events": "none" }, svg);

    // sneeuw die af en toe van een tak valt
    drops = [];
    dropSites.slice(0, 16).forEach((d) => {
      const dur = 7 + R() * 7, delay = R() * dur, dx = (R() - 0.5) * 16;
      for (let q = 0; q < 4; q++) drops.push({ x: d.x + (R() - 0.5) * 6, y: d.y + (R() - 0.5) * 3, r: 0.9 + R() * 1.5, dx: dx + (R() - 0.5) * 8, fall: 55 + R() * 45, dur, delay: delay + q * 0.07 });
    });

    // rondvliegende blaadjes en sneeuwbrokjes
    const flyG = el("g", { class: "fly" }, svg);
    const flyCols = ["#2f5462", "#5d7d6b", "#a7a982", "#6b5444", "#e6dfc4", "#7da2ad"];
    for (let k = 0; k < 20; k++) {
      const y = 140 + R() * 400, sd = R() < 0.5 ? -1 : 1, x = 200 + sd * (halfW(Math.min(y, 500)) + 16 + R() * 44);
      const g = el("g", { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(R() * 360).toFixed(0)}) scale(${(0.6 + R() * 0.8).toFixed(2)})` }, flyG);
      el("path", { d: k % 4 === 3 ? "M0 0 C1 -2 4 -2 5 0 C4 2 1 2 0 0Z" : "M0 0 C2 -3 7 -3 9 0 C7 3 2 3 0 0Z", fill: flyCols[k % flyCols.length] }, g);
    }

    const pts = [];
    way.forEach((p, i) => { pts.push(p); const q = way[i + 1]; if (q) pts.push({ x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 + 16 }); });
    const path = el("path", { d: smooth(pts), fill: "none", stroke: "#2a2a24", "stroke-width": "1.4", opacity: ".7" }, svg);
    const total = path.getTotalLength();
    wayLen = [0];
    let k = 1;
    for (let L = 0; L <= total && k < N; L += 0.75) {
      const pt = path.getPointAtLength(L);
      if (Math.hypot(pt.x - way[k].x, pt.y - way[k].y) < 1.2) { wayLen[k++] = L; L += 10; }
    }
    while (wayLen.length < N) wayLen.push(total);
    wayLen[N - 1] = total;

    const bp = ["#ffe3a0", "#ff9fb6", "#8fe6d3", "#ffd06e", "#fff4e0", "#c7b2ff", "#9cc8ff"];
    bulbs = [];
    let i = 0;
    for (let L = 7; L < total - 4; L += 12, i++) {
      const p = path.getPointAtLength(L);
      bulbs.push({ L, x: p.x, y: p.y, c: bp[i % bp.length], ph: ((i * 0.37) % 2.6) * 2.42, on: false });
    }

    twinkles = [];
    for (let s = 0; s < 9; s++) {
      const y = 120 + R() * 370, hw = halfW(y) * 0.85;
      if (hw < 10) continue;
      twinkles.push({ x: 200 + (R() * 2 - 1) * hw, y, k: 0.5 + R() * 0.5, delay: R() * 4 });
    }

    // ballen: glanzend oranjerood, half tussen de takken
    const ORN = ["#e2643c", "#d4522e", "#ec7d40", "#5a3a2b", "#df5a38", "#ee8a4b"];
    const odefs = $("defs", svg);
    ornEls = [];
    const coverG = el("g", { "pointer-events": "none" });
    C.stops.forEach((s, idx) => {
      if (idx === N - 1) return;
      const p = way[idx], oc = s.kleur || ORN[idx % ORN.length];
      odefs.insertAdjacentHTML("beforeend", `<radialGradient id="og${idx}" cx=".36" cy=".32" r=".78"><stop offset="0" stop-color="${mixHex(oc, "#ffffff", 0.45)}"/><stop offset=".45" stop-color="${oc}"/><stop offset="1" stop-color="${mixHex(oc, "#000000", 0.55)}"/></radialGradient>`);
      const g = el("g", { class: "orn", transform: `translate(${p.x} ${p.y + 11})`, "data-i": idx }, fsvg);
      const sh = el("g", { class: "shake" }, g);
      el("ellipse", { cx: 3, cy: 6, rx: 19, ry: 17, fill: "url(#ornSh)" }, sh);
      el("rect", { x: -4.5, y: -20, width: 9, height: 6, rx: 1.5, fill: "#b89a5a" }, sh);
      el("circle", { r: 21, class: "ring" }, sh);
      el("circle", { r: 16.5, fill: `url(#og${idx})`, class: "ball" }, sh);
      el("ellipse", { cx: -6, cy: -6.5, rx: 4.8, ry: 2.8, fill: "#fff", class: "shine", transform: "rotate(-35 -6 -6.5)" }, sh);
      el("circle", { cx: 6, cy: 7, r: 1.4, fill: "#fff", opacity: ".35" }, sh);
      el("text", { class: "q", "text-anchor": "middle", y: 6 }, sh).textContent = "?";
      el("circle", { r: 30, fill: "transparent" }, g);
      ornEls[idx] = g;
      const u = (p.x - 200) / (halfW(p.y) || 1);
      tuft(coverG, p.x - 3, p.y - 12, Math.PI / 2 - u * 0.9, 15, TONES[u < -0.3 ? "lit" : u < 0.25 ? "mid" : "shade"], 4, false);
    });
    fsvg.appendChild(coverG);

    starEl = el("g", { class: "star", "data-i": N - 1 }, fsvg);
    const sfx = $("#starFx"); sfx.innerHTML = "";
    const sfSvg = (cls) => { const s2 = document.createElementNS(NS, "svg"); s2.setAttribute("viewBox", "80 -54 240 240"); s2.setAttribute("class", cls); sfx.appendChild(s2); return s2; };
    const haloSvg = sfSvg("sf-halo"), raySvg = sfSvg("sf-rays"), orbitSvg = sfSvg("sf-orbit");
    const rays = el("g", {}, raySvg);
    const rayCols = ["#fff3c4", "#ffb3c8", "#a6f0dd", "#ffe08a", "#d4c2ff", "#9cc8ff"];
    $("defs", svg).insertAdjacentHTML("beforeend", rayCols.map((c, j) => `<linearGradient id="ray${j}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity="0"/><stop offset=".35" stop-color="${c}" stop-opacity=".6"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient>`).join(""));
    for (let r = 0; r < 12; r++) el("path", { d: "M-3.4 -40 L0 -116 L3.4 -40Z", fill: `url(#ray${r % rayCols.length})`, transform: `translate(200 66) rotate(${r * 30 + (r % 2) * 8})`, opacity: r % 2 ? ".6" : "1" }, rays);
    // kleurige gloed: goud in het midden, roze en mint aan de rand
    $("defs", svg).insertAdjacentHTML("beforeend", `
      <radialGradient id="starHalo"><stop offset="0" stop-color="#fff1b8" stop-opacity=".95"/><stop offset=".35" stop-color="#ffc861" stop-opacity=".55"/><stop offset=".6" stop-color="#ff8fb4" stop-opacity=".25"/><stop offset=".82" stop-color="#8fe6d3" stop-opacity=".12"/><stop offset="1" stop-color="#8fe6d3" stop-opacity="0"/></radialGradient>
      <radialGradient id="gem" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffd1e0"/><stop offset=".45" stop-color="#ff4f86"/><stop offset="1" stop-color="#9c1745"/></radialGradient>`);
    el("circle", { cx: 200, cy: 66, r: 64, fill: "url(#starHalo)" }, haloSvg);
    // facetten: elke punt een lichte en een donkere helft
    const sp = starPts(200, 66, 30, 13).split(" ").map((q) => q.split(",").map(Number));
    for (let f = 0; f < 10; f++) {
      const p1 = sp[f], p2 = sp[(f + 1) % 10];
      el("path", { d: `M200 66 L${p1[0]} ${p1[1]} L${p2[0]} ${p2[1]}Z`, class: f % 2 ? "fb" : "fa" }, starEl);
    }
    el("polygon", { points: starPts(200, 66, 30, 13), fill: "none", class: "star-shape", stroke: "#fff4c9", "stroke-opacity": ".75", "stroke-width": "1.6", "stroke-linejoin": "round" }, starEl);
    // edelsteentje in het hart
    el("circle", { cx: 200, cy: 66, r: 6.2, fill: "url(#gem)", class: "star-gem" }, starEl);
    el("circle", { cx: 198, cy: 64, r: 1.8, fill: "#fff", opacity: ".85" }, starEl);
    // kleine gekleurde lichtjes die om de piek draaien
    const orbit = el("g", {}, orbitSvg);
    ["#ff8fb4", "#8fe6d3", "#ffd06e", "#c7b2ff", "#9cc8ff", "#ffb38a"].forEach((c, j) => {
      const ang = (j / 6) * Math.PI * 2, rr = 44 + (j % 2) * 6;
      el("circle", { cx: (200 + Math.cos(ang) * rr).toFixed(1), cy: (66 + Math.sin(ang) * rr * 0.8).toFixed(1), r: j % 2 ? 2.2 : 2.8, fill: c }, orbit);
    });
    el("circle", { cx: 200, cy: 66, r: 42, fill: "transparent" }, starEl);
    const ring = el("circle", { cx: 200, cy: 66, r: 38, fill: "none", stroke: "#f2cf6b", "stroke-width": "2.6", opacity: "0", class: "sring" }, starEl);
    ring.style.transformBox = "fill-box"; ring.style.transformOrigin = "center";
    // de losse sterlagen volgen de klassen van de ster (aan, bijna, weggeschoten)
    const syncStar = () => { sfx.className = (starEl.getAttribute("class") || "").replace("star", "").trim(); };
    new MutationObserver(syncStar).observe(starEl, { attributes: true, attributeFilter: ["class"] });
    syncStar();
  }
  function gift(x, y, w, h, c, rib) {
    const cx = x + w / 2;
    return `<g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${c}"/>
      <rect x="${cx}" y="${y}" width="${w / 2}" height="${h}" rx="3" fill="#000" opacity=".1"/>
      <rect x="${x - 2}" y="${y - 1}" width="${w + 4}" height="${Math.max(6, h * 0.22)}" rx="2" fill="${c}"/>
      <rect x="${x - 2}" y="${y - 1}" width="${w + 4}" height="2.4" rx="1.2" fill="#fff" opacity=".22"/>
      <rect x="${cx - w * 0.09}" y="${y - 1}" width="${w * 0.18}" height="${h + 1}" fill="${rib}"/>
      <path d="M${cx} ${y - 1} C${cx - w * 0.38} ${y - h * 0.5} ${cx - w * 0.42} ${y + 3} ${cx} ${y - 1} C${cx + w * 0.42} ${y + 3} ${cx + w * 0.38} ${y - h * 0.5} ${cx} ${y - 1}Z" fill="${rib}"/>
      <circle cx="${cx}" cy="${y - 1}" r="${Math.max(2, w * 0.06)}" fill="${rib}"/>
      <path d="M${x} ${y + 1} Q${cx} ${y - 4} ${x + w} ${y + 1}" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".9"/>
    </g>`;
  }

  /* ---------------- render ---------------- */
  const litLen = (done = S.done) => (done <= 0 ? -1 : wayLen[Math.min(done, N - 1)]);
  function setBulbs(len, from) {
    bulbs.forEach((x) => {
      const on = x.L <= len;
      if (from !== undefined && on && x.L > from) setTimeout(() => { x.on = true; }, (x.L - from) * 7);
      else x.on = on;
    });
  }
  function renderOrns() {
    ornEls.forEach((g, i) => {
      g.classList.toggle("done", i < S.done);
      g.classList.toggle("current", i === S.done);
      g.classList.toggle("locked", i > S.done);
    });
    const starOn = S.done >= N;
    starEl.classList.toggle("on", starOn);
    starEl.classList.toggle("near", !starOn && S.done === N - 1);
    $(".sring", starEl).style.animation = "none";
  }
  const render = () => {
    setBulbs(litLen()); renderOrns();
    if (warmEl) warmEl.style.opacity = (0.25 + 0.75 * Math.min(1, S.done / N)).toFixed(2);
  };

  /* ---------------- top light string ---------------- */
  let topBulbs = [];
  function buildTopLights() {
    const t = $("#topLights"), w = vw();
    t.setAttribute("viewBox", `0 0 ${w} 70`);
    t.innerHTML = '<defs><filter id="tlBlur" x="-1" y="-1" width="3" height="3"><feGaussianBlur stdDeviation="4"/></filter></defs>';
    const wire = el("path", { d: `M-10 14 Q${w * 0.25} 52 ${w * 0.5} 18 Q${w * 0.75} 52 ${w + 10} 14`, fill: "none", stroke: "#2c3a52", "stroke-width": 1.5 }, t);
    const total = wire.getTotalLength(), n = Math.max(9, Math.floor(w / 30));
    const gG = el("g", { filter: "url(#tlBlur)" }, t);
    const cols = ["#fff4cf", "#ffd0da", "#c9f1e8", "#ffe7a3"];
    topBulbs = [];
    for (let i = 1; i < n; i++) {
      const p = wire.getPointAtLength((total * i) / n);
      const c = cols[i % cols.length];
      const glow = el("circle", { cx: p.x, cy: p.y + 9, r: 9, fill: c, opacity: 0 }, gG);
      el("rect", { x: p.x - 2.5, y: p.y - 1, width: 5, height: 5, rx: 1, fill: "#3a465c" }, t);
      const b = el("ellipse", { cx: p.x, cy: p.y + 9, rx: 4.2, ry: 5.6, fill: "#2b3547" }, t);
      topBulbs.push({ b, glow, c });
    }
    if (S.lit) topBulbs.forEach((x) => { x.b.setAttribute("fill", x.c); x.glow.setAttribute("opacity", ".75"); });
  }
  const lightTop = () => topBulbs.forEach((x, i) => setTimeout(() => { x.b.setAttribute("fill", x.c); x.glow.setAttribute("opacity", ".75"); }, 120 + i * 70 + (i % 3) * 40));

  /* ---------------- canvases ---------------- */
  const snow = $("#snow"), sctx = snow.getContext("2d"), fx = $("#fx"), fctx = fx.getContext("2d");
  const front = $("#snowFront"), nctx = front.getContext("2d");
  const drift = $("#drift"), dctx = drift.getContext("2d");
  let flakes = [], fflakes = [], stars = [], parts = [], sparks = [], flash = 0;
  const dpr = Math.min(2, devicePixelRatio || 1), sdpr = 1, fdpr = Math.min(1.5, devicePixelRatio || 1);
  // zachte vlok als sprite, scheelt rekenwerk
  const flakeSprite = (() => {
    const c = document.createElement("canvas"); c.width = c.height = 32;
    const g = c.getContext("2d"), gr = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.35, "rgba(255,255,255,.85)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 32, 32); return c;
  })();
  const glowCache = {};
  const glowSprite = (col) => {
    if (glowCache[col]) return glowCache[col];
    const c = document.createElement("canvas"); c.width = c.height = 64;
    const g = c.getContext("2d"), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.12, col); gr.addColorStop(0.4, col + "55"); gr.addColorStop(1, col + "00");
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return (glowCache[col] = c);
  };
  const newFlake = (top) => ({ x: Math.random() * vw(), y: top ? -10 - Math.random() * 40 : Math.random() * vh(), r: Math.random() * 1.7 + 1.9, v: Math.random() * 0.6 + 0.7, d: Math.random() * 6.3, s: Math.random() * 0.02 + 0.008 });
  const lightsC = $("#treeLights"), lctx = lightsC.getContext("2d"), cam2 = $("#cam");
  const ldpr = Math.min(2, devicePixelRatio || 1);
  // zelfde schaal en uitlijning als de boom-svg (die wordt gecentreerd binnen #cam)
  let lk = 1, lox = 0, loy = 0;
  function sizeLights() {
    const cw = cam2.clientWidth, ch = cam2.clientHeight;
    lightsC.width = Math.round(cw * ldpr); lightsC.height = Math.round(ch * ldpr);
    const k = Math.min(cw / 400, ch / 620);
    lk = k * ldpr; lox = ((cw - 400 * k) / 2) * ldpr; loy = ((ch - 620 * k) / 2) * ldpr;
    const sf = $("#starFx");
    Object.assign(sf.style, { left: `${(cw - 400 * k) / 2 + 80 * k}px`, top: `${(ch - 620 * k) / 2 - 54 * k}px`, width: `${240 * k}px`, height: `${240 * k}px` });
  }
  const twPath = new Path2D("M0 -6 L1.3 -1.3 L6 0 L1.3 1.3 L0 6 L-1.3 1.3 L-6 0 L-1.3 -1.3Z");
  function drawLights(now) {
    if (!lightsC.width) return;
    lctx.setTransform(1, 0, 0, 1, 0, 0);
    lctx.clearRect(0, 0, lightsC.width, lightsC.height);
    lctx.setTransform(lk, 0, 0, lk, lox, loy);
    const t = now / 1000;
    lctx.fillStyle = "#2b3547";
    lctx.beginPath();
    bulbs.forEach((b) => { if (!b.on) { lctx.moveTo(b.x + 3.3, b.y); lctx.arc(b.x, b.y, 3.3, 0, 6.3); } });
    lctx.fill();
    lctx.globalCompositeOperation = "lighter";
    bulbs.forEach((b) => {
      if (!b.on) return;
      const a = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(t * 2.42 + b.ph));
      lctx.globalAlpha = a * 0.75; lctx.drawImage(glowSprite(b.c), b.x - 15, b.y - 15, 30, 30);
    });
    lctx.globalCompositeOperation = "source-over";
    bulbs.forEach((b) => {
      if (!b.on) return;
      lctx.globalAlpha = 0.7 + 0.3 * (0.5 + 0.5 * Math.sin(t * 2.42 + b.ph));
      lctx.fillStyle = b.c; lctx.beginPath(); lctx.arc(b.x, b.y, 3.3, 0, 6.3); lctx.fill();
    });
    if (S.lit) {
      // lantaarns: warme gloed en een flakkerend vlammetje
      [[44, 576, 0.9, 0], [360, 582, 0.78, 1.1]].forEach(([lx, ly, sc, ph]) => {
        const f = 0.5 + 0.5 * Math.sin(t * 2.4 + ph) * Math.sin(t * 5.3 + ph * 2);
        lctx.globalCompositeOperation = "lighter";
        lctx.globalAlpha = 0.45 + 0.25 * f; lctx.drawImage(glowSprite("#ffb347"), lx - 34 * sc, ly - 4 * sc - 34 * sc, 68 * sc, 68 * sc);
        lctx.globalCompositeOperation = "source-over";
        lctx.globalAlpha = 1; lctx.fillStyle = "#ff9d3a";
        const h = (11 + 3 * f) * sc, w = (3 - 0.4 * f) * sc, by = ly - 3 * sc;
        lctx.beginPath(); lctx.moveTo(lx, by); lctx.bezierCurveTo(lx - w, by - h * 0.35, lx - w * 0.3, by - h * 0.75, lx, by - h); lctx.bezierCurveTo(lx + w * 0.3, by - h * 0.75, lx + w, by - h * 0.35, lx, by); lctx.fill();
      });
      // pulserende ring rond de bal (of ster) die nu aan de beurt is
      const cur = S.done;
      if (cur < N) {
        const ring = cur === N - 1 ? { x: 200, y: 66, r: 38 } : { x: way[cur].x, y: way[cur].y + 11, r: 21 };
        const u = (t % 1.8) / 1.8;
        lctx.globalAlpha = 0.9 * (1 - u); lctx.strokeStyle = "#f2cf6b"; lctx.lineWidth = 2.6 / (1 + 0.9 * u);
        lctx.beginPath(); lctx.arc(ring.x, ring.y, ring.r * (1 + 0.9 * u), 0, 6.3); lctx.stroke();
      }
      lctx.fillStyle = "#fff8dc";
      twinkles.forEach((s) => {
        const u = (((t + s.delay) % 4.2) + 4.2) % 4.2 / 4.2;
        const a = u < 0.45 || u > 0.75 ? 0 : u < 0.6 ? (u - 0.45) / 0.15 : (0.75 - u) / 0.15;
        if (a <= 0) return;
        lctx.globalAlpha = a * 0.95; lctx.save(); lctx.translate(s.x, s.y); lctx.scale(s.k, s.k); lctx.fill(twPath); lctx.restore();
      });
      lctx.fillStyle = "#fff";
      drops.forEach((d) => {
        const u = (((t + d.delay) % d.dur) + d.dur) % d.dur / d.dur;
        if (u < 0.84) return;
        const v = (u - 0.84) / 0.16;
        lctx.globalAlpha = v < 0.12 ? v / 0.12 : 1 - v;
        lctx.beginPath(); lctx.arc(d.x + d.dx * v, d.y + d.fall * v * v * 0.6 + d.fall * v * 0.4, d.r, 0, 6.3); lctx.fill();
      });
    }
    lctx.globalAlpha = 1;
  }
  function sizeCanvases() {
    sizeLights();
    [snow, front].forEach((c) => { c.width = vw() * sdpr; c.height = vh() * sdpr; });
    fx.width = vw() * fdpr; fx.height = vh() * fdpr;
    flakes = Array.from({ length: 80 }, () => ({ x: Math.random() * vw(), y: Math.random() * vh(), r: Math.random() * 1.5 + 0.4, v: Math.random() * 0.3 + 0.12, d: Math.random() * 6.3, a: Math.random() * 0.4 + 0.3 }));
    fflakes = Array.from({ length: 30 }, () => newFlake(false));
    stars = Array.from({ length: 70 }, () => ({ x: Math.random() * vw(), y: Math.random() * vh() * 0.55, r: Math.random() * 1.1 + 0.3, p: Math.random() * 6.3, s: Math.random() * 0.03 + 0.008 }));
    sizeDrift();
  }

  /* sneeuw die op de pop-up landt */
  let driftH = [], driftBase = 0, driftOpenAt = 0, settled = [];
  const BIN = 3, DRIFT_TOP = 16;
  function sizeDrift() {
    const w = sheet ? sheet.offsetWidth || vw() : vw();
    drift.width = w * dpr; drift.height = 34 * dpr;
    driftH = new Array(Math.ceil(w / BIN) + 2).fill(0);
  }
  const cornerOff = (x, w) => { const r = 28; if (x < r) return r - Math.sqrt(Math.max(0, r * r - (r - x) * (r - x))); if (x > w - r) return r - Math.sqrt(Math.max(0, r * r - (x - (w - r)) ** 2)); return 0; };
  function landOn(xLocal) {
    const j0 = Math.round(xLocal / BIN);
    for (let j = j0 - 5; j <= j0 + 5; j++) {
      if (j < 0 || j >= driftH.length) continue;
      const d = j - j0;
      const cap = 3.5 + 4.5 * (0.5 + 0.5 * Math.sin(j * 0.37) * Math.sin(j * 0.11 + 2));
      driftH[j] = Math.min(cap, driftH[j] + 0.9 * Math.exp(-(d * d) / 5));
    }
    settled.push({ x: xLocal, life: 70 });
  }
  function resetDrift() { driftH.fill(0); driftBase = 0; settled = []; dctx.clearRect(0, 0, drift.width, drift.height); }
  function drawDrift(now) {
    const w = drift.width / dpr;
    driftBase = Math.min(2.2, ((now - driftOpenAt) / 5000) * 2.2);
    dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dctx.clearRect(0, 0, w, 34);
    const yAt = (x) => {
      const j = x / BIN, j0 = Math.floor(j), f = j - j0;
      const h = (driftH[j0] || 0) * (1 - f) + (driftH[j0 + 1] || 0) * f;
      const wob = Math.sin(x * 0.09) * 0.6 + Math.sin(x * 0.031 + 1) * 0.5;
      const edge = Math.min(1, x / 30, (w - x) / 30);
      return DRIFT_TOP + cornerOff(x, w) - (driftBase + wob * 0.6 + h) * Math.max(0, edge);
    };
    dctx.beginPath();
    dctx.moveTo(0, DRIFT_TOP + 28);
    for (let x = 0; x <= w; x += 2) dctx.lineTo(x, yAt(x));
    for (let x = w; x >= 0; x -= 2) dctx.lineTo(x, DRIFT_TOP + cornerOff(x, w) + 3.5);
    dctx.closePath();
    const gr = dctx.createLinearGradient(0, DRIFT_TOP - 12, 0, DRIFT_TOP + 4);
    gr.addColorStop(0, "#ffffff"); gr.addColorStop(1, "#e3ecfa");
    dctx.fillStyle = gr; dctx.fill();
    // glinstering in de sneeuw
    for (let x = 6; x < w; x += 23) {
      const tw = Math.sin(now * 0.004 + x) * 0.5 + 0.5;
      if (tw > 0.85 && driftBase > 1) { dctx.fillStyle = `rgba(255,255,255,${tw})`; dctx.fillRect(x, yAt(x) + 1.5, 1.6, 1.6); }
    }
    settled = settled.filter((s) => s.life-- > 0);
    settled.forEach((s) => { dctx.globalAlpha = Math.min(1, s.life / 40); dctx.drawImage(flakeSprite, s.x - 3, yAt(s.x) - 3, 6, 6); });
    dctx.globalAlpha = 1;
  }

  function loop(now = 0) {
    const W = vw(), H = vh();
    // achterste laag: sterren + kleine vlokken
    sctx.setTransform(sdpr, 0, 0, sdpr, 0, 0);
    sctx.clearRect(0, 0, W, H);
    stars.forEach((s) => {
      s.p += s.s;
      sctx.globalAlpha = 0.25 + 0.6 * (Math.sin(s.p) * 0.5 + 0.5);
      sctx.fillStyle = "#fff6dc"; sctx.beginPath(); sctx.arc(s.x, s.y, s.r, 0, 7); sctx.fill();
    });
    flakes.forEach((f) => {
      f.y += f.v; f.d += 0.01; f.x += Math.sin(f.d) * 0.25;
      if (f.y > H + 4) { f.y = -4; f.x = Math.random() * W; }
      sctx.globalAlpha = f.a; sctx.fillStyle = "#fff"; sctx.beginPath(); sctx.arc(f.x, f.y, f.r, 0, 7); sctx.fill();
    });
    sctx.globalAlpha = 1;

    // voorste laag: grote zachte vlokken, die landen op een geopende pop-up
    const open = body.classList.contains("sheet-open") && !body.classList.contains("page-open");
    let top = H + 99, l = 0, r = W;
    if (open) { const rc = sheet.getBoundingClientRect(); top = rc.top; l = rc.left; r = rc.right; }
    const want = open ? 46 : 30;
    while (fflakes.length < want) fflakes.push(newFlake(true));
    nctx.setTransform(sdpr, 0, 0, sdpr, 0, 0);
    nctx.clearRect(0, 0, W, H);
    for (let i = fflakes.length - 1; i >= 0; i--) {
      const f = fflakes[i];
      f.y += f.v; f.d += f.s; f.x += Math.sin(f.d) * 0.45;
      if (open && f.x > l && f.x < r && f.y >= top - 4) {
        if (f.y < top + 8) landOn(f.x - l);
        if (fflakes.length > want) { fflakes.splice(i, 1); continue; }
        Object.assign(f, newFlake(true));
        continue;
      }
      if (f.y > H + 10) { if (fflakes.length > want) { fflakes.splice(i, 1); continue; } Object.assign(f, newFlake(true)); }
      const sz = f.r * 3;
      nctx.globalAlpha = 0.85; nctx.drawImage(flakeSprite, f.x - sz / 2, f.y - sz / 2, sz, sz);
    }
    nctx.globalAlpha = 1;
    if (open) drawDrift(now);
    drawLights(now);

    // effecten: confetti, vonken, vuurwerk
    if (parts.length || sparks.length || flash > 0 || fxDirty) {
      fctx.setTransform(fdpr, 0, 0, fdpr, 0, 0);
      fctx.clearRect(0, 0, W, H);
      fxDirty = false;
      parts.forEach((p) => {
        p.vy += 0.12; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.a += p.va; p.life--;
        fctx.save(); fctx.translate(p.x, p.y); fctx.rotate(p.a);
        fctx.globalAlpha = Math.max(0, Math.min(1, p.life / 40));
        fctx.fillStyle = p.c; fctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); fctx.restore();
      });
      parts = parts.filter((p) => p.life > 0 && p.y < H + 20);
      if (flash > 0) {
        const g = fctx.createRadialGradient(flashX, flashY, 0, flashX, flashY, 260);
        g.addColorStop(0, `rgba(255,240,210,${flash * 0.7})`); g.addColorStop(1, "rgba(255,240,210,0)");
        fctx.fillStyle = g; fctx.fillRect(0, 0, W, H); flash -= 0.04;
      }
      if (sparks.length) {
        fctx.globalCompositeOperation = "lighter";
        sparks.forEach((p) => {
          p.t++;
          if (p.update) p.update(p); else { p.vy += p.g || 0.05; p.vx *= 0.985; p.vy *= 0.985; p.x += p.vx; p.y += p.vy; p.life--; }
          const a = Math.max(0, Math.min(1, p.life / (p.fade || 30))) * (p.tw ? 0.65 + 0.35 * Math.sin(p.t * 0.25 + p.ph) : 1);
          if (a <= 0) return;
          const sz = p.r * 6;
          fctx.globalAlpha = a; fctx.drawImage(glowSprite(p.c), p.x - sz / 2, p.y - sz / 2, sz, sz);
        });
        fctx.globalCompositeOperation = "source-over"; fctx.globalAlpha = 1;
        sparks = sparks.filter((p) => p.life > 0);
        if (!sparks.length) fxDirty = true;
      }
      if (!parts.length && !sparks.length && flash <= 0) fxDirty = true;
    }
    requestAnimationFrame(loop);
  }
  let fxDirty = false, flashX = 0, flashY = 0;
  function confetti(x = vw() / 2, y = vh() * 0.3, n = 110, spread = 1) {
    const cols = ["#f2cf6b", "#f7a8b8", "#8fd3c7", "#c9b6f5", "#fbf5ea", "#e57a7a"];
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = (Math.random() * 7 + 3) * spread;
      parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 4, a: Math.random() * 6, va: (Math.random() - 0.5) * 0.3, w: Math.random() * 7 + 4, h: Math.random() * 4 + 3, c: cols[i % cols.length], life: 90 + Math.random() * 70 });
    }
  }
  const party = (n = 3) => { for (let i = 0; i < n; i++) setTimeout(() => confetti(vw() * (0.15 + Math.random() * 0.7), vh() * (0.12 + Math.random() * 0.25), 90), i * 380); };
  const sideCannons = () => {
    [0, 1].forEach((side) => {
      for (let i = 0; i < 70; i++) {
        const cols = ["#f2cf6b", "#f7a8b8", "#8fd3c7", "#c9b6f5", "#fbf5ea"];
        parts.push({ x: side ? vw() + 5 : -5, y: vh() * 0.75, vx: (side ? -1 : 1) * (Math.random() * 8 + 5), vy: -(Math.random() * 12 + 8), a: Math.random() * 6, va: (Math.random() - 0.5) * 0.3, w: Math.random() * 7 + 4, h: Math.random() * 4 + 3, c: cols[i % 5], life: 120 + Math.random() * 60 });
      }
    });
  };

  /* ---------------- camera ---------------- */
  const cam = $("#cam"), stage = $("#stage");
  function focusOn(i, scale = 1.55) {
    const p = i === N - 1 ? { x: 200, y: 66 } : { x: way[i].x, y: way[i].y + 11 };
    const w = cam.offsetWidth, h = cam.offsetHeight;
    const px = (p.x / 400) * w, py = (p.y / 620) * h;
    const sr = stage.getBoundingClientRect();
    const sx = sr.left + cam.offsetLeft + px, sy = sr.top + cam.offsetTop + py;
    cam.style.transformOrigin = `${px}px ${py}px`;
    cam.style.transform = `translate(${vw() / 2 - sx}px, ${vh() * 0.13 - sy}px) scale(${scale})`;
  }
  const unfocus = () => { cam.style.transform = ""; };

  /* ---------------- toast ---------------- */
  let toastT;
  function toast(title, text = "", ms = 5000) {
    const t = $("#toast");
    t.innerHTML = `<div class="ti">${ICON.bell}</div><div><b>${esc(title)}</b>${text ? `<span>${esc(text)}</span>` : ""}</div>`;
    t.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove("show"), ms);
  }
  $("#toast").addEventListener("click", () => $("#toast").classList.remove("show"));

  /* ---------------- scenery: besneeuwd Keulen ---------------- */
  function buildScenery() {
    const sc = $("#scenery");
    const far = "#30487f", near = "#3b5794";
    let win = "";
    const w = (x, y) => (win += `<rect x="${x}" y="${y}" width="2.4" height="3.6" rx=".6" fill="#ffd77a" opacity="${(0.5 + Math.random() * 0.5).toFixed(2)}"/>`);
    for (let i = 0; i < 6; i++) w(54 + i * 7.5, 186 + (i % 2) * 14);
    [[56, 120], [56, 140], [94, 120], [94, 140], [138, 165], [148, 185], [276, 185], [300, 190], [318, 182]].forEach(([x, y]) => w(x, y));
    sc.innerHTML = `
      <defs><linearGradient id="mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfd9f2" stop-opacity="0"/><stop offset=".7" stop-color="#cfd9f2" stop-opacity=".28"/><stop offset="1" stop-color="#cfd9f2" stop-opacity=".1"/></linearGradient><radialGradient id="domGlow"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".6"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient></defs>
      <ellipse cx="76" cy="150" rx="70" ry="90" fill="url(#domGlow)"/>
      <g fill="${far}">
        <rect x="358" y="100" width="5" height="130"/><ellipse cx="360.5" cy="134" rx="12" ry="6"/><rect x="359.5" y="66" width="2" height="36"/>
        <rect x="270" y="176" width="7" height="54"/><rect x="266" y="165" width="34" height="13" rx="1"/>
        <rect x="294" y="180" width="7" height="50"/><rect x="290" y="169" width="34" height="13" rx="1"/>
        <rect x="318" y="184" width="7" height="46"/><rect x="314" y="173" width="32" height="12" rx="1"/>
      </g>
      <circle cx="360.5" cy="66" r="2" fill="#ff5a5a"/>
      <g fill="none" stroke="${far}" stroke-width="3">
        <path d="M166 212 Q182 186 199 212 Q215 186 232 212 Q248 186 265 212"/><path d="M164 212 H267" stroke-width="4"/>
      </g>
      <g fill="${near}">
        <rect x="132" y="152" width="24" height="78"/><polygon points="129,152 144,112 159,152"/>
        <polygon points="130,152 133,138 136,152"/><polygon points="152,152 155,138 158,152"/>
        <rect x="48" y="170" width="56" height="60"/><polygon points="62,170 76,148 90,170"/><polygon points="74,150 76,124 78,150"/>
        <rect x="49" y="95" width="15" height="80"/><rect x="88" y="95" width="15" height="80"/>
        <polygon points="48,96 56.5,36 65,96"/><polygon points="87,96 95.5,36 104,96"/>
      </g>
      <g fill="#fff" opacity=".85"><polygon points="53,70 56.5,48 60,70"/><polygon points="92,70 95.5,48 99,70"/><path d="M129 152 L144 140 L159 152 Z" opacity=".5"/></g>
      ${win}
      <rect x="0" y="196" width="400" height="44" fill="url(#mist)"/>
      <path d="M0 232 Q60 218 120 230 T240 228 T400 226 V300 H0Z" fill="#dfe8f6"/>
      <path d="M0 256 Q100 238 200 254 T400 246 V300 H0Z" fill="#f4f8ff"/>
      <g><polygon points="18,248 30,214 42,248" fill="#14583a"/><polygon points="24,232 30,214 36,232" fill="#fff" opacity=".9"/>
         <polygon points="362,244 374,206 386,244" fill="#14583a"/><polygon points="368,226 374,206 380,226" fill="#fff" opacity=".9"/>
         <polygon points="340,252 348,228 356,252" fill="#1b6b47"/></g>`;
  }

  /* ---------------- full-screen pages ---------------- */
  const page = $("#page");
  function showPage(cls, html, bg = "", bgCls = "") {
    page.className = cls;
    page.innerHTML = `<div class="bg ${bgCls}">${bg}</div>${html}`;
    void page.offsetWidth;
    page.classList.add("show");
    body.classList.add("page-open");
  }
  function hidePage() { page.classList.remove("show"); body.classList.remove("page-open"); }

  function felicitatie() {
    const f = C.felicitatie;
    showPage("pg-fel", `<div class="spacer"></div>
      <p class="pg-kicker in">${esc(C.naam)},</p>
      <p class="big-age in">${C.leeftijd}</p>
      <h1 class="pg-title in">${esc(f.titel)}</h1>
      <p class="love in">${esc(f.liefde)}</p>
      <p class="pg-text in">${esc(f.tekst)}</p>
      <div class="spacer"></div>
      <div class="actions in"><button class="btn btn-gold" data-pg="fel">${esc(f.knop)}</button></div>`);
    chime([784, 988, 1175, 1568, 1976], 0.09);
    sideCannons(); setTimeout(() => party(4), 700); setTimeout(sideCannons, 2600);
  }

  function reveal(i) {
    const s = C.stops[i], piek = s.soort === "piek";
    page.style.setProperty("--c1", s.kleur || "#2d4a7a");
    showPage("pg-reveal", `<div class="spacer"></div>
      <p class="num in">${piek ? esc(T("dePiek")) : `${esc(T("lampje"))} ${i + 1} ${esc(T("van"))} ${N}`}</p>
      <h1 class="pg-title in">${esc(s.titel)}</h1>
      <p class="pg-text in">${esc(s.teaser || "")}</p>
      <div class="spacer"></div>
      <div class="actions in"><button class="btn btn-gold" data-pg="reveal" data-i="${i}">${esc(T("laatZien"))}</button></div>`,
      s.foto ? imgTag(s.foto, "", 1200, s.fokus) : "", s.foto ? "shade" : "solid");
    chime([988, 1319, 1568], 0.1);
    setTimeout(sideCannons, 250);
  }

  function opReis() {
    const o = C.opReis;
    showPage("pg-reis", `<div class="spacer"></div>
      <h1 class="pg-title in">${esc(o.titel)}</h1>
      <p class="pg-text in">${esc(o.tekst)}</p>
      <div class="road in">${CAR}<div class="line"></div></div>
      <div class="spacer"></div>
      <div class="actions in">
        <a class="btn btn-gold" href="${mapsUrl(o.route.adres, "auto")}" target="_blank" rel="noopener">${esc(o.route.naam)}</a>
        <button class="btn btn-ghost" data-pg="reis">${esc(T("weZijnEr"))}</button>
      </div>`);
    chime([523, 659, 784]);
  }

  function cadeauPage(i) {
    const c = i === -1 ? C.startCadeau : i === -2 ? C.eindCadeau : C.stops[i].cadeau;
    showPage("pg-cadeau", `<div class="spacer"></div>
      <p class="pg-kicker in">${esc(c.kicker || T("cadeautje"))}</p>
      <h1 class="pg-title in">${esc(c.titel)}</h1>
      <div class="in gift-wrap" data-pg="box" data-i="${i}">${BOX}${c.foto ? `<img class="charm" src="${esc(c.foto)}" alt="">` : ""}${(c.fotos || []).map((f, j, all) => `<img class="charm duo" style="--dx:${(j - (all.length - 1) / 2) * 105}%;--dl:${j * 0.55}s" src="${esc(f)}" alt="">`).join("")}</div>
      <p class="cadeau-msg">${esc(c.tekst || "")}</p>
      <div class="spacer"></div>
      <div class="actions in" id="cadeauAct"><p class="pg-text" style="margin:0 0 6px">${esc(T("tikPakje"))}</p></div>`);
    chime([659, 784, 988]);
  }

  function proostPage() {
    const p = C.stops[N - 1].proost || { titel: "Proost!", tekst: "" };
    showPage("pg-proost", `<div class="spacer"></div>
      <h1 class="pg-title in">${esc(p.titel)}</h1>
      <p class="pg-text in">${esc(p.tekst)}</p>
      <p class="love in" style="color:#fff8e6">${esc(C.felicitatie.liefde)}</p>
      <div class="spacer"></div>
      <div class="actions in"><button class="btn btn-ink" data-pg="proost">${esc(T("eetsmakelijk"))}</button></div>`);
    sideCannons(); setTimeout(() => party(5), 500);
  }

  function welterusten() {
    const w = C.welterusten;
    showPage("pg-nacht", `<div class="spacer"></div>
      <div class="moon in"></div>
      <h1 class="pg-title in">${esc(w.titel)}</h1>
      <p class="pg-text in" style="font-size:22px">${esc(w.tekst)}</p>
      <div class="spacer"></div>
      <div class="actions in">${w.route ? `<a class="btn btn-gold" href="${mapsUrl(w.route.adres)}" target="_blank" rel="noopener">${esc(w.route.naam)}</a>` : ""}<button class="btn btn-gold" data-pg="nacht">${esc(T("slaapLekker"))}</button></div>`);
    chime([1568, 1319, 1175, 988, 784], 0.16);
  }


  /* ---------------- slot: de piek schiet als vuurwerk weg en wordt een hartje ---------------- */
  const boom = () => {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const t0 = audio.currentTime, len = audio.sampleRate * 1.4, buf = audio.createBuffer(1, len, audio.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      const src = audio.createBufferSource(), f = audio.createBiquadFilter(), g = audio.createGain();
      f.type = "lowpass"; f.frequency.value = 700; g.gain.value = 0.5;
      src.buffer = buf; src.connect(f).connect(g).connect(audio.destination); src.start(t0);
    } catch (e) {}
  };
  const whistle = () => {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const t0 = audio.currentTime, o = audio.createOscillator(), g = audio.createGain();
      o.type = "sine"; o.frequency.setValueAtTime(500, t0); o.frequency.exponentialRampToValueAtTime(1500, t0 + 0.9);
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.05, t0 + 0.1); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.95);
      o.connect(g).connect(audio.destination); o.start(t0); o.stop(t0 + 1);
    } catch (e) {}
  };
  let finaleBusy = false;
  function finale() {
    if (finaleBusy) return; finaleBusy = true;
    unfocus();
    const sr = $(".star-shape", starEl).getBoundingClientRect();
    const sx = sr.left + sr.width / 2, sy = sr.top + sr.height / 2;
    const W = vw(), H = vh();
    // de hele wereld schuift naar beneden, wij kijken mee omhoog de lucht in
    body.classList.add("finale");
    const hh = H * 0.4;
    const cx = W / 2, cy = H * 0.44, apexY = H * 0.3;
    // hartvorm berekenen en schalen
    const raw = [];
    for (let i = 0; i < 170; i++) { const t = (i / 170) * Math.PI * 2; raw.push({ x: 16 * Math.sin(t) ** 3, y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) }); }
    const minY = Math.min(...raw.map((p) => p.y)), maxY = Math.max(...raw.map((p) => p.y));
    const sc = Math.min(W * 0.88 / 32, hh / (maxY - minY)), midY = (minY + maxY) / 2;
    const heart = raw.map((p) => ({ x: cx + p.x * sc, y: cy + (p.y - midY) * sc }));
    for (let i = 0; i < 80; i++) { const p = raw[Math.floor(Math.random() * raw.length)], f = 0.25 + Math.random() * 0.62; heart.push({ x: cx + p.x * sc * f, y: cy + (p.y - midY) * sc * f + (Math.random() - 0.5) * 4 }); }

    starEl.classList.add("launched");
    whistle();
    // raket
    const rocket = { x: sx, y: sy, r: 3.2, c: "#ffe08a", life: 999, t: 0, fade: 1,
      update(p) {
        const k = Math.min(1, p.t / 78), e = 1 - Math.pow(1 - k, 2.4);
        p.x = sx + (cx - sx) * e + Math.sin(p.t * 0.45) * 1.6; p.y = sy + (apexY - sy) * e;
        if (p.t % 1 === 0) sparks.push({ x: p.x, y: p.y, vx: (Math.random() - 0.5) * 0.8, vy: Math.random() * 1.2 + 0.3, r: Math.random() * 1.2 + 0.8, c: Math.random() < 0.5 ? "#ffd36e" : "#ffb347", life: 26 + Math.random() * 14, fade: 26, t: 0, g: 0.03 });
        if (k >= 1) { p.life = 0; burst(); }
      } };
    sparks.push(rocket);

    function burst() {
      boom(); flash = 1; flashX = cx; flashY = apexY;
      chime([1568, 1976, 2349], 0.06);
      // klassieke vonkenregen
      for (let i = 0; i < 110; i++) {
        const a = Math.random() * Math.PI * 2, sp = Math.random() * 5.5 + 2;
        sparks.push({ x: cx, y: apexY, vx: Math.cos(a) * sp * 1.5, vy: Math.sin(a) * sp * 1.5, r: Math.random() * 1.5 + 1, c: ["#ffd36e", "#fff1c9", "#ffb347", "#8fe6d3", "#c7b2ff"][i % 5], life: 50 + Math.random() * 40, fade: 40, t: 0, g: 0.06, tw: true, ph: Math.random() * 6 });
      }
      // hartjesvonken
      const cols = ["#ff5d8f", "#ff8fb1", "#ff3b5c", "#ffc2d4", "#ffd36e"];
      heart.forEach((h, i) => {
        const a = Math.random() * Math.PI * 2, sp = Math.random() * 6 + 3;
        sparks.push({ x: cx, y: apexY, vx: Math.cos(a) * sp * 1.4, vy: Math.sin(a) * sp * 1.4, tx: h.x, ty: h.y, r: i < 170 ? 2.5 + Math.random() * 0.8 : 1.7 + Math.random() * 0.7, c: cols[i % (i < 170 ? 4 : 5)], life: 999, fade: 90, t: 0, tw: true, ph: Math.random() * 6,
          update(p) {
            if (p.t < 14) { p.vx *= 0.9; p.vy *= 0.9; p.x += p.vx; p.y += p.vy; return; }
            if (p.t < 330) {
              const k = Math.min(0.14, (p.t - 14) * 0.006);
              const beat = p.t > 120 ? 1 + 0.045 * Math.max(0, Math.sin((p.t - 120) * 0.11)) ** 6 : 1;
              const gx = cx + (p.tx - cx) * beat, gy = cy + (p.ty - cy) * beat;
              p.x += (gx - p.x) * k; p.y += (gy - p.y) * k;
              return;
            }
            if (p.t === 330) { p.vx = (Math.random() - 0.5) * 0.6; p.vy = Math.random() * 0.4; p.life = 90 + Math.random() * 70; }
            p.vy += 0.018; p.x += p.vx; p.y += p.vy; p.life--;
          } });
      });
      setTimeout(() => chime([784, 988, 1175, 1568, 1976], 0.14), 900);
      // een paar kleine kleurige pijlen eromheen
      [[1300, 0.18, 0.16, "#8fe6d3"], [2000, 0.82, 0.2, "#c7b2ff"], [2700, 0.2, 0.72, "#ffd06e"], [3300, 0.8, 0.7, "#9cc8ff"]].forEach(([ms, fx0, fy0, col]) => setTimeout(() => {
        const bx = W * fx0, by = H * fy0; boom();
        for (let j = 0; j < 46; j++) {
          const a2 = (j / 46) * Math.PI * 2, sp2 = 2.2 + Math.random() * 1.6;
          sparks.push({ x: bx, y: by, vx: Math.cos(a2) * sp2, vy: Math.sin(a2) * sp2, r: 1.3 + Math.random(), c: j % 3 ? col : "#fff1c9", life: 55 + Math.random() * 30, fade: 40, t: 0, g: 0.035, tw: true, ph: Math.random() * 6 });
        }
      }, ms));
      setTimeout(() => body.classList.remove("finale"), 6600);
      setTimeout(() => { starEl.classList.remove("launched"); starEl.classList.add("back"); setTimeout(() => { starEl.classList.remove("back"); finaleBusy = false; }, 1500); }, 8300);
    }
  }

  page.addEventListener("click", (e) => {
    const t = e.target.closest("[data-pg]");
    if (!t) return;
    const k = t.dataset.pg, i = +t.dataset.i;
    if (k === "fel") { if (C.startCadeau && !S.startCadeau) { cadeauPage(-1); } else { hidePage(); body.classList.add("is-tree"); setTimeout(openUitleg, 500); } }
    if (k === "reveal") { S.revealed[C.stops[i].id] = true; save(); hidePage(); setTimeout(() => openStop(i), 250); }
    if (k === "reis") { hidePage(); advance(0); }
    if (k === "box") {
      const box = $(".box", t);
      if (box.classList.contains("open")) return;
      box.classList.remove("shake"); box.classList.add("open");
      const charms = [...t.querySelectorAll(".charm")], charm = charms.length > 0;
      const wacht = charm ? 2200 + (charms.length - 1) * 550 : 0;
      setTimeout(() => $(".cadeau-msg", page).classList.add("show"), wacht);
      if (charm) { charms.forEach((c) => c.classList.add("fly")); setTimeout(() => box.classList.add("gone"), 350); }
      const r = box.getBoundingClientRect();
      confetti(r.left + r.width / 2, r.top + r.height * 0.3, 160, 1.2); chime([784, 988, 1175, 1568, 1976], 0.08);
      if (i >= 0) { S.cadeau[C.stops[i].id] = true; save(); }
      $("#cadeauAct").innerHTML = "";
      setTimeout(() => { $("#cadeauAct").innerHTML = `<button class="btn btn-gold" data-pg="cadeau-door" data-i="${i}">${i === -1 ? "Naar je boom" : i === -2 ? esc(C.eindCadeau.knop || "Sluiten") : "Door!"}</button>`; }, wacht ? wacht + 100 : 0);
    }
    if (k === "cadeau-door") {
      if (i === -2) { hidePage(); }
      else if (i < 0) { S.startCadeau = true; save(); hidePage(); body.classList.add("is-tree"); setTimeout(openUitleg, 500); }
      else if (C.stops[i].cadeau && C.stops[i].cadeau.moment === "aankomst") { hidePage(); setTimeout(() => openStop(i), 400); }
      else { hidePage(); advance(i); }
    }
    if (k === "proost") { hidePage(); setTimeout(() => openStop(N - 1), 300); }
    if (k === "nacht") { hidePage(); closeSheet(); body.classList.add("is-tree"); setTimeout(finale, 900); }
    if (k === "eind") cadeauPage(-2);
    if (k === "binnen") { hidePage(); setTimeout(aangekomen, 300); }
  });

  /* ---------------- sheet ---------------- */
  const sheet = $("#sheet"), sb = $("#sheetBody");
  let geoWatch = null, sheetStop = null;
  function openSheet(html, { tall = true, focus = null, kleur = "#d7263d" } = {}) {
    sheet.style.setProperty("--bg", kleur);
    sheet.style.setProperty("--fg", fgFor(kleur));
    sb.innerHTML = html; sb.scrollTop = 0;
    sheet.classList.toggle("tall", tall);
    if (!body.classList.contains("sheet-open")) { sizeDrift(); resetDrift(); driftOpenAt = performance.now(); }
    body.classList.add("sheet-open");
    if (focus !== null) focusOn(focus); else unfocus();
  }
  function closeSheet() { body.classList.remove("sheet-open"); unfocus(); stopGeo(); sheetStop = null; setTimeout(() => { if (!body.classList.contains("sheet-open")) resetDrift(); }, 600); }
  $(".sh-close").addEventListener("click", closeSheet);
  $("#scrim").addEventListener("click", closeSheet);

  function openUitleg() {
    const u = C.uitleg;
    openSheet(`<h2>${esc(u.titel)}</h2><p class="lead">${esc(u.tekst)}</p>
      <button class="btn btn-gold btn-huge" data-act="go">${esc(T("opPad"))}</button>`, { kleur: "#14894b" });
  }

  const card = (s, p, key) => {
    const on = !!S.proef[key];
    return `<div class="card${on ? " on" : ""}" data-proef="${key}">${imgTag(p.foto, "ph", 500)}<span class="ck">${ICON.check}</span><div class="nm">${esc(p.naam)}</div></div>`;
  };
  const items = (s) => [...(s.eten || []).map((p, j) => ({ p, k: `${s.id}:e${j}` })), ...(s.drinken || []).map((p, j) => ({ p, k: `${s.id}:d${j}` }))];

  function marktBody(s) {
    let h = "";
    if (s.foto) h += imgTag(s.foto, "hero", 900, s.fokus);
    h += `<h2>${esc(s.titel)}</h2><p class="lead">${esc(s.tekst || "")}</p>`;
    if (s.adres) h += `<a class="btn btn-cream" href="${mapsUrl(s.adres, s.vervoer)}" target="_blank" rel="noopener">${ICON.walk}<span>${esc(T("looproute"))}</span><span id="dist"></span></a>`;
    if (s.info && s.info.length) h += `<h3>${ICON.info}${esc(T("informatie"))}</h3><ul class="info">${s.info.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
    if (s.eten && s.eten.length) h += `<h3>${ICON.fork}${esc(T("eten"))}</h3><div class="grid">${s.eten.map((p, j) => card(s, p, `${s.id}:e${j}`)).join("")}</div>`;
    if (s.drinken && s.drinken.length) h += `<h3>${ICON.cup}${esc(T("drinken"))}</h3><div class="grid">${s.drinken.map((p, j) => card(s, p, `${s.id}:d${j}`)).join("")}</div>`;
    if (s.fotoideeen && s.fotoideeen.length) h += `<h3>${ICON.cam}${esc(T("fotoideeen"))}</h3><div class="ideas">${s.fotoideeen.map((x, j) => `<div class="idea"><b>${j + 1}</b><span>${esc(x)}</span></div>`).join("")}</div>`;
    return h;
  }
  const toetjeMarkt = () => (C.stops[N - 1].toetje || {}).markt;
  function openToetje() {
    const m = toetjeMarkt();
    S.toetje = true; save();
    sheetStop = N - 1;
    openSheet(marktBody(m) + `<div style="height:22px"></div><button class="btn btn-ink btn-huge" data-act="kamer">${esc(T("terugHotel"))}</button>`, { focus: N - 1, kleur: m.kleur });
    startGeo(m);
  }

  /* terug naar de kamer: eerst de route, welterusten pas als we er echt zijn */
  let kamerWatch = null;
  function kamerPage() {
    const k = C.stops[N - 1].kamer;
    S.naarKamer = true; save();
    showPage("pg-reis", `<div class="spacer"></div>
      <h1 class="pg-title in">${esc(k.titel)}</h1>
      <p class="pg-text in">${esc(k.tekst)}</p>
      <p class="pg-text in" id="kamerDist" style="opacity:.75"></p>
      <div class="spacer"></div>
      <div class="actions in">
        <a class="btn btn-gold" href="${mapsUrl(k.adres)}" target="_blank" rel="noopener">${esc(T("routeHotel"))}</a>
        <button class="btn btn-ghost" data-pg="binnen">${esc(T("binnen"))}</button>
      </div>`);
    chime([784, 659, 523]);
    kamerGeo();
  }
  function kamerGeo() {
    const k = C.stops[N - 1].kamer;
    if (kamerWatch !== null || !("geolocation" in navigator)) return;
    try {
      kamerWatch = navigator.geolocation.watchPosition((pos) => {
        const m = dist({ lat: pos.coords.latitude, lng: pos.coords.longitude }, k);
        const d = $("#kamerDist");
        if (d) d.textContent = m < 20000 ? `${T("nog")} ${m >= 1000 ? (m / 1000).toFixed(1) + " km" : Math.round(m / 10) * 10 + " m"}` : "";
        if (m <= (k.straal || 120) && pos.coords.accuracy < 150) aangekomen();
      }, () => {}, { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 });
    } catch (e) {}
  }
  function aangekomen() {
    if (kamerWatch !== null) { try { navigator.geolocation.clearWatch(kamerWatch); } catch (e) {} kamerWatch = null; }
    if (S.nacht) return;
    S.nacht = true; save();
    closeSheet();
    welterusten();
    try { if ("Notification" in window && Notification.permission === "granted" && document.hidden) new Notification("Welterusten liefie", { body: C.welterusten.tekst, icon: "icon-192.png" }); } catch (e) {}
  }

  function openStop(i) {
    const s = C.stops[i], cur = i === S.done, done = i < S.done;
    sheetStop = i;
    let h = "";
    if (s.soort === "start") {
      h += `<h2>${esc(s.titel)}</h2><p class="lead">${esc(s.tekst)}</p><h3>${esc(T("kiesMuziek"))}</h3>` +
        C.playlists.map((p) => `<a class="list-link" href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.titel)}${ICON.arrow}</a>`).join("") +
        `<a class="list-link green" href="${esc(C.spotifyZelf.url)}" target="_blank" rel="noopener">${esc(C.spotifyZelf.titel)}${ICON.arrow}</a>` +
        (cur ? `<div style="height:16px"></div><button class="btn btn-red btn-huge" data-act="opreis">${esc(T("opReis"))}</button>` : "");
      openSheet(h, { focus: i, kleur: s.kleur });
      return;
    }
    h += marktBody(s);
    if (s.soort === "piek") {
      if (cur) h += `<div style="height:22px"></div><button class="btn btn-red btn-huge" data-act="next">${esc(T("proost"))}</button>`;
      if (S.done >= N && s.toetje) {
        const t = s.toetje;
        h += `<div style="height:26px"></div>` +
          `<button class="btn btn-red btn-huge" data-act="toetje">${esc(t.knopToetje)}</button>` +
          `<div style="height:10px"></div><button class="btn btn-ink" data-act="kamer">${esc(t.knopKamer)}</button>`;
      }
    } else if (cur && s.cadeau && s.cadeau.moment === "aankomst" && !S.cadeau[s.id]) {
      h += `<div style="height:22px"></div><button class="btn btn-gold btn-huge" data-act="kamerCadeau">${esc(T("opKamer"))}</button>`;
    } else if (cur) {
      h += `<div style="height:22px"></div><button class="btn btn-gold btn-huge" data-act="next">${esc(T("klaarDoor"))}</button>`;
    }
    openSheet(h, { focus: i, kleur: s.kleur });
    if (s.lat && !done) startGeo(s);
  }

  function openProef() {
    let total = 0, got = 0, h = "";
    const lijst = C.stops.map((s, i) => [s, i]);
    if (toetjeMarkt()) lijst.push([toetjeMarkt(), S.toetje ? -1 : 99]);
    lijst.forEach(([s, i]) => {
      const list = items(s);
      if (!list.length) return;
      const locked = i > S.done || (i === S.done && !S.revealed[s.id]);
      total += list.length;
      list.forEach(({ k }) => { if (S.proef[k]) got++; });
      h += `<h3>${locked ? esc(T("ingepakt")) : esc(s.titel)}</h3>` + list.map(({ p, k }) => {
        if (locked) return `<div class="row-check locked"><div class="th"></div><div class="t">? ? ?</div><div class="bx"></div></div>`;
        return `<div class="row-check${S.proef[k] ? " on" : ""}" data-proef="${k}">${imgTag(p.foto, "th", 200)}<div class="t">${esc(p.naam)}</div><div class="bx">${ICON.check}</div></div>`;
      }).join("");
    });
    openSheet(`<h2>${esc(T("proeflijst"))}</h2><p class="lead">${got} van ${total} binnen.</p>${h}`, { kleur: "#d7263d" });
  }
  function openCredits() {
    openSheet(`<h2>Fotocredits</h2><div class="credits">${C.credits.map(([type, f, a]) => type === "commons"
      ? `<a href="https://commons.wikimedia.org/wiki/File:${encodeURIComponent(f.replace(/ /g, "_"))}" target="_blank" rel="noopener">${esc(f)}, ${esc(a)}</a>`
      : `<a>${esc(f)}</a>`).join("")}</div>`, { kleur: "#1d2236" });
  }
  function openMaker() {
    const opts = Array.from({ length: N + 1 }, (_, i) => `<option value="${i}"${i === S.done ? " selected" : ""}>${i === 0 ? "0: nog niets gedaan" : i === N ? `${N}: alles klaar` : `${i}: ${esc(C.stops[i - 1].titel)} klaar`}</option>`).join("");
    openSheet(`<div class="maker"><h2>Makermenu</h2>
      <label>Voortgang</label><select id="mkStep">${opts}</select>
      <div style="height:16px"></div><button class="btn btn-gold" data-act="maker-apply">Toepassen</button>
      <button class="btn btn-ghost" data-act="maker-fel">Toon felicitatie</button>
      <button class="btn btn-ghost" data-act="maker-nacht">Toon welterusten</button>
      <button class="btn btn-ghost" data-act="credits">Fotocredits</button>
      <button class="btn btn-ghost" data-act="maker-reset">Alles wissen</button></div>`, { kleur: "#1d2236" });
  }

  sb.addEventListener("click", (e) => {
    const pr = e.target.closest("[data-proef]");
    if (pr) {
      const k = pr.dataset.proef;
      S.proef[k] = !S.proef[k]; save();
      pr.classList.toggle("on", S.proef[k]);
      if (S.proef[k]) { chime([1175, 1568], 0.08); const r = pr.getBoundingClientRect(); confetti(r.left + r.width / 2, r.top + 30, 40, 0.7); }
      return;
    }
    const act = e.target.closest("[data-act]");
    if (!act) return;
    const a = act.dataset.act;
    if (a === "next") completeStop(sheetStop);
    if (a === "kamerCadeau") { const i = sheetStop; closeSheet(); setTimeout(() => cadeauPage(i), 350); }
    if (a === "opreis") { closeSheet(); setTimeout(opReis, 300); }
    if (a === "go") { S.intro = true; save(); closeSheet(); setTimeout(() => openStop(Math.min(S.done, N - 1)), 450); }
    if (a === "credits") openCredits();
    if (a === "toetje") openToetje();
    if (a === "kamer") { closeSheet(); setTimeout(kamerPage, 400); }
    if (a === "maker-apply") { S.done = Math.max(0, Math.min(N, +$("#mkStep").value)); S.naarKamer = false; S.nacht = false; S.toetje = false; save(); closeSheet(); render(); }
    if (a === "maker-fel") { S.startCadeau = false; save(); closeSheet(); setTimeout(felicitatie, 300); }
    if (a === "maker-nacht") { closeSheet(); setTimeout(welterusten, 300); }
    if (a === "maker-reset") {
      if (act.dataset.sure) { try { localStorage.removeItem(KEY); } catch (e) {} location.reload(); }
      else { act.dataset.sure = "1"; act.textContent = "Zeker weten? Tik nog een keer"; }
    }
  });

  function completeStop(i) {
    if (i !== S.done) return;
    const s = C.stops[i];
    closeSheet();
    if (s.cadeau && !S.cadeau[s.id]) setTimeout(() => cadeauPage(i), 350);
    else advance(i);
  }
  function advance(i) {
    if (i !== S.done) return;
    const from = litLen();
    S.done = i + 1; save();
    const last = S.done >= N;
    setTimeout(() => {
      setBulbs(litLen(), Math.max(0, from));
      renderOrns();
      chime(last ? [784, 988, 1175, 1568, 1976] : [988, 1319]);
      if (last) {
        bulbs.forEach((x) => { x.on = true; });
        setTimeout(() => confetti(vw() / 2, vh() * 0.15, 160), 300);
        setTimeout(proostPage, 1800);
      } else {
        setTimeout(() => {
          const g = S.done === N - 1 ? starEl : ornEls[S.done];
          if (g) { g.classList.add("wiggle"); setTimeout(() => g.classList.remove("wiggle"), 600); }
        }, 900);
      }
    }, 450);
  }

  /* ---------------- location ---------------- */
  const dist = (a, b) => {
    const R = 6371000, rad = Math.PI / 180, dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(x));
  };
  let geoId = null;
  function startGeo(s) {
    stopGeo(); geoId = s.id;
    if (!("geolocation" in navigator)) return;
    try {
      geoWatch = navigator.geolocation.watchPosition((pos) => {
        const chip = $("#dist");
        if (!chip || sheetStop === null || geoId !== s.id) return;
        const m = dist({ lat: pos.coords.latitude, lng: pos.coords.longitude }, s);
        if (m <= 80) {
          chip.textContent = "· je bent er";
          if (!S.seen[s.id]) { S.seen[s.id] = true; save(); party(2); chime(); }
        } else if (m < 20000) {
          chip.textContent = `· ${m >= 1000 ? (m / 1000).toFixed(1) + " km" : Math.round(m / 10) * 10 + " m"}`;
        }
      }, () => {}, { enableHighAccuracy: true, maximumAge: 15000, timeout: 20000 });
    } catch (e) {}
  }
  function stopGeo() { if (geoWatch !== null) { try { navigator.geolocation.clearWatch(geoWatch); } catch (e) {} geoWatch = null; } }

  /* ---------------- dock ---------------- */
  $("#dock").addEventListener("click", (e) => { if (e.target.closest("[data-open]")) openProef(); });

  /* ---------------- tree taps ---------------- */
  const plaagCount = {};
  let pressT, longFired = false;
  fsvg.addEventListener("click", (e) => {
    const g = e.target.closest("[data-i]");
    if (!g || !body.classList.contains("is-tree")) return;
    if (longFired) { longFired = false; return; }
    const i = +g.dataset.i, s = C.stops[i];
    if (i <= S.done) {
      if (i === S.done && s.soort !== "start" && !S.revealed[s.id]) reveal(i);
      else openStop(i);
      return;
    }
    plaagCount[i] = (plaagCount[i] || 0) + 1;
    const txt = plaagCount[i] === 1 && s.plaag ? s.plaag : C.plagen[Math.floor(Math.random() * C.plagen.length)];
    g.classList.remove("wiggle"); void g.getBoundingClientRect(); g.classList.add("wiggle");
    setTimeout(() => g.classList.remove("wiggle"), 600);
    toast(txt, "", 2600);
  });
  fsvg.addEventListener("pointerdown", (e) => { if (e.target.closest(".star")) pressT = setTimeout(() => { longFired = true; openMaker(); }, 1200); });
  ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => fsvg.addEventListener(ev, () => clearTimeout(pressT)));

  /* ---------------- intro ---------------- */
  const toggle = $("#toggle");
  $(".tg-label", toggle).textContent = C.knop;
  toggle.addEventListener("click", () => {
    if (toggle.classList.contains("on")) return;
    toggle.classList.add("on");
    chime([523, 659, 784, 1047, 1319]);
    setTimeout(() => {
      body.classList.remove("is-dark"); body.classList.add("is-lit");
      lightTop();
      bulbs.forEach((x, i) => setTimeout(() => { x.on = true; }, 700 + i * 16));
      setTimeout(() => { starEl.classList.add("on"); }, 700 + bulbs.length * 16);
    }, 350);
    setTimeout(() => $("#toggleWrap").classList.add("gone"), 800);
    const t = 1600 + bulbs.length * 16;
    setTimeout(() => {
      S.lit = true; save();
      felicitatie();
      // achter de felicitatie gaat de slinger weer uit: het pad moet nog gelopen worden
      setTimeout(() => { bulbs.forEach((x) => { if (x.L > litLen()) { x.on = false; } }); starEl.classList.remove("on"); renderOrns(); }, 900);
    }, t);
  });

  /* ---------------- boot ---------------- */
  buildTree(); buildTopLights(); buildScenery(); sizeCanvases(); requestAnimationFrame(loop); render();
  if (S.lit) {
    body.classList.remove("is-dark"); body.classList.add("is-lit");
    $("#toggleWrap").classList.add("gone");
    body.classList.add("is-tree");
    if (!S.intro) setTimeout(openUitleg, 400);
    if (S.naarKamer && !S.nacht) setTimeout(kamerPage, 600);
  }
  if (location.hash === "#maker") setTimeout(openMaker, 300);
  addEventListener("resize", () => { fitApp(); buildTopLights(); sizeCanvases(); });
  setTimeout(() => { const h = appEl.style.height; fitApp(); if (appEl.style.height !== h) { buildTopLights(); sizeCanvases(); } }, 400);
  if ("serviceWorker" in navigator) { try { navigator.serviceWorker.register("sw.js").catch(() => {}); } catch (e) {} }
})();
