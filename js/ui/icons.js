(() => {
  // Sources tried in order; if one fails (rate limit, 404, network blip) the next is used.
  const CDN = 'https://cdn.jsdelivr.net/gh/PrismarineJS/minecraft-assets@master/data/1.21.1';
  const sources = id => {
    const e = encodeURIComponent(id);
    return [
      `https://mc-api.bisai.dev/v1/assets/items/${e}/texture.png`,
      `${CDN}/items/${e}.png`,
      `${CDN}/blocks/${e}.png`,
      `https://mc-api.bisai.dev/v1/assets/items/${e}/texture.png` // final retry after a pause
    ];
  };
  const RETRY_DELAY = [0, 0, 0, 1500];
  // Limit concurrent requests so the API doesn't rate-limit us (the cause of random missing icons)
  const MAX_ACTIVE = 6;
  let active = 0;
  const queue = [];
  const pump = () => {
    while (active < MAX_ACTIVE && queue.length) {
      const img = queue.shift();
      if (!img.isConnected && !img.dataset.src) continue;
      active++;
      start(img);
    }
  };
  const done = img => {
    if (img.dataset.counted) {
      delete img.dataset.counted;
      active = Math.max(0, active - 1);
      pump();
    }
  };
  const start = img => {
    img.dataset.counted = '1';
    const list = JSON.parse(img.dataset.srcs);
    const i = +img.dataset.try || 0;
    const go = () => { img.src = list[i]; };
    RETRY_DELAY[i] ? setTimeout(go, RETRY_DELAY[i]) : go();
  };
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
    img.decoding = 'async';
    img.referrerPolicy = 'no-referrer';
    img.dataset.n = row.name || id;
    // Defer setting src until near viewport so we don't hammer the API all at once
    img.dataset.src = '1';
    img.dataset.srcs = JSON.stringify(sources(id));
    return img;
  };
  const load = img => {
    if (!img || img.dataset.loaded || !img.dataset.src) return;
    img.dataset.loaded = '1';
    delete img.dataset.src;
    queue.push(img);
    pump();
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
  document.addEventListener('load', e => {
    const t = e.target;
    if (t && t.tagName === 'IMG' && t.dataset && t.dataset.srcs) done(t);
  }, true);
  document.addEventListener('error', e => {
    const t = e.target;
    if (!t || t.tagName !== 'IMG' || !t.classList.contains('icon')) return;
    if (t.dataset.srcs) {
      const list = JSON.parse(t.dataset.srcs);
      const next = (+t.dataset.try || 0) + 1;
      if (next < list.length) {
        t.dataset.try = next;
        const go = () => { t.src = list[next]; };
        RETRY_DELAY[next] ? setTimeout(go, RETRY_DELAY[next]) : go();
        return;
      }
      done(t);
    }
    t.replaceWith(letter(t.dataset.n || '?', t.className.replace(/\bicon\b/g, '').trim()));
  }, true);
  WS.icon = icon;
  WS.loadIcons = observe;
})();
