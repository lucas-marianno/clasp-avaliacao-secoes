/**
 * Gets all perguntas from `PerguntasDB` and generates a Word Document for easy auditing by superiors.
 * 
 * This is probably an over-engineered solution, but I refuse to compile all answers everytime they want to modify and audit the questions.
 * 
 * And yeah, I know this is not aligned with oop principles, but none of the code here will be reused anywhere else.
 * With that being said, I'm not extracting functions, nor creating abstraction an yada yada yada...
 */
function genReport() {
  const doc = (function () {
    try {
      const doc = DocumentApp.openById(CONFIG.reportDocId);
      if (!doc) throw new Error(`Doc does not exist '${CONFIG.reportDocId}'`);

      return doc;

    } catch {
      // crete file
      const fileName = "~auto gerado~ Avaliação das Seções - Todas as perguntas";
      const doc = DocumentApp.create(fileName);

      // move to project folder
      const fileIterator = DriveApp.getFilesByName(fileName);
      const docFile = fileIterator.next();
      const folder = DriveApp.getFolderById(CONFIG.projectFolderId);
      docFile.moveTo(folder);

      // remove any possible duplicates
      while (fileIterator.hasNext()) fileIterator.next().setTrashed(true);

      // save ID to props
      PropertiesService.getScriptProperties().setProperty("resportDocId", doc.getId());

      return doc;
    }
  })();

  const docBody = doc.getBody();
  docBody.clear();

  const departamentoStyle = {};
  departamentoStyle[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.CENTER;
  departamentoStyle[DocumentApp.Attribute.FONT_SIZE] = 16;
  departamentoStyle[DocumentApp.Attribute.BOLD] = true;

  const secaoStyle = {};
  secaoStyle[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.CENTER;
  secaoStyle[DocumentApp.Attribute.FONT_SIZE] = 12;
  secaoStyle[DocumentApp.Attribute.BOLD] = true;

  const titleStyle = {};
  titleStyle[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.LEFT;
  titleStyle[DocumentApp.Attribute.FONT_SIZE] = 10;
  titleStyle[DocumentApp.Attribute.BOLD] = true;

  const descriptionStyle = {};
  descriptionStyle[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.JUSTIFY;
  descriptionStyle[DocumentApp.Attribute.FONT_SIZE] = 10;
  descriptionStyle[DocumentApp.Attribute.BOLD] = false;

  const perguntasData = JSON.parse((new DataHandler()).loadPerguntas());
  const i = CONFIG.spreadSheetTabs.perguntasDB.indexes;

  let departamento = "";
  let secao = "";
  for (let line of perguntasData) {
    if (departamento != line[i.departamento]) {
      if (departamento.length > 0) docBody.appendPageBreak();

      departamento = line[i.departamento];
      docBody.appendParagraph(departamento).setAttributes(departamentoStyle);
      docBody.appendParagraph("");
    }

    if (secao != line[i.secao]) {
      secao = line[i.secao];
      docBody.appendParagraph("");
      docBody.appendParagraph(secao).setAttributes(secaoStyle);
      docBody.appendParagraph("");
    }

    let title = `${line[i.index]}.   ${line[i.topicoTitle]}`;
    docBody.appendParagraph(title).setAttributes(titleStyle);

    let description = `${line[i.topicoDescr]}`;
    docBody.appendParagraph(description).setAttributes(descriptionStyle);

    docBody.appendParagraph("");
  }

  Logger.log(`Report generated!\n\nExported all questions into a Document with id "${doc.getId()}"`);
}
