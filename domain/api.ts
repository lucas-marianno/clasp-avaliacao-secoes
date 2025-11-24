/**
 * All functions in this file are accessed via web app / api
 */

function doGet() {
    const htmlPage = HtmlService.createTemplateFromFile("ui/index.html");

    htmlPage.dbIndexes = JSON.stringify(DB_SS.sheets.perguntasDB.indexes);
    htmlPage.perguntasPayload = JSON.stringify(_getPerguntas());

    return htmlPage.evaluate().setTitle("Avaliação SE - 2025");
}

function saveFormData(data) {
    Logger.log(data);

    data = JSON.parse(data);
    data = data.map(e => [e.matr, e.name, e.idPergunta, e.toStart, e.toStop, e.toContinue, e.abster, e.timestamp]);

    const ss = SpreadsheetApp.openById(DB_SS.id);
    const respostasDB = ss.getSheetByName(DB_SS.sheets.respostasDB.name);

    const lock = LockService.getScriptLock();

    try {
        lock.waitLock(30000);

        try {
            const nextRowNumber = respostasDB.getLastRow() + 1;
            const appendDataRng = respostasDB.getRange(nextRowNumber, 1, data.length, data[0].length);

            appendDataRng.setValues(data);

            return payload = {
                status: 'success',
                message: 'Resposta salva!',
            }

        } catch (er) {
            Logger.log(`error while saving data:\n${er}`);

            return payload = {
                status: 'error',
                message: `${er}`,
            }
        }
    } catch (e) {
        Logger.log(`Error while saving, too many requests:\n\n${e}`);

        return payload = {
            status: 'error',
            message: `Muitos acessos simultâneos! Por gentileza, tente novamente em alguns minutos.`
        }

    } finally {
        SpreadsheetApp.flush(); // Make sure all pending changes are made before releasing the lock
        lock.releaseLock();
    }
}
