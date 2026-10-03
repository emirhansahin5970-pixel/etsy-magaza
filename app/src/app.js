/*
 * Küçük Adımlar, Daha Net Günler — uygulama mantığı.
 * Üç bölüm: Kitabı Oku (#oku), Günümü Planla (#planla, #gun-YYYY-AA-GG), Geçmiş Günler (#gecmis).
 * Metinler: i18n/tr.js (GX_STRINGS), kitap: content/book.tr.js (GX_BOOK), veri: storage.js (GX_STORE).
 */
(function () {
  "use strict";

  var S = window.GX_STRINGS;
  var BOOK = window.GX_BOOK;
  var ART = window.GX_ART;
  var STORE = window.GX_STORE;

  var storage = null;
  try {
    storage = window.localStorage;
  } catch (e) {
    storage = null;
  }
  var store = STORE.createStore(storage || { getItem: function () { throw 0; }, setItem: function () { throw 0; }, removeItem: function () {} });

  /* ---------------- Yardımcılar ---------------- */

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

  var ICON_INFO = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5" stroke-linecap="round"/></svg>';
  var ICON_CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  var dateFmt = new Intl.DateTimeFormat(S.locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  function formatDate(key) {
    return dateFmt.format(STORE.keyToDate(key));
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

  function scrollToEl(el, block) {
    if (!el) return;
    el.scrollIntoView({ block: block || "start", behavior: motionAllowed() ? "smooth" : "auto" });
  }

  var toastTimer = null;
  function toast(msg) {
    var region = document.getElementById("toast-region");
    region.textContent = "";
    region.appendChild(h("div", { class: "toast", text: msg }));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { region.textContent = ""; }, 3500);
  }

  /* ---------------- Onay penceresi (tarayıcının confirm() penceresi yerine) ---------------- */

  function confirmDialog(opts) {
    var dlg = document.getElementById("confirm");
    return new Promise(function (resolve) {
      var done = false;
      function finish(v) {
        if (done) return;
        done = true;
        if (dlg.open) dlg.close();
        resolve(v);
      }
      var cancelBtn = h("button", { type: "button", class: "btn btn--secondary", text: t("dialog.cancel"), onclick: function () { finish(false); } });
      dlg.textContent = "";
      dlg.appendChild(
        h("div", { class: "dialog__body" }, [
          h("h2", { id: "confirm-title", text: opts.title }),
          h("p", { text: opts.body }),
          h("div", { class: "btn-row" }, [
            cancelBtn,
            h("button", { type: "button", class: "btn btn--danger", text: opts.confirm, onclick: function () { finish(true); } }),
          ]),
        ])
      );
      dlg.addEventListener("close", function () { finish(false); }, { once: true });
      dlg.showModal();
      cancelBtn.focus();
    });
  }

  /* ---------------- Durum ve yönlendirme ---------------- */

  var state = {
    view: null,
    planDate: null,
    planOpenedAsToday: false,
    cameFromBook: null, // { chapterId, blockId }
    focusField: null,
  };

  function navigate(hash) {
    if (location.hash === "#" + hash) route();
    else location.hash = hash;
  }

  function parseHash() {
    var hsh = decodeURIComponent((location.hash || "").replace(/^#/, ""));
    if (hsh === "hosgeldin") return { view: "welcome" };
    if (hsh === "oku") return { view: "contents" };
    if (hsh.indexOf("oku-") === 0) return { view: "chapter", id: hsh.slice(4) };
    if (hsh === "planla") return { view: "plan", date: STORE.dateKey(), today: true };
    if (hsh.indexOf("gun-") === 0 && STORE.isValidDateKey(hsh.slice(4))) return { view: "plan", date: hsh.slice(4), today: hsh.slice(4) === STORE.dateKey() };
    if (hsh === "gecmis") return { view: "history" };
    return null;
  }

  var viewEl, cleanupFns = [];

  function route() {
    var r = parseHash();
    if (!r) r = store.getSettings().welcomed ? { view: "contents" } : { view: "welcome" };

    flushSave();
    cleanupFns.forEach(function (fn) { fn(); });
    cleanupFns = [];

    state.view = r.view;
    viewEl.textContent = "";
    viewEl.classList.remove("is-entering");

    var tab = { contents: "oku", chapter: "oku", plan: "planla", history: "gecmis" }[r.view];
    document.querySelectorAll("[data-nav]").forEach(function (b) {
      if (b.getAttribute("data-nav") === tab) b.setAttribute("aria-current", "page");
      else b.removeAttribute("aria-current");
    });

    if (r.view === "welcome") renderWelcome();
    else if (r.view === "contents") renderContents();
    else if (r.view === "chapter") renderChapter(r.id);
    else if (r.view === "plan") renderPlanner(r.date, r.today);
    else if (r.view === "history") renderHistory();

    if (motionAllowed()) {
      void viewEl.offsetWidth;
      viewEl.classList.add("is-entering");
    }
    if (!state.pendingScroll) window.scrollTo(0, 0);
    state.pendingScroll = false;
  }

  /* ---------------- Karşılama ---------------- */

  function renderWelcome() {
    function start(hash) {
      return function () {
        store.setSettings({ welcomed: true });
        navigate(hash);
      };
    }
    viewEl.appendChild(
      h("section", { class: "welcome", "aria-labelledby": "welcome-title" }, [
        h("div", { class: "welcome__art", html: ART.smallSteps }),
        h("p", { class: "eyebrow", text: t("welcome.eyebrow") }),
        h("h1", { id: "welcome-title", text: t("welcome.title") }),
        h("p", { class: "lead", text: t("welcome.lead") }),
        h("p", { class: "muted", text: t("welcome.body") }),
        h("div", { class: "btn-row" }, [
          h("button", { type: "button", class: "btn btn--primary", id: "start-reading", text: t("welcome.startReading"), onclick: start("oku-baslarken") }),
          h("button", { type: "button", class: "btn btn--secondary", id: "start-planning", text: t("welcome.startPlanning"), onclick: start("planla") }),
        ]),
        h("p", { class: "note" }, [h("span", { html: ICON_INFO }), h("span", { text: t("welcome.privacyNote") })]),
      ])
    );
  }

  /* ---------------- Kitap: içindekiler ---------------- */

  function chapterLabel(ch) {
    return ch.kind === "chapter" ? t("reader.chapterLabel", { n: ch.number }) : "";
  }

  function renderContents() {
    var reading = store.getSettings().reading;
    var resumeCh = reading && BOOK.chapters.filter(function (c) { return c.id === reading.chapterId && c.available; })[0];

    var items = BOOK.chapters.map(function (ch) {
      var meta = h("div", { class: "toc__meta" }, [
        chapterLabel(ch) ? h("span", { text: chapterLabel(ch) }) : null,
        h("span", { text: t("reader.readingTime", { min: ch.minutes }) }),
      ]);
      return h("li", { class: "toc__item" + (ch.available ? "" : " is-locked") }, [
        meta,
        h("span", { class: "toc__title", text: ch.title }),
        ch.available
          ? h("button", { type: "button", class: "btn btn--secondary", "data-open-chapter": ch.id, text: t("reader.startChapter"), onclick: function () { state.resume = "top"; navigate("oku-" + ch.id); } })
          : h("span", { class: "badge", text: t("reader.notInPrototype") }),
      ]);
    });

    viewEl.appendChild(
      h("section", { class: "stack-lg", "aria-labelledby": "toc-title" }, [
        h("div", { class: "stack" }, [
          h("p", { class: "eyebrow", text: BOOK.title }),
          h("h1", { id: "toc-title", text: t("reader.contentsTitle") }),
          h("p", { class: "muted", text: t("reader.contentsLead") }),
        ]),
        resumeCh
          ? h("div", { class: "resume" }, [
              h("p", { text: (chapterLabel(resumeCh) ? chapterLabel(resumeCh) + " · " : "") + resumeCh.title }),
              h("button", { type: "button", class: "btn btn--primary", id: "resume-reading", text: t("reader.continueReading"), onclick: function () {
                state.resume = reading.blockId;
                navigate("oku-" + resumeCh.id);
              } }),
            ])
          : null,
        h("ol", { class: "toc" }, items),
      ])
    );
  }

  /* ---------------- Kitap: bölüm ---------------- */

  function renderRefs(ids) {
    return ids.map(function (id) {
      var s = BOOK.sources[id];
      return s ? s.authors.split(",")[0].replace(/ ve .*/, "") + (s.authors.indexOf(",") > -1 || s.authors.indexOf(" ve ") > -1 ? " vd." : "") + ", " + s.year : id;
    }).join("; ");
  }

  function renderBlock(b) {
    var attrs = { id: "blk-" + b.id, "data-block": b.id };
    switch (b.type) {
      case "h":
        return h("h2", attrs, [b.text]);
      case "p":
        return h("p", attrs, [b.text]);
      case "scene":
        return h("div", Object.assign({ class: "scene" }, attrs), b.paragraphs.map(function (p) { return h("p", { text: p }); }));
      case "figure":
        return h("figure", Object.assign({ class: "figure" }, attrs), [
          h("div", { class: "figure__art", role: "img", "aria-label": b.alt, html: ART[b.art] || "" }),
          h("figcaption", { text: b.caption }),
        ]);
      case "research":
        return h("aside", Object.assign({ class: "box box--research" }, attrs), [
          h("span", { class: "box__label", text: t("reader.researchLabel") }),
          h("p", { text: b.text }),
          b.refs ? h("p", { class: "box__refs", text: renderRefs(b.refs) }) : null,
        ]);
      case "suggestion":
        return h("aside", Object.assign({ class: "box box--suggestion" }, attrs), [
          h("span", { class: "box__label", text: t("reader.suggestionLabel") }),
          h("p", { text: b.text }),
        ]);
      case "exercise":
        return renderExercise(b, attrs);
      case "summary":
        return h("p", Object.assign({ class: "summary" }, attrs), [h("span", { class: "eyebrow", text: t("reader.summaryLabel") }), b.text]);
      default:
        return null;
    }
  }

  function renderExercise(b, attrs) {
    var children = [
      h("span", { class: "exercise__label", text: t("reader.exerciseLabel") }),
      h("h3", { text: b.title }),
      h("ol", null, b.steps.map(function (s) { return h("li", { text: s }); })),
    ];
    if (b.timerSeconds) children.push(renderTimer(b.timerSeconds));
    if (b.planner) {
      children.push(
        h("button", { type: "button", class: "btn btn--primary", "data-to-planner": b.planner, text: t("reader.exerciseToPlanner"), onclick: function () {
          var ch = currentChapterId;
          store.setSettings({ reading: { chapterId: ch, blockId: b.id } });
          state.cameFromBook = { chapterId: ch, blockId: b.id };
          state.focusField = b.planner;
          navigate("planla");
        } })
      );
    }
    return h("section", Object.assign({ class: "exercise", "aria-label": t("reader.exerciseLabel") + ": " + b.title }, attrs), children);
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
      var progress = 1 - left / seconds;
      fill.style.transition = motionAllowed() ? "transform 1s linear" : "none";
      fill.style.transform = "scaleX(" + progress + ")";
      // Ekran okuyucuyu her saniye konuşturmamak için durum yalnızca 30 saniyede bir güncellenir.
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

  var currentChapterId = null;

  function renderChapter(id) {
    var idx = -1;
    BOOK.chapters.forEach(function (c, i) { if (c.id === id) idx = i; });
    var ch = BOOK.chapters[idx];
    if (!ch || !ch.available) return navigate("oku");
    currentChapterId = ch.id;

    var article = h("article", { class: "reader", "aria-labelledby": "chapter-title" }, [
      h("header", { class: "chapter-head" }, [
        h("p", { class: "eyebrow", text: chapterLabel(ch) || BOOK.title }),
        h("h1", { id: "chapter-title", text: ch.title }),
        h("p", { class: "muted", style: "font-family: var(--font-ui); font-size: .95rem", text: t("reader.readingTime", { min: ch.minutes }) }),
      ]),
    ]);
    ch.blocks.forEach(function (b) {
      var el = renderBlock(b);
      if (el) article.appendChild(el);
    });

    if (ch.sources && ch.sources.length) {
      article.appendChild(
        h("section", { class: "sources", "aria-labelledby": "sources-title" }, [
          h("h2", { id: "sources-title", text: t("reader.sourcesTitle") }),
          h("ol", null, ch.sources.map(function (sid) {
            var s = BOOK.sources[sid];
            var url = "https://doi.org/" + s.doi;
            return h("li", null, [
              s.authors + " (" + s.year + "). " + s.title + ". " + s.venue + ". ",
              h("a", { href: url, target: "_blank", rel: "noopener", text: url }),
            ]);
          })),
        ])
      );
    }

    var next = BOOK.chapters[idx + 1];
    var end = h("div", { class: "chapter-end" });
    if (next && next.available) {
      end.appendChild(h("button", { type: "button", class: "btn btn--primary btn--block", text: t("reader.nextChapter", { title: next.title }), onclick: function () { state.resume = "top"; navigate("oku-" + next.id); } }));
    } else if (next) {
      end.appendChild(h("p", { class: "muted", text: t("reader.nextChapterSoon") }));
    }
    end.appendChild(h("button", { type: "button", class: "btn btn--secondary btn--block", text: t("reader.backToContents"), onclick: function () { navigate("oku"); } }));
    article.appendChild(end);
    viewEl.appendChild(article);

    // Kaldığın yeri hatırla: ekranın üst kısmındaki blok kaydedilir.
    var blocks = Array.prototype.slice.call(article.querySelectorAll("[data-block]"));
    var saveTimer = null;
    function remember() {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(function () {
        var top = null;
        for (var i = 0; i < blocks.length; i++) {
          var r = blocks[i].getBoundingClientRect();
          if (r.bottom > 80) { top = blocks[i]; break; }
        }
        if (top) store.setSettings({ reading: { chapterId: ch.id, blockId: top.getAttribute("data-block") } });
      }, 250);
    }
    window.addEventListener("scroll", remember, { passive: true });
    cleanupFns.push(function () { window.removeEventListener("scroll", remember); clearTimeout(saveTimer); });

    // Bölüm yeniden yüklendiyse ya da geri gelindiyse, bu bölümde kalınan yer kullanılır.
    var saved = store.getSettings().reading;
    if (!state.resume && saved && saved.chapterId === ch.id) state.resume = saved.blockId;
    if (state.resume === "top") state.resume = null;
    if (state.resume) {
      var target = document.getElementById("blk-" + state.resume);
      state.resume = null;
      if (target) {
        state.pendingScroll = true;
        requestAnimationFrame(function () { target.scrollIntoView({ block: "start" }); });
      }
    } else {
      store.setSettings({ reading: { chapterId: ch.id, blockId: ch.blocks[0] && ch.blocks[0].id } });
    }
  }

  /* ---------------- Planlayıcı ---------------- */

  var saveTimerId = null;
  var pendingSave = null;

  function flushSave() {
    if (!pendingSave) return;
    clearTimeout(saveTimerId);
    var p = pendingSave;
    pendingSave = null;
    var ok = store.saveDay(p.key, p.day);
    showSaveStatus(ok);
  }

  function showSaveStatus(ok) {
    var el = document.getElementById("save-status");
    if (!el) return;
    el.classList.remove("is-error");
    el.textContent = ok ? t("planner.saved") : t("planner.saveFailed");
    if (!ok) el.classList.add("is-error");
    el.classList.add("is-visible");
    clearTimeout(el._hide);
    if (ok) el._hide = setTimeout(function () { el.classList.remove("is-visible"); }, 1600);
  }

  function field(id, labelKey, opts) {
    opts = opts || {};
    var input = opts.multiline
      ? h("textarea", { id: id, class: "textarea", rows: opts.rows || 4, maxlength: opts.max || 4000, placeholder: opts.placeholder, autocomplete: "off" })
      : h("input", { id: id, class: "input", type: "text", maxlength: opts.max || 4000, placeholder: opts.placeholder, autocomplete: "off", enterkeyhint: "next" });
    return h("div", { class: "field" }, [h("label", { for: id, text: opts.label || t(labelKey) }), input]);
  }

  function checkbox(id, label) {
    return h("label", { class: "check", for: id }, [
      h("input", { type: "checkbox", id: id }),
      h("span", { class: "check__box", "aria-hidden": "true", html: ICON_CHECK }),
      h("span", { class: "visually-hidden", text: label }),
    ]);
  }

  function card(id, titleKey, hintKey, body) {
    return h("section", { class: "card", id: id, "aria-labelledby": id + "-title" }, [
      h("div", { class: "card__head" }, [
        h("h2", { id: id + "-title", text: t(titleKey) }),
        hintKey ? h("p", { class: "card__hint", text: t(hintKey) }) : null,
      ]),
    ].concat(body));
  }

  function renderPlanner(dateKey, openedAsToday) {
    var today = STORE.dateKey();
    var isPast = dateKey < today;
    state.planDate = dateKey;
    state.planOpenedAsToday = !!openedAsToday;

    var head = h("div", { class: "planner-head" }, [
      h("p", { class: "planner-date", id: "plan-date", text: formatDate(dateKey) }),
      h("h1", { text: isPast ? t("planner.titlePast") : t("planner.titleToday") }),
      h("p", { class: "muted", text: t("planner.intro") }),
    ]);

    var banners = h("div", { class: "stack", id: "plan-banners" });
    if (!store.available) banners.appendChild(h("div", { class: "banner", role: "alert", text: t("planner.storageWarning") }));
    if (isPast) {
      banners.appendChild(h("div", { class: "banner banner--info" }, [
        h("p", { text: t("planner.pastBanner") }),
        h("button", { type: "button", class: "btn btn--secondary", text: t("planner.backToToday"), onclick: function () { navigate("planla"); } }),
      ]));
    }
    if (state.cameFromBook) {
      var back = state.cameFromBook;
      banners.appendChild(h("div", { class: "banner banner--info" }, [
        h("button", { type: "button", class: "btn btn--secondary", id: "back-to-book", text: t("planner.backToBook"), onclick: function () {
          state.cameFromBook = null;
          state.resume = back.blockId;
          navigate("oku-" + back.chapterId);
        } }),
      ]));
    }

    var mainTask = h("div", { class: "task", id: "task-main" }, [
      checkbox("f-main-done", t("planner.mainDoneLabel")),
      h("div", { class: "stack", style: "gap:.75rem" }, [
        field("f-main", "planner.mainLabel", { placeholder: t("planner.mainPlaceholder"), max: 300 }),
        field("f-step", "planner.stepLabel", { placeholder: t("planner.stepPlaceholder"), max: 300 }),
      ]),
    ]);

    function extra(n) {
      return h("div", { class: "task", id: "task-extra" + n }, [
        checkbox("f-extra" + n + "-done", t("planner.extraDoneLabel", { n: n })),
        field("f-extra" + n, null, { label: t("planner.extraLabel", { n: n }), placeholder: t("planner.extraPlaceholder"), max: 300 }),
      ]);
    }

    var preview = h("p", { class: "start-preview", id: "start-preview", "aria-live": "polite", hidden: true });

    var form = h("form", { class: "stack-lg", id: "planner-form", novalidate: true, onsubmit: function (e) { e.preventDefault(); } }, [
      card("card-brain", "planner.brainTitle", "planner.brainHint", [
        field("f-brain", null, { label: t("planner.brainLabel"), multiline: true, rows: 5, max: 10000, placeholder: t("planner.brainPlaceholder") }),
      ]),
      card("card-main", "planner.mainTitle", "planner.mainHint", [mainTask]),
      card("card-extras", "planner.extrasTitle", "planner.extrasHint", [extra(1), extra(2)]),
      card("card-start", "planner.startTitle", "planner.startHint", [
        h("div", { class: "start-grid" }, [
          field("f-when", "planner.whenLabel", { placeholder: t("planner.whenPlaceholder"), max: 200 }),
          field("f-where", "planner.whereLabel", { placeholder: t("planner.wherePlaceholder"), max: 200 }),
          field("f-what", "planner.whatLabel", { placeholder: t("planner.whatPlaceholder"), max: 300 }),
        ]),
        preview,
      ]),
      card("card-evening", "planner.eveningTitle", "planner.eveningHint", [
        field("f-worked", "planner.workedLabel", { multiline: true, rows: 3, max: 2000, placeholder: t("planner.workedPlaceholder") }),
        field("f-easier", "planner.easierLabel", { multiline: true, rows: 3, max: 2000, placeholder: t("planner.easierPlaceholder") }),
      ]),
    ]);

    viewEl.appendChild(h("section", { class: "stack-lg", "aria-labelledby": "plan-date" }, [
      head,
      banners,
      form,
      h("p", { class: "save-status", id: "save-status", role: "status", "aria-live": "polite" }),
    ]));

    // Kayıtlı veriyi forma yerleştir
    var day = store.getDay(dateKey);
    var $ = function (id) { return document.getElementById(id); };
    $("f-brain").value = day.brain;
    $("f-main").value = day.main.text;
    $("f-step").value = day.main.step;
    $("f-main-done").checked = day.main.done;
    $("f-extra1").value = day.extras[0].text;
    $("f-extra1-done").checked = day.extras[0].done;
    $("f-extra2").value = day.extras[1].text;
    $("f-extra2-done").checked = day.extras[1].done;
    $("f-when").value = day.start.when;
    $("f-where").value = day.start.where;
    $("f-what").value = day.start.what;
    $("f-worked").value = day.evening.worked;
    $("f-easier").value = day.evening.easier;

    function collect() {
      return {
        brain: $("f-brain").value,
        main: { text: $("f-main").value, step: $("f-step").value, done: $("f-main-done").checked },
        extras: [
          { text: $("f-extra1").value, done: $("f-extra1-done").checked },
          { text: $("f-extra2").value, done: $("f-extra2-done").checked },
        ],
        start: { when: $("f-when").value, where: $("f-where").value, what: $("f-what").value },
        evening: { worked: $("f-worked").value, easier: $("f-easier").value },
      };
    }

    function updateDoneStyles() {
      $("task-main").classList.toggle("is-done", $("f-main-done").checked);
      $("task-extra1").classList.toggle("is-done", $("f-extra1-done").checked);
      $("task-extra2").classList.toggle("is-done", $("f-extra2-done").checked);
    }

    function updatePreview() {
      var w = $("f-when").value.trim(), wh = $("f-where").value.trim(), wt = $("f-what").value.trim();
      if (w && wh && wt) {
        preview.textContent = t("planner.startPreview", { when: w, where: wh, what: wt });
        preview.hidden = false;
      } else {
        preview.hidden = true;
      }
    }

    function autosize(el) {
      if (el.tagName !== "TEXTAREA") return;
      el.style.height = "auto";
      el.style.height = Math.max(el.scrollHeight + 4, 0) + "px";
    }

    // Tarih, form çizildiği anda sabitlenir: gece yarısından sonra yazılanlar yine bu güne gider.
    var key = dateKey;
    function scheduleSave(immediate) {
      pendingSave = { key: key, day: collect() };
      clearTimeout(saveTimerId);
      if (immediate) flushSave();
      else saveTimerId = setTimeout(flushSave, 400);
    }

    form.addEventListener("input", function (e) {
      if (e.target.type === "checkbox") return;
      autosize(e.target);
      updatePreview();
      scheduleSave(false);
    });
    form.addEventListener("change", function (e) {
      if (e.target.type !== "checkbox") return;
      updateDoneStyles();
      var label = e.target.closest(".check");
      if (label && e.target.checked && motionAllowed()) {
        label.classList.remove("is-pop");
        void label.offsetWidth;
        label.classList.add("is-pop");
      }
      scheduleSave(true);
      toast(e.target.checked ? t("planner.doneFeedback") : t("planner.undoneFeedback"));
    });

    // Ekran klavyesi açıldığında yazılan alanı görünür tut
    function keepVisible(el) {
      var vv = window.visualViewport;
      if (!vv) return;
      var r = el.getBoundingClientRect();
      if (r.bottom > vv.height - 8 || r.top < 60) el.scrollIntoView({ block: "center", behavior: "auto" });
    }
    form.addEventListener("focusin", function (e) {
      if (!/^(INPUT|TEXTAREA)$/.test(e.target.tagName) || e.target.type === "checkbox") return;
      var el = e.target;
      setTimeout(function () { if (document.activeElement === el) keepVisible(el); }, 350);
    });
    if (window.visualViewport) {
      var onVV = function () {
        var a = document.activeElement;
        if (a && form.contains(a) && /^(INPUT|TEXTAREA)$/.test(a.tagName)) keepVisible(a);
      };
      window.visualViewport.addEventListener("resize", onVV);
      cleanupFns.push(function () { window.visualViewport.removeEventListener("resize", onVV); });
    }

    updateDoneStyles();
    updatePreview();
    Array.prototype.forEach.call(form.querySelectorAll("textarea"), autosize);

    if (state.focusField === "brain") {
      state.focusField = null;
      var c = $("card-brain");
      c.classList.add("is-highlight");
      state.pendingScroll = true;
      requestAnimationFrame(function () {
        scrollToEl(c, "start");
        $("f-brain").focus({ preventScroll: true });
      });
    }
  }

  /** Uygulama açıkken gün değişirse: eski kayıt korunur, yeni gün için bir uyarı gösterilir. */
  function checkDayChange() {
    if (state.view !== "plan" || !state.planOpenedAsToday) return;
    if (STORE.dateKey() === state.planDate) return;
    if (document.getElementById("new-day-banner")) return;
    flushSave();
    var banners = document.getElementById("plan-banners");
    if (!banners) return;
    banners.insertBefore(h("div", { class: "banner", id: "new-day-banner", role: "status" }, [
      h("p", { text: t("planner.newDayBanner") }),
      h("button", { type: "button", class: "btn btn--primary", text: t("planner.openNewDay"), onclick: function () { navigate("planla"); } }),
    ]), banners.firstChild);
  }

  /* ---------------- Geçmiş günler ---------------- */

  function renderHistory() {
    var days = store.getDays();
    var keys = Object.keys(days).sort().reverse();
    var today = STORE.dateKey();

    var section = h("section", { class: "stack-lg", "aria-labelledby": "history-title" }, [
      h("div", { class: "stack" }, [
        h("h1", { id: "history-title", text: t("history.title") }),
        h("p", { class: "muted", text: t("history.lead") }),
      ]),
    ]);

    if (!keys.length) {
      section.appendChild(h("div", { class: "empty" }, [
        h("p", { text: t("history.empty") }),
        h("button", { type: "button", class: "btn btn--primary", text: t("history.emptyAction"), onclick: function () { navigate("planla"); } }),
      ]));
    } else {
      section.appendChild(h("ul", { class: "days" }, keys.map(function (k) {
        var d = days[k];
        var tasks = [d.main].concat(d.extras).filter(function (x) { return x.text.trim(); });
        var done = tasks.filter(function (x) { return x.done; }).length;
        return h("li", { class: "day", "data-day": k }, [
          h("p", { class: "day__date" }, [formatDate(k), k === today ? h("span", { class: "badge", text: t("history.today") }) : null]),
          h("p", { class: "day__main", text: d.main.text.trim() || t("history.noMain") }),
          tasks.length ? h("p", { class: "day__meta", text: t("history.doneCount", { done: done, total: tasks.length }) }) : null,
          h("div", { class: "btn-row" }, [
            h("button", { type: "button", class: "btn btn--secondary", "data-open-day": k, text: t("history.open"), onclick: function () { navigate("gun-" + k); } }),
            h("button", { type: "button", class: "btn btn--danger-outline", "data-delete-day": k, text: t("history.delete"), onclick: function () {
              confirmDialog({
                title: t("history.deleteTitle"),
                body: t("history.deleteBody", { date: formatDate(k) }),
                confirm: t("history.deleteConfirm"),
              }).then(function (yes) {
                if (!yes) return;
                store.deleteDay(k);
                toast(t("history.deleted", { date: formatDate(k) }));
                route();
              });
            } }),
          ]),
        ]);
      })));
    }
    viewEl.appendChild(section);
  }

  /* ---------------- Ayarlar ve veriler ---------------- */

  function openSettings() {
    flushSave();
    var dlg = document.getElementById("settings");
    dlg.textContent = "";
    var dayCount = Object.keys(store.getDays()).length;

    // Animasyon ayarı
    var mode = motionMode();
    var seg = h("fieldset", { class: "segmented" }, [h("legend", { class: "visually-hidden", text: t("settings.motionTitle") })].concat(
      [["system", "settings.motionSystem"], ["on", "settings.motionOn"], ["off", "settings.motionOff"]].map(function (o) {
        return h("label", null, [
          h("input", { type: "radio", name: "motion", value: o[0], id: "motion-" + o[0], checked: mode === o[0], onchange: function () {
            store.setSettings({ motion: o[0] });
            applyMotion();
            reducedNote.hidden = !(o[0] === "system" && reduceMQ.matches);
          } }),
          h("span", { text: t(o[1]) }),
        ]);
      })
    ));
    var reducedNote = h("p", { class: "card__hint", text: t("settings.motionSystemReduced"), hidden: !(mode === "system" && reduceMQ.matches) });

    // Yedek alma
    var exportMsg = h("div", { "aria-live": "polite" });
    var exportText = h("div", { hidden: true, class: "stack" });
    function doExport() {
      exportMsg.textContent = "";
      if (!Object.keys(store.getDays()).length) {
        exportMsg.appendChild(h("p", { class: "msg msg--ok", text: t("settings.exportEmpty") }));
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
        exportMsg.appendChild(h("p", { class: "msg msg--ok", text: t("settings.exportDone", { file: file }) }));
      } catch (e) {
        showExportText();
      }
    }
    function showExportText() {
      var text = store.exportText();
      exportText.textContent = "";
      var ta = h("textarea", { class: "textarea code-out", id: "export-text", readonly: true, rows: 8, "aria-label": t("settings.exportCopyButton") });
      ta.value = text;
      var copyMsg = h("p", { class: "card__hint", "aria-live": "polite" });
      exportText.appendChild(h("p", { class: "card__hint", text: t("settings.exportCopyHint") }));
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

    // Geri yükleme
    var importMsg = h("div", { "aria-live": "polite", class: "stack" });
    function showImportError(code, params) {
      importMsg.textContent = "";
      importMsg.appendChild(h("div", { class: "msg msg--error", role: "alert" }, [
        h("strong", { text: t("settings.importErrorTitle") }),
        h("p", { text: t("settings.importErrors." + code, params) }),
        h("p", { text: t("settings.importErrorKept") }),
      ]));
    }
    function handleImportText(text) {
      importMsg.textContent = "";
      var res = STORE.parseBackup(text);
      if (!res.ok) return showImportError(res.code, res.params);
      var existing = store.getDays();
      var keys = Object.keys(res.days);
      var overlap = keys.filter(function (k) { return existing[k]; }).length;
      importMsg.appendChild(h("div", { class: "msg msg--check" }, [
        h("strong", { text: t("settings.importCheckTitle") }),
        h("p", { text: t("settings.importSummary", { n: keys.length, overlap: overlap }) }),
        h("div", { class: "btn-row" }, [
          h("button", { type: "button", class: "btn btn--secondary", text: t("dialog.cancel"), onclick: function () { importMsg.textContent = ""; } }),
          h("button", { type: "button", class: "btn btn--primary", id: "import-confirm", text: t("settings.importConfirm"), onclick: function () {
            var ok = store.mergeDays(res.days);
            importMsg.textContent = "";
            importMsg.appendChild(h("p", { class: ok ? "msg msg--ok" : "msg msg--error", text: ok ? t("settings.importDone", { n: keys.length }) : t("planner.saveFailed") }));
            countEl.textContent = t("settings.dayCount", { n: Object.keys(store.getDays()).length });
            if (state.view === "history" || state.view === "plan") route();
          } }),
        ]),
      ]));
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
    var pasteArea = h("div", { class: "stack", hidden: true }, [
      h("div", { class: "field" }, [
        h("label", { for: "import-paste", text: t("settings.importPasteLabel") }),
        h("textarea", { id: "import-paste", class: "textarea code-out", rows: 6 }),
      ]),
      h("button", { type: "button", class: "btn btn--secondary", id: "import-paste-check", text: t("settings.importPasteButton"), onclick: function () {
        handleImportText(document.getElementById("import-paste").value);
      } }),
    ]);

    var countEl = h("p", { class: "card__hint", id: "day-count", text: t("settings.dayCount", { n: dayCount }) });

    dlg.appendChild(h("div", { class: "dialog__body" }, [
      h("div", { class: "dialog__head" }, [
        h("h2", { id: "settings-title", text: t("settings.title") }),
        h("button", { type: "button", class: "btn btn--secondary", id: "close-settings", text: t("settings.close"), onclick: function () { dlg.close(); } }),
      ]),

      h("section", { class: "panel-section" }, [
        h("h3", { text: t("settings.motionTitle") }),
        h("p", { class: "card__hint", text: t("settings.motionHint") }),
        seg,
        reducedNote,
      ]),

      h("section", { class: "panel-section" }, [
        h("h3", { text: t("settings.dataTitle") }),
        h("ul", null, S.settings.dataPoints.map(function (p) { return h("li", { text: p }); })),
        countEl,
      ]),

      h("section", { class: "panel-section" }, [
        h("h3", { text: t("settings.exportTitle") }),
        h("p", { class: "card__hint", text: t("settings.exportHint") }),
        h("div", { class: "btn-row" }, [
          h("button", { type: "button", class: "btn btn--primary", id: "export-file", text: t("settings.exportButton"), onclick: doExport }),
          h("button", { type: "button", class: "btn btn--secondary", id: "export-show", text: t("settings.exportCopyButton"), onclick: showExportText }),
        ]),
        exportMsg,
        exportText,
      ]),

      h("section", { class: "panel-section" }, [
        h("h3", { text: t("settings.importTitle") }),
        h("p", { class: "card__hint", text: t("settings.importHint") }),
        h("div", { class: "btn-row" }, [
          h("span", { class: "btn btn--secondary file-pick" }, [t("settings.importFileLabel"), fileInput]),
          h("button", { type: "button", class: "btn btn--quiet", text: t("settings.importPasteToggle"), onclick: function () { pasteArea.hidden = !pasteArea.hidden; } }),
        ]),
        pasteArea,
        importMsg,
      ]),

      h("section", { class: "panel-section" }, [
        h("h3", { text: t("settings.resetTitle") }),
        h("p", { class: "card__hint", text: t("settings.resetHint") }),
        h("button", { type: "button", class: "btn btn--danger-outline", id: "reset-all", text: t("settings.resetButton"), onclick: function () {
          var n = Object.keys(store.getDays()).length;
          confirmDialog({
            title: t("settings.resetConfirmTitle"),
            body: t("settings.resetConfirmBody", { n: n }),
            confirm: t("settings.resetConfirm"),
          }).then(function (yes) {
            if (!yes) return;
            store.deleteAll();
            countEl.textContent = t("settings.dayCount", { n: 0 });
            toast(t("settings.resetDone"));
            if (state.view === "history" || state.view === "plan") route();
          });
        } }),
      ]),

      h("section", { class: "panel-section" }, [
        h("h3", { text: t("settings.aboutTitle") }),
        h("p", { class: "card__hint", text: t("settings.aboutBody") }),
      ]),
    ]));
    dlg.showModal();
    document.getElementById("close-settings").focus();
  }

  /* ---------------- Başlangıç ---------------- */

  function applyStaticText() {
    document.documentElement.lang = S.htmlLang;
    document.querySelectorAll("[data-t]").forEach(function (el) { el.textContent = t(el.getAttribute("data-t")); });
    document.querySelectorAll("[data-t-label]").forEach(function (el) { el.setAttribute("aria-label", t(el.getAttribute("data-t-label"))); });
  }

  function init() {
    viewEl = document.getElementById("view");
    applyStaticText();
    applyMotion();
    if (reduceMQ.addEventListener) reduceMQ.addEventListener("change", applyMotion);

    document.querySelectorAll("[data-nav]").forEach(function (b) {
      b.addEventListener("click", function () {
        var target = b.getAttribute("data-nav");
        if (target !== "planla") state.cameFromBook = null;
        store.setSettings({ welcomed: true });
        navigate(target);
      });
    });
    document.getElementById("open-settings").addEventListener("click", openSettings);
    document.querySelector(".skip").addEventListener("click", function (e) {
      e.preventDefault();
      document.getElementById("main").focus();
    });

    window.addEventListener("hashchange", route);
    window.addEventListener("pagehide", flushSave);
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") flushSave();
      else checkDayChange();
    });
    setInterval(checkDayChange, 60 * 1000);

    // Aynı uygulama başka bir sekmede değiştirildiyse görünümü tazele (yazılan alan odaktayken dokunma)
    window.addEventListener("storage", function (e) {
      if (e.key !== store.DAYS_KEY) return;
      var a = document.activeElement;
      var typing = a && /^(INPUT|TEXTAREA)$/.test(a.tagName) && viewEl.contains(a);
      if (state.view === "history" || (state.view === "plan" && !typing)) route();
    });

    route();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
