/*
 * Service worker: uygulama bir kez internetle açıldıktan sonra sonraki açılışları önbellekten de yapabilsin.
 * Sayfa (index.html) için önce ağ denenir (güncellemeler gelsin), ağ yoksa önbellekteki sürüm açılır.
 * Kullanıcı kayıtları burada DEĞİL, tarayıcının localStorage alanındadır; bu dosya kayıtlara dokunmaz.
 * CACHE adı derleme sırasında içerik özetiyle değiştirilir; yeni sürüm yayınlanınca eski önbellek silinir.
 */
var CACHE = "gx-ssc-5d319b77a5";
var ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png"];
var FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", function (event) {
  event.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf("gx-ssc-") === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function timeout(ms, promise) {
  return new Promise(function (resolve, reject) {
    var t = setTimeout(function () { reject(new Error("zaman aşımı")); }, ms);
    promise.then(function (r) { clearTimeout(t); resolve(r); }, function (e) { clearTimeout(t); reject(e); });
  });
}

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);

  // Sayfa: önce ağ (4 sn), olmazsa önbellek
  if (req.mode === "navigate") {
    event.respondWith(timeout(4000, fetch(req)).then(function (res) {
      if (res && res.ok) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put("./index.html", copy); });
      }
      return res;
    }).catch(function () {
      return caches.match("./index.html").then(function (r) { return r || caches.match("./"); });
    }));
    return;
  }

  // Yazı tipleri: önbellekte varsa onu ver, arkada yenile
  if (FONT_HOSTS.indexOf(url.hostname) >= 0) {
    event.respondWith(caches.open(CACHE).then(function (c) {
      return c.match(req).then(function (hit) {
        var net = fetch(req).then(function (res) { if (res && (res.ok || res.type === "opaque")) c.put(req, res.clone()); return res; });
        return hit || net;
      });
    }));
    return;
  }

  // Aynı adresteki dosyalar (simgeler, manifest): önce önbellek
  if (url.origin === self.location.origin) {
    event.respondWith(caches.match(req).then(function (hit) { return hit || fetch(req); }));
  }
});
