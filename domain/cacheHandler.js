const CACHE_KEYS = {
  perguntas: "perguntas",
  indexHtml: "index_html",
  matriculas: "matriculas"
}

class CacheHandler {
  constructor() {
    this._cacheService = CacheService.getScriptCache();

    if (CONFIG.DISABLE_CACHE) {
      Logger.log("Caching is disabled in .config");
      this.clearCache();
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
   * @returns {HtmlService.HtmlOutput}
   */
  getIndexHtml() {
    let htmlRawData = this._cacheService.get(CACHE_KEYS.indexHtml);

    if (!htmlRawData) return;

    Logger.log("Loaded htmlOutput from cache");
    return HtmlService.createHtmlOutput(htmlRawData);
  }

  /**
   * @param {HtmlService.HtmlOutput}
   */
  saveHtml(htmlOutput) {
    this._cacheService.put(CACHE_KEYS.indexHtml, htmlOutput.getContent(), 60 * 60); // 1h cache
    Logger.log("Saved htmlOutput into cache");
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
    this._cacheService.put(CACHE_KEYS.perguntas, perguntasJsonString, 60 * 60);// 1h cache

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
