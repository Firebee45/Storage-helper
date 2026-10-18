(() => {
  const entries = WS.config.sortable.entries || [];
  const owner = new Map();
  const order = [];
  entries.forEach(e => {
    if (typeof e === 'string') { owner.set(e, e); order.push(e); }
    else { e.items.forEach(n => { if (!owner.has(n)) owner.set(n, e.name); }); order.push(e.name); }
  });
  order.push('other');
  WS.groupSortable = rows => {
    const m = new Map();
    for (const r of rows) {
      const g = owner.get(r.name) || 'other';
      if (!m.has(g)) m.set(g, []);
      m.get(g).push(r);
    }
    return order.filter(g => m.has(g)).map(g => ({name:g, rows:m.get(g)}));
  };

  WS.colHead = grp => {
    const head = document.createElement('div'), nm = document.createElement('span');
    head.className = 'col-head';
    nm.className = 'col-name';
    nm.textContent = WS.fmt.display(grp.name);
    head.append(WS.icon(grp.rows[0], 'sm'), nm);
    if (grp.rows.length > 1 || grp.name !== grp.rows[0].name) {
      const n = document.createElement('span');
      n.className = 'col-n';
      n.textContent = grp.rows.length.toLocaleString();
      head.appendChild(n);
    }
    return head;
  };
})();
