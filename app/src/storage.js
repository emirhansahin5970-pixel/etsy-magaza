/*
 * Veri katmanı: günlük kayıtlar, alışkanlık planı, tercihler, yedek alma ve geri yükleme.
 *
 * Şema geçmişi
 *   1 – Yalnızca günlük kayıtlar (gx.ssc.days.v1) ve tercihler (gx.ssc.settings.v1).
 *   2 – Günlük kayda isteğe bağlı zaman seçimi (time) eklendi; alışkanlık verisi (gx.ssc.habit.v1) eklendi;
 *       yedek paketi alışkanlık ve tercihleri de içeriyor.
 *   3 – Günlük kayda gün değerlendirmesi eklendi: rating (null ya da 1–5 tam sayı) ve ratingNote (metin).
 *       Tercihlere tema (system | light | dark) eklendi ve yedeğe dahil edildi.
 *
 * Geri yüklemede "alan yok" ile "alan boş" farklıdır: eski bir yedekte hiç bulunmayan alan (ör. v2 yedeğinde rating)
 * mevcut veriyi SİLMEZ; yeni yedekte açıkça boş/null olan alan ise boş olarak geri yüklenir (bkz. absentFields).
 *
 * Geçiş (1 → 2): Günlük kayıtların anahtarı ve biçimi değişmedi. Eski kayıtlar okunurken eksik alanlara
 * varsayılan değer atanır (migrateDay). Eski "start.what" metni silinmez; arayüz bu metni gösterir ve
 * kullanıcıya ilk küçük adımla eşitleme seçeneği sunar. Hiçbir eski veri otomatik olarak silinmez.
 *
 * Kayıtlar tarih anahtarıyla (YYYY-AA-GG, yerel saat) tutulur; gün değişince eski kayıtların üzerine yazılmaz.
 */
