function onOpen() {
    const ui = SpreadsheetApp.getUi();

    ui.createMenu("Atualizar")
        .addItem("Atualizar lista de perguntas", '_loadPerguntasFromSheet')
        .addToUi();
}
