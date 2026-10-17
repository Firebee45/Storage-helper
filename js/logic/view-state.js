(() => {
  const V = WS.view = {code:'', rec:null, rows:[], stackCount:0, over:{}, voidOn:false, voidMin:10};
  const effective = r => V.over[r.name] || r.auto;
  const voided = r => V.voidOn && r.count < V.voidMin;
  const kept = () => V.rows.filter(r => !voided(r));
  const byCat = key => kept().filter(r => effective(r) === key);
  const setTag = (name, cat) => {
    if (cat) V.over[name] = cat; else delete V.over[name];
    WS.overrides.save(V.code, V.over);
  };
  Object.assign(WS, {effective, voided, kept, byCat, setTag});
})();
