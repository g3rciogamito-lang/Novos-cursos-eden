import { CourseCategory } from '../types/university';

export const COURSE_CATEGORIES: CourseCategory[] = [
  {
    id: 'tecnologia',
    name: 'Tecnologia',
    description:
      'Formação rigorosa em engenharia de software, inteligência artificial aplicada, arquitectura de sistemas e cibersegurança defensiva.',
    academicFocus: 'Sistemas computacionais, algoritmos, modelos de linguagem e segurança de infraestruturas.',
    courseCount: 3,
  },
  {
    id: 'negocios',
    name: 'Negócios',
    description:
      'Programas estruturados para concepção de modelos empresariais, marketing estratégico de aquisição e operação comercial sustentável.',
    academicFocus: 'Estratégia competitiva, comportamento do consumidor, planos financeiros e gestão de equipas.',
    courseCount: 2,
  },
  {
    id: 'criatividade',
    name: 'Criatividade',
    description:
      'Domínio técnico e conceptual da comunicação visual, sistemas tipográficos, identidade de marca e design de interfaces digitais.',
    academicFocus: 'Teoria cromática, composição espacial, ferramentas vectoriais, UI Design e direcção de arte.',
    courseCount: 1,
  },
  {
    id: 'financas',
    name: 'Finanças',
    description:
      'Literacia financeira avançada, análise quantitativa de dados empresariais, gestão patrimonial e avaliação de activos financeiros.',
    academicFocus: 'Orçamentação, matemática financeira, mercados de capitais e modelação analítica.',
    courseCount: 2,
  },
  {
    id: 'desenvolvimento-profissional',
    name: 'Desenvolvimento profissional',
    description:
      'Metodologias internacionais de planeamento, coordenação ágil e execução de projectos complexos com controlo de risco e prazo.',
    academicFocus: 'Ciclo de vida de projectos, Scrum, Kanban, gestão de recursos e monitorização de entregas.',
    courseCount: 1,
  },
  {
    id: 'linguas',
    name: 'Línguas',
    description:
      'Percurso linguístico integral do nível inicial ao domínio académico e executivo da língua inglesa em contextos internacionais.',
    academicFocus: 'Fonética, morfologia, sintaxe, compreensão auditiva, escrita formal e comunicação corporativa.',
    courseCount: 1,
  },
];
