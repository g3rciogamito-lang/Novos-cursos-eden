export type CategoryId =
  | 'tecnologia'
  | 'negocios'
  | 'criatividade'
  | 'financas'
  | 'desenvolvimento-profissional'
  | 'linguas';

export interface CourseCategory {
  id: CategoryId;
  name: string;
  description: string;
  academicFocus: string;
  courseCount: number;
}

export type ExerciseType =
  | 'multiple-choice'
  | 'true-false'
  | 'matching'
  | 'fill-blank'
  | 'essay'
  | 'problem-solving'
  | 'practical'
  | 'case-study'
  | 'simulation'
  | 'assignment';

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface Exercise {
  id: string;
  lessonId?: string;
  moduleId: string;
  courseId: string;
  type: ExerciseType;
  title: string;
  statement: string;
  instructions: string;
  options?: string[];
  matchingPairs?: MatchingPair[];
  blankTemplate?: string;
  evaluationCriteria: string[];
  correctAnswer: string;
  explanation: string;
  pedagogicalFeedback: string;
  points: number;
}

export interface LessonDiagramNode {
  label: string;
  detail: string;
}

export interface LessonDiagram {
  title: string;
  kind: 'flow' | 'layers' | 'matrix' | 'cycle';
  caption: string;
  nodes: LessonDiagramNode[];
}

export interface LessonTable {
  title: string;
  headers: string[];
  rows: string[][];
}

export interface VocabularyTerm {
  term: string;
  definition: string;
}

export interface CaseStudyBlock {
  title: string;
  context: string;
  challenge: string;
  application: string;
  outcome: string;
}

export interface PracticalExample {
  title: string;
  scenario: string;
  steps: string[];
  analysis: string;
}

export interface LessonFullContent {
  title: string;
  learningObjectives: string[];
  introduction: string;
  historicalContext: string;
  deepExplanation: string[];
  fundamentalConcepts: { name: string; description: string }[];
  practicalExamples: PracticalExample[];
  realWorldApplications: { sector: string; usage: string }[];
  caseStudy: CaseStudyBlock;
  illustrationCaption: string;
  diagram: LessonDiagram;
  table: LessonTable;
  summary: string[];
  technicalVocabulary: VocabularyTerm[];
  exercises: Exercise[];
  reviewQuestions: { question: string; guidance: string }[];
  references: { title: string; type: string; note: string }[];
}

export interface LessonSummary {
  id: string;
  moduleId: string;
  courseId: string;
  order: number;
  title: string;
  durationMinutes: number;
  focusTopic: string;
  keyMechanism: string;
  sectorExample: string;
  customContent?: Partial<LessonFullContent>;
}

export interface Module {
  id: string;
  courseId: string;
  order: number;
  title: string;
  hours: number;
  summary: string;
  objectives: string[];
  coreConcepts: string[];
  diagramSpec: LessonDiagram;
  tableSpec: LessonTable;
  vocabulary: VocabularyTerm[];
  caseStudy: CaseStudyBlock;
  lessons: LessonSummary[];
}

export interface AssessmentQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  competencyTag: string;
}

export interface Assessment {
  id: string;
  courseId: string;
  moduleId?: string;
  kind: 'lesson-quiz' | 'module-eval' | 'intermediate-exam' | 'final-exam';
  title: string;
  description: string;
  passingScore: number;
  durationMinutes: number;
  questions: AssessmentQuestion[];
}

export interface CourseProject {
  id: string;
  courseId: string;
  title: string;
  isFinalCapstone: boolean;
  brief: string;
  deliverables: string[];
  rubric: { criterion: string; weight: number; description: string }[];
  estimatedHours: number;
}

export type LabType =
  | 'ai-prompt-lab'
  | 'marketing-campaign-lab'
  | 'web-code-lab'
  | 'english-syntax-lab'
  | 'business-economics-lab'
  | 'design-color-grid-lab'
  | 'finance-compound-lab'
  | 'cyber-audit-lab'
  | 'excel-spreadsheet-lab'
  | 'project-kanban-cpm-lab';

