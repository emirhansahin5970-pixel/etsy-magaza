/*
 * Başlangıç güvenlik ağı. Uygulama kodundan ÖNCE çalışır ve bilerek çok sade (ES3) yazılmıştır:
 * eski ya da kısıtlı bir tarayıcıda bile ayrıştırılabilmeli.
 *
 * Görevleri:
 *   1. Yazı tiplerini çizimi engellemeden etkinleştirmek (Google Fonts yüklenmezse sistem fontları kalır).
 *   2. Eksik küçük API'leri tamamlamak (NodeList.forEach).
 *   3. Başlangıç sırasında oluşan hatayı yakalayıp boş ekran yerine anlaşılır bir mesaj ve teknik ayrıntı göstermek.
 *   4. Uygulama belirli bir sürede başlamazsa bunu söylemek.
 * Uygulama başarıyla başlayınca app.js, GX_BOOT.ready() çağırır ve başlangıç ekranı uygulama ekranıyla değişir.
 *
 * Metinler i18n/<dil>.js dosyalarındaki "boot" bölümünden derleme sırasında buraya yazılır (her dil için:
 * { boot: {...}, ui: { "app.title": ... } }). HTML Türkçe derlenir; cihazın ya da kayıtlı tercihin dili
 * başkaysa başlangıç ekranının sabit metinleri burada o dile çevrilir.
 */
