function generateEnvironment() {
  (new Environment());
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
    // this._moveToProjectFolder([ScriptApp.getScriptId()]);
  }

  installTriggers() {
    for (let tg of ScriptApp.getProjectTriggers()) ScriptApp.deleteTrigger(tg);

    ScriptApp.newTrigger("onOpen").forSpreadsheet(this.ss).onOpen().create();
    ScriptApp.newTrigger("purgeRawData").timeBased().everyHours(1).create();
    ScriptApp.newTrigger("backUpSpreadSheet").timeBased().everyHours(8).create()

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
   * @param {Integer} lastProccessedRawDataRow
   * @returns {SpreadsheetApp.Spreadsheet}
   */
  static generateExternalRespostasSs(lastProccessedRawDataRow) {
    const props = PropertiesService.getScriptProperties();

    // create file
    const fileName = `Avaliação das Seções - Respostas a partir de #${lastProccessedRawDataRow}`;
    const ss = SpreadsheetApp.create(fileName);

    // use / create folder
    let folder;
    try {
      folder = DriveApp.getFolderById(CONFIG.purgedRespostas.folderId);
    } catch (e) {
      folder = DriveApp.createFolder(CONFIG.purgedRespostas.folderName);
      props.setProperty("purgedRespostasFolderId", folder.getId());

      Logger.log("Created purgedRespostasFolder with id " + folder.getId());
    }

    // move file to folder
    const ssFile = DriveApp.getFileById(ssId);
    ssFile.moveTo(folder);

    Logger.log(`Generated external respostas ss with id '${ssId}' in folder '${folder.getId()}'`);

    // add fileId to props
    const ssId = ss.getId();
    const propKey = "purgedRespostasCurrentSsId"
    props.setProperty(propKey, ssId);

    Logger.log(`updated prop ${propKey}`);

    // rename tab
    const tab = ss.getSheets()[0];
    tab.setName(CONFIG.purgedRespostas.sheetName);

    // create tab headers
    const tabHeader = Object.keys(CONFIG.purgedRespostas.indexes);
    tab.appendRow(tabHeader);

    // delete remaining rows
    tab.deleteColumns(tabHeader.length + 1, tab.getMaxColumns() - tabHeader.length);
    tab.deleteRows(2, tab.getMaxRows() - 1);

    return ss;
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







