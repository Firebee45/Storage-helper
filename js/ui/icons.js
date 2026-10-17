(() => {
  // Inventory-style renders with open CORS (not blocked by Cloudflare/ORB).
  const itemUrl = id => `https://blockrender.dev/render/item/${encodeURIComponent(id)}.png?size=64`;
  const blockUrl = id => `https://blockrender.dev/render/block/${encodeURIComponent(id)}.png?size=64`;
  const letter = (name, cls) => {
    const s = document.createElement('span');
    s.className = ('icon ph ' + (cls || '')).trim();
    s.textContent = (name || '?').charAt(0).toUpperCase();
    return s;
  };
  const icon = (row, cls = '') => {
    if (!row || !row.id || String(row.id).includes(':')) return letter(row && row.name, cls);
    const id = String(row.id).toLowerCase();
    const img = document.createElement('img');
    img.className = ('icon ' + cls).trim();
    img.alt = '';
    img.width = 64;
    img.height = 64;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.referrerPolicy = 'no-referrer';
    img.dataset.n = row.name || id;
    img.dataset.id = id;
    img.dataset.stage = 'item';
    img.src = itemUrl(id);
    return img;
  };
  document.addEventListener('error', e => {
    const t = e.target;
    if (!t || t.tagName !== 'IMG' || !t.classList.contains('icon') || !t.dataset) return;
    const id = t.dataset.id;
    if (!id) {
      t.replaceWith(letter(t.dataset.n || '?', t.className.replace(/\bicon\b/g, '').trim()));
      return;
    }
    if (t.dataset.stage === 'item') {
      t.dataset.stage = 'block';
      t.src = blockUrl(id);
      return;
    }
    t.replaceWith(letter(t.dataset.n || '?', t.className.replace(/\bicon\b/g, '').trim()));
  }, true);
  WS.icon = icon;
})();
