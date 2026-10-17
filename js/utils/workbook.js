(() => {
  const NS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
  const RNS = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
  const PKG = 'http://schemas.openxmlformats.org/package/2006/relationships';
  const HEAD = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
  const esc = v => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const letter = i => String.fromCharCode(65 + i);
  const width = len => Math.ceil(len * 1.15) + 3;
  const STYLES = HEAD + `<styleSheet xmlns="${NS}"><fonts count="4"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FF006100"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FF9C0006"/><name val="Calibri"/></font></fonts><fills count="4"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFC6EFCE"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFFC7CE"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="5"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/><xf numFmtId="3" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="0" fontId="2" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center"/></xf><xf numFmtId="0" fontId="3" fillId="3" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
  const text = (ref, v, style) => `<c r="${ref}" t="inlineStr"${style ? ` s="${style}"` : ''}><is><t xml:space="preserve">${esc(v)}</t></is></c>`;
  const cell = (ref, col, v) => col.type === 'bool' ? `<c r="${ref}" s="${v ? 3 : 4}" t="b"><v>${v ? 1 : 0}</v></c>` : col.type === 'num' ? `<c r="${ref}" s="2"><v>${v}</v></c>` : text(ref, v);
  const sheetXml = s => {
    const n = s.rows.length, last = letter(s.cols.length - 1);
    const widths = s.cols.map((c, i) => {
      let w = c.h.length + (c.type === 'bool' ? 4 : 0);
      if (c.type !== 'bool') for (const r of s.rows) w = Math.max(w, (c.type === 'num' ? Number(r[i]).toLocaleString('en-US') : String(r[i])).length);
      return width(w);
    });
    let data = `<row r="1">${s.cols.map((c, i) => text(letter(i) + '1', c.h, 1)).join('')}</row>`;
    s.rows.forEach((r, j) => { data += `<row r="${j + 2}">${s.cols.map((c, i) => cell(letter(i) + (j + 2), c, r[i])).join('')}</row>`; });
    return HEAD + `<worksheet xmlns="${NS}"><sheetPr><tabColor rgb="FF${s.tab}"/></sheetPr><sheetViews><sheetView workbookViewId="0"${s.first ? ' tabSelected="1"' : ''}><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${widths.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join('')}</cols><sheetData>${data}</sheetData><autoFilter ref="A1:${last}${n + 1}"/></worksheet>`;
  };
  const build = sheets => {
    const zip = new JSZip(), N = sheets.length;
    const parts = sheets.map((s, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('');
    zip.file('[Content_Types].xml', HEAD + `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${parts}</Types>`);
    zip.file('_rels/.rels', HEAD + `<Relationships xmlns="${PKG}"><Relationship Id="rId1" Type="${RNS}/officeDocument" Target="xl/workbook.xml"/></Relationships>`);
    const names = sheets.map((s, i) => `<sheet name="${esc(s.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('');
    const filters = sheets.map((s, i) => `<definedName name="_xlnm._FilterDatabase" localSheetId="${i}" hidden="1">'${esc(s.name)}'!$A$1:$${letter(s.cols.length - 1)}$${s.rows.length + 1}</definedName>`).join('');
    zip.file('xl/workbook.xml', HEAD + `<workbook xmlns="${NS}" xmlns:r="${RNS}"><sheets>${names}</sheets><definedNames>${filters}</definedNames></workbook>`);
    const rels = sheets.map((s, i) => `<Relationship Id="rId${i + 1}" Type="${RNS}/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('');
    zip.file('xl/_rels/workbook.xml.rels', HEAD + `<Relationships xmlns="${PKG}">${rels}<Relationship Id="rId${N + 1}" Type="${RNS}/styles" Target="styles.xml"/></Relationships>`);
    zip.file('xl/styles.xml', STYLES);
    sheets.forEach((s, i) => zip.file(`xl/worksheets/sheet${i + 1}.xml`, sheetXml({...s, first:i === 0})));
    return zip.generateAsync({type:'uint8array', compression:'DEFLATE'});
  };
  WS.buildWorkbook = build;
})();
