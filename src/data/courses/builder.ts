import {
  Assessment,
  AssessmentQuestion,
  CaseStudyBlock,
  CategoryId,
  Course,
  CourseProject,
  LabType,
  LessonDiagram,
  LessonFullContent,
  LessonSummary,
  LessonTable,
  Module,
  VocabularyTerm,
} from '../../types/university';

export interface ModuleSeed {
  title: string;
  hours: number;
  summary: string;
  coreConcepts: [string, string, string];
  diagramKind: LessonDiagram['kind'];
  diagramNodes: [string, string][];
  tableTitle: string;
  tableHeaders: [string, string, string];
  tableRows: [string, string, string][];
  vocabulary: [string, string][];
  caseStudy: CaseStudyBlock;
  lessons: {
    title: string;
    durationMinutes?: number;
    focusTopic: string;
    keyMechanism: string;
    sectorExample: string;
    customContent?: Partial<LessonFullContent>;
  }[];
}

export interface CourseSeed {
  id: string;
  number: string;
  slug: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  academicOverview: string;
  categoryId: CategoryId;
  categoryName: string;
  level: Course['level'];
  totalHours: number;
  coverImage: string;
  accentColor: string;
  accentSoft: string;
  competencies: string[];
  careerOutcomes: string[];
  labType: LabType;
  labTitle: string;
  labDescription: string;
  modules: ModuleSeed[];
  practicalProjects: {
    title: string;
    brief: string;
    deliverables: string[];
    estimatedHours: number;
  }[];
  finalProject: {
    title: string;
    brief: string;
    deliverables: string[];
    estimatedHours: number;
    rubric: { criterion: string; weight: number; description: string }[];
  };
}

function buildExamQuestions(
  courseId: string,
  shortTitle: string,
  modules: Module[],
  startIdx: number,
  count: number
): AssessmentQuestion[] {
  const questions: AssessmentQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const mod = modules[(startIdx + i) % modules.length];
    const c0 = mod.coreConcepts[0];
    const c1 = mod.coreConcepts[1];
    const c2 = mod.coreConcepts[2];
    const vocab = mod.vocabulary[0];

    if (i % 2 === 0) {
      questions.push({
        id: `${courseId}-q-${startIdx}-${i}`,
        prompt: `No módulo "${mod.title}" de ${shortTitle}, qual é a função principal da integração entre "${c0}" e "${c1}"?`,
        options: [
          `Assegurar rigor técnico e previsibilidade operacional através de ${c2}, com validação explícita de resultados.`,
          `Eliminar a necessidade de documentação e revisão intermédia para acelerar o processo sem critérios.`,
          `Substituir integralmente os fundamentos do módulo anterior por soluções improvisadas.`,
          `Restringir a análise apenas a aspectos superficiais sem impacto na entrega final.`,
        ],
        correctIndex: 0,
        explanation: `Em "${mod.title}", "${c0}" e "${c1}" operam em conjunto com "${c2}" para garantir consistência, auditabilidade e qualidade técnica.`,
        competencyTag: mod.title,
      });
    } else {
      questions.push({
        id: `${courseId}-q-${startIdx}-${i}`,
        prompt: `Em "${mod.title}", o conceito técnico "${vocab?.term || c0}" refere-se correctamente a:`,
        options: [
          `Um procedimento informal sem critério mensurável de verificação.`,
          vocab?.definition || `Elemento estruturante que orienta ${c0} e ${c1}.`,
          `Uma etapa opcional aplicada apenas após a conclusão integral do projecto.`,
          `Um termo exclusivo de outras áreas sem aplicação em ${shortTitle}.`,
        ],
        correctIndex: 1,
        explanation: `"${vocab?.term || c0}" é definido precisamente por: ${vocab?.definition || c0}.`,
        competencyTag: mod.title,
      });
    }
  }
  return questions;
}

