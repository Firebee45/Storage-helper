(() => {
  const {$} = WS, {rules} = WS.config, box = $('suggestions');
  const n = x => x.toLocaleString();
  const defs = V => [
    {key:'bulk', title:'Suggested bulk items', desc:`The top ${rules.bulkPercent}% of stackable item types by quantity, shown as an inventory grid with shortened counts.`, info:c => `Top ${n(c)} of ${n(V.stackCount)} stackable item types (highest quantity).`},
    {key:'hall', title:'Suggested chest hall items', desc:`Item types with over ${n(rules.misMax)} and under ${n(rules.hallMax)} in total that are not in the bulk list.`, info:c => `${WS.fmt.types(c)} for the chest hall.`},
    {key:'mis', title:'Suggested MIS items', desc:`Item types with about 512 or fewer in total. A little leeway is allowed, up to ${n(rules.misMax)}.`, info:c => `${WS.fmt.types(c)} for MIS.`},
    {key:'unstackable', title:'Unstackable items that can be sorted', desc:'Items that do not stack but can still be sorted without extra help.', info:c => `${WS.fmt.types(c)} that can be sorted.`},
    {key:'unsorted', title:'Unstackable items that cannot be sorted', desc:'Items that do not stack and cannot be sorted without copper golems or allays.', info:c => `${WS.fmt.types(c)} that need copper golems or allays.`}
  ];
  const card = (d, rows) => {
    const c = document.createElement('div'), h = document.createElement('h3'), p = document.createElement('p'), i = document.createElement('p'), g = document.createElement('div');
    c.className = `card panel sug c-${d.key}`;
    h.innerHTML = '<i class="sw"></i>';
    h.append(d.title);
    p.className = 'desc';
    p.textContent = d.desc;
    i.className = 'info';
    i.textContent = d.info(rows.length);
    g.className = 'tiles';
    if (!rows.length) { g.className = 'empty'; g.textContent = 'Nothing fits this group.'; }
    else if (d.key === 'unstackable') {
      g.className = 'cols';
      WS.groupSortable(rows).forEach(grp => {
        const col = document.createElement('div'), head = WS.colHead(grp), t = document.createElement('div');
        col.className = grp.rows.length === 1 ? 'col one' : 'col';
        t.className = 'tiles';
        WS.fillTiles(t, grp.rows);
        col.append(head, t);
        g.appendChild(col);
      });
    } else WS.fillTiles(g, rows);
    c.append(h, p, i, g);
    return c;
  };
  const render = () => {
    const V = WS.view, f = document.createDocumentFragment();
    defs(V).forEach(d => f.appendChild(card(d, V.rows.filter(r => r.auto === d.key))));
    box.replaceChildren(f);
  };
  WS.suggest = {render};
})();
