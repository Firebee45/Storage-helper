(() => {
  const cats = WS.config.cats;
  const data = () => WS.kept().map(r => ({name:r.name, count:r.count, cat:WS.effective(r)}));
  const flags = r => cats.map(c => r.cat === c.key);
  const itemsCsv = () => {
    const q = v => `"${String(v).replaceAll('"', '""')}"`;
    const lines = [['Item', 'Quantity', ...cats.map(c => c.label)], ...data().map(r => [r.name, r.count, ...flags(r).map(f => f ? 'TRUE' : 'FALSE')])];
    return lines.map(l => l.map(q).join(',')).join('\r\n');
  };
  const itemsXlsx = () => {
    const rows = data();
    const per = cats.map(c => ({name:c.label, tab:c.tab, cols:[{h:'Item', type:'text'}, {h:'Quantity', type:'num'}], rows:rows.filter(r => r.cat === c.key).map(r => [r.name, r.count])}));
    const all = {name:'All items', tab:'6B7280', cols:[{h:'Item', type:'text'}, {h:'Quantity', type:'num'}, ...cats.map(c => ({h:c.label, type:'bool'}))], rows:rows.map(r => [r.name, r.count, ...flags(r)])};
    return WS.buildWorkbook([...per, all]);
  };
  Object.assign(WS, {itemsCsv, itemsXlsx});
})();
