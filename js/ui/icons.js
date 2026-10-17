(() => {
  const url = id => `https://mc-api.bisai.dev/v1/assets/items/${encodeURIComponent(id)}/texture.png`;
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
    // Defer setting src until near viewport so we don't hammer the API all at once
    img.dataset.src = url(id);
    return img;
  };
  const load = img => {
    if (!img || img.dataset.loaded || !img.dataset.src) return;
    img.dataset.loaded = '1';
    img.src = img.dataset.src;
    delete img.dataset.src;
  };
  const io = typeof IntersectionObserver === 'function'
    ? new IntersectionObserver(entries => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          load(e.target);
          io.unobserve(e.target);
        }
      }, { rootMargin: '120px 0px', threshold: 0.01 })
    : null;
  const observe = root => {
    if (!root) return;
    const imgs = root.querySelectorAll ? root.querySelectorAll('img.icon[data-src]') : [];
    for (const img of imgs) {
      if (io) io.observe(img);
      else load(img);
    }
  };
  // When icons are inserted into the DOM, start observing them
  const mo = typeof MutationObserver === 'function'
    ? new MutationObserver(muts => {
        for (const m of muts) {
          for (const n of m.addedNodes) {
            if (n.nodeType !== 1) continue;
            if (n.matches && n.matches('img.icon[data-src]')) {
              if (io) io.observe(n); else load(n);
            } else {
              observe(n);
            }
          }
        }
      })
    : null;
  if (mo) mo.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('error', e => {
    const t = e.target;
    if (!t || t.tagName !== 'IMG' || !t.classList.contains('icon')) return;
    t.replaceWith(letter(t.dataset.n || '?', t.className.replace(/\bicon\b/g, '').trim()));
  }, true);
  WS.icon = icon;
  WS.loadIcons = observe;
})();
