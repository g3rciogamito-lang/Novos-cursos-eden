import {
  Course,
  Exercise,
  ExerciseType,
  LessonFullContent,
  LessonSummary,
  Module,
} from '../types/university';

const EXERCISE_TYPE_CYCLE: ExerciseType[] = [
  'multiple-choice',
  'true-false',
  'matching',
  'fill-blank',
  'problem-solving',
  'practical',
  'case-study',
  'simulation',
  'essay',
  'assignment',
];

export function buildModuleExercises(course: Course, module: Module): Exercise[] {
  const concepts = module.coreConcepts;
  const vocab = module.vocabulary;
  const lessons = module.lessons;
  const exercises: Exercise[] = [];

  // Create 5 varied exercises per module (across all 10 types over consecutive modules)
  for (let idx = 0; idx < 5; idx++) {
    const typeIndex = (module.order * 3 + idx) % EXERCISE_TYPE_CYCLE.length;
    const type = EXERCISE_TYPE_CYCLE[typeIndex];
    const targetLesson = lessons[idx % lessons.length];
    const primaryConcept = concepts[idx % concepts.length] || module.title;
    const secondaryConcept = concepts[(idx + 1) % concepts.length] || course.shortTitle;
    const vocabA = vocab[idx % vocab.length];
    const vocabB = vocab[(idx + 1) % vocab.length] || vocab[0];
    const exId = `${module.id}-ex-${idx + 1}`;

    if (type === 'multiple-choice') {
      exercises.push({
        id: exId,
        lessonId: targetLesson.id,
        moduleId: module.id,
        courseId: course.id,
        type,
        title: `Análise Conceptual: ${primaryConcept}`,
        statement: `No contexto do módulo "${module.title}" e da aula "${targetLesson.title}", qual é o papel estrutural de "${primaryConcept}" quando aplicado a ${targetLesson.sectorExample}?`,
        instructions: 'Seleccione a alternativa tecnicamente mais rigorosa e clique em "Verificar resposta".',
        options: [
          `Estabelecer critérios verificáveis para ${targetLesson.keyMechanism}, reduzindo ambiguidade operacional e aumentando a previsibilidade dos resultados.`,
          `Substituir integralmente a necessidade de planeamento prévio e eliminar qualquer etapa de validação humana no processo.`,
          `Restringir a aplicação do módulo apenas a cenários teóricos sem impacto em ${targetLesson.sectorExample}.`,
          `Ignorar as dependências com ${secondaryConcept} para acelerar a execução inicial sem controlo de qualidade.`,
        ],
        evaluationCriteria: [
          'Identificação correcta da função técnica do conceito no fluxo do módulo.',
          'Distinção entre prática profissional rigorosa e atalhos operacionais.',
        ],
        correctAnswer: `Estabelecer critérios verificáveis para ${targetLesson.keyMechanism}, reduzindo ambiguidade operacional e aumentando a previsibilidade dos resultados.`,
        explanation: `"${primaryConcept}" actua em articulação directa com ${targetLesson.keyMechanism}, garantindo que as decisões em ${targetLesson.sectorExample} sejam mensuráveis e auditáveis.`,
        pedagogicalFeedback:
          'Revise a secção de Conceitos Fundamentais da aula para reforçar a ligação entre critério técnico e resultado operacional.',
        points: 20,
      });
    } else if (type === 'true-false') {
      exercises.push({
        id: exId,
        lessonId: targetLesson.id,
        moduleId: module.id,
        courseId: course.id,
        type,
        title: `Validação Técnica: ${targetLesson.focusTopic}`,
        statement: `Afirmação: Em "${module.title}", a implementação eficaz de "${primaryConcept}" dispensa a articulação com "${secondaryConcept}" e não requer validação em ${targetLesson.sectorExample}.`,
        instructions: 'Indique se a afirmação é Verdadeira ou Falsa com base nos fundamentos estudados.',
        options: ['Verdadeiro', 'Falso'],
        evaluationCriteria: [
          'Reconhecimento da interdependência sistémica entre conceitos do módulo.',
        ],
        correctAnswer: 'Falso',
        explanation: `A afirmação é Falsa porque "${primaryConcept}" depende da integração coerente com "${secondaryConcept}" e de verificação contínua em ${targetLesson.sectorExample}.`,
        pedagogicalFeedback:
          'Em formação profissional avançada, nenhum mecanismo opera isolado: observe sempre as interfaces entre módulos.',
        points: 15,
      });
    } else if (type === 'matching') {
      const pairs = [
        {
          id: 'p1',
          left: vocabA?.term || primaryConcept,
          right: vocabA?.definition || `Base estrutural associada a ${targetLesson.keyMechanism}.`,
        },
        {
          id: 'p2',
          left: vocabB?.term || secondaryConcept,
          right: vocabB?.definition || `Elemento complementar aplicado em ${targetLesson.sectorExample}.`,
        },
        {
          id: 'p3',
          left: targetLesson.focusTopic,
          right: `Objectivo central da aula ${targetLesson.order} do módulo ${module.order}.`,
        },
      ];
      exercises.push({
        id: exId,
        lessonId: targetLesson.id,
        moduleId: module.id,
        courseId: course.id,
        type,
        title: `Associação de Conceitos: ${module.title}`,
        statement: 'Associe cada termo técnico à sua definição operacional correspondente.',
        instructions: 'Seleccione a definição correspondente para cada termo e submeta a associação.',
        matchingPairs: pairs,
        evaluationCriteria: [
          'Correspondência exacta dos três termos técnicos do vocabulário do módulo.',
        ],
        correctAnswer: pairs.map((p) => `${p.left} -> ${p.right}`).join(' | '),
        explanation:
          'A precisão terminológica permite comunicar especificações técnicas sem ambiguidade em equipas multidisciplinares.',
        pedagogicalFeedback:
          'Consulte o Vocabulário Técnico da aula sempre que precisar consolidar definições formais.',
        points: 20,
      });
    } else if (type === 'fill-blank') {
      exercises.push({
        id: exId,
        lessonId: targetLesson.id,
        moduleId: module.id,
        courseId: course.id,
        type,
        title: `Preenchimento Técnico: ${targetLesson.title}`,
        statement: `Complete a síntese técnica com o termo correcto estudado em "${module.title}":`,
        blankTemplate: `Na arquitectura de ${course.shortTitle}, o mecanismo de [____] é essencial para estruturar ${targetLesson.focusTopic} com rigor profissional.`,
        instructions: `Escreva o conceito-chave exacto (dica: relaciona-se com "${primaryConcept}").`,
        evaluationCriteria: [
          'Emprego preciso do conceito nuclear da unidade curricular.',
        ],
        correctAnswer: primaryConcept,
        explanation: `O termo "${primaryConcept}" sintetiza o eixo metodológico que sustenta ${targetLesson.focusTopic}.`,
        pedagogicalFeedback:
          'Caso tenha usado um sinónimo próximo, compare a terminologia exacta utilizada nos objectivos da aula.',
        points: 15,
      });
    } else if (type === 'essay') {
      exercises.push({
        id: exId,
        lessonId: targetLesson.id,
        moduleId: module.id,
        courseId: course.id,
        type,
        title: `Questão Discursiva: Aplicação em ${targetLesson.sectorExample}`,
        statement: `Explique, em pelo menos 3 frases estruturadas, como integraria "${primaryConcept}" e "${secondaryConcept}" para resolver um desafio real em ${targetLesson.sectorExample}, indicando critérios de validação.`,
        instructions:
          'Redija a sua resposta argumentada com introdução, mecanismo técnico e critério de verificação.',
        evaluationCriteria: [
          'Clareza na definição de objectivo e contexto.',
          'Articulação explícita entre os dois conceitos do módulo.',
          'Inclusão de um critério mensurável ou verificável de sucesso.',
        ],
        correctAnswer: `Uma resposta completa identifica o problema em ${targetLesson.sectorExample}, descreve o papel de ${primaryConcept} na fase de estruturação, articula com ${secondaryConcept} para controlo de qualidade e define métricas ou testes de verificação.`,
        explanation:
          'A capacidade de justificar escolhas técnicas por escrito distingue a execução mecânica da competência profissional madura.',
        pedagogicalFeedback:
          'Verifique se a sua resposta cobriu os três critérios: contexto, mecanismo e critério de validação.',
        points: 25,
      });
    } else if (type === 'problem-solving') {
      exercises.push({
        id: exId,
        lessonId: targetLesson.id,
        moduleId: module.id,
        courseId: course.id,
        type,
        title: `Resolução de Problema: Diagnóstico em ${targetLesson.focusTopic}`,
        statement: `Cenário: Uma equipa em ${targetLesson.sectorExample} implementou ${targetLesson.focusTopic}, mas registou falhas recorrentes por ausência de controlo em ${targetLesson.keyMechanism}. Descreva o plano de correcção passo a passo.`,
        instructions:
          'Apresente diagnóstico, acção correctiva prioritária e mecanismo de prevenção.',
        evaluationCriteria: [
          'Identificação da causa raiz ligada ao mecanismo da aula.',
          'Sequência lógica de intervenção correctiva.',
          'Definição de indicador ou teste preventivo.',
        ],
        correctAnswer: `1) Auditar o fluxo actual de ${targetLesson.keyMechanism}; 2) Aplicar ${primaryConcept} com parâmetros documentados; 3) Validar com amostra controlada antes da adopção integral.`,
        explanation:
          'Problemas recorrentes exigem intervenção na causa estrutural (processo e validação) e não apenas correcções pontuais.',
        pedagogicalFeedback:
          'Compare a sua sequência com as etapas descritas na secção "Exemplos Práticos" desta aula.',
        points: 25,
      });
    } else if (type === 'practical') {
      exercises.push({
        id: exId,
        lessonId: targetLesson.id,
        moduleId: module.id,
        courseId: course.id,
        type,
        title: `Exercício Prático: Especificação de ${primaryConcept}`,
        statement: `Elabore uma especificação técnica resumida aplicando "${primaryConcept}" ao caso prático de ${targetLesson.sectorExample}, incluindo entradas esperadas, transformação e entrega final.`,
        instructions:
          'Estruture a sua proposta nos três blocos (Entradas, Processamento, Entrega) antes de submeter.',
        evaluationCriteria: [
          'Entradas claramente delimitadas.',
          'Aplicação coerente de ' + targetLesson.keyMechanism + '.',
          'Entrega final verificável.',
        ],
        correctAnswer: `Entradas: requisitos do caso em ${targetLesson.sectorExample}; Processamento: aplicação sistemática de ${primaryConcept} e ${targetLesson.keyMechanism}; Entrega: artefacto documentado e validado face aos critérios do módulo.`,
        explanation:
          'Modelar entradas, processamento e entrega evita falhas de âmbito e facilita a revisão por pares.',
        pedagogicalFeedback:
          'Pode aprofundar este exercício directamente no Laboratório interactivo associado a este curso.',
        points: 25,
      });
    } else if (type === 'case-study') {
      exercises.push({
        id: exId,
        lessonId: targetLesson.id,
        moduleId: module.id,
        courseId: course.id,
        type,
        title: `Estudo de Caso: ${module.caseStudy.title}`,
        statement: `Com base no caso "${module.caseStudy.title}" (${module.caseStudy.context}), explique por que razão a decisão adoptada (${module.caseStudy.application}) produziu o resultado observado e qual risco permaneceria sem monitorização.`,
        instructions:
          'Analise criticamente o caso de estudo apresentando causa, decisão e risco residual.',
        evaluationCriteria: [
          'Leitura rigorosa do contexto e do desafio do caso.',
          'Ligação entre a decisão técnica e o resultado.',
          'Identificação realista de risco residual.',
        ],
        correctAnswer: `A intervenção respondeu directamente ao desafio (${module.caseStudy.challenge}) através de ${module.caseStudy.application}, gerando ${module.caseStudy.outcome}. Sem monitorização contínua, o risco residual seria a degradação gradual da consistência operacional.`,
        explanation:
          'Estudos de caso treinam o julgamento profissional em condições reais onde existem restrições de tempo, orçamento e qualidade.',
        pedagogicalFeedback:
          'Releia a secção "Estudo de Caso" da aula para validar cada detalhe da análise.',
        points: 25,
      });
    } else if (type === 'simulation') {
      exercises.push({
        id: exId,
        lessonId: targetLesson.id,
        moduleId: module.id,
        courseId: course.id,
        type,
        title: `Simulação Guiada: Decisão em ${module.title}`,
        statement: `Numa simulação operacional de ${course.shortTitle}, dispõe de prazo reduzido para entregar ${targetLesson.focusTopic}. Qual a sequência de decisão mais equilibrada entre rigor e velocidade?`,
        instructions: 'Avalie as opções simuladas e seleccione a estratégia profissional recomendada.',
        options: [
          `Definir o escopo mínimo viável de ${primaryConcept}, validar ${targetLesson.keyMechanism} em teste rápido e documentar os pressupostos.`,
          `Saltar toda a fase de revisão técnica para entregar antes do prazo, corrigindo eventuais falhas apenas após reclamação.`,
          `Aumentar a complexidade do sistema sem validar os requisitos fundamentais com as partes interessadas.`,
        ],
        evaluationCriteria: [
          'Equilíbrio entre agilidade de entrega e integridade técnica.',
        ],
        correctAnswer: `Definir o escopo mínimo viável de ${primaryConcept}, validar ${targetLesson.keyMechanism} em teste rápido e documentar os pressupostos.`,
        explanation:
          'Reduzir o escopo inicial mantendo a validação técnica garante entrega fiável dentro do prazo, sem acumular dívida operacional.',
        pedagogicalFeedback:
          'Experimente validar cenários semelhantes no Laboratório prático do curso.',
        points: 20,
      });
    } else {
      exercises.push({
        id: exId,
        lessonId: targetLesson.id,
        moduleId: module.id,
        courseId: course.id,
        type: 'assignment',
        title: `Trabalho Individual: Dossier de ${module.title}`,
        statement: `Redija o resumo executivo do seu trabalho individual sobre "${module.title}", articulando "${primaryConcept}", um exemplo prático em ${targetLesson.sectorExample} e um plano de melhoria contínua.`,
        instructions:
          'Apresente a síntese estruturada do seu trabalho individual para registo no seu percurso académico.',
        evaluationCriteria: [
          'Estrutura executiva clara (objectivo, método, aplicação, melhoria).',
          'Uso rigoroso do vocabulário técnico do módulo.',
        ],
        correctAnswer: `Um trabalho individual sólido demonstra domínio de ${primaryConcept}, apresenta evidência aplicada em ${targetLesson.sectorExample} e estabelece métricas claras de acompanhamento após a implementação.`,
        explanation:
          'Os trabalhos individuais consolidam a autonomia investigativa e alimentam o portefólio profissional do estudante.',
        pedagogicalFeedback:
          'Guarde os pontos-chave também nas suas anotações pessoais para reutilizar no Projecto Final.',
        points: 30,
      });
    }
  }

  return exercises;
}

