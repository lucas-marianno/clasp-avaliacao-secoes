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

  let htmlOutput;

  if (CONFIG.IS_ACCEPTING_RESPONSES) {
    htmlOutput = cacheHandler.getHtml(CACHE_KEYS.indexHtml) || _generateIndex(cacheHandler);
  } else {
    htmlOutput = cacheHandler.getHtml(CACHE_KEYS.notAcceptingHtml) || _generateNotAccepting(cacheHandler);
  }

  return htmlOutput.setTitle("Avaliação SE - 2025");
}

function saveFormData(rawData) {
  return CONFIG.IS_ACCEPTING_RESPONSES ?
    (new DataHandler()).ingestRawData(rawData) :
    { status: 'error', message: `Este documento de avaliação não está mais aceitando respostas. O prazo para envio das repostas foi de 09/12/2025 à 19/12/2025 até as 22h.`, };
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