export interface Course {
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
  level: 'Iniciante a Avançado' | 'Intermédio a Avançado' | 'Fundamentos a Profissional';
  totalHours: number;
  coverImage: string;
  accentColor: string;
  accentSoft: string;
  competencies: string[];
  careerOutcomes: string[];
  labType: LabType;
  labTitle: string;
  labDescription: string;
  modules: Module[];
  finalProject: CourseProject;
  practicalProjects: CourseProject[];
  intermediateExam: Assessment;
  finalExam: Assessment;
}

export type ResourceType =
  | 'Livro'
  | 'Apostila'
  | 'Guia'
  | 'Documento PDF'
  | 'Glossário'
  | 'Estudo de Caso'
  | 'Artigo'
  | 'Referência Bibliográfica'
  | 'Material Complementar';

export interface LibraryResource {
  id: string;
  courseId: string;
  moduleId?: string;
  subject: string;
  type: ResourceType;
  title: string;
  author: string;
  pagesOrDuration: string;
  summary: string;
  sections: { heading: string; body: string }[];
  keyTakeaways: string[];
}

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  role: 'Estudante' | 'Coordenação Académica';
  institutionUnit: string;
  avatarInitials: string;
  joinedAt: string;
}

export interface ApprovalCriteria {
  minLessonCompletionPct: number;
  minAverageScore: number;
  requireFinalExam: boolean;
  requireFinalProject: boolean;
}

export interface LessonNote {
  lessonId: string;
  courseId: string;
  content: string;
  updatedAt: string;
}

export interface ExerciseAttemptRecord {
  exerciseId: string;
  courseId: string;
  answer: string;
  isCorrect: boolean;
  score: number;
  attemptedAt: string;
}

export interface AssessmentResultRecord {
  assessmentId: string;
  courseId: string;
  kind: Assessment['kind'];
  score: number;
  passed: boolean;
  completedAt: string;
}

export interface ProjectSubmissionRecord {
  projectId: string;
  courseId: string;
  title: string;
  submissionText: string;
  artifactUrlOrNotes: string;
  selfChecklistCompleted: boolean;
  score: number;
  status: 'Avaliado' | 'Submetido';
  submittedAt: string;
}

export interface Certificate {
  id: string;
  verificationCode: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  totalHours: number;
  finalScore: number;
  issuedAt: string;
  issuerName: string;
  competencies: string[];
}

export interface StudentState {
  user: StudentUser;
  enrolledCourseIds: string[];
  completedLessonIds: string[];
  favoriteLessonIds: string[];
  lastLessonByCourse: Record<string, string>;
  notesByLesson: Record<string, LessonNote>;
  exerciseAttempts: Record<string, ExerciseAttemptRecord>;
  assessmentResults: Record<string, AssessmentResultRecord>;
  projectSubmissions: Record<string, ProjectSubmissionRecord>;
  studyMinutesByCourse: Record<string, number>;
  dailyStudyMinutes: { day: string; minutes: number }[];
  certificates: Certificate[];
  approvalCriteria: ApprovalCriteria;
  readerFontSize: number;
  comfortableReadingMode: boolean;
}

export type AppView =
  | { page: 'home' }
  | { page: 'courses'; categoryFilter?: CategoryId | 'all' }
  | { page: 'categories'; selectedCategory?: CategoryId }
  | { page: 'course-detail'; courseId: string }
  | { page: 'learn'; courseId: string; moduleId?: string; lessonId?: string; tab?: 'conteudo' | 'exercicios' | 'avaliacoes' | 'projectos' | 'materiais' }
  | { page: 'library'; courseFilter?: string }
  | { page: 'labs'; courseId?: string }
  | { page: 'journey'; subtab?: 'progresso' | 'perfil' | 'certificados' | 'criterios' }
  | { page: 'verify-certificate'; code?: string }
  | { page: 'search'; query?: string };
