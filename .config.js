const CONFIG = {
  IS_DEV_MODE: ScriptApp.getService().getUrl().endsWith("/dev"),
  DISABLE_CACHE: false,
  IS_ACCEPTING_RESPONSES:(() => {
    const fromDate = new Date(2025, 12 - 1, 09, 14); // 09/12/2025 14:00
    const upToDate = new Date(2025, 12 - 1, 19, 22); // 19/12/2025 22:00
    const now = new Date();

    return now > fromDate && now <= upToDate;
  })(),
  projectFolderId: PropertiesService.getScriptProperties().getProperty("projectFolderId"),
  autoBackUpsFolderId: PropertiesService.getScriptProperties().getProperty("autoBackUpsFolderId"),
  reportDocId: PropertiesService.getScriptProperties().getProperty("reportDocId"),
  spreadSheetId: PropertiesService.getScriptProperties().getProperty("spreadSheetId"),
  titularidadesExercicioId: PropertiesService.getScriptProperties().getProperty("titularidadesExercicioId"),
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
        cpf: 1,
        nome: 2,
        idPergunta: 3,
        toStart: 4,
        toStop: 5,
        toContinue: 6,
        abster: 7,
        timestamp: 8
      }
    },
    respostasRawData: {
      name: "_DB_RESPOSTAS_RAW_DATA_",
      indexes: {
        matr: 0,
        cpf: 1,
        name: 2,
        rawData: 3,
        timestamp: 4,
        status: 5,
      },
      statuses: {
        pending: "PENDING",
        processed: "PROCESSED",
        error: "ERROR",
      }
    },
    titularidadesExercicio: {
      name: "DadosCompleto",
      indexex: {
        matr: 0,
        dig: 1,
        name: 2,
        cargo: 3,
        uniExercicio: 9,
        funcao: 10
      }
    }
  }
}
