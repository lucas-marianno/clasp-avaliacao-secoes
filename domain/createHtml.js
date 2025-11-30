/**
 * @param {CacheHandler} cacheHandler
 * @returns {HtmlService.HtmlOutput}
 */
function _createHtml(cacheHandler) {
  const htmlTemplate = HtmlService.createTemplateFromFile("ui/index.html");
  let perguntasPayload = cacheHandler.loadPerguntas();

  if (!perguntasPayload) {
    perguntasPayload = (new DataHandler).loadPerguntas();

    cacheHandler.savePerguntas(perguntasPayload);
  }

  htmlTemplate.dbIndexes = JSON.stringify(CONFIG.spreadSheetTabs.perguntasDB.indexes);
  htmlTemplate.perguntasPayload = perguntasPayload;
  let htmlOutput = htmlTemplate.evaluate();

  cacheHandler.saveHtml(htmlOutput);
  Logger.log("Loaded htmlOutput from file and stored into cache");

  return htmlOutput;
}