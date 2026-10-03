/*
 * Küçük Adımlar, Daha Net Günler — uygulama mantığı.
 * Ana bölümler: Oku (#oku, #oku-<bolum>), Günüm (#gunum, #gun-YYYY-AA-GG, #gecmis), Alışkanlığım (#aliskanlik, #aliskanlik-kur).
 * Açılış: #hosgeldin (adres boşken de açılış gösterilir).
 * Metinler: i18n/tr.js (GX_STRINGS), kitap: content/book.tr.js (GX_BOOK), veri: storage.js (GX_STORE).
 */
(function () {
  "use strict";

  var S = window.GX_STRINGS;
  var BOOK = window.GX_BOOK;
  var ART = window.GX_ART;
  var STORE = window.GX_STORE;
  var BOOT = window.GX_BOOT || { ready: function () {}, fail: function (e) { throw e; }, details: function () { return ""; } };

  if (!S || !BOOK || !ART || !STORE) {
    var missing = [["i18n/tr.js", S], ["content/book.tr.js", BOOK], ["illustrations.js", ART], ["storage.js", STORE]]
      .filter(function (x) { return !x[1]; }).map(function (x) { return x[0]; });
    BOOT.fail(new Error("Uygulama dosyaları eksik yüklendi: " + missing.join(", ")), "yükleme");
    return;
  }

  var storage = null;
  try {
    storage = window.localStorage;
  } catch (e) {
    storage = null;
  }
  var store = STORE.createStore(storage || { getItem: function () { throw 0; }, setItem: function () { throw 0; }, removeItem: function () {} });

  /* ================= Yardımcılar ================= */

  function get(path) {
    return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, S);
  }

  /** Metin anahtarını bulur ve {yer tutucuları} doldurur. */
  function t(path, params) {
    var s = get(path);
    if (typeof s !== "string") return path;
    if (!params) return s;
    return s.replace(/\{(\w+)\}/g, function (m, k) { return params[k] != null ? String(params[k]) : m; });
  }

  /** Küçük DOM oluşturucu. Kullanıcı metni her zaman textContent ile girer. */
  function h(tag, attrs, children) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v == null || v === false) return;
        if (k === "class") el.className = v;
        else if (k === "text") el.textContent = v;
        else if (k === "html") el.innerHTML = v; // yalnızca sabit SVG görseller için
        else if (k.slice(0, 2) === "on") el.addEventListener(k.slice(2), v);
        else if (v === true) el.setAttribute(k, "");
        else el.setAttribute(k, v);
      });
    }
    (children || []).forEach(function (c) {
      if (c == null || c === false) return;
      el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return el;
  }

  function $(id) {
    return document.getElementById(id);
  }

  var ICON_INFO = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5" stroke-linecap="round"/></svg>';
  var ICON_CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var ICON_CHEV = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
  var ICON_BACK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';

  /** Intl desteklenmez ya da hata verirse tarihleri tr.js'teki ay/gün adlarıyla biçimlendir; açılış engellenmez. */
  function makeFormatter(opts, fallback) {
    try {
      var f = new Intl.DateTimeFormat(S.locale, opts);
      f.format(new Date());
      return { format: function (d) { return f.format(d); } };
    } catch (e) {
      return { format: fallback };
    }
  }
  var dateFmt = makeFormatter({ weekday: "long", day: "numeric", month: "long", year: "numeric" }, function (d) {
    return d.getDate() + " " + S.dates.months[d.getMonth()] + " " + d.getFullYear() + " " + S.dates.weekdays[d.getDay()];
  });
  var shortFmt = makeFormatter({ day: "numeric", month: "long" }, function (d) { return d.getDate() + " " + S.dates.months[d.getMonth()]; });
  var wdFmt = makeFormatter({ weekday: "short" }, function (d) { return S.dates.weekdaysShort[d.getDay()]; });
  function formatDate(key) { return dateFmt.format(STORE.keyToDate(key)); }
  function formatShort(key) { return shortFmt.format(STORE.keyToDate(key)); }

  function clip(s, n) {
    s = String(s || "").trim().replace(/\s+/g, " ");
    return s.length > n ? s.slice(0, n - 1).trim() + "…" : s;
  }

  /** "kütüphanede", "masamda", "evde" gibi bulunma ekiyle biten yer adları cümleye doğal oturur. */
  function isLocative(s) {
    return /(d|t)[ae]$/i.test(String(s || "").trim().replace(/[.,;:!?]+$/, ""));
  }

  /** Cümle ortasına giren alanın ilk harfi Türkçe kurallarıyla küçültülür ("Masamda" → "masamda"); kısaltmalara dokunulmaz ("AVM'de"). */
  function midSentence(s) {
    s = String(s || "").trim();
    if (s.length > 1 && s[1] === s[1].toLocaleUpperCase("tr") && s[1] !== s[1].toLocaleLowerCase("tr")) return s;
    return s.charAt(0).toLocaleLowerCase("tr") + s.slice(1);
  }

  var reduceMQ = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  function motionMode() {
    var m = store.getSettings().motion;
    return m === "on" || m === "off" ? m : "system";
  }
  function motionAllowed() {
    var m = motionMode();
    return m === "on" || (m === "system" && !reduceMQ.matches);
  }
  function applyMotion() {
    var m = motionMode();
    if (m === "system") document.documentElement.removeAttribute("data-motion");
    else document.documentElement.setAttribute("data-motion", m);
  }
  function textSize() {
    return store.getSettings().textSize || "standard";
  }

  var toastTimer = null;
  function toast(msg) {
    var region = $("toast-region");
    region.textContent = "";
    region.appendChild(h("div", { class: "toast", text: msg }));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { region.textContent = ""; }, 3200);
  }

  function isTyping() {
    var a = document.activeElement;
    return !!(a && /^(INPUT|TEXTAREA)$/.test(a.tagName) && a.type !== "checkbox" && a.type !== "radio" && viewEl.contains(a));
  }

  /* ---------- Ortak bileşenler: aynı görünüm her ekranda ---------- */

  function field(id, label, opts) {
    opts = opts || {};
    var hintId = opts.hint ? id + "-hint" : null;
    var errId = id + "-err";
    var input = opts.multiline
      ? h("textarea", { id: id, class: "textarea", rows: opts.rows || 3, maxlength: opts.max || 2000, placeholder: opts.placeholder, autocomplete: "off", "aria-describedby": hintId })
      : h("input", { id: id, class: "input", type: "text", maxlength: opts.max || 300, placeholder: opts.placeholder, autocomplete: "off", enterkeyhint: "next", "aria-describedby": hintId });
    if (opts.value != null) input.value = opts.value;
    return h("div", { class: "field" }, [
      h("label", { for: id, text: label }),
      hintId ? h("p", { class: "hint", id: hintId, text: opts.hint }) : null,
      input,
      h("p", { class: "field-error", id: errId, role: "alert", hidden: true }),
    ]);
  }

  function checkbox(id, label, checked) {
    var input = h("input", { type: "checkbox", id: id });
    input.checked = !!checked;
    return h("label", { class: "check", for: id }, [
      input,
      h("span", { class: "check__box", "aria-hidden": "true", html: ICON_CHECK }),
      h("span", { class: "visually-hidden", text: label }),
    ]);
  }

  function choiceGroup(name, legend, options, value, opts) {
    opts = opts || {};
    return h("fieldset", { class: "choices " + (opts.cls || ""), id: opts.id }, [
      h("legend", { class: opts.hideLegend ? "visually-hidden" : null, text: legend }),
    ].concat(options.map(function (o) {
      var input = h("input", { type: "radio", name: name, value: o.value, id: name + "-" + o.value });
      input.checked = value === o.value;
      return h("label", { class: "choice", for: name + "-" + o.value }, [
        input,
        h("span", null, [opts.marks ? h("i", { class: "mark", "aria-hidden": "true" }) : null, o.label]),
      ]);
    })));
  }

  function disclosure(id, summaryText, body, open, pill) {
    var d = h("details", { class: "disclosure", id: id }, [
      h("summary", null, [
        h("span", { class: "chev", "aria-hidden": "true", html: ICON_CHEV }),
        h("span", { class: "sum-text", text: summaryText }),
        pill ? h("span", { class: "pill", text: pill }) : null,
      ]),
      h("div", { class: "disclosure__body" }, body),
    ]);
    d.open = !!open;
    return d;
  }

  function crumb(label, hash) {
    return h("button", { type: "button", class: "crumb", onclick: function () { navigate(hash); } }, [
      h("span", { html: ICON_BACK, "aria-hidden": "true" }),
      label,
    ]);
  }

  function autosize(el) {
    if (!el || el.tagName !== "TEXTAREA") return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + 4 + "px";
  }

  /* ---------- Kaydetme durumu: başarısızlıkta "Kaydedildi" asla gösterilmez ---------- */

  var pendingSave = null;
  var saveTimerId = null;

  function scheduleSave(fn, immediate) {
    pendingSave = fn;
    clearTimeout(saveTimerId);
    if (immediate) flushSave();
    else saveTimerId = setTimeout(flushSave, 400);
  }

  function flushSave() {
    clearTimeout(saveTimerId);
    if (!pendingSave) return;
    var fn = pendingSave;
    pendingSave = null;
    showSaveStatus(fn() !== false);
  }

  function showSaveStatus(ok) {
    var el = $("save-status");
    if (!el) {
      if (!ok) toast(t("save.failed"));
      return;
    }
    clearTimeout(el._hide);
    el.textContent = "";
    el.classList.toggle("is-error", !ok);
    if (ok) {
      el.textContent = t("common.saved");
      el._hide = setTimeout(function () { el.textContent = ""; }, 1800);
    } else {
      el.appendChild(h("div", { class: "box box--error", role: "alert" }, [
        h("p", { text: t("save.failed") }),
        h("button", { type: "button", class: "btn btn--secondary", text: t("save.failedAction"), onclick: function () { openSettings({ showExport: true }); } }),
      ]));
    }
  }

  function saveStatusEl() {
    return h("div", { class: "save-status", id: "save-status", role: "status", "aria-live": "polite" });
  }

  /* ---------- Pencereler: showModal yoksa basit yedek görünüm ---------- */

  function openDialog(dlg) {
    if (typeof dlg.showModal === "function") {
      try {
        dlg.showModal();
        return;
      } catch (e) { /* aşağıdaki yedeğe düş */ }
    }
    dlg.classList.add("is-fallback");
    dlg.setAttribute("open", "");
  }
  function closeDialog(dlg) {
    if (typeof dlg.close === "function" && !dlg.classList.contains("is-fallback")) {
      try { dlg.close(); } catch (e) { dlg.removeAttribute("open"); }
    } else {
      dlg.removeAttribute("open");
      dlg.classList.remove("is-fallback");
      try { dlg.dispatchEvent(new Event("close")); } catch (e) { /* eski tarayıcı */ }
    }
  }

  /* ---------- Onay penceresi (tarayıcının confirm() penceresi yerine) ---------- */

  function confirmDialog(opts) {
    var dlg = $("confirm");
    return new Promise(function (resolve) {
      var done = false;
      function finish(v) {
        if (done) return;
        done = true;
        if (dlg.hasAttribute("open")) closeDialog(dlg);
        resolve(v);
      }
      var cancelBtn = h("button", { type: "button", class: "btn btn--secondary", text: t("common.cancel"), onclick: function () { finish(false); } });
      dlg.textContent = "";
      dlg.appendChild(h("div", { class: "dialog__body" }, [
        h("h2", { id: "confirm-title", text: opts.title }),
        h("p", { text: opts.body }),
        h("div", { class: "btn-row" }, [
          cancelBtn,
          h("button", { type: "button", class: "btn btn--danger", text: opts.confirm, onclick: function () { finish(true); } }),
        ]),
      ]));
      dlg.addEventListener("close", function () { finish(false); }, { once: true });
      openDialog(dlg);
      cancelBtn.focus();
    });
  }

  /* ================= Yönlendirme ================= */

  var state = {
    view: null,
    planDate: null,
    planOpenedAsToday: false,
    cameFromBook: null,   // { chapterId, blockId }
    focusField: null,
    resume: null,
    habitDay: null,
    habitRenderedFor: null,
    flash: null,
    pendingScroll: false,
  };

  var viewEl, cleanupFns = [];

  function navigate(hash) {
    if (location.hash === "#" + hash) route();
    else location.hash = hash;
  }

  function parseHash() {
    var hsh = decodeURIComponent((location.hash || "").replace(/^#/, ""));
    if (!hsh || hsh === "hosgeldin") return { view: "home" };
    if (hsh === "oku") return { view: "contents" };
    if (hsh.indexOf("oku-") === 0) return { view: "chapter", id: hsh.slice(4) };
    if (hsh === "gunum" || hsh === "planla") return { view: "day", date: STORE.dateKey(), today: true };
    if (hsh.indexOf("gun-") === 0 && STORE.isValidDateKey(hsh.slice(4))) return { view: "day", date: hsh.slice(4), today: hsh.slice(4) === STORE.dateKey() };
    if (hsh === "gecmis") return { view: "history" };
    if (hsh === "aliskanlik") return { view: "habit" };
    if (hsh === "aliskanlik-kur") return { view: "wizard" };
    return { view: "home" };
  }

  var TAB_OF = { contents: "oku", chapter: "oku", day: "gunum", history: "gunum", habit: "aliskanlik", wizard: "aliskanlik" };

  function route() {
    var r = parseHash();
    flushSave();
    cleanupFns.forEach(function (fn) { fn(); });
    cleanupFns = [];

    state.view = r.view;
    viewEl.textContent = "";
    viewEl.className = "view";

    var tab = TAB_OF[r.view];
    document.querySelectorAll("[data-nav]").forEach(function (b) {
      if (b.getAttribute("data-nav") === tab) b.setAttribute("aria-current", "page");
      else b.removeAttribute("aria-current");
    });

    try {
      if (r.view === "home") renderHome();
      else if (r.view === "contents") renderContents();
      else if (r.view === "chapter") renderChapter(r.id);
      else if (r.view === "day") renderDay(r.date, r.today);
      else if (r.view === "history") renderHistory();
      else if (r.view === "habit") renderHabit();
      else if (r.view === "wizard") renderWizard();
    } catch (err) {
      if (!BOOT.isStarted || !BOOT.isStarted()) throw err; // ilk açılışta init yakalar
      renderViewError(err, r.view);
    }

    // Açılıştaki "Kaldığın yerden devam et" için son bölüm
    var place = { chapter: "oku-" + (r.id || ""), day: r.today ? "gunum" : null, habit: "aliskanlik" }[r.view];
    if (place) store.setSettings({ lastPlace: place });

    if (motionAllowed()) {
      void viewEl.offsetWidth;
      viewEl.classList.add("is-entering");
    }
    if (!state.pendingScroll) window.scrollTo(0, 0);
    state.pendingScroll = false;
  }

  /** Bir ekran çizilemezse: anlaşılır mesaj + ayrı alanda teknik ayrıntı. Gezinme kullanılmaya devam eder. */
  function renderViewError(err, view) {
    viewEl.textContent = "";
    var ta = h("textarea", { class: "textarea code-out", readonly: true, rows: 7, id: "view-error-details", "aria-label": t("boot.details") });
    ta.value = BOOT.details(err, "ekran: " + view);
    viewEl.appendChild(h("section", { class: "boot-screen boot-screen--error", role: "alert", id: "view-error" }, [
      h("h1", { text: t("boot.viewErrorTitle") }),
      h("p", { text: t("boot.viewErrorBody") }),
      h("button", { type: "button", class: "btn btn--primary", text: t("boot.goHome"), onclick: function () { navigate("hosgeldin"); } }),
      h("details", { class: "boot-details" }, [h("summary", { text: t("boot.details") }), ta]),
    ]));
  }

  /* ================= Açılış ================= */

  function chapterById(id) {
    return BOOK.chapters.filter(function (c) { return c.id === id; })[0];
  }
  function chapterLabel(ch) {
    return ch.kind === "chapter" ? t("reader.chapterLabel", { n: ch.number }) : "";
  }

  function renderHome() {
    var settings = store.getSettings();
    var habit = store.getHabit();
    var continueBtn = null;
    var last = settings.lastPlace;
    if (last && last.indexOf("oku-") === 0 && settings.reading) {
      var ch = chapterById(settings.reading.chapterId);
      if (ch && ch.available) {
        continueBtn = h("button", { type: "button", class: "btn btn--secondary", id: "home-continue", text: t("home.continueReading", { chapter: ch.title }), onclick: function () {
          state.resume = settings.reading.blockId;
          navigate("oku-" + ch.id);
        } });
      }
    } else if (last === "gunum" && Object.keys(store.getDays()).length) {
      continueBtn = h("button", { type: "button", class: "btn btn--secondary", id: "home-continue", text: t("home.continueDay"), onclick: function () { navigate("gunum"); } });
    } else if (last === "aliskanlik" && (habit.activePlanId || habit.draft)) {
      continueBtn = h("button", { type: "button", class: "btn btn--secondary", id: "home-continue", text: t("home.continueHabit"), onclick: function () { navigate("aliskanlik"); } });
    }

    viewEl.classList.add("is-wide");
    viewEl.appendChild(h("section", { class: "home", "aria-labelledby": "home-title" }, [
      h("div", { class: "cover", "aria-hidden": "true" }, [
        h("span", { class: "cover__brand", text: t("home.coverBrand") }),
        h("span", { class: "cover__title", text: t("home.coverTitle") }),
        h("span", { class: "cover__subtitle", text: t("home.coverSubtitle") }),
        h("div", { class: "cover__art", html: ART.cover }),
      ]),
      h("div", { class: "home__text" }, [
        h("h1", { id: "home-title", class: "visually-hidden", text: t("home.coverTitle") }),
        h("p", { class: "home__desc", text: t("home.description") }),
        h("div", { class: "btn-row" }, [
          h("button", { type: "button", class: "btn btn--primary", id: "start-reading", text: t("home.startReading"), onclick: function () {
            store.setSettings({ welcomed: true });
            var r = store.getSettings().reading;
            if (r && chapterById(r.chapterId)) { state.resume = r.blockId; navigate("oku-" + r.chapterId); }
            else { state.resume = "top"; navigate("oku-baslarken"); }
          } }),
          h("button", { type: "button", class: "btn btn--secondary", id: "plan-today", text: t("home.planToday"), onclick: function () {
            store.setSettings({ welcomed: true });
            navigate("gunum");
          } }),
        ]),
        h("button", { type: "button", class: "btn btn--quiet", id: "habit-link", text: t("home.habitLink"), onclick: function () { navigate("aliskanlik"); } }),
        continueBtn ? h("div", { class: "home__continue" }, [h("p", { class: "label", text: t("home.continueTitle") }), continueBtn]) : null,
        h("p", { class: "note-line" }, [h("span", { html: ICON_INFO }), h("span", { text: t("home.privacyNote") })]),
      ]),
    ]));
  }

  /* ================= Kitap ================= */

  function renderContents() {
    var reading = store.getSettings().reading;
    var resumeCh = reading && chapterById(reading.chapterId);
    if (resumeCh && !resumeCh.available) resumeCh = null;

    viewEl.appendChild(h("section", { class: "stack-lg", "aria-labelledby": "toc-title" }, [
      h("div", { class: "page-head" }, [
        h("p", { class: "eyebrow", text: BOOK.title }),
        h("h1", { id: "toc-title", text: t("reader.contentsTitle") }),
        h("p", { class: "muted", text: t("reader.contentsLead") }),
      ]),
      resumeCh ? h("div", { class: "box box--action" }, [
        h("p", { text: (chapterLabel(resumeCh) ? chapterLabel(resumeCh) + " · " : "") + resumeCh.title }),
        h("button", { type: "button", class: "btn btn--primary", id: "resume-reading", text: t("reader.continueReading"), onclick: function () {
          state.resume = reading.blockId;
          navigate("oku-" + resumeCh.id);
        } }),
      ]) : null,
      h("ol", { class: "toc" }, BOOK.chapters.map(function (ch) {
        return h("li", { class: "toc__item" + (ch.available ? "" : " is-locked") }, [
          h("div", { class: "toc__meta" }, [
            chapterLabel(ch) ? h("span", { text: chapterLabel(ch) }) : null,
            h("span", { text: ch.available ? t("reader.readingTime", { min: ch.minutes }) : t("reader.notWritten") }),
          ]),
          h("span", { class: "toc__title", text: ch.title }),
          ch.available
            ? h("button", { type: "button", class: "btn btn--secondary", "data-open-chapter": ch.id, text: t("reader.startChapter"), onclick: function () { state.resume = "top"; navigate("oku-" + ch.id); } })
            : h("p", { class: "hint", text: t("reader.notWrittenHint") }),
        ]);
      })),
    ]));
  }

  function citation(id) {
    var s = BOOK.sources[id];
    if (!s) return null;
    var url = "https://doi.org/" + s.doi;
    return h("p", { class: "cite" }, [
      s.authors + " (" + s.year + "). " + s.title + ". " + s.venue + ". ",
      h("a", { href: url, target: "_blank", rel: "noopener", text: url }),
    ]);
  }

  function renderBlock(b, ch) {
    var attrs = { id: "blk-" + b.id, "data-block": b.id };
    function w(el, text) { el.setAttribute("data-w", String(text.length)); return el; }
    switch (b.type) {
      case "h":
        return w(h("h2", attrs, [b.text]), b.text);
      case "p":
        return w(h("p", attrs, [b.text]), b.text);
      case "scene":
        return w(h("div", Object.assign({ class: "scene" }, attrs), b.paragraphs.map(function (p) { return h("p", { text: p }); })), b.paragraphs.join(" "));
      case "figure":
        return w(h("figure", Object.assign({ class: "figure" }, attrs), [
          h("div", { class: "figure__art", role: "img", "aria-label": b.alt, html: ART[b.art] || "" }),
          h("figcaption", { text: b.caption }),
        ]), b.caption);
      case "research":
        return w(h("aside", Object.assign({ class: "box box--research", "aria-label": t("reader.researchLabel") }, attrs), [
          h("span", { class: "box__label", text: t("reader.researchLabel") }),
          h("p", { text: b.finding }),
          h("p", { class: "research__limits" }, [h("strong", { text: t("reader.limitsLabel") + ": " }), b.limits]),
          h("details", { class: "more" }, [
            h("summary", { text: t("reader.researchMore") }),
            h("div", { class: "more__body" }, [b.details ? h("p", { text: b.details }) : null].concat((b.refs || []).map(citation))),
          ]),
        ]), b.finding + b.limits);
      case "suggestion":
        return w(h("div", Object.assign({ class: "suggestion" }, attrs), [
          h("span", { class: "suggestion__label", text: t("reader.suggestionLabel") }),
          h("p", { text: b.text }),
        ]), b.text);
      case "exercise":
        return renderExercise(b, attrs, ch);
      case "summary":
        return w(h("p", Object.assign({ class: "summary" }, attrs), [h("span", { class: "eyebrow", text: t("reader.summaryLabel") }), b.text]), b.text);
      default:
        return null;
    }
  }

  function renderExercise(b, attrs, ch) {
    var steps = h("ol", null, b.steps.map(function (s) { return h("li", { text: s }); }));
    steps.setAttribute("data-w", String(b.steps.join(" ").length + b.title.length)); // düğmeler sayılmaz
    var children = [
      h("span", { class: "box__label", text: t("reader.exerciseLabel") }),
      h("h3", { text: b.title }),
      steps,
    ];
    if (b.timerSeconds) children.push(renderTimer(b.timerSeconds));
    if (b.planner) {
      children.push(h("button", { type: "button", class: "btn btn--primary", "data-to-planner": b.planner, text: t("reader.exerciseToPlanner"), onclick: function () {
        store.setSettings({ reading: { chapterId: ch.id, blockId: b.id } });
        state.cameFromBook = { chapterId: ch.id, blockId: b.id };
        state.focusField = b.planner;
        navigate("gunum");
      } }));
    }
    var el = h("section", Object.assign({ class: "box box--exercise exercise", "aria-label": t("reader.exerciseLabel") + ": " + b.title }, attrs), children);
    el.removeAttribute("data-w");
    return el;
  }

  function renderTimer(seconds) {
    var fill = h("div", { class: "timer__fill" });
    var status = h("p", { class: "timer__status", "aria-live": "polite" });
    var btn = h("button", { type: "button", class: "btn btn--secondary", text: t("reader.timerStart") });
    var handle = null, endAt = 0;

    function fmt(s) {
      var m = Math.floor(s / 60), r = s % 60;
      return m + ":" + (r < 10 ? "0" : "") + r;
    }
    function stop(finished) {
      clearInterval(handle);
      handle = null;
      btn.textContent = t("reader.timerStart");
      fill.style.transition = "none";
      fill.style.transform = "scaleX(" + (finished ? 1 : 0) + ")";
      status.textContent = finished ? t("reader.timerDone") : "";
    }
    function tick() {
      var left = Math.max(0, Math.round((endAt - Date.now()) / 1000));
      fill.style.transition = motionAllowed() ? "transform 1s linear" : "none";
      fill.style.transform = "scaleX(" + (1 - left / seconds) + ")";
      // Ekran okuyucuyu her saniye konuşturmamak için durum 30 saniyede bir güncellenir.
      if (left % 30 === 0 || left <= 5) status.textContent = t("reader.timerRemaining", { time: fmt(left) });
      if (left <= 0) stop(true);
    }
    btn.addEventListener("click", function () {
      if (handle) return stop(false);
      endAt = Date.now() + seconds * 1000;
      btn.textContent = t("reader.timerStop");
      status.textContent = t("reader.timerRemaining", { time: fmt(seconds) });
      fill.style.transition = "none";
      fill.style.transform = "scaleX(0)";
      handle = setInterval(tick, 1000);
    });
    cleanupFns.push(function () { clearInterval(handle); });
    return h("div", { class: "timer" }, [h("div", { class: "timer__bar", "aria-hidden": "true" }, [fill]), status, btn]);
  }

  function textSizeControl(onChange, idPrefix) {
    var group = choiceGroup(idPrefix || "textsize", t("reader.textSizeLabel"), ["standard", "large", "larger"].map(function (k) {
      return { value: k, label: t("reader.textSizes." + k) };
    }), textSize(), { cls: "choices--seg" });
    group.addEventListener("change", function (e) {
      store.setSettings({ textSize: e.target.value });
      if (onChange) onChange(e.target.value);
    });
    return group;
  }

  /** Bloklar ara başlıklarla kısa okuma parçalarına ayrılır. */
  function splitParts(blocks) {
    var parts = [[]];
    blocks.forEach(function (b) {
      if (b.type === "h" && parts[parts.length - 1].length) parts.push([]);
      parts[parts.length - 1].push(b);
    });
    return parts;
  }

  function renderChapter(id) {
    var idx = -1;
    BOOK.chapters.forEach(function (c, i) { if (c.id === id) idx = i; });
    var ch = BOOK.chapters[idx];
    if (!ch || !ch.available) return navigate("oku");

    var parts = splitParts(ch.blocks);
    var fillEl = h("div", { class: "readbar__fill" });
    var pctEl = h("span", { class: "readbar__pct", "aria-hidden": "true", text: t("reader.progressShort", { p: 0 }) });
    var partEl = h("span", { class: "readbar__title" });
    var progressText = h("span", { class: "visually-hidden", id: "read-progress", "aria-live": "off" });
    var readbar = h("div", { class: "readbar" }, [
      h("div", { class: "readbar__inner" }, [
        h("div", { class: "readbar__row" }, [partEl, pctEl]),
        h("div", { class: "readbar__track", role: "progressbar", "aria-label": t("reader.progress", { p: "" }).replace("%", "").trim(), "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": "0", id: "read-track" }, [fillEl]),
        progressText,
      ]),
    ]);

    var article = h("article", { class: "reader", "data-size": textSize(), "aria-labelledby": "chapter-title" }, [
      h("header", { class: "reader__head" }, [
        h("p", { class: "eyebrow", text: chapterLabel(ch) || BOOK.title }),
        h("h1", { id: "chapter-title", text: ch.title }),
        h("p", { class: "hint", text: t("reader.readingTime", { min: ch.minutes }) }),
        h("div", { class: "reader__tools" }, [textSizeControl(function (v) {
          var anchorBlock = currentBlock();
          article.setAttribute("data-size", v);
          if (anchorBlock) { state.pendingScroll = true; anchorBlock.scrollIntoView({ block: "start" }); }
          update();
        }, "textsize")]),
      ]),
    ]);

    parts.forEach(function (blocks, i) {
      var title = blocks[0].type === "h" ? blocks[0].text : ch.title;
      var sec = h("section", { class: "part", "data-part": String(i + 1), "data-part-title": title }, [
        h("p", { class: "part__label", text: t("reader.partLabel", { n: i + 1, total: parts.length }) }),
      ]);
      blocks.forEach(function (b) {
        var el = renderBlock(b, ch);
        if (el) sec.appendChild(el);
      });
      article.appendChild(sec);
    });

    if (ch.sources && ch.sources.length) {
      article.appendChild(h("details", { class: "more sources", id: "sources" }, [
        h("summary", { text: t("reader.sourcesTitle") }),
        h("ol", null, ch.sources.map(function (sid) { return h("li", null, [citation(sid)]); })),
      ]));
    }

    var next = BOOK.chapters[idx + 1];
    var end = h("div", { class: "chapter-end" });
    if (next && next.available) {
      end.appendChild(h("button", { type: "button", class: "btn btn--primary btn--block", text: t("reader.nextChapter", { title: next.title }), onclick: function () { state.resume = "top"; navigate("oku-" + next.id); } }));
    } else {
      end.appendChild(h("p", { class: "muted", text: t("reader.nextChapterSoon") }));
      end.appendChild(h("button", { type: "button", class: "btn btn--primary btn--block", text: t("reader.goToDay"), onclick: function () { navigate("gunum"); } }));
    }
    end.appendChild(h("button", { type: "button", class: "btn btn--secondary btn--block", text: t("reader.backToContents"), onclick: function () { navigate("oku"); } }));
    article.appendChild(end);

    viewEl.appendChild(readbar);
    viewEl.appendChild(article);

    var blockEls = Array.prototype.slice.call(article.querySelectorAll("[data-block]"));
    var weighted = Array.prototype.slice.call(article.querySelectorAll("[data-w]"));
    var total = weighted.reduce(function (a, el) { return a + (+el.getAttribute("data-w")); }, 0) || 1;
    var partEls = Array.prototype.slice.call(article.querySelectorAll(".part"));

    function barBottom() {
      return readbar.getBoundingClientRect().bottom;
    }
    function currentBlock() {
      var top = Math.max(barBottom(), 0) + 8;
      for (var i = 0; i < blockEls.length; i++) {
        if (blockEls[i].getBoundingClientRect().bottom > top) return blockEls[i];
      }
      return null;
    }

    /** Konuma dayalı yaklaşık ilerleme: yalnızca okuma metni sayılır (düğmeler ve kaynaklar hariç). */
    var lastPct = -1;
    function update() {
      var line = Math.max(barBottom(), 0) + (window.innerHeight - Math.max(barBottom(), 0)) * 0.3;
      var read = 0;
      weighted.forEach(function (el) {
        var r = el.getBoundingClientRect(), wgt = +el.getAttribute("data-w");
        if (r.bottom <= line) read += wgt;
        else if (r.top < line) read += wgt * ((line - r.top) / Math.max(r.height, 1));
      });
      var lastEl = weighted[weighted.length - 1];
      var pct = Math.round((100 * read) / total);
      if (lastEl && lastEl.getBoundingClientRect().bottom <= window.innerHeight + 2) pct = 100;
      pct = Math.max(0, Math.min(100, pct));

      var curPart = partEls[0];
      partEls.forEach(function (p) { if (p.getBoundingClientRect().top <= line) curPart = p; });
      partEl.textContent = (chapterLabel(ch) ? chapterLabel(ch) + " · " : "") + (curPart ? curPart.getAttribute("data-part-title") : ch.title);

      if (pct !== lastPct) {
        lastPct = pct;
        fillEl.style.width = pct + "%";
        pctEl.textContent = t("reader.progressShort", { p: pct });
        $("read-track").setAttribute("aria-valuenow", String(pct));
        $("read-track").setAttribute("aria-valuetext", t("reader.progress", { p: pct }));
      }
    }

    // Kaldığın yeri hatırla
    var saveTimer = null;
    function onScroll() {
      update();
      clearTimeout(saveTimer);
      saveTimer = setTimeout(function () {
        var b = currentBlock();
        if (b) store.setSettings({ reading: { chapterId: ch.id, blockId: b.getAttribute("data-block") } });
      }, 250);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    cleanupFns.push(function () {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      clearTimeout(saveTimer);
    });

    // Konum: açıkça "baştan" denmediyse bu bölümde kalınan yer kullanılır
    var saved = store.getSettings().reading;
    if (!state.resume && saved && saved.chapterId === ch.id) state.resume = saved.blockId;
    if (state.resume === "top") state.resume = null;
    var target = state.resume && $("blk-" + state.resume);
    state.resume = null;
    if (target) {
      state.pendingScroll = true;
      requestAnimationFrame(function () {
        target.scrollIntoView({ block: "start" });
        update();
      });
    } else {
      store.setSettings({ reading: { chapterId: ch.id, blockId: ch.blocks[0] && ch.blocks[0].id } });
      requestAnimationFrame(update);
    }
  }

  /* ================= Günüm ================= */

  function renderDay(dateKey, openedAsToday) {
    var today = STORE.dateKey();
    var isPast = dateKey < today;
    state.planDate = dateKey;
    state.planOpenedAsToday = !!openedAsToday;

    var day = store.getDay(dateKey);
    var legacyWhat = day.start.what.trim() && day.start.what.trim() !== day.main.step.trim() ? day.start.what : "";
    var keepWhat = day.start.what; // eski alan: kullanıcı karar verene kadar olduğu gibi saklanır
    var key = dateKey; // form bu tarihe sabitlenir; gece yarısı geçse de yazılanlar bu güne gider

    var banners = h("div", { class: "stack-sm", id: "day-banners" });
    if (!store.available) banners.appendChild(h("div", { class: "banner banner--warn", role: "alert", text: t("save.storageWarning") }));
    if (isPast) {
      banners.appendChild(h("div", { class: "banner" }, [
        h("p", { text: t("day.pastBanner") }),
        h("button", { type: "button", class: "btn btn--secondary", text: t("day.backToToday"), onclick: function () { navigate("gunum"); } }),
      ]));
    }
    if (state.cameFromBook) {
      var back = state.cameFromBook;
      banners.appendChild(h("div", { class: "banner" }, [
        h("button", { type: "button", class: "btn btn--secondary", id: "back-to-book", text: t("day.backToBook"), onclick: function () {
          state.cameFromBook = null;
          state.resume = back.blockId;
          navigate("oku-" + back.chapterId);
        } }),
      ]));
    }

    // Ana iş ve ilk küçük adım: ilk bakışta yalnızca bunlar
    var mainBox = h("section", { class: "box box--action", "aria-label": t("day.mainLabel") }, [
      h("div", { class: "task", id: "task-main" }, [
        field("f-main", t("day.mainLabel"), { hint: t("day.mainHint"), placeholder: t("day.mainPlaceholder"), value: day.main.text }),
        checkbox("f-main-done", t("day.mainDoneLabel"), day.main.done),
      ]),
      field("f-step", t("day.stepLabel"), { hint: t("day.stepHint"), placeholder: t("day.stepPlaceholder"), value: day.main.step }),
    ]);

    var brainFilled = !!day.brain.trim();
    var brain = disclosure("d-brain", t("day.brainToggle"), [
      field("f-brain", t("day.brainLabel"), { hint: t("day.brainHint"), multiline: true, rows: 5, max: 10000, placeholder: t("day.brainPlaceholder"), value: day.brain }),
    ], brainFilled, brainFilled ? t("day.filled") : null);

    function extra(n) {
      var ex = day.extras[n - 1];
      return h("div", { class: "task", id: "task-extra" + n }, [
        field("f-extra" + n, t("day.extraLabel", { n: n }), { placeholder: t("day.extraPlaceholder"), value: ex.text }),
        checkbox("f-extra" + n + "-done", t("day.extraDoneLabel", { n: n }), ex.done),
      ]);
    }
    var extrasFilled = !!(day.extras[0].text.trim() || day.extras[1].text.trim());
    var extras = disclosure("d-extras", t("day.extrasToggle"), [h("p", { class: "hint", text: t("day.extrasHint") }), extra(1), extra(2)], extrasFilled, extrasFilled ? t("day.filled") : null);

    // Başlama planı: ilk küçük adım otomatik kullanılır; kullanıcı yalnızca zaman ve yeri yazar
    var startOut = h("div", { id: "start-out", "aria-live": "polite" });
    var legacyBox = null;
    if (legacyWhat) {
      legacyBox = h("div", { class: "box box--note legacy", id: "legacy-what" }, [
        h("strong", { text: t("day.legacyTitle") }),
        h("p", { text: t("day.legacyBody") }),
        h("blockquote", { text: legacyWhat }),
        h("p", { class: "hint", text: t("day.legacyUseStepHint") }),
        h("div", { class: "btn-row" }, [
          h("button", { type: "button", class: "btn btn--secondary", id: "legacy-use-step", text: t("day.legacyUseStep"), onclick: function () { resolveLegacy(false); } }),
          h("button", { type: "button", class: "btn btn--secondary", id: "legacy-move", text: t("day.legacyMoveToStep"), onclick: function () { resolveLegacy(true); } }),
        ]),
      ]);
    }
    var timeTip = h("p", { class: "hint", id: "time-tip", "aria-live": "polite" });
    var timeCustom = field("f-time-custom", t("day.timeCustomLabel"), { placeholder: t("day.timeCustomPlaceholder"), value: day.time.custom, max: 40 });
    var timeGroup = choiceGroup("time", t("day.timeLabel"), ["5", "15", "30", "custom"].map(function (v) {
      return { value: v, label: t("day.timeOptions." + v) };
    }), day.time.budget, { cls: "choices--time", marks: true, id: "time-group" });
    var timeClear = h("button", { type: "button", class: "btn btn--quiet", id: "time-clear", text: t("day.timeClear"), onclick: function () {
      timeGroup.querySelectorAll("input").forEach(function (i) { i.checked = false; });
      $("f-time-custom").value = "";
      updateTime();
      save(true);
    } });

    var startFilled = !!(day.start.when.trim() || day.start.where.trim() || day.time.budget || legacyWhat);
    var start = disclosure("d-start", t("day.startToggle"), [
      h("p", { class: "hint", text: t("day.startHint") }),
      field("f-when", t("day.whenLabel"), { placeholder: t("day.whenPlaceholder"), value: day.start.when, max: 200 }),
      field("f-where", t("day.whereLabel"), { placeholder: t("day.wherePlaceholder"), value: day.start.where, max: 200 }),
      startOut,
      legacyBox,
      timeGroup,
      timeCustom,
      timeTip,
      timeClear,
    ], startFilled, startFilled ? t("day.filled") : null);

    var eveningFilled = !!(day.evening.worked.trim() || day.evening.easier.trim());
    var evening = disclosure("d-evening", t("day.eveningToggle"), [
      h("p", { class: "hint", text: t("day.eveningHint") }),
      field("f-worked", t("day.workedLabel"), { multiline: true, rows: 3, placeholder: t("day.workedPlaceholder"), value: day.evening.worked }),
      field("f-easier", t("day.easierLabel"), { multiline: true, rows: 3, placeholder: t("day.easierPlaceholder"), value: day.evening.easier }),
    ], eveningFilled, eveningFilled ? t("day.filled") : null);

    var form = h("form", { class: "stack-lg", id: "day-form", novalidate: true, onsubmit: function (e) { e.preventDefault(); } }, [
      brain,
      mainBox,
      h("div", { class: "disclosures" }, [extras, start, evening]),
    ]);
    // Aklımdakiler ana işin üstünde, ama ayrı çizgili satır olarak dursun
    brain.style.borderTop = "1px solid var(--line)";

    viewEl.appendChild(h("section", { class: "stack-lg", "aria-labelledby": "day-title" }, [
      h("div", { class: "day-head" }, [
        h("div", { class: "page-head" }, [
          h("p", { class: "date-line", id: "day-date", text: formatDate(dateKey) }),
          h("h1", { id: "day-title", text: isPast ? t("day.titlePast") : t("day.titleToday") }),
        ]),
        h("button", { type: "button", class: "btn btn--quiet", id: "open-history", text: t("day.historyLink"), onclick: function () { navigate("gecmis"); } }),
      ]),
      banners,
      form,
      saveStatusEl(),
    ]));

    function collect() {
      var budget = "";
      var checked = timeGroup.querySelector("input:checked");
      if (checked) budget = checked.value;
      return {
        brain: $("f-brain").value,
        main: { text: $("f-main").value, step: $("f-step").value, done: $("f-main-done").checked },
        extras: [
          { text: $("f-extra1").value, done: $("f-extra1-done").checked },
          { text: $("f-extra2").value, done: $("f-extra2-done").checked },
        ],
        start: { when: $("f-when").value, where: $("f-where").value, what: keepWhat },
        time: { budget: budget, custom: budget === "custom" ? $("f-time-custom").value : "" },
        evening: { worked: $("f-worked").value, easier: $("f-easier").value },
      };
    }

    function save(immediate) {
      var data = collect();
      scheduleSave(function () { return store.saveDay(key, data); }, immediate);
    }

    function resolveLegacy(moveToStep) {
      if (moveToStep) {
        $("f-step").value = keepWhat;
      }
      keepWhat = "";
      legacyBox.remove();
      legacyBox = null;
      toast(t("day.legacyResolved"));
      updateStart();
      save(true);
    }

    function updateStart() {
      startOut.textContent = "";
      var w = $("f-when").value.trim(), wh = $("f-where").value.trim(), st = $("f-step").value.trim();
      if (!st) {
        if (w || wh) startOut.appendChild(h("p", { class: "hint", text: t("day.startNeedsStep") }));
        return;
      }
      if (!w && !wh) return;
      var box = h("div", { class: "start-out" }, [h("span", { class: "label", text: t("day.startLabelled") })]);
      if (w && wh && isLocative(wh)) {
        box.appendChild(h("p", { id: "start-sentence", text: t("day.startSentence", { when: w, where: midSentence(wh), step: midSentence(st) }) }));
      } else {
        box.appendChild(h("dl", null, [
          w ? h("dt", { text: t("day.startWhen") }) : null, w ? h("dd", { text: w }) : null,
          wh ? h("dt", { text: t("day.startWhere") }) : null, wh ? h("dd", { text: wh }) : null,
          h("dt", { text: t("day.startStep") }), h("dd", { text: st }),
        ]));
      }
      startOut.appendChild(box);
    }

    function updateTime() {
      var checked = timeGroup.querySelector("input:checked");
      var v = checked ? checked.value : "";
      timeCustom.hidden = v !== "custom";
      timeTip.textContent = v ? t("day.timeTips." + v) : "";
      timeClear.hidden = !v;
    }

    function updateDone() {
      $("task-main").classList.toggle("is-done", $("f-main-done").checked);
      $("task-extra1").classList.toggle("is-done", $("f-extra1-done").checked);
      $("task-extra2").classList.toggle("is-done", $("f-extra2-done").checked);
    }

    form.addEventListener("input", function (e) {
      if (e.target.type === "checkbox" || e.target.type === "radio") return;
      autosize(e.target);
      updateStart();
      save(false);
    });
    form.addEventListener("change", function (e) {
      if (e.target.type === "radio") {
        updateTime();
        save(true);
        if (e.target.value === "custom") $("f-time-custom").focus();
        return;
      }
      if (e.target.type !== "checkbox") return;
      updateDone();
      var label = e.target.closest(".check");
      if (label && e.target.checked && motionAllowed()) {
        label.classList.remove("is-pop");
        void label.offsetWidth;
        label.classList.add("is-pop");
      }
      save(true);
      toast(e.target.checked ? t("day.doneFeedback") : t("day.undoneFeedback"));
    });
    form.addEventListener("toggle", function (e) {
      if (e.target.open) Array.prototype.forEach.call(e.target.querySelectorAll("textarea"), autosize);
    }, true);

    updateDone();
    updateStart();
    updateTime();
    Array.prototype.forEach.call(form.querySelectorAll("textarea"), autosize);

    if (state.focusField === "brain") {
      state.focusField = null;
      brain.open = true;
      state.pendingScroll = true;
      requestAnimationFrame(function () {
        brain.scrollIntoView({ block: "start", behavior: motionAllowed() ? "smooth" : "auto" });
        $("f-brain").focus({ preventScroll: true });
      });
    }
  }

  /** Uygulama açıkken gün değişirse: eski kayıt korunur, yeni gün için bir uyarı gösterilir. */
  function checkDayChange() {
    var today = STORE.dateKey();
    if (state.view === "habit" && state.habitRenderedFor && state.habitRenderedFor !== today && !isTyping()) {
      flushSave();
      state.habitDay = null;
      route();
      return;
    }
    if (state.view !== "day" || !state.planOpenedAsToday || today === state.planDate) return;
    if ($("new-day-banner")) return;
    flushSave();
    var banners = $("day-banners");
    if (!banners) return;
    banners.insertBefore(h("div", { class: "banner banner--warn", id: "new-day-banner", role: "status" }, [
      h("p", { text: t("day.newDayBanner") }),
      h("button", { type: "button", class: "btn btn--primary", text: t("day.openNewDay"), onclick: function () { navigate("gunum"); } }),
    ]), banners.firstChild);
  }

  /* ================= Geçmiş günler (Günüm'ün ikincil ekranı) ================= */

  function renderHistory() {
    var days = store.getDays();
    var keys = Object.keys(days).sort().reverse();
    var today = STORE.dateKey();

    var section = h("section", { class: "stack-lg", "aria-labelledby": "history-title" }, [
      h("div", { class: "page-head" }, [
        crumb(t("history.crumb"), "gunum"),
        h("h1", { id: "history-title", text: t("history.title") }),
        h("p", { class: "muted", text: t("history.lead") }),
      ]),
    ]);

    if (!keys.length) {
      section.appendChild(h("div", { class: "box box--research" }, [
        h("p", { text: t("history.empty") }),
        h("button", { type: "button", class: "btn btn--primary", text: t("history.emptyAction"), onclick: function () { navigate("gunum"); } }),
      ]));
      viewEl.appendChild(section);
      return;
    }

    section.appendChild(h("ul", { class: "days" }, keys.map(function (k) {
      var d = days[k];
      var snippet = d.evening.worked.trim() || d.evening.easier.trim();
      var rows = [];
      function row(label, value) {
        if (!value) return;
        rows.push(h("div", null, [h("dt", { text: label }), h("dd", { text: value })]));
      }
      row(t("history.detailStep"), d.main.step.trim() + (d.main.done ? " · " + t("history.detailDone") : ""));
      row(t("history.detailBrain"), d.brain.trim());
      row(t("history.detailExtras"), d.extras.filter(function (x) { return x.text.trim(); }).map(function (x) { return x.text.trim() + (x.done ? " (" + t("history.detailDone") + ")" : ""); }).join("\n"));
      row(t("history.detailStart"), [d.start.when.trim(), d.start.where.trim(), d.start.what.trim()].filter(Boolean).join(" · "));
      row(t("history.detailTime"), d.time.budget ? (d.time.budget === "custom" ? d.time.custom : t("day.timeOptions." + d.time.budget)) : "");
      row(t("history.detailWorked"), d.evening.worked.trim());
      row(t("history.detailEasier"), d.evening.easier.trim());

      var det = h("details", { class: "disclosure", "data-day": k }, [
        h("summary", null, [
          h("span", { class: "chev", "aria-hidden": "true", html: ICON_CHEV }),
          h("span", { class: "sum-text day-sum" }, [
            h("span", { class: "day-sum__date" }, [formatDate(k), k === today ? h("span", { class: "pill", text: t("history.today") }) : null]),
            h("span", { class: "day-sum__main", text: d.main.text.trim() || t("history.noMain") }),
            snippet ? h("span", { class: "day-sum__evening", text: t("history.eveningSnippet", { text: clip(snippet, 90) }) }) : null,
          ]),
        ]),
        h("div", { class: "disclosure__body" }, [
          rows.length ? h("dl", { class: "day-detail" }, rows) : null,
          h("div", { class: "btn-row" }, [
            h("button", { type: "button", class: "btn btn--secondary", "data-open-day": k, text: t("history.open"), onclick: function () { navigate("gun-" + k); } }),
            h("button", { type: "button", class: "btn btn--danger-outline", "data-delete-day": k, text: t("history.delete"), onclick: function () {
              confirmDialog({
                title: t("history.deleteTitle"),
                body: t("history.deleteBody", { date: formatDate(k) }),
                confirm: t("history.deleteConfirm"),
              }).then(function (yes) {
                if (!yes) return;
                if (store.deleteDay(k)) toast(t("history.deleted", { date: formatDate(k) }));
                else toast(t("save.failed"));
                route();
              });
            } }),
          ]),
        ]),
      ]);
      return h("li", null, [det]);
    })));
    viewEl.appendChild(section);
  }

  /* ================= Alışkanlığım ================= */

  var STEP_KEYS = STORE.PLAN_FIELDS; // goal, start, anchor, place, ease, smaller
  var REQUIRED = { goal: true, start: true, anchor: true };

  function planSummary(plan) {
    var nodes = [];
    if (plan.anchor && plan.place && plan.start && isLocative(plan.place)) {
      nodes.push(h("p", { class: "plan-sentence", id: "plan-sentence", text: t("habit.summarySentence", { anchor: plan.anchor, place: midSentence(plan.place), start: midSentence(plan.start) }) }));
    }
    nodes.push(h("dl", { class: "plan-sum" }, ["goal", "anchor", "place", "start", "ease", "smaller"].filter(function (f) { return plan[f]; }).map(function (f) {
      return h("div", null, [h("dt", { text: t("habit.summaryLabels." + f) }), h("dd", { text: plan[f] })]);
    })));
    return nodes;
  }

  function renderHabit() {
    var habit = store.getHabit();
    var plan = habit.activePlanId && habit.plans[habit.activePlanId];
    var today = STORE.dateKey();
    state.habitRenderedFor = today;

    var archived = Object.keys(habit.plans).map(function (id) { return habit.plans[id]; }).filter(function (p) { return p.id !== habit.activePlanId; });
    function previousPlans() {
      if (!archived.length) return null;
      return h("div", { class: "stack-sm" }, [
        h("h2", { text: t("habit.previousPlans") }),
        h("ul", { class: "change-list", id: "previous-plans" }, archived.map(function (p) {
          var count = Object.keys(habit.log).filter(function (k) { return habit.log[k].planId === p.id; }).length;
          return h("li", { text: t("habit.previousPlanItem", { goal: p.goal, count: count }) });
        })),
      ]);
    }

    if (!plan) {
      viewEl.classList.add("is-wide");
      viewEl.appendChild(h("section", { class: "habit-grid", "aria-labelledby": "habit-title" }, [
        h("div", { class: "stack" }, [
          h("p", { class: "eyebrow", text: t("habit.title") }),
          h("h1", { id: "habit-title", text: t("habit.introTitle") }),
          h("p", { class: "lead", text: t("habit.introBody") }),
          h("p", { class: "muted", text: t("habit.introTrial") }),
          h("div", { class: "btn-row" }, [
            h("button", { type: "button", class: "btn btn--primary", id: "habit-setup", text: habit.draft ? t("habit.continueSetup") : t("habit.startSetup"), onclick: function () { navigate("aliskanlik-kur"); } }),
          ]),
          previousPlans(),
        ]),
        h("div", { class: "illus", html: ART.habitLoop }),
      ]));
      return;
    }

    var selected = state.habitDay && state.habitDay <= today ? state.habitDay : today;
    var weekKeys = [];
    for (var i = 6; i >= 0; i--) weekKeys.push(STORE.addDays(today, -i));
    if (weekKeys.indexOf(selected) < 0) selected = today;
    state.habitDay = selected;

    var entry = habit.log[selected];
    var olderPlan = entry && entry.planId !== plan.id ? habit.plans[entry.planId] : null;

    // Seçili gün için kayıt
    var statusGroup = choiceGroup("hstatus", selected === today ? t("habit.statusQuestion") : t("habit.statusLegend", { date: formatShort(selected) }),
      STORE.HABIT_STATUSES.map(function (s) { return { value: s, label: t("habit.statuses." + s) }; }),
      entry ? entry.status : null, { marks: true, id: "habit-status" });
    var note = field("f-hnote", t("habit.noteLabel"), { multiline: true, rows: 2, max: 2000, placeholder: t("habit.notePlaceholder"), value: entry ? entry.note : "" });
    var noteInput = note.querySelector("textarea");
    var noteHint = h("p", { class: "hint", id: "hnote-needs", text: t("habit.noteNeedsStatus"), hidden: !!entry });
    noteInput.disabled = !entry;

    function writeEntry(status) {
      var hb = store.getHabit();
      var existing = hb.log[selected];
      if (!status) delete hb.log[selected];
      else hb.log[selected] = {
        status: status,
        note: noteInput.value,
        planId: existing ? existing.planId : hb.activePlanId, // eski plana ait kayıt eski planında kalır
        updatedAt: new Date().toISOString(),
      };
      return store.saveHabit(hb);
    }

    statusGroup.addEventListener("change", function (e) {
      noteInput.disabled = false;
      noteHint.hidden = true;
      var status = e.target.value;
      scheduleSave(function () { return writeEntry(status); }, true);
      refreshWeek();
    });
    noteInput.addEventListener("input", function () {
      autosize(noteInput);
      var c = statusGroup.querySelector("input:checked");
      if (!c) return;
      var status = c.value;
      scheduleSave(function () { return writeEntry(status); }, false);
    });
    var clearBtn = h("button", { type: "button", class: "btn btn--quiet", id: "habit-clear", text: t("habit.clearStatus"), onclick: function () {
      function doClear() {
        statusGroup.querySelectorAll("input").forEach(function (i) { i.checked = false; });
        noteInput.value = "";
        noteInput.disabled = true;
        noteHint.hidden = false;
        scheduleSave(function () { return writeEntry(null); }, true);
        refreshWeek();
      }
      if (noteInput.value.trim()) {
        confirmDialog({ title: t("habit.clearStatus"), body: noteInput.value.trim(), confirm: t("habit.clearStatus") }).then(function (yes) { if (yes) doClear(); });
      } else doClear();
    } });

    var weekList = h("ul", { class: "week", id: "habit-week" });
    function refreshWeek() {
      var hb = store.getHabit();
      weekList.textContent = "";
      weekKeys.forEach(function (k) {
        var e = hb.log[k];
        var status = e ? e.status : "none";
        var older = e && e.planId !== hb.activePlanId;
        var label = formatDate(k) + ": " + t("habit.statusShort." + status) + (older ? " · " + t("habit.olderPlan", { goal: (hb.plans[e.planId] || {}).goal || "" }) : "");
        weekList.appendChild(h("li", null, [
          h("button", { type: "button", "data-hday": k, "aria-pressed": k === selected ? "true" : "false", "aria-label": label, onclick: function () {
            flushSave();
            state.habitDay = k;
            state.pendingScroll = true;
            var y = window.scrollY;
            route();
            window.scrollTo(0, y);
            var b = document.querySelector('[data-hday="' + k + '"]');
            if (b) b.focus({ preventScroll: true });
          } }, [
            h("span", { class: "wd", text: wdFmt.format(STORE.keyToDate(k)) }),
            h("span", { class: "dot dot--" + status + (older ? " dot--older" : ""), "aria-hidden": "true" }),
            h("span", { text: String(STORE.keyToDate(k).getDate()) }),
          ]),
        ]));
      });
    }
    refreshWeek();

    var review = habit.reviews[plan.id] || { fit: "", context: "", shrink: "" };
    var reviewFilled = !!(review.fit || review.context || review.shrink);
    var reviewForm = h("div", { class: "stack" }, [
      h("p", { class: "hint", text: t("habit.reviewLead") }),
      field("f-rfit", t("habit.reviewFit"), { multiline: true, rows: 2, value: review.fit }),
      field("f-rcontext", t("habit.reviewContext"), { multiline: true, rows: 2, value: review.context }),
      field("f-rshrink", t("habit.reviewShrink"), { multiline: true, rows: 2, value: review.shrink }),
    ]);
    reviewForm.addEventListener("input", function (e) {
      autosize(e.target);
      var vals = { fit: $("f-rfit").value, context: $("f-rcontext").value, shrink: $("f-rshrink").value };
      var pid = plan.id;
      scheduleSave(function () {
        var hb = store.getHabit();
        hb.reviews[pid] = { fit: vals.fit, context: vals.context, shrink: vals.shrink, updatedAt: new Date().toISOString() };
        return store.saveHabit(hb);
      }, false);
    });

    var flash = state.flash;
    state.flash = null;

    viewEl.classList.add("is-wide");
    viewEl.appendChild(h("section", { class: "stack-lg", "aria-labelledby": "habit-title" }, [
      h("div", { class: "page-head" }, [
        h("p", { class: "eyebrow", text: t("habit.title") }),
        h("h1", { id: "habit-title", text: plan.goal }),
      ]),
      flash ? h("div", { class: "banner", role: "status", id: "habit-flash", text: flash }) : null,
      !store.available ? h("div", { class: "banner banner--warn", role: "alert", text: t("save.storageWarning") }) : null,
      h("div", { class: "habit-grid" }, [
        h("div", { class: "stack-lg" }, [
          h("section", { class: "box box--action", "aria-labelledby": "habit-day-title" }, [
            h("h2", { id: "habit-day-title", text: selected === today ? t("habit.todayTitle") : formatDate(selected) }),
            olderPlan ? h("p", { class: "hint", id: "older-plan-note", text: t("habit.olderPlan", { goal: olderPlan.goal }) }) : null,
            statusGroup,
            note,
            noteHint,
            clearBtn,
          ]),
          h("section", { class: "stack-sm", "aria-labelledby": "week-title" }, [
            h("h2", { id: "week-title", text: t("habit.weekTitle") }),
            h("p", { class: "hint", text: t("habit.weekHint") }),
            h("div", { class: "week-wrap" }, [weekList]),
            h("ul", { class: "legend", "aria-label": t("habit.legend") }, ["done", "smaller", "skipped", "none"].map(function (s) {
              return h("li", null, [h("span", { class: "dot dot--" + s, "aria-hidden": "true" }), t("habit.statusShort." + s)]);
            })),
            h("p", { class: "hint", text: t("habit.weekTrialNote") }),
          ]),
          saveStatusEl(),
        ]),
        h("div", { class: "stack-lg" }, [
          h("section", { class: "stack", "aria-labelledby": "plan-title" }, [
            h("h2", { id: "plan-title", text: t("habit.planTitle") }),
          ].concat(planSummary(plan)).concat([
            h("button", { type: "button", class: "btn btn--secondary", id: "habit-edit", text: t("habit.editPlan"), onclick: function () {
              var hb = store.getHabit();
              var p = hb.plans[hb.activePlanId];
              hb.draft = { goal: p.goal, start: p.start, anchor: p.anchor, place: p.place, ease: p.ease, smaller: p.smaller, step: 0, editingId: p.id };
              store.saveHabit(hb);
              navigate("aliskanlik-kur");
            } }),
          ])),
          h("div", { class: "disclosures" }, [disclosure("d-review", t("habit.reviewTitle"), [reviewForm], reviewFilled)]),
          previousPlans(),
        ]),
      ]),
    ]));
    Array.prototype.forEach.call(viewEl.querySelectorAll("textarea"), autosize);
  }

  /* ---------- Alışkanlık kurulumu: adım adım ---------- */

  function renderWizard() {
    var habit = store.getHabit();
    var draft = habit.draft || Object.assign(STORE.emptyPlanFields(), { step: 0, editingId: null });
    var total = STEP_KEYS.length;
    var step = Math.min(draft.step || 0, total);
    var editing = draft.editingId && habit.plans[draft.editingId] ? draft.editingId : null;

    function persist(patch) {
      var hb = store.getHabit();
      hb.draft = Object.assign({}, draft, patch);
      draft = hb.draft;
      return store.saveHabit(hb);
    }
    function go(n) {
      persist({ step: n });
      state.pendingScroll = false;
      route();
    }

    var progress = h("div", { class: "wizard__progress", "aria-hidden": "true" }, STEP_KEYS.map(function (k, i) { return h("span", { class: i <= step ? "is-on" : null }); }));
    var head = h("div", { class: "page-head" }, [
      crumb(t("habit.title"), "aliskanlik"),
      h("p", { class: "eyebrow", text: editing ? t("habit.editTitle") : t("habit.setupTitle") }),
      progress,
    ]);

    var section = h("section", { class: "stack-lg", "aria-labelledby": "wizard-title" }, [head]);

    if (step >= total) {
      section.appendChild(h("div", { class: "stack" }, [
        h("h1", { id: "wizard-title", text: t("habit.summaryStepTitle") }),
        h("p", { class: "muted", text: t("habit.summaryStepLead") }),
        h("div", { class: "box box--action", id: "wizard-summary" }, planSummary(draft)),
        h("div", { class: "btn-row" }, [
          h("button", { type: "button", class: "btn btn--secondary", text: t("common.back"), onclick: function () { go(total - 1); } }),
          h("button", { type: "button", class: "btn btn--primary", id: "wizard-finish", text: t("habit.finish"), onclick: function () {
            var res = STORE.applyPlanEdit(store.getHabit(), draft, editing);
            if (!store.saveHabit(res.habit)) return showSaveStatus(false);
            state.flash = res.versioned ? t("habit.versionNotice") : t("habit.savedPlan");
            state.habitDay = null;
            navigate("aliskanlik");
          } }),
        ]),
        saveStatusEl(),
      ]));
      viewEl.appendChild(section);
      $("wizard-title").setAttribute("tabindex", "-1");
      $("wizard-title").focus({ preventScroll: true });
      return;
    }

    var key = STEP_KEYS[step];
    var info = S.habit.steps[key];
    var inputId = "w-" + key;
    var input = h("textarea", { id: inputId, class: "textarea", rows: 2, maxlength: 500, autocomplete: "off", "aria-describedby": inputId + "-hint " + inputId + "-err" });
    input.value = draft[key] || "";
    var err = h("p", { class: "field-error", id: inputId + "-err", role: "alert", hidden: true });

    input.addEventListener("input", function () {
      autosize(input);
      err.hidden = true;
      input.removeAttribute("aria-invalid");
      var v = input.value;
      scheduleSave(function () { var p = {}; p[key] = v; return persist(p); }, false);
    });

    function next(skip) {
      var v = input.value.trim();
      if (!skip && REQUIRED[key] && !v) {
        err.textContent = t("common.requiredError");
        err.hidden = false;
        input.setAttribute("aria-invalid", "true");
        input.focus();
        return;
      }
      flushSave();
      var p = { step: step + 1 };
      p[key] = skip ? "" : input.value.trim();
      persist(p);
      route();
    }

    section.appendChild(h("div", { class: "stack" }, [
      h("p", { class: "hint", text: t("habit.stepOf", { n: step + 1, total: total }) + (REQUIRED[key] ? "" : " · " + t("common.optional")) }),
      h("h1", { id: "wizard-title" }, [h("label", { for: inputId, text: info.label })]),
      h("p", { class: "muted", id: inputId + "-hint", text: info.hint }),
      input,
      err,
      h("div", { class: "box box--research" }, [
        h("p", { text: t("common.example", { text: info.example }) }),
        h("button", { type: "button", class: "btn btn--secondary", id: "use-example", text: t("common.useExample"), onclick: function () {
          input.value = info.example;
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.focus();
        } }),
      ]),
      h("div", { class: "btn-row" }, [
        step > 0 ? h("button", { type: "button", class: "btn btn--secondary", id: "wizard-back", text: t("common.back"), onclick: function () {
          flushSave();
          var p = { step: step - 1 };
          p[key] = input.value;
          persist(p);
          route();
        } }) : null,
        h("button", { type: "button", class: "btn btn--primary", id: "wizard-next", text: t("common.next"), onclick: function () { next(false); } }),
      ]),
      REQUIRED[key] ? null : h("button", { type: "button", class: "btn btn--quiet", id: "wizard-skip", text: t("common.skip"), onclick: function () { next(true); } }),
      saveStatusEl(),
    ]));
    viewEl.appendChild(section);
    autosize(input);
    if (step > 0 || draft[key]) input.focus({ preventScroll: true });
  }

  /* ================= Ayarlar ve veriler ================= */

  function openSettings(opts) {
    opts = opts || {};
    flushSave();
    var dlg = $("settings");
    dlg.textContent = "";

    function counts() {
      var habit = store.getHabit();
      return t("settings.dataCount", { days: Object.keys(store.getDays()).length, habitDays: Object.keys(habit.log).length });
    }

    var mode = motionMode();
    var motion = choiceGroup("motion", t("settings.motionTitle"), [
      { value: "system", label: t("settings.motionSystem") },
      { value: "on", label: t("settings.motionOn") },
      { value: "off", label: t("settings.motionOff") },
    ], mode, { cls: "choices--seg", hideLegend: true });
    var reducedNote = h("p", { class: "hint", text: t("settings.motionSystemReduced"), hidden: !(mode === "system" && reduceMQ.matches) });
    motion.addEventListener("change", function (e) {
      store.setSettings({ motion: e.target.value });
      applyMotion();
      reducedNote.hidden = !(e.target.value === "system" && reduceMQ.matches);
    });

    var sizes = textSizeControl(function (v) {
      var r = document.querySelector(".reader");
      if (r) r.setAttribute("data-size", v);
      var inPage = document.querySelectorAll('input[name="textsize"]');
      inPage.forEach(function (i) { i.checked = i.value === v; });
    }, "textsize-settings");

    // Yedek alma
    var exportMsg = h("div", { "aria-live": "polite" });
    var exportText = h("div", { hidden: true, class: "stack-sm" });
    function doExport() {
      exportMsg.textContent = "";
      if (!store.hasAnyData()) {
        exportMsg.appendChild(h("p", { class: "banner", text: t("settings.exportEmpty") }));
        return;
      }
      var text = store.exportText();
      var file = "kucuk-adimlar-yedek-" + STORE.dateKey() + ".json";
      try {
        var blob = new Blob([text], { type: "application/json" });
        var url = URL.createObjectURL(blob);
        var a = h("a", { href: url, download: file });
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
        exportMsg.appendChild(h("p", { class: "banner", text: t("settings.exportDone", { file: file }) }));
      } catch (e) {
        showExportText();
      }
    }
    function showExportText() {
      var text = store.exportText();
      exportText.textContent = "";
      var ta = h("textarea", { class: "textarea code-out", id: "export-text", readonly: true, rows: 8 });
      ta.value = text;
      var copyMsg = h("p", { class: "hint", "aria-live": "polite" });
      exportText.appendChild(h("p", { class: "hint", text: t("settings.exportCopyHint") }));
      exportText.appendChild(h("label", { class: "label", for: "export-text", text: t("settings.exportTextLabel") }));
      exportText.appendChild(ta);
      exportText.appendChild(h("button", { type: "button", class: "btn btn--secondary", text: t("settings.copy"), onclick: function () {
        function fallback() {
          ta.focus();
          ta.select();
          copyMsg.textContent = t("settings.copyFailed");
        }
        try {
          navigator.clipboard.writeText(text).then(function () { copyMsg.textContent = t("settings.copied"); }, fallback);
        } catch (e) {
          fallback();
        }
      } }));
      exportText.appendChild(copyMsg);
      exportText.hidden = false;
    }

    // Geri yükleme: önce kontrol, sonra değişikliklerin listesi, sonra onay
    var importMsg = h("div", { "aria-live": "polite", class: "stack-sm", id: "import-msg" });
    function showImportError(code, params) {
      importMsg.textContent = "";
      importMsg.appendChild(h("div", { class: "box box--error", role: "alert" }, [
        h("strong", { text: t("settings.importErrorTitle") }),
        h("p", { text: t("settings.importErrors." + code, params) }),
        h("p", { text: t("settings.importErrorKept") }),
      ]));
    }
    function changeList(items, render) {
      var shown = items.slice(0, 8).map(function (x) { return h("li", { text: render(x) }); });
      if (items.length > 8) shown.push(h("li", { text: t("settings.importMore", { n: items.length - 8 }) }));
      return h("ul", { class: "change-list" }, shown);
    }
    function statusText(e) {
      return t("habit.statusShort." + e.status);
    }
    function handleImportText(text) {
      importMsg.textContent = "";
      var res = STORE.parseBackup(text);
      if (!res.ok) return showImportError(res.code, res.params);
      var plan = store.planRestore(res);
      var lines = [];
      if (plan.version < 2) lines.push(h("p", { text: t("settings.importOldVersion") }));
      if (plan.daysAdded.length) lines.push(h("p", { text: t("settings.importDaysAdded", { n: plan.daysAdded.length }) }));
      if (plan.daysChanged.length) {
        lines.push(h("p", { text: t("settings.importDaysChanged", { n: plan.daysChanged.length }) }));
        lines.push(changeList(plan.daysChanged, function (c) {
          return t("settings.importChangeLine", { date: formatShort(c.key), before: clip(c.before.main.text || "—", 40), after: clip(c.after.main.text || "—", 40) });
        }));
      }
      if (plan.daysSame.length) lines.push(h("p", { class: "hint", text: t("settings.importDaysSame", { n: plan.daysSame.length }) }));
      if (plan.plansAdded.length) lines.push(h("p", { text: t("settings.importHabitPlans", { n: plan.plansAdded.length }) }));
      if (plan.logAdded.length) lines.push(h("p", { text: t("settings.importHabitLogAdded", { n: plan.logAdded.length }) }));
      if (plan.logChanged.length) {
        lines.push(h("p", { text: t("settings.importHabitLogChanged", { n: plan.logChanged.length }) }));
        lines.push(changeList(plan.logChanged, function (c) {
          return t("settings.importChangeLine", { date: formatShort(c.key), before: statusText(c.before), after: statusText(c.after) });
        }));
      }
      if (plan.hasHabit && plan.keepsActivePlan) lines.push(h("p", { text: t("settings.importHabitKeepsActive") }));
      if (plan.adoptsActivePlan) lines.push(h("p", { text: t("settings.importHabitAdoptsActive") }));
      if (plan.settings) lines.push(h("p", { text: t("settings.importSettings") }));

      var nothing = !plan.daysAdded.length && !plan.daysChanged.length && !plan.plansAdded.length && !plan.logAdded.length && !plan.logChanged.length && !plan.adoptsActivePlan;
      if (nothing) {
        importMsg.appendChild(h("div", { class: "box box--research" }, [h("p", { text: t("settings.importNothing") })]));
        return;
      }
      lines.push(h("p", { class: "hint", text: t("settings.importKept") }));
      importMsg.appendChild(h("div", { class: "box box--action", id: "import-summary" }, [
        h("strong", { text: t("settings.importCheckTitle") }),
      ].concat(lines).concat([
        h("div", { class: "btn-row" }, [
          h("button", { type: "button", class: "btn btn--secondary", text: t("common.cancel"), onclick: function () { importMsg.textContent = ""; } }),
          h("button", { type: "button", class: "btn btn--primary", id: "import-confirm", text: t("settings.importConfirm"), onclick: function () {
            var ok = store.applyRestore(res);
            importMsg.textContent = "";
            importMsg.appendChild(h("p", { class: ok ? "banner" : "box box--error", role: ok ? "status" : "alert", text: ok ? t("settings.importDone") : t("save.failed") }));
            countEl.textContent = counts();
            applyMotion();
            if (state.view !== "home") route();
          } }),
        ]),
      ])));
      $("import-summary").scrollIntoView({ block: "nearest" });
    }
    var fileInput = h("input", { type: "file", id: "import-file", "aria-label": t("settings.importFileLabel"), onchange: function () {
      var f = fileInput.files && fileInput.files[0];
      fileInput.value = "";
      if (!f) return;
      if (f.size > 2 * 1024 * 1024) return showImportError("tooLarge", {});
      var reader = new FileReader();
      reader.onload = function () { handleImportText(String(reader.result)); };
      reader.onerror = function () { showImportError("readFailed", {}); };
      reader.readAsText(f, "utf-8");
    } });
    var pasteArea = h("div", { class: "stack-sm", hidden: true }, [
      h("div", { class: "field" }, [
        h("label", { for: "import-paste", text: t("settings.importPasteLabel") }),
        h("textarea", { id: "import-paste", class: "textarea code-out", rows: 6 }),
      ]),
      h("button", { type: "button", class: "btn btn--secondary", id: "import-paste-check", text: t("settings.importPasteButton"), onclick: function () {
        handleImportText($("import-paste").value);
      } }),
    ]);

    var countEl = h("p", { class: "hint", id: "data-count", text: counts() });

    dlg.appendChild(h("div", { class: "dialog__body" }, [
      h("div", { class: "dialog__head" }, [
        h("h2", { id: "settings-title", text: t("settings.title") }),
        h("button", { type: "button", class: "btn btn--secondary", id: "close-settings", text: t("settings.close"), onclick: function () { closeDialog(dlg); } }),
      ]),
      h("section", { class: "panel-section" }, [
        h("h3", { text: t("settings.dataTitle") }),
        h("ul", null, S.settings.dataPoints.map(function (p) { return h("li", { text: p }); })),
        countEl,
      ]),
      h("section", { class: "panel-section", id: "export-section" }, [
        h("h3", { text: t("settings.exportTitle") }),
        h("p", { class: "hint", text: t("settings.exportHint") }),
        h("div", { class: "btn-row" }, [
          h("button", { type: "button", class: "btn btn--primary", id: "export-file", text: t("settings.exportButton"), onclick: doExport }),
          h("button", { type: "button", class: "btn btn--secondary", id: "export-show", text: t("settings.exportCopyButton"), onclick: showExportText }),
        ]),
        exportMsg,
        exportText,
      ]),
      h("section", { class: "panel-section" }, [
        h("h3", { text: t("settings.importTitle") }),
        h("p", { class: "hint", text: t("settings.importHint") }),
        h("div", { class: "btn-row" }, [
          h("span", { class: "btn btn--secondary file-pick" }, [t("settings.importFileLabel"), fileInput]),
        ]),
        h("button", { type: "button", class: "btn btn--quiet", id: "import-paste-toggle", text: t("settings.importPasteToggle"), onclick: function () { pasteArea.hidden = !pasteArea.hidden; } }),
        pasteArea,
        importMsg,
      ]),
      h("section", { class: "panel-section" }, [
        h("h3", { text: t("settings.motionTitle") }),
        h("p", { class: "hint", text: t("settings.motionHint") }),
        motion,
        reducedNote,
      ]),
      h("section", { class: "panel-section" }, [
        h("h3", { text: t("settings.textSizeTitle") }),
        sizes,
      ]),
      h("section", { class: "panel-section" }, [
        h("h3", { text: t("settings.resetTitle") }),
        h("p", { class: "hint", text: t("settings.resetHint") }),
        h("button", { type: "button", class: "btn btn--danger-outline", id: "reset-all", text: t("settings.resetButton"), onclick: function () {
          confirmDialog({
            title: t("settings.resetConfirmTitle"),
            body: t("settings.resetConfirmBody", { days: Object.keys(store.getDays()).length }),
            confirm: t("settings.resetConfirm"),
          }).then(function (yes) {
            if (!yes) return;
            toast(store.deleteAll() ? t("settings.resetDone") : t("save.failed"));
            countEl.textContent = counts();
            if (state.view !== "home") route();
          });
        } }),
      ]),
      h("section", { class: "panel-section" }, [
        h("h3", { text: t("settings.aboutTitle") }),
        h("p", { class: "hint", text: t("settings.aboutBody") }),
      ]),
    ]));
    openDialog(dlg);
    if (opts.showExport) {
      showExportText();
      $("export-section").scrollIntoView({ block: "start" });
      $("export-text").focus();
    } else {
      $("close-settings").focus();
    }
  }

  /* ================= Başlangıç ================= */

  /** Ekran klavyesi açıldığında yazılan alanı görünür tut (iOS/Android). */
  function keepVisible(el) {
    var vv = window.visualViewport;
    if (!vv || !el || !el.getBoundingClientRect) return;
    var r = el.getBoundingClientRect();
    if (r.bottom > vv.height - 8 || r.top < 8) el.scrollIntoView({ block: "center", behavior: "auto" });
  }

  function init() {
    viewEl = $("view");
    document.documentElement.lang = S.htmlLang;
    document.querySelectorAll("[data-t]").forEach(function (el) { el.textContent = t(el.getAttribute("data-t")); });
    document.querySelectorAll("[data-t-label]").forEach(function (el) { el.setAttribute("aria-label", t(el.getAttribute("data-t-label"))); });
    applyMotion();
    if (reduceMQ.addEventListener) reduceMQ.addEventListener("change", applyMotion);

    document.querySelectorAll("[data-nav]").forEach(function (b) {
      b.addEventListener("click", function () {
        var target = b.getAttribute("data-nav");
        if (target !== "gunum") state.cameFromBook = null;
        if (target === "aliskanlik") state.habitDay = null;
        store.setSettings({ welcomed: true });
        navigate(target);
      });
    });
    $("open-settings").addEventListener("click", function () { openSettings(); });
    document.querySelector(".skip").addEventListener("click", function (e) {
      e.preventDefault();
      $("main").focus();
    });

    document.addEventListener("focusin", function (e) {
      var el = e.target;
      if (!/^(INPUT|TEXTAREA)$/.test(el.tagName) || el.type === "checkbox" || el.type === "radio") return;
      setTimeout(function () { if (document.activeElement === el) keepVisible(el); }, 350);
    });
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", function () {
        var a = document.activeElement;
        if (a && /^(INPUT|TEXTAREA)$/.test(a.tagName)) keepVisible(a);
      });
    }

    window.addEventListener("hashchange", route);
    window.addEventListener("pagehide", flushSave);
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") flushSave();
      else checkDayChange();
    });
    setInterval(checkDayChange, 60 * 1000);

    // Aynı uygulama başka bir sekmede değiştirildiyse görünümü tazele (yazarken dokunma)
    window.addEventListener("storage", function (e) {
      if (e.key !== store.DAYS_KEY && e.key !== store.HABIT_KEY) return;
      if (isTyping()) return;
      if (state.view === "history" || state.view === "day" || state.view === "habit") route();
    });

    route();
  }

  function start() {
    try {
      init();
      BOOT.ready();
    } catch (err) {
      BOOT.fail(err, "başlatma");
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
