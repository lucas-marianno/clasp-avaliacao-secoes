function testSaveForm() {
    saveFormData(MOCK_PAYLOAD);
}

const MOCK_PAYLOAD = `[
  {
    "matr": "12345",
    "name": "MOCK USER",
    "idPergunta": 1,
    "toStart": "SE-0 - DEPARTAMENTO EXEMPLO",
    "toStop": "Título do critério avaliado",
    "toContinue": "Lorem ipsum dolo",
    "abster": false,
    "timestamp": 1763558882461
  },
  {
    "matr": "12345",
    "name": "MOCK USER",
    "idPergunta": 2,
    "toStart": "",
    "toStop": " A clareza, suficiência e os meios de comunicação utilizados para informar os professores sobre os objetivos, procedimentos e usos das avaliação",
    "toContinue": "",
    "abster": false,
    "timestamp": 1763558888165
  }
]`;
