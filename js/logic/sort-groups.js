(() => {
  const entries = WS.config.sortable.entries || [];
  const groups = entries.filter(e => typeof e !== 'string');
  const owner = new Map();
  groups.forEach(g => g.items.forEach(n => { if (!owner.has(n)) owner.set(n, g.name); }));
  const order = [...groups.map(g => g.name), 'other'];
  
  WS.groupSortable = rows => {
    const m = new Map();
    for (const r of rows) {
      const g = owner.get(r.name) || 'other';
      if (!m.has(g)) m.set(g, []);
      m.get(g).push(r);
    }
    return order.filter(g => m.has(g)).map(g => ({name:g, rows:m.get(g)}));
  };
})();
