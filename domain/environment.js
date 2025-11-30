class Environment {
  constructor() {
    /**@type {SpreadsheetApp.Spreadsheet}*/
    this.ss = SpreadsheetApp.openById(CONFIG.spreadSheetId) || this._generateDbSs();
  }
  
  installTriggers() {
    for (let tg of ScriptApp.getProjectTriggers()) ScriptApp.deleteTrigger(tg);

    ScriptApp.newTrigger("onOpen").forSpreadsheet(this.ss).onOpen().create();
    ScriptApp.newTrigger("purgeRawData").timeBased().everyHours(1).create();

    Logger.log(`Triggers installed!`);
  }

  /**
   * @returns {SpreadsheetApp.Spreadsheet}
   */
  _generateDbSs() {
    if (this.ss) {
      Logger.log(`Spreadsheet database creation aborted. Document already exists!`);
      return this.ss;
    }

    this.ss = SpreadsheetApp.create("Avaliação das Seções - DB");
    Logger.log(`Created Spreadsheet database with id '${this.ss.getId()}'`);

    this._generateTabs();
    this.installTriggers();

    return this.ss;
  }

  /**
   * @returns {void}
   */
  _generateTabs() {
    const tabs = Object.values(CONFIG.spreadSheetTabs);

    for (let entry of tabs) {

      let tab = this.ss.getSheetByName(entry.name);
      if (!tab) {
        tab = this.ss.insertSheet().setName(entry.name);
        Logger.log(`Created new tab with name '${entry.name}'`);
      }

      if (tab.getLastRow() > 0) {
        Logger.log(`Header creation aborted! Tab '${entry.name}' is not empty.`);
        continue;
      }

      const tabHeader = Object.keys(entry.indexes);

      tab.appendRow(tabHeader);

      tab.deleteColumns(tabHeader.length + 1, tab.getMaxColumns() - tabHeader.length);
      tab.deleteRows(2, tab.getMaxRows() - 1);

      Logger.log(`Tab '${entry.name}' was populated`);
    }

    // delete default tab
    const sheet1 = this.ss.getSheetByName("Sheet1");
    if (sheet1) {
      this.ss.deleteSheet(sheet1);
    }
  }
}

function generateEnvironment(){
  new Environment();
}






