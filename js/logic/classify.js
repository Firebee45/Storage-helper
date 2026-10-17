(() => {
  const {rules, unstackable: U, sortable: S} = WS.config;
  const un = new Set(U.names), so = new Set(S.names);
  const isSortable = name => so.has(name) || S.patterns.some(p => p.test(name));
  const isUnstackable = name => un.has(name) || U.patterns.some(p => p.test(name)) || isSortable(name);
  const classify = totals => {
    const rows = totals.map(([name, count]) => ({name, id:name.replace(/ /g, '_'), count, unstack:isUnstackable(name), auto:null})).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    const stack = rows.filter(r => !r.unstack);
    const cut = Math.ceil(stack.length * rules.bulkPercent / 100);
    stack.forEach((r, i) => { r.auto = i < cut ? 'bulk' : r.count <= rules.misMax ? 'mis' : r.count < rules.hallMax ? 'hall' : null; });
    rows.forEach(r => { if (r.unstack) r.auto = isSortable(r.name) ? 'unstackable' : 'unsorted'; });
    return {rows, stackCount:stack.length};
  };
  WS.classify = classify;
})();