(function (w, d) {
  var ALL = /*@BOOT_STRINGS@*/ {};
  var LANG = pickLang();
  var STR = (ALL[LANG] && ALL[LANG].boot) || {};
  var TIMEOUT_MS = 12000;
  var started = false;
  var errors = [];
  var t0 = new Date().getTime();

  /** Kayıtlı dil tercihi → cihazın dil listesi → İngilizce (app.js ile aynı kural). */
  function pickLang() {
    var i, code, list = [];
    try {
      var st = w.JSON.parse(w.localStorage.getItem("gx.ssc.settings.v1") || "{}");
      if (st && typeof st.lang === "string" && ALL[st.lang]) return st.lang;
    } catch (e) {}
    try {
      var n = w.navigator;
      list = n.languages && n.languages.length ? n.languages : [n.language || n.userLanguage || ""];
    } catch (e) {}
    for (i = 0; i < list.length; i++) {
      code = String(list[i] || "").toLowerCase().split("-")[0].split("_")[0];
      if (ALL[code]) return code;
    }
    return ALL.en ? "en" : "tr";
  }

  function s(key) {
    if (STR[key]) return STR[key];
    try {
      var all = w.GX_I18N || {};
      var src = all[LANG] || all.en || w.GX_STRINGS;
      if (src && src.boot && src.boot[key]) return src.boot[key];
    } catch (e) {}
    return key;
  }

  // Başlangıç ekranının sabit metinleri (HTML'de Türkçe) seçilen dile çevrilir.
  try {
    var ui = ALL[LANG] && ALL[LANG].ui;
    if (ui && d.querySelectorAll && d.documentElement.getAttribute("lang") !== LANG) {
      var els = d.querySelectorAll("[data-t]"), j, key;
      for (j = 0; j < els.length; j++) {
        key = els[j].getAttribute("data-t");
        if (ui[key] != null && !els[j].getAttribute("data-t-lang")) els[j].textContent = ui[key];
      }
      els = d.querySelectorAll("[data-t-label]");
      for (j = 0; j < els.length; j++) {
        key = els[j].getAttribute("data-t-label");
        if (ui[key] != null) els[j].setAttribute("aria-label", ui[key]);
      }
      d.documentElement.setAttribute("lang", LANG);
      if (ui["app.title"]) d.title = ui["app.title"];
    }
  } catch (e) {}

  // Eski tarayıcılar için küçük tamamlayıcı
  try {
    if (w.NodeList && w.NodeList.prototype && !w.NodeList.prototype.forEach) w.NodeList.prototype.forEach = Array.prototype.forEach;
  } catch (e) {}

  // Yazı tipleri: media="print" ile engellemeden indirilir, yüklenince etkinleşir.
  try {
    var fonts = d.getElementById("gx-fonts");
    if (fonts) {
      var enable = function () { fonts.media = "all"; };
      if (fonts.sheet) enable();
      else if (fonts.addEventListener) fonts.addEventListener("load", enable, false);
    }
  } catch (e) {}

  function root() {
    return d.getElementById("app-root");
  }

  function setRootState(state) {
    var r = root();
    if (!r) return;
    r.className = r.className.replace(/\bis-(booting|failed)\b/g, "").replace(/\s+/g, " ") + (state ? " " + state : "");
  }

  function features() {
    var out = [];
    function check(name, fn) {
      var ok;
      try { ok = !!fn(); } catch (e) { ok = false; }
      out.push(name + ": " + (ok ? "var" : "YOK"));
    }
    check("JSON", function () { return w.JSON && w.JSON.parse; });
    check("querySelector", function () { return d.querySelector; });
    check("localStorage", function () {
      var k = "gx.ssc.bootprobe";
      w.localStorage.setItem(k, "1");
      w.localStorage.removeItem(k);
      return true;
    });
    check("Intl.DateTimeFormat", function () { return new w.Intl.DateTimeFormat("tr-TR").format(new Date()); });
    check("Promise", function () { return w.Promise; });
    check("dialog.showModal", function () { return d.createElement("dialog").showModal; });
    check("matchMedia", function () { return w.matchMedia; });
    return out;
  }

  function describe(err, stage) {
    if (!err) return stage ? "[" + stage + "]" : "";
    var msg = (err.name ? err.name + ": " : "") + (err.message || String(err));
    if (err.stack) msg += "\n" + String(err.stack).split("\n").slice(0, 4).join("\n");
    return (stage ? "[" + stage + "] " : "") + msg;
  }

  function detailsText(kind) {
    var lines = [];
    lines.push("Durum: " + kind);
    lines.push("Dil: " + LANG);
    lines.push("Süre: " + (new Date().getTime() - t0) + " ms");
    lines.push("Adres türü: " + (w.location ? w.location.protocol : "?"));
    lines.push("Tarayıcı: " + (w.navigator ? w.navigator.userAgent : "?"));
    var files = ["GX_I18N", "GX_BOOK", "GX_ART", "GX_STORE"], loaded = [];
    for (var i = 0; i < files.length; i++) loaded.push(files[i] + (w[files[i]] ? " var" : " YOK"));
    lines.push("Uygulama dosyaları: " + loaded.join(", "));
    lines.push("Özellikler: " + features().join(", "));
    lines.push("Hatalar:" + (errors.length ? "\n" + errors.join("\n---\n") : " kayıt yok"));
    return lines.join("\n");
  }

  function el(tag, cls, text) {
    var e = d.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.appendChild(d.createTextNode(text));
    return e;
  }

  /** Boş ekran yerine mesaj + teknik ayrıntı gösterir. kind: error | timeout | unsupported */
  function show(kind) {
    var view = d.getElementById("view");
    if (!view) return;
    var title = kind === "timeout" ? s("timeoutTitle") : kind === "unsupported" ? s("unsupportedTitle") : s("errorTitle");
    var body = kind === "timeout"
      ? s("timeoutBody").replace("{sec}", String(Math.round(TIMEOUT_MS / 1000)))
      : kind === "unsupported" ? s("unsupportedBody") : s("errorBody");

    var panel = el("section", "boot-screen boot-screen--error");
    panel.setAttribute("role", "alert");
    panel.setAttribute("id", "boot-error");
    panel.appendChild(el("p", "eyebrow", "Genix Studio"));
    panel.appendChild(el("h1", null, title));
    panel.appendChild(el("p", null, body));
    panel.appendChild(el("p", "hint", s("errorSteps")));

    var reload = el("button", "btn btn--primary", s("reload"));
    reload.setAttribute("type", "button");
    reload.onclick = function () { w.location.reload(); };
    panel.appendChild(reload);

    var det = el("details", "boot-details");
    det.appendChild(el("summary", null, s("details")));
    var ta = el("textarea", "textarea code-out");
    ta.setAttribute("readonly", "readonly");
    ta.setAttribute("rows", "8");
    ta.setAttribute("id", "boot-error-details");
    ta.setAttribute("aria-label", s("details"));
    ta.value = detailsText(kind);
    det.appendChild(ta);
    var copy = el("button", "btn btn--secondary", s("copyDetails"));
    copy.setAttribute("type", "button");
    copy.onclick = function () {
      ta.focus();
      ta.select();
      try {
        if (w.navigator.clipboard && w.navigator.clipboard.writeText) {
          w.navigator.clipboard.writeText(ta.value).then(function () { copy.firstChild.nodeValue = s("copied"); }, function () {});
        } else if (d.execCommand && d.execCommand("copy")) {
          copy.firstChild.nodeValue = s("copied");
        }
      } catch (e) {}
    };
    det.appendChild(copy);
    panel.appendChild(det);

    while (view.firstChild) view.removeChild(view.firstChild);
    view.appendChild(panel);
    setRootState("is-failed");
  }

  w.onerror = function (message, source, line, col, err) {
    errors.push(err ? describe(err) : String(message) + " (" + (source || "satır içi") + ":" + line + ":" + col + ")");
    if (!started) show("error");
    return false;
  };

  if (!d.querySelector || !w.JSON || !d.addEventListener) {
    errors.push("Temel tarayıcı özellikleri eksik.");
    // Belge tamamen yüklendiğinde göster (view öğesi henüz oluşmamış olabilir)
    setTimeout(function () { show("unsupported"); }, 0);
  }

  setTimeout(function () {
    if (!started) show("timeout");
  }, TIMEOUT_MS);

  w.GX_BOOT = {
    /** Uygulama ekranı başarıyla çizildi. */
    ready: function () {
      started = true;
      setRootState("");
    },
    /** Başlangıç sırasında yakalanan hata (app.js içinden). */
    fail: function (err, stage) {
      errors.push(describe(err, stage));
      show("error");
    },
    isStarted: function () { return started; },
    /** Uygulama çalışırken bir ekran çizilemezse o ekranda gösterilecek ayrıntılar. */
    details: function (err, stage) {
      errors.push(describe(err, stage));
      return detailsText("ekran hatası");
    }
  };
})(window, document);
