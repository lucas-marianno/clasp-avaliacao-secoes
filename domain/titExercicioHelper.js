class TitExercHelper {
  constructor() {
    /**@type {GoogleAppsScript.Spreadsheet.Spreadsheet}*/
    this.teSs = this._getSs();
  }

  /**
  * Fetches matriculas from a external spreadsheet and returns a list of all matriculas
  * @returns {number[]}
  */
  getMatriculas() {
    const sheet = this.teSs.getSheetByName(CONFIG.spreadSheetTabs.titularidadesExercicio.name);
    const nRows = sheet.getLastRow();

    if (nRows < 9000) throw new Error(`There was an error while fetching matriculas from titularidadesExercicio. Only found ${nRows} matriculas!`);

    const matrRng = sheet.getRange(2, CONFIG.spreadSheetTabs.titularidadesExercicio.indexex.matr + 1, nRows - 1, 1);
    const matriculas = matrRng.getValues().map(row => row[0]);

    return matriculas;
  }


  _getSs() {
    return SpreadsheetApp.openById(CONFIG.titularidadesExercicioId);
  }
}

