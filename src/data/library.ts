import { ALL_COURSES } from './courses';
import { LibraryResource, ResourceType } from '../types/university';

const CURATED_RESOURCES: LibraryResource[] = [
  {
    id: 'lib-ia-01',
    courseId: 'curso-01-ia',
    moduleId: 'curso-01-ia-m07',
    subject: 'Engenharia de Prompts e LLMs',
    type: 'Apostila',
    title: 'Tratado Prático de Engenharia de Prompts Estruturados',
    author: 'Departamento de Sistemas Cognitivos — Instituto Meridiano',
    pagesOrDuration: '64 páginas',
    summary:
      'Compêndio metodológico sobre desenho de system prompts, separação de instruções e dados, Few-Shot, Chain-of-Thought e validação por esquemas tipados.',
    sections: [
      {
        heading: '1. Arquitetura de Instrução Determinística',
        body: 'Prompts fiáveis não dependem de frases mágicas, mas de estrutura clara: definição explícita de papel, delimitação inequívoca dos dados de entrada, regras de recusa quando faltam informações e especificação rigorosa do formato de saída.',
      },
      {
        heading: '2. Controlo de Alucinações e Grounding',
        body: 'Sempre que a tarefa exige fidelidade documental, deve instruir-se o modelo a responder exclusivamente com base nos excertos fornecidos, declarando explicitamente "Informação não disponível na fonte" perante lacunas.',
      },
      {
        heading: '3. Protocolo de Avaliação Contínua',
        body: 'Antes de colocar qualquer prompt em produção, valide-o contra um conjunto mínimo de 15 a 30 casos representativos (incluindo entradas vazias, ambíguas ou mal-intencionadas).',
      },
    ],
    keyTakeaways: [
      'Separar instruções de sistema de texto fornecido pelo utilizador usando delimitadores claros.',
      'Preferir temperatura 0 em tarefas de classificação e extracção estruturada.',
      'Documentar alterações de prompt com testes de regressão como se fosse código.',
    ],
  },
  {
    id: 'lib-ia-02',
    courseId: 'curso-01-ia',
    moduleId: 'curso-01-ia-m12',
    subject: 'Agentes e Automação',
    type: 'Guia',
    title: 'Guia de Segurança e Supervisão em Agentes Autónomos',
    author: 'Núcleo de Engenharia Aplicada',
    pagesOrDuration: '38 páginas',
    summary:
      'Normas práticas para definir limites de ferramentas (Function Calling), orçamentos de execução, circuitos de fallback e revisão humana.',
    sections: [
      {
        heading: 'Princípio do Menor Privilégio em Ferramentas',
        body: 'Um agente nunca deve receber permissões destrutivas directas (como eliminação em massa ou transferências financeiras) sem confirmação humana explícita numa fila de aprovação.',
      },
      {
        heading: 'Rastreabilidade e Auditoria',
        body: 'Cada invocação de ferramenta deve registar timestamp, parâmetros enviados, resposta recebida e custo estimado de tokens.',
      },
    ],
    keyTakeaways: [
      'Definir número máximo de iterações para impedir ciclos infinitos.',
      'Validar argumentos gerados pelo LLM antes de executar qualquer função.',
    ],
  },
  {
    id: 'lib-mkt-01',
    courseId: 'curso-02-marketing',
    moduleId: 'curso-02-marketing-m06',
    subject: 'Copywriting e Conversão',
    type: 'Guia',
    title: 'Manual de Redacção Persuasiva Ética e Pesquisa Voice of Customer',
    author: 'Cátedra de Comunicação e Mercado',
    pagesOrDuration: '52 páginas',
    summary: 'Metodologia completa para entrevistar clientes reais, extrair linguagem autêntica e estruturar páginas de elevada clareza.',
    sections: [
      {
        heading: 'Pesquisa Antes da Escrita',
        body: 'Oitenta por cento da eficácia de uma página de oferta reside na recolha fiel das dúvidas, objecções e expectativas reais expressas pelos próprios clientes.',
      },
      {
        heading: 'Hierarquia de Clareza',
        body: 'Nos primeiros cinco segundos, o visitante precisa responder a três perguntas: o que é isto, para quem serve e qual o próximo passo.',
      },
    ],
    keyTakeaways: [
      'Substituir adjectivos vagos por evidências e mecanismos concretos.',
      'Testar títulos com utilizadores reais antes de escalar tráfego pago.',
    ],
  },
  {
    id: 'lib-web-01',
    courseId: 'curso-03-webdev',
    moduleId: 'curso-03-webdev-m08',
    subject: 'TypeScript e React',
    type: 'Livro',
    title: 'Arquitectura Frontend Moderna com TypeScript Estrito e React',
    author: 'Faculdade de Engenharia de Software',
    pagesOrDuration: '148 páginas',
    summary:
      'Obra de referência sobre modelação de estado com uniões discriminadas, composição limpa de componentes, hooks personalizados e acessibilidade WCAG.',
    sections: [
      {
        heading: 'Capítulo 1 — Modelar Estados Impossíveis de Corromper',
        body: 'Em vez de manter três booleanos separados (isLoading, isError, isSuccess) que podem contradizer-se, utilize uniões discriminadas com um campo status único.',
      },
      {
        heading: 'Capítulo 2 — Estado Derivado vs. Estado Armazenado',
        body: 'Todo valor que possa ser calculado directamente a partir de props ou estado existente deve ser computado na renderização ou com useMemo, evitando efeitos em cascata.',
      },
    ],
    keyTakeaways: [
      'Activar strictNullChecks desde o início do projecto.',
      'Separar camada de repositório/API dos componentes visuais.',
    ],
  },
  {
    id: 'lib-web-02',
    courseId: 'curso-03-webdev',
    moduleId: 'curso-03-webdev-m15',
    subject: 'SQL e Bases de Dados',
    type: 'Documento PDF',
    title: 'Caderno Técnico de Modelação Relacional, SQL e Segurança de Dados',
    author: 'Engenharia de Dados — Instituto Meridiano',
    pagesOrDuration: '76 páginas',
    summary:
      'Referência prática com diagramas ER, normalização até 3FN, CTEs, funções de janela, índices B-Tree e consultas parametrizadas.',
    sections: [
      {
        heading: 'Integridade na Origem',
        body: 'Restrições NOT NULL, UNIQUE e FOREIGN KEY na base de dados impedem corrupção silenciosa mesmo quando múltiplos serviços acedem aos mesmos dados.',
      },
      {
        heading: 'Imunidade à Injecção SQL',
        body: 'Jamais concatene entrada do utilizador em strings SQL; utilize sempre prepared statements com parâmetros ligados.',
      },
    ],
    keyTakeaways: [
      'Usar EXPLAIN ANALYZE antes de criar índices aleatórios.',
      'Executar operações financeiras multi-tabela dentro de transacções ACID.',
    ],
  },
  {
    id: 'lib-ing-01',
    courseId: 'curso-04-ingles',
    moduleId: 'curso-04-ingles-m06',
    subject: 'Gramática e Fonética',
    type: 'Guia',
    title: 'Atlas dos 12 Tempos Verbais e Fonética Prática (IPA)',
    author: 'Departamento de Línguas Internacionais',
    pagesOrDuration: '84 páginas',
    summary:
      'Quadro comparativo integral de tempo e aspecto verbal em inglês acompanhado de guia de articulação fonética para falantes de português.',
    sections: [
      {
        heading: 'Tempo vs. Aspecto',
        body: 'O inglês combina três tempos (Present, Past, Future) com quatro aspectos (Simple, Continuous, Perfect, Perfect Continuous). Compreender a intenção comunicativa de cada aspecto elimina a necessidade de tradução literal.',
      },
      {
        heading: 'Domínio da Vogal Schwa',
        body: 'Mais de um terço dos sons vocálicos em fala corrida reduz-se ao som neutro /ə/, responsável pelo ritmo característico da língua inglesa.',
      },
    ],
    keyTakeaways: [
      'Associar Present Perfect à relevância presente, não a tempo encerrado.',
      'Treinar pares mínimos diariamente durante 10 minutos em voz alta.',
    ],
  },
  {
    id: 'lib-emp-01',
    courseId: 'curso-05-empreendedorismo',
    moduleId: 'curso-05-empreendedorismo-m08',
    subject: 'Gestão Financeira e Estratégia',
    type: 'Estudo de Caso',
    title: 'Colectânea de Casos: Tesouraria, Ponto de Equilíbrio e Escala em PMEs',
    author: 'Escola de Gestão e Estratégia',
    pagesOrDuration: '44 páginas',
    summary:
      'Análise comentada de decisões reais de crescimento, capital de giro, renegociação de prazos e expansão controlada por unidades piloto.',
    sections: [
      {
        heading: 'Caso Central — Crescer Sem Quebrar o Caixa',
        body: 'Examina como empresas com demonstração de resultados lucrativa podem enfrentar falta aguda de liquidez quando prazos de recebimento excedem prazos de pagamento.',
      },
      {
        heading: 'Lições Operacionais',
        body: 'A introdução de adiantamentos contratuais e controlo semanal de tesouraria a 13 semanas estabiliza o crescimento.',
      },
    ],
    keyTakeaways: [
      'Acompanhar Cash Flow semanalmente em paralelo com margens.',
      'Validar unidade piloto replicável antes de expandir geograficamente.',
    ],
  },
  {
    id: 'lib-des-01',
    courseId: 'curso-06-design',
    moduleId: 'curso-06-design-m03',
    subject: 'Tipografia e Cor',
    type: 'Artigo',
    title: 'Proporção Espacial, Escalas Tipográficas e Acessibilidade Cromática',
    author: 'Ateliê de Comunicação Visual',
    pagesOrDuration: '22 min leitura',
    summary:
      'Artigo aprofundado sobre medida de linha (65–75ch), ritmo vertical, selecção de pares tipográficos e cálculo de contraste WCAG AA/AAA.',
    sections: [
      {
        heading: 'A Matemática da Clareza Editorial',
        body: 'Layouts elegantes não nascem de enfeites, mas de proporções consistentes: margens exteriores maiores que espaçamentos interiores e contraste nítido entre níveis de informação.',
      },
      {
        heading: 'Acessibilidade como Critério Estético',
        body: 'Design inacessível é design incompleto. Validar rácio 4.5:1 garante conforto tanto para utilizadores com baixa visão como em ecrãs sob luz solar.',
      },
    ],
    keyTakeaways: [
      'Limitar a duas famílias tipográficas coordenadas por projecto.',
      'Usar algarismos tabulares em tabelas, preços e painéis.',
    ],
  },
  {
    id: 'lib-fin-01',
    courseId: 'curso-07-financas',
    moduleId: 'curso-07-financas-m06',
    subject: 'Matemática Financeira e Carteiras',
    type: 'Documento PDF',
    title: 'Compêndio de Capitalização Composta, Inflação e Política de Investimentos',
    author: 'Cátedra de Finanças Pessoais',
    pagesOrDuration: '68 páginas',
    summary:
      'Fórmulas comentadas de juros compostos, taxas equivalentes, amortização Price vs. SAC, impacto de comissões e modelo completo de IPS.',
    sections: [
      {
        heading: 'Retorno Real Líquido',
        body: 'Avaliar qualquer investimento exige descontar comissões anuais, impostos aplicáveis e inflação esperada do período.',
      },
      {
        heading: 'Declaração de Política de Investimento (IPS)',
        body: 'Escrever as regras de alocação e rebalanceamento em períodos de calma protege o património contra decisões impulsivas durante crises.',
      },
    ],
    keyTakeaways: [
      'Construir reserva de emergência líquida antes de assumir risco de mercado.',
      'Diferenciar volatilidade temporária de perda permanente.',
    ],
  },
  {
    id: 'lib-sec-01',
    courseId: 'curso-08-ciberseguranca',
    moduleId: 'curso-08-ciberseguranca-m08',
    subject: 'Segurança Web e Resposta',
    type: 'Referência Bibliográfica',
    title: 'Referencial Defensivo: OWASP, Zero Trust e Protocolo NIST de Incidentes',
    author: 'Laboratório de Segurança da Informação',
    pagesOrDuration: '92 páginas',
    summary:
      'Guia técnico sistematizando mitigação de falhas web, segmentação Zero Trust, preservação de evidências forenses e normas éticas.',
    sections: [
      {
        heading: 'Autorização no Servidor e Menor Privilégio',
        body: 'Todas as verificações de posse e permissão devem ocorrer no servidor em cada pedido autenticado, impedindo acessos laterais (IDOR).',
      },
      {
        heading: 'Ordem de Volatilidade Forense',
        body: 'Durante um incidente, preserve primeiro memória RAM e estado de rede antes de desligar máquinas ou analisar cópias bit-a-bit.',
      },
    ],
    keyTakeaways: [
      'Testes ofensivos apenas em ambientes controlados e expressamente autorizados.',
      'Manter backups imutáveis testados periodicamente contra ransomware.',
    ],
  },
  {
    id: 'lib-exc-01',
    courseId: 'curso-09-excel-dados',
    moduleId: 'curso-09-excel-dados-m09',
    subject: 'ETL, DAX e Visualização',
    type: 'Material Complementar',
    title: 'Guia de Boas Práticas: Tidy Data, Esquema Estrela e Visualização Íntegra',
    author: 'Departamento de Ciência Analítica',
    pagesOrDuration: '58 páginas',
    summary:
      'Padrões profissionais de preparação no Power Query, modelação Facto-Dimensão no Power BI, medidas DAX e integridade gráfica.',
    sections: [
      {
        heading: 'Tidy Data como Alicerce',
        body: 'Antes de escrever qualquer fórmula ou gráfico, garanta uma variável por coluna, um registo por linha e ausência total de células mescladas.',
      },
      {
        heading: 'Honestidade Visual',
        body: 'Gráficos de barras devem iniciar o eixo de valores em zero para evitar distorção visual das proporções reais.',
      },
    ],
    keyTakeaways: [
      'Usar Tabelas Oficiais e Power Query para eliminar trabalho repetitivo.',
      'Preferir medidas DAX explícitas em esquemas estrela limpos.',
    ],
  },
  {
    id: 'lib-prj-01',
    courseId: 'curso-10-projectos',
    moduleId: 'curso-10-projectos-m13',
    subject: 'Agile, Scrum, Kanban e Riscos',
    type: 'Artigo',
    title: 'Combinando Caminho Crítico, WIP Limits e Governança Executiva',
    author: 'Centro de Excelência em Gestão de Projectos',
    pagesOrDuration: '26 min leitura',
    summary:
      'Análise prática de modelos híbridos modernos unindo marcos preditivos de direcção com execução ágil orientada a fluxo e valor.',
    sections: [
      {
        heading: 'A Falsa Dicotomia Entre Cascata e Ágil',
        body: 'Organizações maduras escolhem a abordagem em função do grau de incerteza e do custo de mudança, combinando frequentemente marcos trimestrais com entregas quinzenais.',
      },
      {
        heading: 'Lei de Little no Quotidiano',
        body: 'Limitar trabalho simultâneo (WIP) reduz drasticamente o Lead Time percebido pelo cliente e melhora o foco da equipa.',
      },
    ],
    keyTakeaways: [
      'Diferenciar sempre Risco futuro de Problema (Issue) actual.',
      'Encerrar formalmente cada projecto com handover e lições aprendidas.',
    ],
  },
];

