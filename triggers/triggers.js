// --------------------------------- INSTALLER
function installTriggers() { (new Environment).installTriggers()};


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

function backUpSpreadSheet() {
  const ssFile = DriveApp.getFileById(CONFIG.spreadSheetId);
  const backupFolder = DriveApp.getFolderById(CONFIG.autoBackUpsFolderId);

  const timestamp = new Date().toLocaleString().replace(/[,|\s]+/g, '_').replace(/\//g,'.');
  const copyFile = ssFile.makeCopy().setName(`~autobackup~${timestamp}`).moveTo(backupFolder);

  Logger.log(`Back up created with file id '${copyFile.getId()}' in folder id '${CONFIG.autoBackUpsFolderId}'`);
}
