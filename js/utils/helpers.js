window.WS = {};
(() => {
  const $ = id => document.getElementById(id);
  const formatBytes = n => n < 1024 ? `${n} B` : n < 1048576 ? `${(n/1024).toFixed(1)} KB` : `${(n/1048576).toFixed(1)} MB`;
  const add = (map, key, count) => { if (!key || !Number.isFinite(count) || count <= 0) return; map.set(key, (map.get(key)||0) + count); };
  const itemName = id => String(id || 'unknown:item').replace(/^minecraft:/, '').replaceAll('_',' ');
  const containerLabel = id => { const name = itemName(id); return /\bshulker box$/i.test(name) ? 'shulker box' : name; };
  const tick = () => new Promise(resolve => setTimeout(resolve, 0));
  const downloadBlob = (blob, filename) => { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url); };
  Object.assign(WS, {$, formatBytes, add, itemName, containerLabel, tick, downloadBlob});
})();