(function (root) {
  "use strict";

  var APP_ID = "genix-small-steps-clear-days";
  var SCHEMA_VERSION = 3;
  var SUPPORTED_BACKUP_VERSIONS = [1, 2, 3];

  var DAYS_KEY = "gx.ssc.days.v1"; // şema 2'de de aynı anahtar: eski kayıtlar yerinde okunur
  var SETTINGS_KEY = "gx.ssc.settings.v1";
  var HABIT_KEY = "gx.ssc.habit.v1";
  var META_KEY = "gx.ssc.meta";
  var SNAPSHOT_KEY = "gx.ssc.beforeRestore";

  var MAX_IMPORT_BYTES = 2 * 1024 * 1024;
  var MAX_TEXT = 4000;
  var MAX_BRAIN = 10000;

  var TIME_BUDGETS = ["", "5", "15", "30", "custom"];
  var HABIT_STATUSES = ["done", "smaller", "skipped"];
  var TEXT_SIZES = ["standard", "large", "larger"];
  var THEMES = ["system", "light", "dark"];
  // Eski yedeklerde bulunmayabilen gün alanları: yoksa geri yüklemede mevcut değer korunur
  var OPTIONAL_DAY_FIELDS = ["time", "rating", "ratingNote"];
  var MOTION_MODES = ["system", "on", "off"];

  var DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
  var ID_RE = /^[a-z0-9_-]{1,40}$/i;

  function pad(n) {
    return (n < 10 ? "0" : "") + n;
  }

  /** Yerel saate göre tarih anahtarı. toISOString() UTC kullandığı için gece yarısı yanlış güne yazabilir. */
  function dateKey(d) {
    d = d || new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function isValidDateKey(key) {
    var m = DATE_RE.exec(key);
    if (!m) return false;
    var y = +m[1], mo = +m[2], da = +m[3];
    if (y < 2000 || y > 2100) return false;
    var d = new Date(y, mo - 1, da);
    return d.getFullYear() === y && d.getMonth() === mo - 1 && d.getDate() === da;
  }

  function keyToDate(key) {
    var m = DATE_RE.exec(key);
    return new Date(+m[1], +m[2] - 1, +m[3]);
  }

  function addDays(key, n) {
    var d = keyToDate(key);
    d.setDate(d.getDate() + n);
    return dateKey(d);
  }

  function newId() {
    return "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  /* ---------------- Günlük kayıt ---------------- */

  function emptyDay() {
    return {
      brain: "",
      main: { text: "", step: "", done: false },
      extras: [
        { text: "", done: false },
        { text: "", done: false },
      ],
      start: { when: "", where: "", what: "" }, // what: şema 1'den kalan alan, yalnızca eski kayıtlarda dolu olabilir
      time: { budget: "", custom: "" },
      evening: { worked: "", easier: "" },
      rating: null, // gün değerlendirmesi: null ya da 1–5; varsayılan seçim yok
      ratingNote: "",
      updatedAt: null,
    };
  }

  function isDayEmpty(day) {
    if (!day) return true;
    var texts = [
      day.brain, day.main.text, day.main.step,
      day.extras[0].text, day.extras[1].text,
      day.start.when, day.start.where, day.start.what,
      day.time.budget, day.time.custom,
      day.evening.worked, day.evening.easier, day.ratingNote,
    ];
    if (day.rating !== null && day.rating !== undefined) return false; // yalnızca puan girilmiş gün de geçerli kayıttır
    for (var i = 0; i < texts.length; i++) if (texts[i] && String(texts[i]).trim()) return false;
    return !(day.main.done || day.extras[0].done || day.extras[1].done);
  }

  /** İçerik karşılaştırması (güncellenme zamanı hariç): geri yüklemede "aynı" ile "değişecek"i ayırmak için. */
  function sameDay(a, b) {
    var x = JSON.parse(JSON.stringify(a)), y = JSON.parse(JSON.stringify(b));
    x.updatedAt = y.updatedAt = null;
    return JSON.stringify(x) === JSON.stringify(y);
  }

  /* ---------------- Doğrulama yardımcıları ---------------- */

  function ValidationError(code, params) {
    this.code = code;
    this.params = params || {};
  }

  function checkObject(v, key, field) {
    if (!v || typeof v !== "object" || Array.isArray(v)) throw new ValidationError("badField", { key: key, field: field });
    return v;
  }
  function optObject(v, key, field) {
    return v === undefined || v === null ? {} : checkObject(v, key, field);
  }
  function checkText(v, key, field, max) {
    if (v === undefined || v === null) return "";
    if (typeof v !== "string" || v.length > (max || MAX_TEXT)) throw new ValidationError("badField", { key: key, field: field });
    return v;
  }
  function checkBool(v, key, field) {
    if (v === undefined || v === null) return false;
    if (typeof v !== "boolean") throw new ValidationError("badField", { key: key, field: field });
    return v;
  }
  function checkEnum(v, list, key, field) {
    if (v === undefined || v === null) return list[0];
    if (list.indexOf(v) < 0) throw new ValidationError("badField", { key: key, field: field });
    return v;
  }
  function checkStamp(v, key, field) {
    if (v === undefined || v === null) return null;
    if (typeof v !== "string" || v.length > 40) throw new ValidationError("badField", { key: key, field: field });
    return v;
  }

  /**
   * Bir günü doğrular ve şema 2 biçimine getirir (geçiş burada yapılır).
   * Bilinmeyen alanlar atılır; tür hatasında ValidationError fırlatır.
   */
  function migrateDay(raw, key) {
    checkObject(raw, key, "gün");
    var main = optObject(raw.main, key, "main");
    var start = optObject(raw.start, key, "start");
    var time = optObject(raw.time, key, "time"); // şema 1'de yok → boş
    var evening = optObject(raw.evening, key, "evening");
    var extras = raw.extras === undefined ? [] : raw.extras;
    if (!Array.isArray(extras) || extras.length > 2) throw new ValidationError("badField", { key: key, field: "extras" });

    var day = emptyDay();
    day.brain = checkText(raw.brain, key, "brain", MAX_BRAIN);
    day.main.text = checkText(main.text, key, "main.text");
    day.main.step = checkText(main.step, key, "main.step");
    day.main.done = checkBool(main.done, key, "main.done");
    for (var i = 0; i < extras.length; i++) {
      var ex = checkObject(extras[i], key, "extras");
      day.extras[i].text = checkText(ex.text, key, "extras.text");
      day.extras[i].done = checkBool(ex.done, key, "extras.done");
    }
    day.start.when = checkText(start.when, key, "start.when");
    day.start.where = checkText(start.where, key, "start.where");
    day.start.what = checkText(start.what, key, "start.what");
    day.time.budget = checkEnum(time.budget === undefined ? "" : time.budget, TIME_BUDGETS, key, "time.budget");
    day.time.custom = checkText(time.custom, key, "time.custom", 40);
    day.evening.worked = checkText(evening.worked, key, "evening.worked");
    day.evening.easier = checkText(evening.easier, key, "evening.easier");
    if (raw.rating !== undefined && raw.rating !== null) {
      if (typeof raw.rating !== "number" || raw.rating % 1 !== 0 || raw.rating < 1 || raw.rating > 5) throw new ValidationError("badField", { key: key, field: "rating" });
      day.rating = raw.rating;
    }
    day.ratingNote = checkText(raw.ratingNote, key, "ratingNote", 2000);
    day.updatedAt = checkStamp(raw.updatedAt, key, "updatedAt");
    return day;
  }

  /** Ham kayıtta hiç bulunmayan isteğe bağlı alanlar (eski şema). Geri yüklemede bunlar mevcut veriyi ezmez. */
  function absentDayFields(raw) {
    var out = [];
    for (var i = 0; i < OPTIONAL_DAY_FIELDS.length; i++) {
      if (!raw || !Object.prototype.hasOwnProperty.call(raw, OPTIONAL_DAY_FIELDS[i])) out.push(OPTIONAL_DAY_FIELDS[i]);
    }
    return out;
  }

  /** Yedekteki günü, yedekte bulunmayan alanlar için mevcut değerle tamamlar. */
  function effectiveIncomingDay(current, incoming, absent) {
    if (!current || !absent || !absent.length) return incoming;
    var d = JSON.parse(JSON.stringify(incoming));
    absent.forEach(function (f) { d[f] = JSON.parse(JSON.stringify(current[f])); });
    return d;
  }

  /* ---------------- Alışkanlık ---------------- */

  var PLAN_FIELDS = ["goal", "start", "anchor", "place", "ease", "smaller"];

  function emptyHabit() {
    return { activePlanId: null, plans: {}, log: {}, reviews: {}, draft: null };
  }

  function emptyPlanFields() {
    return { goal: "", start: "", anchor: "", place: "", ease: "", smaller: "" };
  }

  function migratePlan(raw, id) {
    checkObject(raw, id, "plan");
    if (!ID_RE.test(id)) throw new ValidationError("badField", { key: id, field: "plan.id" });
    var p = { id: id };
    PLAN_FIELDS.forEach(function (f) { p[f] = checkText(raw[f], id, "plan." + f, 500); });
    if (!p.goal.trim()) throw new ValidationError("badField", { key: id, field: "plan.goal" });
    p.createdAt = checkStamp(raw.createdAt, id, "plan.createdAt");
    p.updatedAt = checkStamp(raw.updatedAt, id, "plan.updatedAt");
    p.archivedAt = checkStamp(raw.archivedAt, id, "plan.archivedAt");
    return p;
  }

  function migrateLogEntry(raw, key, plans) {
    checkObject(raw, key, "alışkanlık kaydı");
    var e = {
      status: checkEnum(raw.status, HABIT_STATUSES, key, "habit.status"),
      note: checkText(raw.note, key, "habit.note", 2000),
      planId: checkText(raw.planId, key, "habit.planId", 40),
      updatedAt: checkStamp(raw.updatedAt, key, "habit.updatedAt"),
    };
    if (raw.status === undefined) throw new ValidationError("badField", { key: key, field: "habit.status" });
    if (!plans[e.planId]) throw new ValidationError("badField", { key: key, field: "habit.planId" });
    return e;
  }

  function migrateHabit(raw) {
    var h = emptyHabit();
    if (raw === undefined || raw === null) return h;
    checkObject(raw, "alışkanlık", "habit");
    var plans = optObject(raw.plans, "alışkanlık", "plans");
    Object.keys(plans).forEach(function (id) { h.plans[id] = migratePlan(plans[id], id); });
    var log = optObject(raw.log, "alışkanlık", "log");
    Object.keys(log).forEach(function (k) {
      if (!isValidDateKey(k)) throw new ValidationError("badDate", { key: k.slice(0, 40) });
      h.log[k] = migrateLogEntry(log[k], k, h.plans);
    });
    var reviews = optObject(raw.reviews, "alışkanlık", "reviews");
    Object.keys(reviews).forEach(function (id) {
      if (!h.plans[id]) throw new ValidationError("badField", { key: id, field: "reviews" });
      var r = checkObject(reviews[id], id, "reviews");
      h.reviews[id] = {
        fit: checkText(r.fit, id, "reviews.fit", 2000),
        context: checkText(r.context, id, "reviews.context", 2000),
        shrink: checkText(r.shrink, id, "reviews.shrink", 2000),
        updatedAt: checkStamp(r.updatedAt, id, "reviews.updatedAt"),
      };
    });
    if (raw.activePlanId !== undefined && raw.activePlanId !== null) {
      if (typeof raw.activePlanId !== "string" || !h.plans[raw.activePlanId]) throw new ValidationError("badField", { key: "alışkanlık", field: "activePlanId" });
      h.activePlanId = raw.activePlanId;
    }
    if (raw.draft !== undefined && raw.draft !== null) {
      var d = checkObject(raw.draft, "taslak", "draft");
      var draft = emptyPlanFields();
      PLAN_FIELDS.forEach(function (f) { draft[f] = checkText(d[f], "taslak", "draft." + f, 500); });
      draft.step = typeof d.step === "number" && d.step >= 0 && d.step < 10 ? Math.floor(d.step) : 0;
      draft.editingId = typeof d.editingId === "string" && h.plans[d.editingId] ? d.editingId : null;
      h.draft = draft;
    }
    return h;
  }

  function norm(s) {
    return String(s || "").trim().replace(/\s+/g, " ").toLocaleLowerCase("tr");
  }

  /**
   * Alışkanlık planını oluşturur ya da düzenler (yan etkisiz; yeni nesne döner).
   * Hedef (goal) değiştiyse ve eski planın kayıtları varsa: eski plan arşivlenir, yeni bir plan açılır.
   * Böylece geçmiş kayıtlar yeni hedefe aitmiş gibi görünmez.
   */
  function applyPlanEdit(habit, fields, editingId, nowIso) {
    var h = JSON.parse(JSON.stringify(habit));
    var now = nowIso || new Date().toISOString();
    var clean = emptyPlanFields();
    PLAN_FIELDS.forEach(function (f) { clean[f] = String(fields[f] || "").trim(); });
    var old = editingId ? h.plans[editingId] : null;

    if (old) {
      var hasLogs = Object.keys(h.log).some(function (k) { return h.log[k].planId === old.id; });
      if (norm(old.goal) !== norm(clean.goal) && hasLogs) {
        old.archivedAt = now;
        var id = newId();
        h.plans[id] = Object.assign({ id: id, createdAt: now, updatedAt: now, archivedAt: null }, clean);
        h.activePlanId = id;
        h.draft = null;
        return { habit: h, versioned: true, planId: id };
      }
      PLAN_FIELDS.forEach(function (f) { old[f] = clean[f]; });
      old.updatedAt = now;
      h.draft = null;
      return { habit: h, versioned: false, planId: old.id };
    }

    if (h.activePlanId && h.plans[h.activePlanId]) h.plans[h.activePlanId].archivedAt = now;
    var nid = newId();
    h.plans[nid] = Object.assign({ id: nid, createdAt: now, updatedAt: now, archivedAt: null }, clean);
    h.activePlanId = nid;
    h.draft = null;
    return { habit: h, versioned: false, planId: nid };
  }

  function isHabitEmpty(h) {
    return !h || (!Object.keys(h.plans).length && !Object.keys(h.log).length);
  }

  /* ---------------- Tercihler ---------------- */

  function migrateSettings(raw) {
    var s = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
    var out = {};
    if (MOTION_MODES.indexOf(s.motion) >= 0) out.motion = s.motion;
    if (TEXT_SIZES.indexOf(s.textSize) >= 0) out.textSize = s.textSize;
    if (THEMES.indexOf(s.theme) >= 0) out.theme = s.theme;
    if (s.calendarOpen === true) out.calendarOpen = true;
    if (s.welcomed === true) out.welcomed = true;
    if (typeof s.lang === "string" && /^[a-z]{2}$/.test(s.lang)) out.lang = s.lang; // arayüz dili: yalnızca bu cihazda, yedeğe girmez
    if (s.reading && typeof s.reading === "object" && typeof s.reading.chapterId === "string") {
      out.reading = { chapterId: s.reading.chapterId.slice(0, 40), blockId: typeof s.reading.blockId === "string" ? s.reading.blockId.slice(0, 40) : null };
    }
    if (typeof s.lastPlace === "string" && s.lastPlace.length < 60) out.lastPlace = s.lastPlace;
    return out;
  }

  /* ---------------- Yedek: ayrıştırma ve doğrulama (yan etkisiz) ---------------- */

  /**
   * Yedek metnini ayrıştırır. Sürüm 1 (yalnızca günler) ve sürüm 2 (günler + alışkanlık + tercihler) kabul edilir.
   * Başarılıysa { ok: true, version, days, habit|null, settings|null }, değilse { ok: false, code, params }.
   */
  function parseBackup(text) {
    try {
      if (typeof text !== "string") throw new ValidationError("notJson");
      if (text.length > MAX_IMPORT_BYTES) throw new ValidationError("tooLarge");
      var data;
      try {
        data = JSON.parse(text.replace(/^﻿/, ""));
      } catch (e) {
        throw new ValidationError("notJson");
      }
      if (!data || typeof data !== "object" || Array.isArray(data)) throw new ValidationError("notJson");
      if (data.app !== APP_ID) throw new ValidationError("wrongApp");
      if (SUPPORTED_BACKUP_VERSIONS.indexOf(data.version) < 0) throw new ValidationError("wrongVersion");
      if (data.days === undefined && data.version === 2) data.days = {};
      if (!data.days || typeof data.days !== "object" || Array.isArray(data.days)) throw new ValidationError("badDays");

      var days = {};
      var absent = {};
      Object.keys(data.days).forEach(function (k) {
        if (!isValidDateKey(k)) throw new ValidationError("badDate", { key: k.slice(0, 40) });
        var day = migrateDay(data.days[k], k);
        if (!isDayEmpty(day)) {
          days[k] = day;
          var a = absentDayFields(data.days[k]);
          if (a.length) absent[k] = a;
        }
      });

      var habit = null, settings = null;
      if (data.version >= 2) {
        habit = migrateHabit(data.habit);
        habit.draft = null; // yarım kalmış kurulum taslağı geri yüklenmez
        if (isHabitEmpty(habit)) habit = null;
        settings = data.settings ? migrateSettings(data.settings) : null;
        if (settings) {
          // Yalnızca görünüm tercihleri taşınır; okuma konumu cihaza özeldir. Yedekte olmayan tercih değiştirilmez.
          settings = { motion: settings.motion, textSize: settings.textSize, theme: settings.theme };
          if (!settings.motion && !settings.textSize && !settings.theme) settings = null;
        }
      }
      if (!Object.keys(days).length && !habit) throw new ValidationError("empty");
      return { ok: true, version: data.version, days: days, absentFields: absent, habit: habit, settings: settings };
    } catch (err) {
      if (err instanceof ValidationError) return { ok: false, code: err.code, params: err.params };
      return { ok: false, code: "notJson", params: {} };
    }
  }

  function buildBackup(days, habit, settings, now) {
    var h = habit ? JSON.parse(JSON.stringify(habit)) : emptyHabit();
    h.draft = null;
    return JSON.stringify(
      {
        app: APP_ID,
        version: SCHEMA_VERSION,
        exportedAt: (now || new Date()).toISOString(),
        days: days,
        habit: h,
        settings: { motion: settings && settings.motion, textSize: settings && settings.textSize, theme: settings && settings.theme },
      },
      null,
      2
    );
  }

  /**
   * Geri yüklemenin etkisini önceden hesaplar (hiçbir şey yazmaz). Arayüz bunu onaydan önce gösterir.
   */
  function planRestore(current, incoming) {
    var r = {
      version: incoming.version,
      daysAdded: [], daysChanged: [], daysSame: [],
      plansAdded: [], plansChanged: [], reviewsChanged: [], logAdded: [], logChanged: [],
      keepsActivePlan: false, adoptsActivePlan: false,
      settings: incoming.settings,
      hasHabit: !!incoming.habit,
    };
    var absent = incoming.absentFields || {};
    Object.keys(incoming.days).sort().forEach(function (k) {
      var cur = current.days[k];
      var inc = effectiveIncomingDay(cur, incoming.days[k], absent[k]);
      if (!cur) r.daysAdded.push(k);
      else if (sameDay(cur, inc)) r.daysSame.push(k);
      else r.daysChanged.push({ key: k, before: cur, after: inc });
    });
    if (incoming.habit) {
      var ch = current.habit, ih = incoming.habit;
      Object.keys(ih.plans).forEach(function (id) {
        var cp = ch.plans[id], ip = ih.plans[id];
        if (!cp) { r.plansAdded.push(ip); return; }
        // Aynı kimlikli plan değişecekse alan alan eski ve yeni değer
        var diffs = [];
        PLAN_FIELDS.forEach(function (f) { if ((cp[f] || "") !== (ip[f] || "")) diffs.push({ field: f, before: cp[f] || "", after: ip[f] || "" }); });
        if (!!cp.archivedAt !== !!ip.archivedAt && id !== ch.activePlanId) diffs.push({ field: "archived", before: !!cp.archivedAt, after: !!ip.archivedAt });
        if (diffs.length) r.plansChanged.push({ id: id, goal: cp.goal, diffs: diffs });
      });
      Object.keys(ih.reviews).forEach(function (id) {
        var cr = ch.reviews[id], ir = ih.reviews[id];
        var diffs = [];
        ["fit", "context", "shrink"].forEach(function (f) {
          var b = cr ? cr[f] || "" : "", a = ir[f] || "";
          if (b !== a) diffs.push({ field: f, before: b, after: a });
        });
        if (diffs.length) r.reviewsChanged.push({ id: id, goal: (ch.plans[id] || ih.plans[id] || {}).goal || "", diffs: diffs });
      });
      Object.keys(ih.log).sort().forEach(function (k) {
        var cur = ch.log[k], inc = ih.log[k];
        if (!cur) r.logAdded.push(k);
        else if (cur.status !== inc.status || cur.note !== inc.note || cur.planId !== inc.planId) r.logChanged.push({ key: k, before: cur, after: inc });
      });
      if (ch.activePlanId) r.keepsActivePlan = true;
      else if (ih.activePlanId) r.adoptsActivePlan = true;
    }
    return r;
  }

  /** Geri yükleme birleştirmesi: yedekteki aynı tarihli kayıtlar kullanılır, diğerleri korunur. */
  function mergeRestore(current, incoming) {
    var days = JSON.parse(JSON.stringify(current.days));
    var absent = incoming.absentFields || {};
    Object.keys(incoming.days).forEach(function (k) { days[k] = effectiveIncomingDay(current.days[k], incoming.days[k], absent[k]); });
    var habit = JSON.parse(JSON.stringify(current.habit));
    if (incoming.habit) {
      var ih = incoming.habit;
      Object.keys(ih.plans).forEach(function (id) {
        var p = JSON.parse(JSON.stringify(ih.plans[id]));
        // Bu cihazda aktif olan plan geri yüklemeyle arşive düşmesin
        if (id === habit.activePlanId) p.archivedAt = null;
        habit.plans[id] = p;
      });
      Object.keys(ih.log).forEach(function (k) { habit.log[k] = ih.log[k]; });
      Object.keys(ih.reviews).forEach(function (id) { habit.reviews[id] = ih.reviews[id]; });
      if (!habit.activePlanId && ih.activePlanId) habit.activePlanId = ih.activePlanId;
    }
    return { days: days, habit: habit };
  }

  /* ---------------- Tarayıcı deposu ---------------- */

  function createStore(storage) {
    var available = true;
    try {
      var probe = "gx.ssc.probe";
      storage.setItem(probe, "1");
      storage.removeItem(probe);
    } catch (e) {
      available = false;
    }

    // Yazma başarısız olursa son içerik burada tutulur; yedek alma bu içeriği kullanır, böylece yazılanlar kaybolmaz.
    var unsavedDays = null;
    var unsavedHabit = null;

    function readJSON(key, fallback) {
      try {
        var raw = storage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        return fallback;
      }
    }

    function writeJSON(key, value) {
      if (!available) return false;
      try {
        storage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        return false;
      }
    }

    function loadDays() {
      if (unsavedDays) return JSON.parse(JSON.stringify(unsavedDays));
      var raw = readJSON(DAYS_KEY, {});
      var out = {};
      if (!raw || typeof raw !== "object") return out;
      Object.keys(raw).forEach(function (k) {
        if (!isValidDateKey(k)) return;
        try {
          out[k] = migrateDay(raw[k], k);
        } catch (e) {
          /* Bozuk tek bir gün diğerlerini engellemesin; depoda olduğu gibi kalır ama okunmaz. */
        }
      });
      return out;
    }

    function writeDays(days) {
      var ok = writeJSON(DAYS_KEY, days);
      unsavedDays = ok ? null : JSON.parse(JSON.stringify(days));
      return ok;
    }

    function loadHabit() {
      if (unsavedHabit) return JSON.parse(JSON.stringify(unsavedHabit));
      try {
        return migrateHabit(readJSON(HABIT_KEY, null));
      } catch (e) {
        return emptyHabit();
      }
    }

    function writeHabit(h) {
      var ok = writeJSON(HABIT_KEY, h);
      unsavedHabit = ok ? null : JSON.parse(JSON.stringify(h));
      return ok;
    }

    // Şema sürümünü işaretle (veri dönüştürmesi okuma sırasında yapılır, bkz. migrateDay)
    if (available) {
      var meta = readJSON(META_KEY, {});
      if (!meta || meta.schema !== SCHEMA_VERSION) writeJSON(META_KEY, { schema: SCHEMA_VERSION, migratedFrom: meta && meta.schema ? meta.schema : 1 });
    }

    var api = {
      available: available,
      DAYS_KEY: DAYS_KEY,
      HABIT_KEY: HABIT_KEY,

      hasUnsaved: function () { return !!(unsavedDays || unsavedHabit); },

      getDays: loadDays,
      getDay: function (key) {
        var days = loadDays();
        return days[key] ? days[key] : emptyDay();
      },

      /** Yalnızca verilen tarihin kaydını yazar; diğer günlere dokunmaz. Boş gün kaydedilmez. */
      saveDay: function (key, day) {
        if (!isValidDateKey(key)) return false;
        // Henüz yaşanmamış güne gün değerlendirmesi kaydedilmez (arayüz de engeller)
        if (key > dateKey() && (day.rating !== null && day.rating !== undefined)) return false;
        var days = loadDays();
        if (isDayEmpty(day)) {
          delete days[key];
        } else {
          day.updatedAt = new Date().toISOString();
          try {
            days[key] = migrateDay(day, key);
          } catch (e) {
            return false;
          }
        }
        return writeDays(days);
      },
      deleteDay: function (key) {
        var days = loadDays();
        delete days[key];
        return writeDays(days);
      },

      getHabit: loadHabit,
      saveHabit: function (h) {
        try {
          h = migrateHabit(h);
        } catch (e) {
          return false;
        }
        return writeHabit(h);
      },

      deleteAll: function () {
        var a = writeDays({});
        var b = writeHabit(emptyHabit());
        return a && b;
      },

      planRestore: function (incoming) {
        return planRestore({ days: loadDays(), habit: loadHabit() }, incoming);
      },

      /** Geri yükleme: önce mevcut verinin kopyası saklanır, sonra birleştirilir. */
      applyRestore: function (incoming) {
        var current = { days: loadDays(), habit: loadHabit() };
        writeJSON(SNAPSHOT_KEY, { at: new Date().toISOString(), days: current.days, habit: current.habit });
        var merged = mergeRestore(current, incoming);
        var ok = writeDays(merged.days) && writeHabit(merged.habit);
        if (ok && incoming.settings) {
          var patch = {};
          if (incoming.settings.motion) patch.motion = incoming.settings.motion;
          if (incoming.settings.textSize) patch.textSize = incoming.settings.textSize;
          if (incoming.settings.theme) patch.theme = incoming.settings.theme;
          api.setSettings(patch);
        }
        return ok;
      },

      exportText: function () {
        return buildBackup(loadDays(), loadHabit(), api.getSettings());
      },
      hasAnyData: function () {
        return Object.keys(loadDays()).length > 0 || !isHabitEmpty(loadHabit());
      },

      getSettings: function () {
        return migrateSettings(readJSON(SETTINGS_KEY, {}));
      },
      setSettings: function (patch) {
        var s = readJSON(SETTINGS_KEY, {});
        if (!s || typeof s !== "object") s = {};
        Object.keys(patch).forEach(function (k) { s[k] = patch[k]; });
        return writeJSON(SETTINGS_KEY, s);
      },
    };
    return api;
  }

  /**
   * Ay takvimi: haftalar pazartesi başlar. Dönen dizi 7'nin katıdır; ay dışındaki hücreler null.
   * month: 0–11
   */
  function monthGrid(year, month) {
    var first = new Date(year, month, 1);
    var lead = (first.getDay() + 6) % 7; // pazartesi = 0
    var count = new Date(year, month + 1, 0).getDate();
    var cells = [];
    for (var i = 0; i < lead; i++) cells.push(null);
    for (var d = 1; d <= count; d++) cells.push(dateKey(new Date(year, month, d)));
    while (cells.length % 7) cells.push(null);
    return cells;
  }

  var api = {
    APP_ID: APP_ID,
    THEMES: THEMES,
    monthGrid: monthGrid,
    SCHEMA_VERSION: SCHEMA_VERSION,
    TIME_BUDGETS: TIME_BUDGETS,
    HABIT_STATUSES: HABIT_STATUSES,
    PLAN_FIELDS: PLAN_FIELDS,
    dateKey: dateKey,
    keyToDate: keyToDate,
    addDays: addDays,
    isValidDateKey: isValidDateKey,
    newId: newId,
    emptyDay: emptyDay,
    isDayEmpty: isDayEmpty,
    migrateDay: migrateDay,
    emptyHabit: emptyHabit,
    emptyPlanFields: emptyPlanFields,
    migrateHabit: migrateHabit,
    applyPlanEdit: applyPlanEdit,
    parseBackup: parseBackup,
    buildBackup: buildBackup,
    planRestore: planRestore,
    mergeRestore: mergeRestore,
    createStore: createStore,
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.GX_STORE = api;
})(typeof window !== "undefined" ? window : this);
