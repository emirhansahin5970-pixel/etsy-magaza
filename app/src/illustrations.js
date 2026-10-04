/*
 * Kitap ve arayüz görselleri: elle çizilmiş, satır içi SVG.
 * Renkler CSS sınıflarından gelir (styles.css: .il-*), böylece PDF ve web aynı paleti kullanır.
 * Görseller süslemeden çok anlamı taşır; açıklayıcı metinleri (alt) kitap içeriğinde tutulur.
 */
window.GX_ART = {
  // Kapak motifi: dağınık çizgilerden tek bir yola, yolun başında küçük bir adım.
  cover:
    '<svg viewBox="0 0 240 150" role="img" aria-hidden="true" focusable="false">' +
    '<path class="cv-scribble" d="M18 40c10-8 20 6 30-2s18 6 26-1"/>' +
    '<path class="cv-scribble" d="M14 62c12 6 20-8 32-2s14 8 24 1"/>' +
    '<path class="cv-scribble" d="M26 84c8-5 16 5 24-1"/>' +
    '<path class="cv-path" d="M80 70c30 0 40 50 80 50h66"/>' +
    '<rect class="cv-step" x="150" y="104" width="22" height="12" rx="3"/>' +
    '<rect class="cv-step" x="176" y="92" width="22" height="24" rx="3"/>' +
    '<rect class="cv-step cv-step--far" x="202" y="78" width="22" height="38" rx="3"/>' +
    '<circle class="cv-dot" cx="161" cy="96" r="5"/>' +
    '<circle class="cv-sun" cx="206" cy="36" r="16"/>' +
    "</svg>",

  // Alışkanlık: bir an (çapa) → küçük başlangıç → kısa not; ve tekrar.
  habitLoop:
    '<svg viewBox="0 0 320 150" role="img" aria-hidden="true" focusable="false">' +
    '<path class="il-loop" d="M70 112c40 26 140 26 180 0"/>' +
    '<path class="il-arrow-head" d="M76 103l-7 9 11 3"/>' +
    '<circle class="il-node" cx="60" cy="62" r="34"/>' +
    '<circle class="il-node il-node--main" cx="160" cy="52" r="38"/>' +
    '<circle class="il-node" cx="260" cy="62" r="34"/>' +
    '<path class="il-arrow" d="M98 58h20"/><path class="il-arrow-head" d="M114 52l7 6-7 6"/>' +
    '<path class="il-arrow" d="M202 58h18"/><path class="il-arrow-head" d="M216 52l7 6-7 6"/>' +
    '<circle class="il-clock" cx="60" cy="62" r="15"/><path class="il-clock-hand" d="M60 53v9l6 4"/>' +
    '<rect class="il-step" x="142" y="58" width="12" height="12" rx="2"/><rect class="il-step" x="157" y="48" width="12" height="22" rx="2"/><circle class="il-dot" cx="148" cy="50" r="5"/>' +
    '<path class="il-rule" d="M248 54h24M248 64h18M248 74h22"/>' +
    "</svg>",
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

  // Bölüm 3: Plan bir engelin etrafından dolaşarak sürer; altta yedi günlük deneme, bir gün boş.
  flexiblePlan:
    '<svg viewBox="0 0 320 180" role="img" aria-hidden="true" focusable="false">' +
    '<path class="il-ground" d="M14 96h292"/>' +
    '<rect class="il-soft" x="132" y="70" width="56" height="44" rx="8"/>' +
    '<path class="il-scribble" d="M146 86c8-6 14 6 22 0s10 6 8 8"/>' +
    '<path class="il-loop" d="M20 92h96c14 0 14-48 44-48s30 48 44 48h96"/>' +
    '<circle class="il-dot" cx="20" cy="92" r="6"/>' +
    '<path class="il-arrow-head" d="M292 85l9 7-9 7"/>' +
    '<rect class="il-step" x="44" y="136" width="24" height="24" rx="5"/>' +
    '<rect class="il-step" x="78" y="136" width="24" height="24" rx="5"/>' +
    '<rect class="il-step" x="112" y="136" width="24" height="24" rx="5"/>' +
    '<rect class="il-box" x="146" y="136" width="24" height="24" rx="5"/>' +
    '<rect class="il-step" x="180" y="136" width="24" height="24" rx="5"/>' +
    '<rect class="il-step" x="214" y="136" width="24" height="24" rx="5"/>' +
    '<rect class="il-step" x="248" y="136" width="24" height="24" rx="5"/>' +
    '<circle class="il-dot" cx="284" cy="148" r="5"/>' +
    "</svg>",
};
