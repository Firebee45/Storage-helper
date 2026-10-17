(() => {
  const {$} = WS;
  const stamp = () => WS.view.code || 'world';
  $('exportCsv').addEventListener('click', () => WS.downloadBlob(new Blob([WS.itemsCsv()], {type:'text/csv;charset=utf-8;'}), `minecraft-world-items-${stamp()}.csv`));
  $('exportXlsx').addEventListener('click', async () => {
    const bytes = await WS.itemsXlsx();
    WS.downloadBlob(new Blob([bytes], {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}), `minecraft-world-items-${stamp()}.xlsx`);
  });
})();
