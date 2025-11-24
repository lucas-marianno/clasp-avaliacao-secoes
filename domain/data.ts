/**
 * Loads perguntas from spreadsheet into Script Properties
 * 
 * @returns {void}
 */
function _loadPerguntasFromSheet() {
    const ss = SpreadsheetApp.openById(DB_SS.id);
    const perguntasSheet = ss.getSheetByName(DB_SS.sheets.perguntasDB.name);

    const data = perguntasSheet.getDataRange().getValues();

    PropertiesService.getScriptProperties().setProperty(DB_PROPS.perguntas, JSON.stringify(data.slice(1)));

    Logger.log(`Successfully loaded perguntas from Spreadsheet and loaded them into the property "${DB_PROPS.perguntas}"`);
}

/**
 * Loads perguntas from Script Properties and returns a JSON string version of it
 * 
 * @returns {string} JSON stringified data
 */
function _loadPerguntasFromProps() {
    const props = PropertiesService.getScriptProperties();

    const data = props.getProperty(DB_PROPS.perguntas);

    if (data === null || data === "") {
        throw new Error(`There is no property "${DB_PROPS.perguntas}" in Script Properties or property is empty.`);
    }

    Logger.log(`Successfully loaded perguntas from the Script Property "${DB_PROPS.perguntas}"`);

    return data;
}

function _getPerguntas() {
    let data;
    let status;
    let statusMessage;

    try {
        data = _loadPerguntasFromProps();
        status = "success";
    } catch (e) {
        statusMessage = `Failed to load perguntas from Props with error:\n${e}`;

        _loadPerguntasFromSheet();

        try {
            data = _loadPerguntasFromProps();
            status = "success";
            statusMessage = null;

        } catch (er) {
            status = "error";
            statusMessage = `Fatal error on loading perguntas:\n${e}`;

        }
    } finally {
        const payload = {
            status: status,
            data: data,
            statusMessage: statusMessage,
        };

        Logger.log(payload);

        return payload;
    }
}






