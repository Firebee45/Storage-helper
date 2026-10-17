(() => {
  const tip = WS.$('tip');
  const hide = () => { tip.hidden = true; };
  const show = t => {
    tip.textContent = t.dataset.tip;
    tip.hidden = false;
    const r = t.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
    const x = Math.max(8, Math.min(r.left + r.width / 2 - w / 2, innerWidth - w - 8));
    const y = r.bottom + 6 + h > innerHeight - 8 ? r.top - h - 6 : r.bottom + 6;
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
  };
  const target = e => e.target.closest && e.target.closest('[data-tip]');
  document.addEventListener('mouseover', e => { const t = target(e); if (t) show(t); });
  document.addEventListener('mouseout', e => { const t = target(e); if (t && !t.contains(e.relatedTarget)) hide(); });
  document.addEventListener('focusin', e => { const t = target(e); if (t) show(t); });
  document.addEventListener('focusout', hide);
  window.addEventListener('scroll', hide, true);
})();
