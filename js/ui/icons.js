(() => {
  const BASE = 'https://mc-api.bisai.dev/v1/assets/items/';
  const letter = (name, cls) => {
    const s = document.createElement('span');
    s.className = ('icon ph ' + cls).trim();
    s.textContent = name.charAt(0).toUpperCase();
    return s;
  };
  const icon = (row, cls = '') => {
    if (row.id.includes(':')) return letter(row.name, cls);
    const img = new Image();
    img.className = ('icon ' + cls).trim();
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.dataset.n = row.name;
    img.src = `${BASE}${encodeURIComponent(row.id)}/texture.png?size=64`;
    return img;
  };
  document.addEventListener('error', e => {
    const t = e.target;
    if (t && t.tagName === 'IMG' && t.classList.contains('icon')) t.replaceWith(letter(t.dataset.n || '?', t.className.replace(/\bicon\b/, '').trim()));
  }, true);
  WS.icon = icon;
})();
