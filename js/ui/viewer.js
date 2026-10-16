(() => {
  const {$, infoLine, makeTable} = WS;
  const el = {viewer:$('viewer'), meta:$('viewerMeta'), kinds:$('vKinds'), total:$('vTotal'), containers:$('vContainers'), search:$('vSearch'), results:$('vResults'), containerList:$('vContainerList')};
  let rec = null;
  const when = ms => new Date(ms).toLocaleString(undefined, {dateStyle:'medium', timeStyle:'short'});
  const renderItems = () => {
    const q = el.search.value.trim().toLowerCase();
    const rows = rec.totals.filter(([name]) => name.toLowerCase().includes(q)).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    if (!rows.length) { el.results.className = 'empty'; el.results.textContent = 'No matching items.'; return; }
    el.results.className = '';
    el.results.replaceChildren(infoLine(`Showing ${rows.length.toLocaleString()} of ${rec.totals.length.toLocaleString()} item types.`), makeTable('<thead><tr><th>Item</th><th class="num">Quantity</th></tr></thead>', rows));
  };
  const renderContainers = () => {
    const rows = [...rec.containers].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    if (!rows.length) { el.containerList.className = 'empty'; el.containerList.textContent = 'No non-empty containers.'; return; }
    el.containerList.className = '';
    el.containerList.replaceChildren(infoLine(`${rec.containerCount.toLocaleString()} non-empty containers in total.`), makeTable('<thead><tr><th>Container type</th><th class="num">Count</th></tr></thead>', rows));
  };
  const showWorld = data => {
    rec = data;
    el.meta.textContent = `${data.name} · saved ${when(data.savedAt)}${data.structures ? ' · containers inside structures ignored' : ''}`;
    el.kinds.textContent = data.totals.length.toLocaleString();
    el.total.textContent = data.totalCount.toLocaleString();
    el.containers.textContent = data.containerCount.toLocaleString();
    el.search.value = '';
    renderItems();
    renderContainers();
    el.viewer.hidden = false;
  };
  const hideWorld = () => { rec = null; el.viewer.hidden = true; };
  el.search.addEventListener('input', () => { if (rec) renderItems(); });
  Object.assign(WS, {showWorld, hideWorld});
})();
