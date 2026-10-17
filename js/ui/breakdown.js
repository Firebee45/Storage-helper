(() => {
  const {$, fmt} = WS;
  const box = $('breakdown'), table = $('bdTable'), search = $('bdSearch'), count = $('bdCount');
  let built = false;
  const render = () => {
    built = true;
    const q = search.value.trim().toLowerCase().replace(/_/g, ' ');
    const rows = WS.view.rows.filter(r => r.name.includes(q));
    if (!rows.length) { table.className = 'empty'; table.textContent = 'No matching items.'; return; }
    table.className = '';
    const info = document.createElement('p'), wrap = document.createElement('div'), t = document.createElement('table'), tb = document.createElement('tbody');
    info.className = 'info';
    info.textContent = `Showing ${rows.length.toLocaleString()} of ${WS.view.rows.length.toLocaleString()} item types.`;
    wrap.className = 'table-wrap';
    t.innerHTML = '<thead><tr><th>Item</th><th class="num">Quantity</th></tr></thead>';
    for (const r of rows) {
      const tr = document.createElement('tr'), a = document.createElement('td'), n = document.createElement('td'), l = document.createElement('span');
      l.className = 'name-cell';
      l.append(WS.icon(r, 'sm'), document.createTextNode(fmt.display(r.name)));
      a.className = 'name';
      a.appendChild(l);
      n.className = 'num';
      n.textContent = r.count.toLocaleString();
      tr.append(a, n);
      tb.appendChild(tr);
    }
    t.appendChild(tb);
    wrap.appendChild(t);
    table.replaceChildren(info, wrap);
  };
  const reset = () => {
    built = false;
    box.open = false;
    search.value = '';
    table.className = 'empty';
    table.replaceChildren();
    count.textContent = fmt.types(WS.view.rows.length);
  };
  if (box) box.addEventListener('toggle', () => { if (box.open && !built) render(); });
  if (search) search.addEventListener('input', render);
  WS.breakdown = {reset};
})();
