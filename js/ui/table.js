(() => {
  const infoLine = text => { const p = document.createElement('p'); p.className = 'info'; p.textContent = text; return p; };
  const makeTable = (headHtml, rows) => {
    const table = document.createElement('table');
    table.innerHTML = headHtml;
    const tbody = document.createElement('tbody');
    for (const [name, count] of rows) {
      const tr = document.createElement('tr'), nameTd = document.createElement('td'), countTd = document.createElement('td');
      nameTd.textContent = name; nameTd.className = 'name'; countTd.textContent = count.toLocaleString(); countTd.className = 'num';
      tr.append(nameTd, countTd); tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    const wrap = document.createElement('div'); wrap.className = 'table-wrap'; wrap.appendChild(table);
    return wrap;
  };
  Object.assign(WS, {infoLine, makeTable});
})();
