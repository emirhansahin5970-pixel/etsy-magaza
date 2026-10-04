// Ortak test yardımcıları.

/**
 * Uygulama ilk açılışta İngilizce açılır. Türkçe metinlerle yazılmış eski testler için bu yardımcı,
 * dil tercihi kaydedilmemiş tarayıcıda tercih "tr" imiş gibi davranır (yalnızca okumada; kayıtlı başka dil varsa dokunmaz).
 */
export async function turkishUI(ctx) {
  await ctx.addInitScript(() => {
    const K = "gx.ssc.settings.v1";
    const orig = Storage.prototype.getItem;
    Storage.prototype.getItem = function (k) {
      const v = orig.call(this, k);
      if (k !== K) return v;
      try {
        const s = JSON.parse(v || "{}");
        if (s && typeof s === "object" && !Array.isArray(s) && !s.lang) return JSON.stringify(Object.assign({}, s, { lang: "tr" }));
      } catch (e) { /* bozuk veri testleri: olduğu gibi bırak */ }
      return v;
    };
  });
}
