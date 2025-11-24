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

const MOCK_PERGUNTAS = {
  ID_PERGUNTA: 1,
  TIT_DEPARTAMENTO: "SE-0 - DEPARTAMENTO EXEMPLO",
  TIT_SEÇÃO: "SE-000 - SEÇÃO EXEMPLO",
  TIT_TOPICO: "Título do critério avaliado",
  DESC_TOPICO: `Descrição do critério (opcional)
  
Lorem ipsum dolor sit amet adipiscing bibendum sem orci tempus aliquet gravida, orci amet iaculis aptent blandit quam accumsan donec in facilisis, cursus ante curabitur aliquet condimentum tincidunt facilisis non cubilia lorem et pretium aliquam phasellus ipsum metus quisque auctor tristique donec nibh, praesent congue ultricies aenean ornare ligula sagittis proin sed vestibulum purus tempus aenean neque aliquam curae vivamus purus egestas ligula tincidunt nullam.

Dolor id fringilla ut lacinia sem ut pretium ante, luctus hendrerit porttitor etiam malesuada eleifend vel suscipit fusce molestie posuere venenatis pellentesque fusce eros, etiam amet est netus nostra suspendisse condimentum, nulla felis inceptos id quam velit integer orci pretium placerat maecenas ante congue purus enim sociosqu odio erat eleifend vestibulum euismod, quam convallis posuere habitasse odio vitae quisque faucibus vulputate primis integer tellus fusce.

Suscipit conubia volutpat potenti eu nostra eleifend hac neque tellus nisl, curae nunc porta turpis aptent donec litora velit elit sagittis, dolor non dapibus luctus gravida donec ultrices leo scelerisque risus eleifend vehicula morbi orci ultrices lacinia platea consectetur, dictum curabitur habitant turpis dapibus volutpat metus mollis habitasse, eget venenatis arcu congue potenti imperdiet varius."	1
`,
  ORDEM_INTERNA: 1
}