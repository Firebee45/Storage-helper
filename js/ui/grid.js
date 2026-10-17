(() => {
  const {fmt} = WS;
  const tile = row => {
    const exact = row.count.toLocaleString(), name = fmt.display(row.name);
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tile';
    b.dataset.tip = `${name} — ${exact}`;
    b.setAttribute('aria-label', `${name}, ${exact}. Choose a group`);
    b._row = row;
    const c = document.createElement('span');
    c.className = 'cnt';
    c.textContent = fmt.short(row.count);
    b.append(WS.icon(row), c);
    return b;
  };
  const fillTiles = (el, rows) => {
    const f = document.createDocumentFragment();
    rows.forEach(r => f.appendChild(tile(r)));
    el.replaceChildren(f);
  };
  Object.assign(WS, {tile, fillTiles});
})();
