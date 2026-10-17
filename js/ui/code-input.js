(() => {
  const {$} = WS;
  const wrap = $('codeBoxes'), msg = $('codeMsg'), boxes = [...document.querySelectorAll('.code-box')];
  const DEFAULT = 'Codes are saved in this browser only.';
  const clean = text => text.replace(/[^0-9a-f]/gi, '').toUpperCase();
  const value = () => boxes.map(b => b.value).join('');
  const setMsg = (text, kind) => {
    msg.textContent = text;
    msg.classList.toggle('error', kind === 'error');
    wrap.classList.remove('bad', 'ok');
    void wrap.offsetWidth;
    if (kind) wrap.classList.add(kind === 'error' ? 'bad' : 'ok');
  };
  const submit = () => {
    const code = value();
    const rec = WS.codes.load(code);
    if (!rec) {
      if (typeof WS.hideWorld === 'function') WS.hideWorld();
      setMsg('No world found for that code in this browser.', 'error');
      return;
    }
    setMsg(`Loaded ${rec.name}.`, 'ok');
    if (typeof WS.showWorld === 'function') WS.showWorld(rec, code);
    else setMsg('Viewer failed to load. Refresh the page and try again.', 'error');
  };
  const update = () => {
    if (value().length === 6) { submit(); return; }
    if (typeof WS.hideWorld === 'function') WS.hideWorld();
    setMsg(DEFAULT, '');
  };
  const fill = (box, ch) => { box.value = ch; box.classList.toggle('filled', !!ch); };
  boxes.forEach((box, i) => {
    box.addEventListener('focus', () => box.select());
    box.addEventListener('input', () => {
      const ch = clean(box.value).slice(-1);
      fill(box, ch);
      if (ch && i < 5) boxes[i + 1].focus();
      update();
    });
    box.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && !box.value && i > 0) { e.preventDefault(); fill(boxes[i - 1], ''); boxes[i - 1].focus(); update(); }
      else if (e.key === 'ArrowLeft' && i > 0) { e.preventDefault(); boxes[i - 1].focus(); }
      else if (e.key === 'ArrowRight' && i < 5) { e.preventDefault(); boxes[i + 1].focus(); }
    });
    box.addEventListener('paste', e => {
      e.preventDefault();
      const text = clean((e.clipboardData || window.clipboardData).getData('text')).slice(0, 6);
      if (!text) return;
      boxes.forEach((b, j) => fill(b, text[j] || ''));
      boxes[Math.min(text.length, 5)].focus();
      update();
    });
  });
  boxes[0].focus();
})();
