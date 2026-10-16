(() => {
  const root = document.documentElement, btn = document.getElementById('themeBtn');
  const meta = document.querySelector('meta[name="theme-color"]');
  let timer = 0;
  const apply = theme => {
    root.setAttribute('data-theme', theme);
    btn.setAttribute('aria-pressed', String(theme === 'dark'));
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    btn.title = btn.getAttribute('aria-label');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0A0A0A' : '#FAFAFA');
  };
  const animate = theme => {
    root.classList.add('theme-anim');
    apply(theme);
    clearTimeout(timer);
    timer = setTimeout(() => root.classList.remove('theme-anim'), 550);
  };
  apply(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    animate(next);
    try { localStorage.setItem('ws-theme', next); } catch (e) {}
  });
  try {
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      let saved = null; try { saved = localStorage.getItem('ws-theme'); } catch (err) {}
      if (!saved) animate(e.matches ? 'dark' : 'light');
    });
  } catch (e) {}
})();
