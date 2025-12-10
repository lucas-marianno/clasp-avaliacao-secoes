const CACHE_KEYS = { // this is only here because .gas classes do not accept static parameters... 
  perguntas: CONFIG.IS_DEV_MODE ? "perguntas_dev" : "perguntas",
  indexHtml: CONFIG.IS_DEV_MODE ? "index_html_dev" : "index_html",
  matriculas: CONFIG.IS_DEV_MODE ? "matriculas_dev" : "matriculas",
  notAcceptingHtml: CONFIG.IS_DEV_MODE ? "notAcceptingHtml_dev" : "notAcceptingHtml",
}


class CacheHandler {
  constructor() {
    this._cacheService = CacheService.getScriptCache();

    if (CONFIG.DISABLE_CACHE) {
      Logger.log("Caching is disabled in .config");
      this.clearCache();
    }

    if (CONFIG.IS_DEV_MODE) {
      Logger.log("Caching is in '_dev' mode");
    }
  }

  /**
   * @returns {void}
   */
  clearCache() {
    const keys = Object.values(CACHE_KEYS);

    this._cacheService.removeAll(keys);

    Logger.log(`Cache keys cleared:\n` + keys);
  }

  /**
   * @param {CACHE_KEYS} cacheKey
   * @returns {HtmlService.HtmlOutput}
   */
  getHtml(cacheKey) {
    let htmlRawData = this._cacheService.get(cacheKey);

    if (!htmlRawData) return;

    Logger.log(`Loaded htmlOutput with key '${cacheKey}' from cache`);
    return HtmlService.createHtmlOutput(htmlRawData);
  }

  /**
   * @param {HtmlService.HtmlOutput} htmlOutput
   * @param {CACHE_KEYS} cacheKey
   */
  saveHtml(htmlOutput, cacheKey) {
    this._cacheService.put(cacheKey, htmlOutput.getContent(), 60 * 60 * 6); // 6h cache
    Logger.log(`Saved htmlOutput with key '${cacheKey}' into cache`);
  }


  /**
   * @returns {string} JSON 
   */
  loadPerguntas() {
    let data = this._cacheService.get(CACHE_KEYS.perguntas);

    if (!data) return;

    Logger.log(`Loaded perguntas from ScriptCache "${CACHE_KEYS.perguntas}"`);
    return data;
  }
  /**
   * @param {string} perguntasJsonString
   */
  savePerguntas(perguntasJsonString) {
    if (typeof perguntasJsonString !== "string") throw new TypeError(`perguntasJsonString must be a JSON string`);
    this._cacheService.put(CACHE_KEYS.perguntas, perguntasJsonString, 60 * 60 * 6);// 6h cache

    Logger.log(`Saved perguntas to cache.`);
  }

  /**
  * @param {string} matriculasJson
  */
  saveMatriculas(matriculasJson) {
    if (typeof matriculasJson !== "string") throw new TypeError(`matriculasJson must be a JSON string`);
    this._cacheService.put(CACHE_KEYS.matriculas, matriculasJson, 60 * 60 * 6); // 6h cache

    Logger.log(`Saved matriculas to cache with json.length of ${matriculasJson.length}`);
  }

  /**
  * Returns a JSON parsed string
  * @returns {String} 
  */
  loadMatriculas() {
    const matriculas = this._cacheService.get(CACHE_KEYS.matriculas);
    if (!matriculas) return;

    Logger.log(`Loaded matriculas from cache with json.length of ${matriculas.length}`);
    return matriculas;
  }
}
