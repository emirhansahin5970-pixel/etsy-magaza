/*
 * Kitap ve arayüz görselleri: elle çizilmiş, satır içi SVG.
 * Renkler CSS sınıflarından gelir (styles.css: .il-*), böylece PDF ve web aynı paleti kullanır.
 * Görseller süslemeden çok anlamı taşır; açıklayıcı metinleri (alt) kitap içeriğinde tutulur.
 */
window.GX_ART = {
  // Karşılama: büyük bir iş, küçük basamaklara ayrılıyor; ilk basamakta turuncu bir başlangıç noktası.
  smallSteps:
    '<svg viewBox="0 0 320 150" role="img" aria-hidden="true" focusable="false">' +
    '<rect class="il-soft" x="14" y="34" width="96" height="96" rx="10"/>' +
    '<path class="il-line" d="M30 58h64M30 76h50M30 94h58M30 112h36"/>' +
    '<path class="il-arrow" d="M120 82c14 0 22 0 34 0"/>' +
    '<path class="il-arrow-head" d="M150 75l8 7-8 7"/>' +
    '<rect class="il-step" x="170" y="114" width="34" height="16" rx="4"/>' +
    '<rect class="il-step" x="208" y="96" width="34" height="34" rx="4"/>' +
    '<rect class="il-step" x="246" y="78" width="34" height="52" rx="4"/>' +
    '<rect class="il-step il-step--far" x="284" y="60" width="22" height="70" rx="4"/>' +
    '<circle class="il-dot" cx="187" cy="102" r="7"/>' +
    '<path class="il-ground" d="M10 131h300"/>' +
    "</svg>",

  // Bölüm 1: Dolanık düşünceler, sıraya girmiş bir kâğıda aktarılıyor.
  thoughtsToPaper:
    '<svg viewBox="0 0 320 180" role="img" aria-hidden="true" focusable="false">' +
    '<circle class="il-soft" cx="70" cy="90" r="62"/>' +
    '<path class="il-scribble" d="M36 70c10-12 24 4 34-6s20 8 28 0"/>' +
    '<path class="il-scribble" d="M30 98c14 8 22-10 36-2s18 12 30 2"/>' +
    '<path class="il-scribble" d="M48 120c8-6 18 6 26-2"/>' +
    '<path class="il-scribble" d="M56 48c6 4 14-2 20 2"/>' +
    '<circle class="il-ring" cx="98" cy="58" r="6"/>' +
    '<circle class="il-ring" cx="40" cy="128" r="4"/>' +
    '<circle class="il-ring" cx="106" cy="112" r="5"/>' +
    '<path class="il-arrow" d="M136 90c18-10 34-10 50 0"/>' +
    '<path class="il-arrow-head" d="M181 82l8 9-11 3"/>' +
    '<rect class="il-paper" x="200" y="22" width="102" height="138" rx="6"/>' +
    '<path class="il-rule" d="M230 52h56M230 74h48M230 96h56M230 118h40M230 140h50"/>' +
    '<rect class="il-box" x="212" y="45" width="12" height="12" rx="3"/>' +
    '<rect class="il-box" x="212" y="67" width="12" height="12" rx="3"/>' +
    '<rect class="il-box" x="212" y="89" width="12" height="12" rx="3"/>' +
    '<rect class="il-box" x="212" y="111" width="12" height="12" rx="3"/>' +
    '<rect class="il-box" x="212" y="133" width="12" height="12" rx="3"/>' +
    '<path class="il-check" d="M214 74l3 3 6-7"/>' +
    "</svg>",
};
