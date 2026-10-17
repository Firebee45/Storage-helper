(() => {
  const {$} = WS, V = WS.view;
  const el = {viewer:$('viewer'), meta:$('viewerMeta'), kinds:$('vKinds'), total:$('vTotal')};
  const when = ms => new Date(ms).toLocaleString(undefined, {dateStyle:'medium', timeStyle:'short'});
  const showWorld = (rec, code) => {
    const c = WS.classify(rec.totals);
    Object.assign(V, {code, rec, rows:c.rows, stackCount:c.stackCount, over:WS.overrides.load(code)});
    el.meta.textContent = `${rec.name} · saved ${when(rec.savedAt)}${rec.structures ? ' · containers inside structures ignored' : ''}`;
    el.kinds.textContent = c.rows.length.toLocaleString();
    el.total.textContent = (rec.totalCount != null ? rec.totalCount : c.rows.reduce((a, r) => a + r.count, 0)).toLocaleString();
    WS.closeTag();
    WS.breakdown.reset();
    WS.suggest.render();
    WS.fullGrid.build();
    WS.lists.render();
    el.viewer.hidden = false;
  };
  const hideWorld = () => { WS.closeTag(); V.rows = []; el.viewer.hidden = true; };
  el.viewer.addEventListener('click', e => { const t = e.target.closest('.tile'); if (t && t._row) WS.openTag(t); });
  WS.refreshTags = () => { WS.fullGrid.paint(); WS.lists.render(); };
  WS.refreshAll = () => { WS.fullGrid.apply(); WS.lists.render(); };
  Object.assign(WS, {showWorld, hideWorld});
})();
