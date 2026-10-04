// Kitap çevirilerinin yapısı Türkçe kitapla aynı olmalı: bölüm ve blok kimlikleri, türler, sıra, görsel/kaynak/planlayıcı alanları.
// Kullanım: node --test tests/book.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const LANGS = ["tr", "en", "de", "fr", "es", "it", "nl"];
const sandbox = { window: {} };
for (const l of LANGS) vm.runInNewContext(readFileSync(new URL(`../app/src/content/book.${l}.js`, import.meta.url), "utf8"), sandbox);
const BOOKS = JSON.parse(JSON.stringify(sandbox.window.GX_BOOKS));
const TR = BOOKS.tr;

const TEXT_FIELDS = ["text", "finding", "limits", "details", "alt", "caption", "title"];
const SAME_FIELDS = ["id", "type", "art", "planner", "timerSeconds"];

function texts(book) {
  const out = [book.title, book.subtitle];
  for (const c of book.chapters) {
    out.push(c.title);
    for (const b of c.blocks) {
      for (const f of TEXT_FIELDS) if (b[f]) out.push(b[f]);
      for (const f of ["paragraphs", "steps"]) if (b[f]) out.push(...b[f]);
    }
  }
  return out;
}

test("Türkçe kitap tam: bütün bölümler yazılmış, kaynak kimlikleri kaynakçada var", () => {
  assert.equal(TR.lang, "tr");
  for (const c of TR.chapters) {
    assert.equal(c.available, true, c.id);
    assert.ok(c.blocks.length > 0, c.id);
    for (const b of c.blocks) for (const r of b.refs || []) assert.ok(TR.sources[r], `${c.id}/${b.id}: ${r}`);
    for (const r of c.sources || []) assert.ok(TR.sources[r], `${c.id}: ${r}`);
  }
  const ids = TR.chapters.flatMap((c) => c.blocks.map((b) => b.id));
  assert.equal(new Set(ids).size, ids.length, "blok kimlikleri benzersiz");
});

for (const l of LANGS.filter((x) => x !== "tr")) {
  test(`${l}: kitap yapısı Türkçe ile aynı`, () => {
    const B = BOOKS[l];
    assert.ok(B, "kitap yüklendi");
    assert.equal(B.lang, l);
    assert.equal(B.sources, undefined, "kaynakça yalnızca book.tr.js'te");
    assert.equal(B.chapters.length, TR.chapters.length);
    TR.chapters.forEach((c, i) => {
      const d = B.chapters[i];
      for (const f of ["id", "kind", "number", "minutes", "available"]) assert.equal(d[f], c[f], `${c.id}.${f}`);
      assert.deepEqual(d.sources, c.sources, `${c.id}.sources`);
      assert.equal(d.blocks.length, c.blocks.length, `${c.id}: blok sayısı`);
      c.blocks.forEach((b, j) => {
        const e = d.blocks[j];
        for (const f of SAME_FIELDS) assert.equal(e[f], b[f], `${c.id}/${b.id}.${f}`);
        assert.deepEqual(e.refs, b.refs, `${b.id}.refs`);
        for (const f of TEXT_FIELDS) assert.equal(!!e[f], !!b[f], `${b.id}.${f} var/yok`);
        for (const f of ["paragraphs", "steps"]) assert.equal((e[f] || []).length, (b[f] || []).length, `${b.id}.${f} uzunluğu`);
      });
    });
  });

  test(`${l}: Türkçe metin kalmamış`, () => {
    const left = texts(BOOKS[l]).filter((s) => /[ğışİĞŞ]/.test(s));
    assert.deepEqual(left, []);
  });
}
