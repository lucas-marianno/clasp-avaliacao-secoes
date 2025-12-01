function generateEnvironment() {
  new Environment();
}

class Environment {
  constructor() {
    this._propsService = PropertiesService.getScriptProperties();
    this._checkAndGenerateProps();

    /**@type {DriveApp.Folder}*/
    this.projectFolder = this._generateProjectFolder();

    /**@type {SpreadsheetApp.Spreadsheet}*/
    this.ss = this._generateDbSs();

    // moves THIS script to project folder
    this._moveToProjectFolder([ScriptApp.getScriptId()]);
  }

  installTriggers() {
    for (let tg of ScriptApp.getProjectTriggers()) ScriptApp.deleteTrigger(tg);

    ScriptApp.newTrigger("onOpen").forSpreadsheet(this.ss).onOpen().create();
    ScriptApp.newTrigger("purgeRawData").timeBased().everyHours(1).create();

    Logger.log(`Triggers installed!`);
  }

  _checkAndGenerateProps() {
    if (!CONFIG.projectFolderId) {
      this._propsService.setProperty("projectFolderId", "blank");
      Logger.log(`Property "projectFolderId" did not exist and was created with blank value`);
    }

    if (!CONFIG.reportDocId) {
      this._propsService.setProperty("reportDocId", "blank");
      Logger.log(`Property "reportDocId" did not exist and was created with blank value`);
    }

    if (!CONFIG.spreadSheetId) {
      this._propsService.setProperty("spreadSheetId", "blank");
      Logger.log(`Property "spreadSheetId" dit not exist and was created with blank value`);
    }
  }

  /**
   * @returns {DriveApp.Folder}
   */
  _generateProjectFolder() {
    try {
      return DriveApp.getFolderById(CONFIG.projectFolderId);

    } catch {
      const folderName = "Avaliação das Seções 2.0";
      let folder;

      const iterator = DriveApp.getFoldersByName(folderName);
      if (!iterator.hasNext()) {
        folder = DriveApp.createFolder(folderName);

      } else {
        folder = iterator.next();
        // remove possible duplicates
        while (iterator.hasNext()) iterator.next().setTrashed(true);

      }

      this._propsService.setProperty("projectFolderId", folder.getId());

      Logger.log(`Created project folder with id '${folder.getId()}'`);
      return folder;
    }
  }

  /**
   * @param {string[]} filesIds
   */
  _moveToProjectFolder(filesIds) {
    for (let id of filesIds) {
      const file = DriveApp.getFileById(id);
      file.moveTo(this.projectFolder);
    }
  }

  /**
   * @returns {SpreadsheetApp.Spreadsheet}
   */
  _generateDbSs() {
    try {
      return SpreadsheetApp.openById(CONFIG.spreadSheetId);

    } catch {
      const fileName = "Avaliação das Seções - DB";

      const iterator = DriveApp.getFilesByName(fileName);
      if (!iterator.hasNext()) {
        // create new Spreadsheet
        this.ss = SpreadsheetApp.create(fileName);
        Logger.log(`Created Spreadsheet database with id '${this.ss.getId()}'`);

      } else {
        this.ss = iterator.next();
        // remove duplicates
        while (iterator.hasNext()) iterator.next().setTrashed(true);
      }

      // move ss to projectFolder
      const ssId = this.ss.getId();
      this._moveToProjectFolder([ssId]);

      // save ss id to props
      this._propsService.setProperty("spreadSheetId", ssId);

      this._generateTabs();
      this.installTriggers();

      return this.ss;
    }
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







