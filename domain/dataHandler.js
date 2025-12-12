class DataHandler {
  constructor() {
    this._ss = SpreadsheetApp.openById(CONFIG.spreadSheetId);
    this._perguntasSheet = this._ss.getSheetByName(CONFIG.spreadSheetTabs.perguntasDB.name);
    this._rawDataSheet = this._ss.getSheetByName(CONFIG.spreadSheetTabs.respostasRawData.name);
    this._indexes = CONFIG.spreadSheetTabs.respostasRawData.indexes;
    this._statuses = CONFIG.spreadSheetTabs.respostasRawData.statuses;
  }

  /////////////////////////////////////////////////////////////// PUBLIC FUNCTIONS ///////////////////////////////////////////////////////////////

  /**
   * @param {string} rawData
   * @returns {{status: string, message: string}}
   */
  ingestRawData(rawData) {
    const rawDataLen = rawData.length;
    if (rawDataLen > 45000) { // cell has a max char limit of 50k chars
      const msg = `Suas respostas estão muito grandes. Reduza a quantidade de texto das respostas e tente novamente.\n` +
        ` Limite = 45.000 caracteres, suas respostas = ` + rawDataLen;

      Logger.log(`received payload is way too big (${rawDataLen} chars): \n\n ${rawData}`);
      return { status: 'error', message: msg };
    }

    try {
      let data = JSON.parse(rawData);

      const i = this._indexes
      const row = new Array(Object.keys(i).length);

      row[i.matr] = data?.matr;
      row[i.cpf] = data?.cpf;
      row[i.name] = data?.name;
      row[i.rawData] = data?.respostasData;
      row[i.timestamp] = data?.timestamp;
      row[i.status] = CONFIG.spreadSheetTabs.respostasRawData.statuses.pending;

      this._rawDataSheet.appendRow(row); // this is atomic, it does not need to use LockService

      return {
        status: 'success',
        message: 'Resposta salva!',
      };

    } catch (er) {
      Logger.log(`error while saving data:\n${er}`);
      return {
        status: 'error',
        message: `${er}`,
      }
    }
  }

  purgeRawData() {
    if (this._rawDataSheet.getLastRow() <= 1) {
      Logger.log(`Raw data processing aborted, empty table.`);
      return;
    }

    const processResult = this._processRawData();

    if (!processResult) {
      Logger.log(`Raw data purging aborted!!! nothing to process!`);
      return;
    }

    this._saveDataToExternalRespostasSs(processResult);
    this._markAsProccessed(processResult.fromRow, processResult.numRows);

    Logger.log(`Raw data purged from '${CONFIG.spreadSheetTabs.respostasRawData.name}' into db with ID'${CONFIG.purgedRespostas.currentSsId}'`);
  }


  /**
   * @returns {string} JSON
   */
  loadPerguntas() {
    let perguntasData = this._perguntasSheet.getDataRange().getValues();
    perguntasData = perguntasData.slice(1);

    Logger.log(`Loaded perguntas from Spreadsheet`);
    return JSON.stringify(perguntasData);
  }

  /////////////////////////////////////////////////////////////// PRIVATE FUNCTIONS ///////////////////////////////////////////////////////////////

  /**
   * @param {Integer} fromRow
   * @param {Integer} numRows
   */
  _markAsProccessed(fromRow, numRows) {
    const statusColumnRng = this._rawDataSheet.getRange(fromRow, this._indexes.status + 1, numRows, 1);
    const newValues = new Array(numRows).fill([this._statuses.processed]);

    statusColumnRng.setValues(newValues);

    Logger.log(`Updated ${CONFIG.spreadSheetTabs.respostasRawData.name}'s status column from row #${fromRow} up to row #${fromRow + numRows}.`);
  }

  /**
   * @returns {{bulkData: any[][], fromRow: Integer, numRows: Integer}}
   */
  _processRawData() {

    const rawData = this._rawDataSheet.getDataRange().getValues();

    if (rawData.length <= 1) return;

    let bulkData = [];
    let fromRow;

    for (let r = 0; r < rawData.length; r++) {
      const isPending = rawData[r][this._indexes.status] === this._statuses.pending;

      if (!isPending) continue;
      if (!fromRow) fromRow = r + 1;

      const userMatr = rawData[r][this._indexes.matr];
      const userCpf = rawData[r][this._indexes.cpf];
      const userName = rawData[r][this._indexes.name];
      const timestamp = rawData[r][this._indexes.timestamp];

      let respostasData = rawData[r][this._indexes.rawData];
      respostasData = JSON.parse(respostasData);
      respostasData = respostasData.map(e => [userMatr, userCpf, userName, e.idPergunta, e.toStart, e.toStop, e.toContinue, e.abster, timestamp]);

      bulkData.push(...respostasData);
    }

    if (!fromRow) return;
    let numRows = rawData.length - fromRow + 1;

    Logger.log(`Processed '${CONFIG.spreadSheetTabs.respostasRawData.name}' up to row #${rawData.length}`);
    Logger.log(`Processed ${numRows} new raw responses with status ${this._statuses.pending} into ${bulkData.length} individual answers.`);

    return {
      bulkData: bulkData,
      fromRow: fromRow,
      numRows: numRows,
    }
  }

  /**
   * @returns {bulkData: any[][], fromRow: Integer, numRows: Integer}
   */
  _saveDataToExternalRespostasSs(processResult) {
    Logger.log("Saving data to external Respostas Ss");

    // open / create external SS
    let externalSS;
    try {
      externalSS = SpreadsheetApp.openById(CONFIG.purgedRespostas.currentSsId);
    } catch (e) {
      externalSS = Environment.generateExternalRespostasSs(processResult.fromRow);
    }

    let externalDB = externalSS.getSheetByName(CONFIG.purgedRespostas.sheetName);

    // check for SS capacity
    // gsheets has a hard limit of 10kk cells. but it becomes really slugish with anything over 100k rows or over 1mil cells.
    const maxUsableNumberOfRows = 100000;
    const rowCount = externalDB.getLastRow();
    if (rowCount >= maxUsableNumberOfRows) {
      Logger.log(`Current external ss with ID '${CONFIG.purgedRespostas.currentSsId}' has reached 100% capacity. Creating new external ss to receive purged respostas.`);
      externalSS = Environment.generateExternalRespostasSs(processResult.fromRow);
      externalDB = externalSS.getSheetByName(CONFIG.purgedRespostas.sheetName);
    } else {
      Logger.log(`Current external ss with ID '${CONFIG.purgedRespostas.currentSsId}' is at ${rowCount / maxUsableNumberOfRows * 100}% capacity. [${rowCount} rows]`)
    }

    const bulkData = processResult.bulkData;

    const lock = LockService.getScriptLock();
    try {
      lock.waitLock(30000);

      const nextRowNumber = externalDB.getLastRow() + 1;
      const appendDataRng = externalDB.getRange(nextRowNumber, 1, bulkData.length, bulkData[0].length);

      appendDataRng.setValues(bulkData);

      Logger.log(`Successfully saved ${bulkData.length} new answers to external db with id '${externalSS.getId()}' with tab name '${CONFIG.purgedRespostas.sheetName}'.`);

    } catch (e) {
      Logger.log(`An error occurred while saving data batch from raw to db:\n\n` + e);

    } finally {
      SpreadsheetApp.flush();
      lock.releaseLock();
    }
  }
}