// Normalize the single typo type 'Manual' -> 'Apostila' cleanly and also auto-generate
// per-course Glossários & Guias Curriculares so every course has rich multi-type library entries.
const normalizedCurated: LibraryResource[] = CURATED_RESOURCES.map((r) => ({
  ...r,
  type: (r.type as string) === 'Manual' ? 'Guia' : r.type,
}));

const generatedGlossaryAndGuides: LibraryResource[] = ALL_COURSES.flatMap((course) => {
  const allTerms = course.modules.flatMap((m) => m.vocabulary).slice(0, 12);
  const glossary: LibraryResource = {
    id: `lib-gloss-${course.id}`,
    courseId: course.id,
    subject: course.categoryName,
    type: 'Glossário',
    title: `Glossário Técnico Oficial — ${course.title}`,
    author: 'Comissão Editorial — Instituto Meridiano',
    pagesOrDuration: `${allTerms.length} termos normalizados`,
    summary: `Vocabulário técnico consolidado ao longo dos ${course.modules.length} módulos do programa de ${course.title} (${course.totalHours}h).`,
    sections: allTerms.map((t) => ({
      heading: t.term,
      body: t.definition,
    })),
    keyTakeaways: [
      `Terminologia padronizada para utilização em exercícios, avaliações e projectos de ${course.shortTitle}.`,
      'Consulte este glossário durante a leitura das aulas no Ambiente de Aprendizagem.',
    ],
  };

  const syllabusGuide: LibraryResource = {
    id: `lib-guide-${course.id}`,
    courseId: course.id,
    subject: 'Plano Académico',
    type: 'Material Complementar',
    title: `Programa Curricular e Roteiro de Estudo — ${course.shortTitle}`,
    author: 'Direcção Académica — Instituto Meridiano',
    pagesOrDuration: `${course.totalHours}h de formação`,
    summary: `Guia estruturado dos ${course.modules.length} módulos, competências alvo, avaliações intermédias/finais e projecto de conclusão.`,
    sections: course.modules.slice(0, 8).map((m) => ({
      heading: `Módulo ${String(m.order).padStart(2, '0')} — ${m.title} (${m.hours}h)`,
      body: `${m.summary} Conceitos nucleares: ${m.coreConcepts.join(', ')}.`,
    })),
    keyTakeaways: course.competencies.slice(0, 4),
  };

  return [glossary, syllabusGuide];
});

export const ACADEMIC_LIBRARY: LibraryResource[] = [
  ...normalizedCurated,
  ...generatedGlossaryAndGuides,
];
