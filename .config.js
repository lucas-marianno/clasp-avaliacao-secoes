const CONFIG = {
  IS_DEV_MODE: false,
  DISABLE_CACHE: false,
  projectFolderId: PropertiesService.getScriptProperties().getProperty("projectFolderId"),
  reportDocId: PropertiesService.getScriptProperties().getProperty("reportDocId"),
  spreadSheetId: PropertiesService.getScriptProperties().getProperty("spreadSheetId"),
  spreadSheetTabs: {
    perguntasDB: {
      name: this.IS_DEV_MODE ? "_dev_PERGUNTAS" : "PERGUNTAS",
      indexes: {
        index: 0,
        id: 1,
        departamento: 2,
        secao: 3,
        topicoTitle: 4,
        topicoDescr: 5,
      }
    },
    perguntasMock: {
      name: "_PERGUNTAS_MOCK_",
      indexes: {
        index: 0,
        id: 1,
        departamento: 2,
        secao: 3,
        topicoTitle: 4,
        topicoDescr: 5,
      }
    },
    respostasDB: {
      name: this.IS_DEV_MODE ? "_dev_DB_RESPOSTAS" : "_DB_RESPOSTAS",
      indexes: {
        matr: 0,
        nome: 1,
        idPergunta: 2,
        toStart: 3,
        toStop: 4,
        toContinue: 5,
        abster: 6,
        timestamp: 7
      }
    },
    respostasRawData: {
      name: "_DB_RESPOSTAS_RAW_DATA_",
      indexes: {
        matr: 0,
        name: 1,
        rawData: 2,
        timestamp: 3,
        status: 4,
      },
      statuses: {
        pending: "PENDING",
        processed: "PROCESSED",
        error: "ERROR",
      }
    }
  },
}
