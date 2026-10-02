/*
 * Veri katmanı: günlük kayıtlar, ayarlar, yedek alma ve geri yükleme.
 * Kayıtlar tarayıcının localStorage alanında, tarih anahtarıyla (YYYY-AA-GG, yerel saat) tutulur.
 * Her gün ayrı bir anahtar olduğu için gün değişince eski kayıtların üzerine yazılmaz.
 */
(function (root) {
  "use strict";

  var APP_ID = "genix-small-steps-clear-days";
  var SCHEMA_VERSION = 1;
  var DAYS_KEY = "gx.ssc.days.v1";
  var SETTINGS_KEY = "gx.ssc.settings.v1";
  var BACKUP_KEY = "gx.ssc.days.beforeRestore";
  var MAX_IMPORT_BYTES = 2 * 1024 * 1024;
  var MAX_TEXT = 4000;
  var MAX_BRAIN = 10000;

  var DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

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

  function emptyDay() {
    return {
      brain: "",
      main: { text: "", step: "", done: false },
      extras: [
        { text: "", done: false },
        { text: "", done: false },
      ],
      start: { when: "", where: "", what: "" },
      evening: { worked: "", easier: "" },
      updatedAt: null,
    };
  }

  function isDayEmpty(day) {
    if (!day) return true;
    var texts = [
      day.brain, day.main.text, day.main.step,
      day.extras[0].text, day.extras[1].text,
      day.start.when, day.start.where, day.start.what,
      day.evening.worked, day.evening.easier,
    ];
    for (var i = 0; i < texts.length; i++) if (texts[i] && texts[i].trim()) return false;
    return !(day.main.done || day.extras[0].done || day.extras[1].done);
  }

  /* ---------- Doğrulama: yedekten gelen veriyi alan alan kontrol eder ---------- */

  function ValidationError(code, params) {
    this.code = code;
    this.params = params || {};
  }

  function checkObject(v, key, field) {
    if (!v || typeof v !== "object" || Array.isArray(v)) throw new ValidationError("badField", { key: key, field: field });
    return v;
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

  /** Tek bir günü temizler; bilinmeyen alanları atar, tür hatasında ValidationError fırlatır. */
  function sanitizeDay(raw, key) {
    checkObject(raw, key, "gün");
    var main = checkObject(raw.main || {}, key, "main");
    var start = checkObject(raw.start || {}, key, "start");
    var evening = checkObject(raw.evening || {}, key, "evening");
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
    day.evening.worked = checkText(evening.worked, key, "evening.worked");
    day.evening.easier = checkText(evening.easier, key, "evening.easier");
    if (raw.updatedAt !== undefined && raw.updatedAt !== null) {
      if (typeof raw.updatedAt !== "string" || raw.updatedAt.length > 40) throw new ValidationError("badField", { key: key, field: "updatedAt" });
      day.updatedAt = raw.updatedAt;
    }
    return day;
  }

  /**
   * Yedek metnini ayrıştırır ve doğrular. Hiçbir yan etkisi yoktur.
   * Başarılıysa { ok: true, days }, değilse { ok: false, code, params } döner.
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
      if (data.version !== SCHEMA_VERSION) throw new ValidationError("wrongVersion");
      if (!data.days || typeof data.days !== "object" || Array.isArray(data.days)) throw new ValidationError("badDays");
      var keys = Object.keys(data.days);
      if (!keys.length) throw new ValidationError("empty");
      var days = {};
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (!isValidDateKey(k)) throw new ValidationError("badDate", { key: k.slice(0, 40) });
        var day = sanitizeDay(data.days[k], k);
        if (!isDayEmpty(day)) days[k] = day;
      }
      if (!Object.keys(days).length) throw new ValidationError("empty");
      return { ok: true, days: days };
    } catch (err) {
      if (err instanceof ValidationError) return { ok: false, code: err.code, params: err.params };
      return { ok: false, code: "notJson", params: {} };
    }
  }

  function buildBackup(days, now) {
    return JSON.stringify(
      { app: APP_ID, version: SCHEMA_VERSION, exportedAt: (now || new Date()).toISOString(), days: days },
      null,
      2
    );
  }

  /* ---------- Tarayıcı deposu ---------- */

  function createStore(storage) {
    var available = true;
    try {
      var probe = "gx.ssc.probe";
      storage.setItem(probe, "1");
      storage.removeItem(probe);
    } catch (e) {
      available = false;
    }

    var memoryDays = {};

    function readJSON(key, fallback) {
      try {
        var raw = storage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        return fallback;
      }
    }

    function loadDays() {
      if (!available) return memoryDays;
      var raw = readJSON(DAYS_KEY, {});
      var out = {};
      if (!raw || typeof raw !== "object") return out;
      Object.keys(raw).forEach(function (k) {
        if (!isValidDateKey(k)) return;
        try {
          out[k] = sanitizeDay(raw[k], k);
        } catch (e) {
          /* Bozuk tek bir gün diğerlerini engellemesin; olduğu gibi bırakılır, ama okunmaz. */
        }
      });
      return out;
    }

    function writeDays(days) {
      memoryDays = days;
      if (!available) return false;
      try {
        storage.setItem(DAYS_KEY, JSON.stringify(days));
        return true;
      } catch (e) {
        return false;
      }
    }

    return {
      available: available,

      getDays: loadDays,

      getDay: function (key) {
        var days = loadDays();
        return days[key] ? days[key] : emptyDay();
      },

      /** Yalnızca verilen tarihin kaydını yazar; diğer günlere dokunmaz. Boş gün kaydedilmez. */
      saveDay: function (key, day) {
        if (!isValidDateKey(key)) return false;
        var days = loadDays();
        if (isDayEmpty(day)) {
          delete days[key];
        } else {
          day.updatedAt = new Date().toISOString();
          try {
            days[key] = sanitizeDay(day, key);
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

      deleteAll: function () {
        return writeDays({});
      },

      /** Geri yükleme: önce mevcut kayıtların bir kopyası saklanır, sonra yedekteki günler eklenir. */
      mergeDays: function (incoming) {
        var days = loadDays();
        if (available) {
          try {
            storage.setItem(BACKUP_KEY, JSON.stringify(days));
          } catch (e) {
            /* Kopya alınamazsa da geri yükleme yapılabilir; yedek dosyası kullanıcıda. */
          }
        }
        Object.keys(incoming).forEach(function (k) {
          days[k] = incoming[k];
        });
        return writeDays(days);
      },

      exportText: function () {
        return buildBackup(loadDays());
      },

      getSettings: function () {
        var s = readJSON(SETTINGS_KEY, {});
        return s && typeof s === "object" ? s : {};
      },

      setSettings: function (patch) {
        var s = this.getSettings();
        Object.keys(patch).forEach(function (k) {
          s[k] = patch[k];
        });
        if (!available) return false;
        try {
          storage.setItem(SETTINGS_KEY, JSON.stringify(s));
          return true;
        } catch (e) {
          return false;
        }
      },

      DAYS_KEY: DAYS_KEY,
    };
  }

  var api = {
    APP_ID: APP_ID,
    SCHEMA_VERSION: SCHEMA_VERSION,
    dateKey: dateKey,
    keyToDate: keyToDate,
    isValidDateKey: isValidDateKey,
    emptyDay: emptyDay,
    isDayEmpty: isDayEmpty,
    parseBackup: parseBackup,
    buildBackup: buildBackup,
    createStore: createStore,
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.GX_STORE = api;
})(typeof window !== "undefined" ? window : this);
