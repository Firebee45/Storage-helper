(() => {
  const {$} = WS;
  const grid = $('allGrid'), info = $('allInfo'), search = $('allSearch'), vOn = $('voidOn'), vMin = $('voidMin');
  let tiles = [];
  const paint = t => { const c = WS.effective(t._row); if (c) t.dataset.cat = c; else delete t.dataset.cat; };
  const apply = () => {
    const q = search.value.trim().toLowerCase().replace(/_/g, ' ');
    let shown = 0, gone = 0;
    for (const t of tiles) {
      const out = WS.voided(t._row), ok = !out && t._row.name.includes(q);
      if (out) gone++;
      t.hidden = !ok;
      if (ok) shown++;
    }
    info.textContent = `Showing ${shown.toLocaleString()} of ${tiles.length.toLocaleString()} item types.` + (WS.view.voidOn ? ` ${gone.toLocaleString()} voided under ${WS.view.voidMin.toLocaleString()}.` : '');
  };
  const build = () => {
    const V = WS.view;
    V.voidOn = false;
    V.voidMin = 10;
    vOn.checked = false;
    vMin.value = 10;
    vMin.disabled = true;
    search.value = '';
    WS.fillTiles(grid, V.rows);
    tiles = [...grid.children];
    tiles.forEach(paint);
    apply();
  };
  if (search) {
    search.addEventListener('input', apply);
    search.addEventListener('keydown', e => { if (e.key === 'Enter') { const t = tiles.find(x => !x.hidden); if (t) { t.scrollIntoView({block:'center', behavior:'instant'}); WS.openTag(t); } } });
  }
  if (vOn) vOn.addEventListener('change', () => { WS.view.voidOn = vOn.checked; if (vMin) vMin.disabled = !vOn.checked; WS.refreshAll(); });
  if (vMin) vMin.addEventListener('input', () => { WS.view.voidMin = Math.max(0, Math.floor(Number(vMin.value) || 0)); WS.refreshAll(); });
  WS.fullGrid = {build, apply, paint:() => tiles.forEach(paint)};
})();
