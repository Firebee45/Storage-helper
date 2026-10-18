(() => {
  const {$, fmt} = WS, box = $('lists');
  const panel = (c, rows) => {
    const p = document.createElement('div'), h = document.createElement('h3'), d = document.createElement('p');
    p.className = `card panel list c-${c.key}`;
    h.innerHTML = '<i class="sw"></i>';
    h.append(c.label);
    d.className = 'desc';
    const total = rows.reduce((a, r) => a + r.count, 0);
    d.textContent = `${fmt.types(rows.length)} · ${total.toLocaleString()} item${total === 1 ? '' : 's'}`;
    p.append(h, d);
    if (!rows.length) {
      const e = document.createElement('div');
      e.className = 'empty';
      e.textContent = 'No items yet.';
      p.appendChild(e);
      return p;
    }
    const list = rs => {
      const ul = document.createElement('ul');
      ul.className = 'rows';
      for (const r of rs) {
        const li = document.createElement('li'), nm = document.createElement('span'), num = document.createElement('span');
        nm.className = 'nm';
        nm.textContent = fmt.display(r.name);
        num.className = 'num';
        num.textContent = r.count.toLocaleString();
        li.append(WS.icon(r, 'sm'), nm, num);
        ul.appendChild(li);
      }
      return ul;
    };
    if (c.key === 'unstackable') {
      p.classList.add('wide');
      const cols = document.createElement('div');
      cols.className = 'cols';
      WS.groupSortable(rows).forEach(grp => {
        const col = document.createElement('div'), head = WS.colHead(grp);
        col.className = grp.rows.length === 1 ? 'col one' : 'col';
        col.append(head, list(grp.rows));
        cols.appendChild(col);
      });
      p.appendChild(cols);
    } else p.appendChild(list(rows));
    return p;
  };
  const render = () => {
    const f = document.createDocumentFragment();
    WS.config.cats.forEach(c => f.appendChild(panel(c, WS.byCat(c.key))));
    box.replaceChildren(f);
  };
  WS.lists = {render};
})();
