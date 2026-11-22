/* Kerstboom service worker: alles bewaren zodat de app ook zonder bereik werkt */
const VERSIE = "kerstboom-v21";
const FILES = [
  "./",
  "index.html",
  "style.css",
  "app.js",
  "content.js",
  "manifest.webmanifest",
  "icon-180.png",
  "icon-192.png",
  "icon-512.png",
];

// Alle foto's uit content.js ook meteen bewaren
try {
  self.window = self;
  importScripts("content.js");
  const C = self.CONTENT || {};
  const fotos = new Set();
  const voeg = (f) => { if (f && !/^commons:|^https?:/.test(f)) fotos.add(f); };
  const stops = C.stops || [];
  const laatste = stops[stops.length - 1] || {};
  const extra = [C.startCadeau, C.eindCadeau, (laatste.toetje || {}).markt].filter(Boolean);
  [...stops, ...extra].forEach((s) => {
    voeg(s.foto);
    (s.fotos || []).forEach(voeg);
    if (s.cadeau) { voeg(s.cadeau.foto); (s.cadeau.fotos || []).forEach(voeg); }
    [...(s.eten || []), ...(s.drinken || [])].forEach((p) => voeg(p.foto));
  });
  FILES.push(...fotos);
} catch (e) {}

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(VERSIE).then((c) => Promise.all(FILES.map((f) => c.add(f).catch(() => {}))))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSIE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Eigen bestanden: eerst netwerk (zodat aanpassingen doorkomen), anders uit de cache
  if (url.origin === location.origin) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const kopie = res.clone();
          caches.open(VERSIE).then((c) => c.put(req, kopie));
          return res;
        })
        .catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match("index.html")))
    );
    return;
  }
  // Lettertypes en andere externe bestanden: cache eerst
  e.respondWith(
    caches.match(req).then((hit) =>
      hit ||
      fetch(req).then((res) => {
        if (res.ok || res.type === "opaque") {
          const kopie = res.clone();
          caches.open(VERSIE).then((c) => c.put(req, kopie));
        }
        return res;
      })
    )
  );
});
