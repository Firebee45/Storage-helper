(() => {
  const UNITS = ['', 'K', 'M', 'B', 'T'];
  const short = n => {
    if (n < 1000) return String(n);
    let i = 0, v = n;
    while (v >= 1000 && i < UNITS.length - 1) { v /= 1000; i++; }
    let r = v < 100 ? Math.round(v * 10) / 10 : Math.round(v);
    if (r >= 1000 && i < UNITS.length - 1) { r = 1; i++; }
    return r + UNITS[i];
  };
  const display = name => name.replace(/\b[a-z]/g, c => c.toUpperCase());
  const types = n => `${n.toLocaleString()} item type${n === 1 ? '' : 's'}`;
  WS.fmt = {short, display, types};
})();