export function buildCourse(seed: CourseSeed): Course {
  const modules: Module[] = seed.modules.map((mSeed, mIdx) => {
    const moduleId = `${seed.id}-m${String(mIdx + 1).padStart(2, '0')}`;
    const lessons: LessonSummary[] = mSeed.lessons.map((lSeed, lIdx) => ({
      id: `${moduleId}-l${String(lIdx + 1).padStart(2, '0')}`,
      moduleId,
      courseId: seed.id,
      order: lIdx + 1,
      title: lSeed.title,
      durationMinutes: lSeed.durationMinutes ?? 45 + ((lIdx * 5) % 25),
      focusTopic: lSeed.focusTopic,
      keyMechanism: lSeed.keyMechanism,
      sectorExample: lSeed.sectorExample,
      customContent: lSeed.customContent,
    }));

    const vocabulary: VocabularyTerm[] = mSeed.vocabulary.map(([term, definition]) => ({
      term,
      definition,
    }));

    return {
      id: moduleId,
      courseId: seed.id,
      order: mIdx + 1,
      title: mSeed.title,
      hours: mSeed.hours,
      summary: mSeed.summary,
      objectives: [
        `Dominar os princípios fundamentais e avançados de ${mSeed.title}.`,
        `Aplicar ${mSeed.coreConcepts[0]} e ${mSeed.coreConcepts[1]} em cenários reais.`,
        `Avaliar decisões técnicas utilizando ${mSeed.coreConcepts[2]} e critérios de qualidade.`,
      ],
      coreConcepts: [...mSeed.coreConcepts],
      diagramSpec: {
        title: `Arquitectura Conceptual — ${mSeed.title}`,
        kind: mSeed.diagramKind,
        caption: `Esquema estrutural dos pilares de ${mSeed.title} no programa de ${seed.shortTitle}.`,
        nodes: mSeed.diagramNodes.map(([label, detail]) => ({ label, detail })),
      },
      tableSpec: {
        title: mSeed.tableTitle,
        headers: [...mSeed.tableHeaders],
        rows: mSeed.tableRows.map((r) => [...r]),
      },
      vocabulary,
      caseStudy: mSeed.caseStudy,
      lessons,
    };
  });

  const midPoint = Math.floor(modules.length / 2);

  const intermediateExam: Assessment = {
    id: `${seed.id}-exam-mid`,
    courseId: seed.id,
    kind: 'intermediate-exam',
    title: `Exame Intermédio — ${seed.shortTitle}`,
    description: `Avaliação cumulativa dos módulos 1 a ${midPoint}, verificando domínio conceptual e aplicação prática intermédia.`,
    passingScore: 70,
    durationMinutes: 45,
    questions: buildExamQuestions(seed.id, seed.shortTitle, modules.slice(0, midPoint), 0, 8),
  };

  const finalExam: Assessment = {
    id: `${seed.id}-exam-final`,
    courseId: seed.id,
    kind: 'final-exam',
    title: `Exame Final de Certificação — ${seed.title}`,
    description: `Prova global de encerramento abrangendo todos os ${modules.length} módulos do programa de ${seed.totalHours} horas.`,
    passingScore: 70,
    durationMinutes: 75,
    questions: buildExamQuestions(seed.id, seed.shortTitle, modules, 0, 12),
  };

  const practicalProjects: CourseProject[] = seed.practicalProjects.map((p, idx) => ({
    id: `${seed.id}-proj-${idx + 1}`,
    courseId: seed.id,
    title: p.title,
    isFinalCapstone: false,
    brief: p.brief,
    deliverables: p.deliverables,
    estimatedHours: p.estimatedHours,
    rubric: [
      { criterion: 'Rigor técnico e metodologia', weight: 40, description: 'Aplicação fiel dos conceitos e normas do curso.' },
      { criterion: 'Qualidade da execução prática', weight: 35, description: 'Coerência, clareza e ausência de erros estruturais.' },
      { criterion: 'Documentação e argumentação', weight: 25, description: 'Justificação objectiva das escolhas realizadas.' },
    ],
  }));

  const finalProject: CourseProject = {
    id: `${seed.id}-capstone`,
    courseId: seed.id,
    title: seed.finalProject.title,
    isFinalCapstone: true,
    brief: seed.finalProject.brief,
    deliverables: seed.finalProject.deliverables,
    estimatedHours: seed.finalProject.estimatedHours,
    rubric: seed.finalProject.rubric,
  };

  return {
    id: seed.id,
    number: seed.number,
    slug: seed.slug,
    title: seed.title,
    shortTitle: seed.shortTitle,
    subtitle: seed.subtitle,
    description: seed.description,
    academicOverview: seed.academicOverview,
    categoryId: seed.categoryId,
    categoryName: seed.categoryName,
    level: seed.level,
    totalHours: seed.totalHours,
    coverImage: seed.coverImage,
    accentColor: seed.accentColor,
    accentSoft: seed.accentSoft,
    competencies: seed.competencies,
    careerOutcomes: seed.careerOutcomes,
    labType: seed.labType,
    labTitle: seed.labTitle,
    labDescription: seed.labDescription,
    modules,
    finalProject,
    practicalProjects,
    intermediateExam,
    finalExam,
  };
}
