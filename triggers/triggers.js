// --------------------------------- SPREADSHEET TRIGGERS

function onOpen() {
  const ui = SpreadsheetApp.getUi();

  ui.createMenu("Atualizar")
    .addItem("Limpar cache", 'clearCache')
    .addItem("Purge raw data", 'purgeRawData')
    .addToUi();
}

function clearCache() {
  (new CacheHandler()).clearCache();
}

// --------------------------------- TIME DRIVEN 

function purgeRawData() {
  (new DataHandler()).purgeRawData();
}
