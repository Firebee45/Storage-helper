(() => {
  const {$, fmt} = WS, cats = WS.config.cats, menu = $('tagMenu');
  const head = document.createElement('div'), opts = document.createElement('div');
  head.className = 'tag-head';
  opts.className = 'tag-opts';
  const opt = (key, label) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tag-opt' + (key ? ' c-' + key : '');
    b.dataset.cat = key;
    b.innerHTML = (key ? '<i class="sw"></i>' : '') + '<span class="tl"></span><span class="chk" aria-hidden="true"></span>';
    b.querySelector('.tl').textContent = label;
    return b;
  };
  cats.forEach(c => opts.appendChild(opt(c.key, c.label)));
  const auto = opt('', 'Use suggestion');
  opts.appendChild(auto);
  menu.append(head, opts);
  let row = null, opened = 0;
  const close = () => { menu.hidden = true; row = null; };
  const place = t => {
    const r = t.getBoundingClientRect(), w = menu.offsetWidth, h = menu.offsetHeight;
    const x = Math.max(8, Math.min(r.left, innerWidth - w - 8));
    const below = r.bottom + 6 + h <= innerHeight - 8;
    const y = Math.max(8, Math.min(below ? r.bottom + 6 : r.top - h - 6, innerHeight - h - 8));
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
  };
  const open = t => {
    row = t._row;
    opened = Date.now();
    const mine = WS.view.over[row.name] || '', sug = cats.find(c => c.key === row.auto);
    const info = document.createElement('div'), name = document.createElement('strong'), sub = document.createElement('span');
    info.className = 'tag-info';
    name.textContent = fmt.display(row.name);
    sub.textContent = `${row.count.toLocaleString()} · suggested: ${sug ? sug.label : 'none'}`;
    info.append(name, sub);
    head.replaceChildren(WS.icon(row), info);
    auto.querySelector('.tl').textContent = `Use suggestion (${sug ? sug.label : 'none'})`;
    opts.querySelectorAll('.tag-opt').forEach(b => b.classList.toggle('on', b.dataset.cat === mine));
    menu.hidden = false;
    place(t);
  };
  opts.addEventListener('click', e => {
    const b = e.target.closest('.tag-opt');
    if (!b || !row) return;
    WS.setTag(row.name, b.dataset.cat || null);
    WS.refreshTags();
    close();
  });
  document.addEventListener('click', e => { if (!menu.hidden && !menu.contains(e.target) && !e.target.closest('.tile')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  window.addEventListener('resize', close);
  window.addEventListener('scroll', e => { if (Date.now() - opened > 400 && !menu.contains(e.target)) close(); }, true);
  Object.assign(WS, {openTag:open, closeTag:close});
})();
