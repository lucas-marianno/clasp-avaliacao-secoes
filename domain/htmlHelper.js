
/**
 * @param {CacheHandler} cacheHandler
 * @returns {HtmlService.HtmlOutput}
 */
function _generateIndex(cacheHandler) {
  if (!cacheHandler) cacheHandler = new CacheHandler();

  const htmlTemplate = HtmlService.createTemplateFromFile("ui/index.html");
  let perguntasPayload = cacheHandler.loadPerguntas();

  if (!perguntasPayload) {
    perguntasPayload = (new DataHandler).loadPerguntas();

    cacheHandler.savePerguntas(perguntasPayload);
  }

  Logger.log(JSON.stringify(JSON.parse(perguntasPayload).slice(0, 5), null, 2));

  htmlTemplate.dbIndexes = JSON.stringify(CONFIG.spreadSheetTabs.perguntasDB.indexes);
  htmlTemplate.perguntasPayload = perguntasPayload;
  let htmlOutput = htmlTemplate.evaluate();

  cacheHandler.saveHtml(htmlOutput, CACHE_KEYS.indexHtml);
  Logger.log("Loaded 'ui/index.html' from file and stored into cache");

  return htmlOutput;
}

/**
 * @param {CacheHandler} cacheHandler
 * @returns {HtmlService.HtmlOutput}
 */
function _generateNotAccepting(cacheHandler) {
  if (!cacheHandler) cacheHandler = new CacheHandler();

  const htmlOutput = HtmlService.createHtmlOutputFromFile("ui/notAcceptingResponses.html");

  cacheHandler.saveHtml(htmlOutput, CACHE_KEYS.notAcceptingHtml);
  Logger.log("Loaded 'ui/notAcceptingResponses.html' from file and stored into cache");

  return htmlOutput;
}











