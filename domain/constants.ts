const IS_DEV_MODE = false;

const DB_SS = {
    id: PropertiesService.getScriptProperties().getProperty("db_id"),
    sheets: {
        perguntasDB: {
            name: IS_DEV_MODE ? "_dev_PERGUNTAS" : "PERGUNTAS",
            indexes: {
                id: 0,
                departamento: 1,
                secao: 2,
                topicoTitle: 3,
                topicoDescr: 4,
                index: 5,
            },
        },
        respostasDB: {
            name: IS_DEV_MODE ? "_dev_DB_RESPOSTAS" : "_DB_RESPOSTAS",
            indexes: {
                matr: 0,
                nome: 1,
                dept_avaliado: 2,
                tit_topico: 3,
                desc_topico: 4,
                start: 5,
                stop: 6,
                contin: 7,
                abster: 8,
                timestamp: 9,
            },
        },
    },
}

const DB_PROPS = {
    perguntas: "perguntas"
}
