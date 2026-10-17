(() => {
  const {$} = WS, V = WS.view;
  const el = {viewer:$('viewer'), meta:$('viewerMeta'), kinds:$('vKinds'), total:$('vTotal')};
  const when = ms => new Date(ms).toLocaleString(undefined, {dateStyle:'medium', timeStyle:'short'});
  const showWorld = (rec, code) => {
    if (!rec || !Array.isArray(rec.totals)) return;
    const c = WS.classify(rec.totals);
    Object.assign(V, {code: code || '', rec, rows:c.rows, stackCount:c.stackCount, over:WS.overrides.load(code || '')});
    if (el.meta) el.meta.textContent = `${rec.name || 'World'} · saved ${when(rec.savedAt)}${rec.structures ? ' · containers inside structures ignored' : ''}`;
    if (el.kinds) el.kinds.textContent = c.rows.length.toLocaleString();
    if (el.total) el.total.textContent = (rec.totalCount != null ? rec.totalCount : c.rows.reduce((a, r) => a + r.count, 0)).toLocaleString();
    if (typeof WS.closeTag === 'function') WS.closeTag();
    if (WS.breakdown && WS.breakdown.reset) WS.breakdown.reset();
    if (WS.suggest && WS.suggest.render) WS.suggest.render();
    if (WS.fullGrid && WS.fullGrid.build) WS.fullGrid.build();
    if (WS.lists && WS.lists.render) WS.lists.render();
    if (el.viewer) el.viewer.hidden = false;
  };
  const hideWorld = () => {
    if (typeof WS.closeTag === 'function') WS.closeTag();
    V.rows = [];
    if (el.viewer) el.viewer.hidden = true;
  };
  if (el.viewer) el.viewer.addEventListener('click', e => { const t = e.target.closest('.tile'); if (t && t._row) WS.openTag(t); });
  WS.refreshTags = () => { if (WS.fullGrid) WS.fullGrid.paint(); if (WS.lists) WS.lists.render(); };
  WS.refreshAll = () => { if (WS.fullGrid) WS.fullGrid.apply(); if (WS.lists) WS.lists.render(); };
  Object.assign(WS, {showWorld, hideWorld});
})();
