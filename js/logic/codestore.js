(() => {
  const PREFIX = 'ws-world-', INDEX = 'ws-world-index', MAX = 25;
  const CODE_RE = /^[0-9A-F]{6}$/;
  const read = key => { try { return localStorage.getItem(key); } catch (e) { return null; } };
  const write = (key, value) => { try { localStorage.setItem(key, value); return true; } catch (e) { return false; } };
  const drop = key => { try { localStorage.removeItem(key); } catch (e) {} };
  const index = () => { try { const list = JSON.parse(read(INDEX) || '[]'); return Array.isArray(list) ? list.filter(c => read(PREFIX + c) !== null) : []; } catch (e) { return []; } };
  const random = () => window.crypto && crypto.getRandomValues ? crypto.getRandomValues(new Uint32Array(1))[0] : Math.floor(Math.random() * 4294967296);
  const randomCode = () => (random() & 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0');
  const valid = code => CODE_RE.test(code);
  const save = data => {
    const list = index();
    let code = randomCode();
    for (let i = 0; i < 20 && read(PREFIX + code) !== null; i++) code = randomCode();
    if (read(PREFIX + code) !== null) return null;
    const json = JSON.stringify({v:1, savedAt:Date.now(), ...data});
    let ok = write(PREFIX + code, json);
    while (!ok && list.length) { drop(PREFIX + list.shift()); ok = write(PREFIX + code, json); }
    if (!ok) return null;
    list.push(code);
    while (list.length > MAX) drop(PREFIX + list.shift());
    write(INDEX, JSON.stringify(list));
    return code;
  };
  const load = code => {
    const c = String(code).toUpperCase();
    if (!valid(c)) return null;
    const raw = read(PREFIX + c);
    if (raw === null) return null;
    try { const rec = JSON.parse(raw); return rec && rec.v === 1 && Array.isArray(rec.totals) ? rec : null; } catch (e) { return null; }
  };
  WS.codes = {valid, save, load};
})();
