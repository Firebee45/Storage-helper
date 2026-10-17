(() => {
  const key = code => 'ws-tags-' + code;
  const valid = new Set(WS.config.cats.map(c => c.key));
  const load = code => {
    try {
      const out = {};
      for (const [k, v] of Object.entries(JSON.parse(localStorage.getItem(key(code)) || '{}'))) if (valid.has(v)) out[k] = v;
      return out;
    } catch (e) { return {}; }
  };
  const save = (code, over) => { try { localStorage.setItem(key(code), JSON.stringify(over)); return true; } catch (e) { return false; } };
  WS.overrides = {load, save};
})();
