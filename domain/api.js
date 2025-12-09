/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *                                                                                       
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *                                                                                       
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *                                                                                       
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *                                                                                       
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *                                                                                       
 * * * * * * * * All functions in this file are accessed via web app / api * * * * * * * * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 * * * * * * * * * * DO NOT CHANGE THEIR NAMES, PARAMS OR RETURN VALUES  * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
*/

function doGet() {
  const cacheHandler = new CacheHandler();

  let htmlOutput = cacheHandler.getHtml(CACHE_KEYS.indexHtml) || _generateIndex(cacheHandler);

  return htmlOutput.setTitle("Avaliação SE - 2025");
}

function saveFormData(rawData) {
  const handler = new DataHandler();

  return handler.ingestRawData(rawData);
}

/**
  * @param {string} matr
  */
function validateMatricula(matr) {
  if (!/^\d{5}$/.test(matr)) return { status: "error", msg: "A matrícula deve possuir exatamente 5 dígitos" };

  matr = parseInt(matr);

  // check cache
  const cache = new CacheHandler();
  let matriculas = cache.loadMatriculas();

  if (matriculas) {
    matriculas = JSON.parse(matriculas); // string => number[]

  } else { // check titExer ss
    const titExercHelper = new TitExercHelper();
    matriculas = titExercHelper.getMatriculas();

    cache.saveMatriculas(JSON.stringify(matriculas));

  }

  const found = matriculas.findIndex(e => e === matr);

  if (found === -1) return { status: "error", msg: "Matrícula não cadastrada" };

  return { status: "success", msg: "Matrícula válida" };

}