export function buildLessonFullContent(
  course: Course,
  module: Module,
  lesson: LessonSummary
): LessonFullContent {
  const custom = lesson.customContent || {};
  const c0 = module.coreConcepts[0] || lesson.focusTopic;
  const c1 = module.coreConcepts[1] || lesson.keyMechanism;
  const c2 = module.coreConcepts[2] || module.title;

  const moduleExercises = buildModuleExercises(course, module);
  const lessonExercises = moduleExercises.slice(0, 3).map((ex, i) => ({
    ...ex,
    id: `${lesson.id}-ex-${i + 1}`,
    lessonId: lesson.id,
  }));

  return {
    title: custom.title || lesson.title,
    learningObjectives: custom.learningObjectives || [
      `Compreender os fundamentos teóricos e operacionais de ${lesson.focusTopic} no âmbito de ${module.title}.`,
      `Aplicar o mecanismo de ${lesson.keyMechanism} na resolução estruturada de problemas em ${lesson.sectorExample}.`,
      `Avaliar decisões técnicas comparando critérios de qualidade, desempenho, risco e viabilidade prática.`,
      `Integrar o vocabulário técnico da unidade na documentação e comunicação profissional da área.`,
    ],
    introduction:
      custom.introduction ||
      `Esta aula do módulo "${module.title}" aprofunda o estudo de ${lesson.focusTopic} dentro do programa de ${course.title} (${course.totalHours} horas). Em contextos profissionais exigentes, compreender apenas a superfície de uma ferramenta revela-se insuficiente quando surgem restrições reais de escala, precisão ou custo. Ao longo desta sessão, examinamos como ${lesson.keyMechanism} estrutura o trabalho técnico e sustenta decisões fiáveis em ${lesson.sectorExample}.`,
    historicalContext:
      custom.historicalContext ||
      `A consolidação de ${lesson.focusTopic} enquanto disciplina estruturada acompanhou a evolução das exigências metodológicas em ${course.categoryName.toLowerCase()}. Numa primeira fase, as práticas eram sobretudo empíricas e dependentes da experiência individual; progressivamente, com a formalização de normas técnicas, métricas objectivas e fluxos reproduzíveis, ${lesson.keyMechanism} tornou-se um padrão indispensável para equipas que procuram consistência, auditabilidade e qualidade internacional.`,
    deepExplanation: custom.deepExplanation || [
      `No plano arquitectural, ${lesson.focusTopic} assenta na separação clara entre definição de requisitos, execução controlada e verificação de conformidade. Quando um profissional aborda ${lesson.keyMechanism}, o primeiro passo consiste em mapear as variáveis que determinam o resultado esperado e isolar eventuais pontos de falha antes da implementação definitiva.`,
      `Em segundo lugar, é necessário articular ${c0} com ${c1}. Esta relação não é meramente sequencial: as decisões tomadas durante a estruturação inicial condicionam directamente a capacidade de manutenção, adaptação e escalabilidade futura. Por esse motivo, a metodologia ensinada no Instituto Meridiano privilegia modelos explícitos, documentados e passíveis de revisão crítica.`,
      `Por fim, a maturidade na aplicação de ${lesson.focusTopic} manifesta-se na capacidade de antecipar excepções e estabelecer salvaguardas proporcionais ao impacto do sistema. Em ${lesson.sectorExample}, uma implementação robusta exige critérios claros de aceitação, monitorização periódica e ciclos curtos de refinamento baseados em evidência observável.`,
    ],
    fundamentalConcepts: custom.fundamentalConcepts || [
      {
        name: c0,
        description: `Elemento nuclear de ${module.title} que define os parâmetros base para organizar e validar ${lesson.focusTopic}.`,
      },
      {
        name: c1,
        description: `Mecanismo operacional responsável pela transformação controlada das entradas em entregas consistentes.`,
      },
      {
        name: c2,
        description: `Quadro de integração que assegura alinhamento entre os objectivos da unidade e os padrões de ${course.shortTitle}.`,
      },
    ],
    practicalExamples: custom.practicalExamples || [
      {
        title: `Exemplo Prático 1 — Estruturação de ${lesson.focusTopic}`,
        scenario: `Uma equipa necessita de implementar ${lesson.focusTopic} num projecto de ${lesson.sectorExample} com prazo definido e requisitos rigorosos de qualidade.`,
        steps: [
          `Diagnosticar o estado inicial e definir os objectivos mensuráveis ligados a ${c0}.`,
          `Configurar a arquitectura de ${lesson.keyMechanism} respeitando as restrições do contexto.`,
          `Executar um ensaio piloto controlado para verificar conformidade e identificar desvios.`,
          `Documentar procedimentos e critérios de aprovação para replicação segura pela equipa.`,
        ],
        analysis: `A aplicação ordenada destas quatro etapas reduz retrabalho e torna explícito o raciocínio técnico subjacente a cada escolha.`,
      },
      {
        title: `Exemplo Prático 2 — Revisão e Optimização`,
        scenario: `Revisão de um fluxo existente que apresenta inconsistências na interface entre ${c0} e ${c1}.`,
        steps: [
          `Isolar a etapa com maior variabilidade operacional através de auditoria estruturada.`,
          `Padronizar o formato de entrada e introduzir pontos de validação intermédia.`,
          `Comparar o comportamento antes e depois da intervenção usando os indicadores definidos na tabela técnica.`,
        ],
        analysis: `Pequenos ajustes na precisão dos critérios intermédios produzem ganhos expressivos de fiabilidade no resultado final.`,
      },
    ],
    realWorldApplications: custom.realWorldApplications || [
      {
        sector: lesson.sectorExample,
        usage: `Aplicação directa de ${lesson.focusTopic} para elevar a precisão das entregas e padronizar processos críticos.`,
      },
      {
        sector: 'Consultoria e Auditoria Técnica',
        usage: `Avaliação comparativa de maturidade operacional utilizando critérios formais derivados de ${lesson.keyMechanism}.`,
      },
      {
        sector: 'Operações e Escalabilidade Organizacional',
        usage: `Criação de manuais de procedimento e sistemas replicáveis entre diferentes equipas e mercados.`,
      },
    ],
    caseStudy: custom.caseStudy || module.caseStudy,
    illustrationCaption:
      custom.illustrationCaption ||
      `Representação visual de referência do curso ${course.shortTitle} — enquadramento conceptual para ${lesson.title}.`,
    diagram: custom.diagram || module.diagramSpec,
    table: custom.table || module.tableSpec,
    summary: custom.summary || [
      `${lesson.focusTopic} constitui uma competência estruturante no domínio de ${course.title}.`,
      `A articulação entre ${c0} e ${lesson.keyMechanism} garante previsibilidade e rigor metodológico.`,
      `A validação contínua por critérios explícitos evita erros silenciosos em ${lesson.sectorExample}.`,
      `A consolidação desta aula prepara o estudante para os exercícios práticos e para o módulo seguinte.`,
    ],
    technicalVocabulary: custom.technicalVocabulary || module.vocabulary,
    exercises: custom.exercises || lessonExercises,
    reviewQuestions: custom.reviewQuestions || [
      {
        question: `Qual é a diferença fundamental entre aplicar ${lesson.focusTopic} de forma intuitiva e aplicá-lo com critérios técnicos verificáveis?`,
        guidance: `Destaque a importância da reprodutibilidade, da documentação e da redução de variabilidade em ${lesson.sectorExample}.`,
      },
      {
        question: `De que forma ${c0} e ${c1} se condicionam mutuamente na prática profissional?`,
        guidance: `Explique como falhas na definição inicial de ${c0} afectam directamente o desempenho de ${c1}.`,
      },
      {
        question: `Que indicadores escolheria para confirmar que uma implementação de ${lesson.keyMechanism} cumpriu os objectivos propostos?`,
        guidance: `Recorra aos critérios apresentados na tabela comparativa e no estudo de caso da aula.`,
      },
    ],
    references: custom.references || [
      {
        title: `Manual Académico de ${course.shortTitle} — Unidade ${module.order}`,
        type: 'Apostila Interna',
        note: `Disponível integralmente na Biblioteca Académica do Instituto Meridiano.`,
      },
      {
        title: `Guia Metodológico de ${lesson.focusTopic}`,
        type: 'Guia Prático',
        note: `Sistematiza padrões de verificação, listas de controlo e exemplos aplicados.`,
      },
      {
        title: `Glossário Técnico de ${course.categoryName}`,
        type: 'Glossário',
        note: `Referência terminológica normalizada para utilização em projectos e avaliações.`,
      },
    ],
  };
}
