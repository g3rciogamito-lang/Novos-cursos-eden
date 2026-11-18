import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Eye,
  FileText,
  FlaskConical,
  Menu,
  Minus,
  Plus,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import {
  getCourseById,
  getCourseLessonsFlat,
  getCourseModuleAndLesson,
} from '../../data/courses';
import { buildLessonFullContent, buildModuleExercises } from '../../data/lessonEngine';
import { ACADEMIC_LIBRARY } from '../../data/library';
import { useUniversity } from '../../context/UniversityContext';
import { Assessment, CourseProject } from '../../types/university';
import { CourseImage } from '../common/CourseImage';
import { DiagramRenderer } from '../common/DiagramRenderer';
import { AssessmentRunner } from './AssessmentRunner';
import { ExerciseCard } from './ExerciseCard';

interface LearningEnvironmentPageProps {
  courseId: string;
  initialLessonId?: string;
  initialTab?: 'conteudo' | 'exercicios' | 'avaliacoes' | 'projectos' | 'materiais';
}

export const LearningEnvironmentPage: React.FC<LearningEnvironmentPageProps> = ({
  courseId,
  initialLessonId,
  initialTab = 'conteudo',
}) => {
  const {
    state,
    navigate,
    markLessonCompleted,
    setLastLesson,
    toggleFavoriteLesson,
    saveLessonNote,
    submitProject,
    setReaderFontSize,
    setComfortableReadingMode,
    getCourseDiagnostics,
    requestCertificate,
  } = useUniversity();

  const course = getCourseById(courseId);
  const [activeTab, setActiveTab] = useState<typeof initialTab>(initialTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inCourseQuery, setInCourseQuery] = useState('');
  const [revealedQuestions, setRevealedQuestions] = useState<Record<number, boolean>>({});
  const [noteDraft, setNoteDraft] = useState<string | null>(null);
  const [noteSavedToast, setNoteSavedToast] = useState(false);
  const [certFeedback, setCertFeedback] = useState('');

  // Project submission form states
  const [projectForms, setProjectForms] = useState<
    Record<string, { text: string; artifact: string; error?: string }>
  >({});

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="font-display text-xl font-semibold text-[#020B1C]">
          Ambiente de aprendizagem indisponível para este curso.
        </p>
        <button
          type="button"
          onClick={() => navigate({ page: 'courses', categoryFilter: 'all' })}
          className="mt-4 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#020B1C] text-white text-sm"
        >
          Voltar aos cursos
        </button>
      </div>
    );
  }

  const resolvedLessonId =
    initialLessonId || state.lastLessonByCourse[course.id] || course.modules[0].lessons[0].id;

  const { module: activeModule, lesson: activeLesson } = getCourseModuleAndLesson(
    course,
    resolvedLessonId
  );

  const [expandedModuleId, setExpandedModuleId] = useState<string>(activeModule.id);

  const fullLesson = useMemo(
    () => buildLessonFullContent(course, activeModule, activeLesson),
    [course, activeModule, activeLesson]
  );

  const moduleExercises = useMemo(
    () => buildModuleExercises(course, activeModule),
    [course, activeModule]
  );

  const flatLessons = useMemo(() => getCourseLessonsFlat(course), [course]);
  const currentIndex = flatLessons.findIndex((item) => item.lesson.id === activeLesson.id);
  const prevItem = currentIndex > 0 ? flatLessons[currentIndex - 1] : null;
  const nextItem =
    currentIndex >= 0 && currentIndex < flatLessons.length - 1
      ? flatLessons[currentIndex + 1]
      : null;

  const diag = getCourseDiagnostics(course);
  const isCompleted = state.completedLessonIds.includes(activeLesson.id);
  const isFavorite = state.favoriteLessonIds.includes(activeLesson.id);
  const savedNote = state.notesByLesson[activeLesson.id]?.content || '';
  const currentNoteValue = noteDraft !== null ? noteDraft : savedNote;

  const courseLibraryItems = useMemo(
    () => ACADEMIC_LIBRARY.filter((r) => r.courseId === course.id),
    [course.id]
  );

  const filteredModules = useMemo(() => {
    const q = inCourseQuery.trim().toLowerCase();
    if (!q) return course.modules;
    return course.modules
      .map((m) => ({
        ...m,
        lessons: m.lessons.filter(
          (l) =>
            l.title.toLowerCase().includes(q) ||
            l.focusTopic.toLowerCase().includes(q) ||
            m.title.toLowerCase().includes(q)
        ),
      }))
      .filter((m) => m.lessons.length > 0 || m.title.toLowerCase().includes(q));
  }, [course.modules, inCourseQuery]);

  const selectLesson = (lessonId: string, moduleId: string) => {
    setLastLesson(course.id, lessonId);
    setExpandedModuleId(moduleId);
    setRevealedQuestions({});
    setNoteDraft(null);
    setSidebarOpen(false);
    setActiveTab('conteudo');
    navigate({ page: 'learn', courseId: course.id, moduleId, lessonId, tab: 'conteudo' });
  };

  // Dynamic lesson quiz & module evaluation constructed cleanly from lesson/module content
  const lessonQuiz: Assessment = useMemo(
    () => ({
      id: `${activeLesson.id}-quiz`,
      courseId: course.id,
      moduleId: activeModule.id,
      kind: 'lesson-quiz',
      title: `Quiz Rápido — ${activeLesson.title}`,
      description: 'Verifique a compreensão imediata dos conceitos estudados nesta aula.',
      passingScore: 70,
      durationMinutes: 10,
      questions: [
        {
          id: `${activeLesson.id}-q1`,
          prompt: `Qual é o foco principal de "${activeLesson.title}"?`,
          options: [
            `${activeLesson.focusTopic}, operacionalizado através de ${activeLesson.keyMechanism}.`,
            'Execução informal sem critérios de verificação nem documentação.',
            'Substituição integral de todos os módulos subsequentes do curso.',
          ],
          correctIndex: 0,
          explanation: `A aula estrutura ${activeLesson.focusTopic} aplicando ${activeLesson.keyMechanism} em ${activeLesson.sectorExample}.`,
          competencyTag: activeModule.title,
        },
        {
          id: `${activeLesson.id}-q2`,
          prompt: `No contexto de ${activeLesson.sectorExample}, o que garante maior fiabilidade na entrega?`,
          options: [
            'Saltar a etapa de revisão técnica para poupar tempo.',
            `Articular ${activeModule.coreConcepts[0]} com critérios objectivos de validação.`,
            'Evitar qualquer registo de decisões ou glossário técnico.',
          ],
          correctIndex: 1,
          explanation: `A articulação de ${activeModule.coreConcepts[0]} com verificação explícita previne falhas recorrentes.`,
          competencyTag: activeModule.coreConcepts[0],
        },
      ],
    }),
    [activeLesson, activeModule, course.id]
  );

  const moduleEval: Assessment = useMemo(
    () => ({
      id: `${activeModule.id}-eval`,
      courseId: course.id,
      moduleId: activeModule.id,
      kind: 'module-eval',
      title: `Avaliação do Módulo ${activeModule.order}: ${activeModule.title}`,
      description: `Consolidação integral das competências do Módulo ${activeModule.order}.`,
      passingScore: 70,
      durationMinutes: 25,
      questions: activeModule.coreConcepts.map((concept, idx) => ({
        id: `${activeModule.id}-meq-${idx}`,
        prompt: `Em "${activeModule.title}", qual prática descreve o domínio profissional de "${concept}"?`,
        options: [
          `Aplicar ${concept} com base nos critérios do módulo e verificar a conformidade face aos resultados.`,
          `Ignorar as dependências com ${activeModule.coreConcepts[(idx + 1) % 3]}.`,
          'Adiar qualquer validação até depois da conclusão do curso.',
        ],
        correctIndex: 0,
        explanation: `"${concept}" integra os fundamentos avaliados neste módulo em conjunto com o estudo de caso.`,
        competencyTag: concept,
      })),
    }),
    [activeModule, course.id]
  );

  const handleSaveNote = () => {
    saveLessonNote(course.id, activeLesson.id, currentNoteValue);
    setNoteSavedToast(true);
    setTimeout(() => setNoteSavedToast(false), 2200);
  };

  const handleProjectSubmit = (proj: CourseProject) => {
    const form = projectForms[proj.id] || { text: '', artifact: '' };
    if (form.text.trim().length < 30) {
      setProjectForms((prev) => ({
        ...prev,
        [proj.id]: {
          ...form,
          error: 'Descreva a solução e os entregáveis realizados (mínimo de 30 caracteres).',
        },
      }));
      return;
    }
    submitProject(proj, form.text.trim(), form.artifact.trim() || 'Submissão directa na plataforma');
  };

  const handleIssueCertificate = async () => {
    setCertFeedback('');
    const res = await requestCertificate(course);
    if (res.certificate) {
      setCertFeedback(`Certificado emitido com código ${res.certificate.verificationCode}.`);
    } else if (res.error) {
      setCertFeedback(res.error);
    }
  };

  const readingContainerBg = state.comfortableReadingMode ? 'bg-[#FAF8F4]' : 'bg-white';

  return (
    <div className="min-h-screen bg-[#F5F8FF] flex flex-col">
      {/* Top Learning Context Bar */}
      <div className="bg-[#020B1C] text-white border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen((p) => !p)}
              className="lg:hidden min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5"
              aria-label="Abrir índice do curso"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => navigate({ page: 'course-detail', courseId: course.id })}
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Programa
            </button>
            <span className="text-slate-600">/</span>
            <h1 className="font-display text-sm sm:text-base font-semibold text-white truncate">
              {course.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2.5 text-xs">
              <span className="text-slate-400 hidden sm:inline">Progresso:</span>
              <div className="w-28 h-1.5 rounded-full bg-white/15 overflow-hidden">
                <div
                  className="h-full bg-[#176BFF] transition-all"
                  style={{ width: `${Math.max(4, diag.completionPct)}%` }}
                />
              </div>
              <span className="font-mono font-semibold text-white tabular-nums">
                {diag.completionPct}%
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate({ page: 'labs', courseId: course.id })}
              className="min-h-[36px] inline-flex items-center gap-1.5 rounded-lg border border-[#176BFF]/50 bg-[#176BFF]/15 px-3 py-1.5 text-xs font-medium text-white hover:bg-[#176BFF] transition-colors"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              Laboratório
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="max-w-[1440px] w-full mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12">
        {/* Left Sidebar Curriculum Tree */}
        <aside
          className={`${
            sidebarOpen ? 'block' : 'hidden'
          } lg:block lg:col-span-4 xl:col-span-3 border-r border-slate-200 bg-white lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] overflow-y-auto`}
        >
          <div className="p-4 border-b border-slate-200 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={inCourseQuery}
                onChange={(e) => setInCourseQuery(e.target.value)}
                placeholder="Pesquisar aula ou módulo..."
                aria-label="Pesquisar no curso"
                className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-[#F5F8FF]/60 pl-9 pr-3 text-xs sm:text-sm text-[#020B1C] focus:border-[#176BFF] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-[#64748B] font-mono tabular-nums">
              <span>
                {diag.completedLessons}/{diag.totalLessons} aulas concluídas
              </span>
              <span>{diag.studyHours}h estudadas</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredModules.map((mod) => {
              const isOpen = expandedModuleId === mod.id || Boolean(inCourseQuery.trim());
              return (
                <div key={mod.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedModuleId(expandedModuleId === mod.id ? '' : mod.id)
                    }
                    className="w-full px-4 py-3.5 text-left flex items-start justify-between gap-2 hover:bg-[#F5F8FF]/60 transition-colors"
                  >
                    <div>
                      <p className="font-mono text-[11px] text-[#164E9B] tabular-nums">
                        Módulo {String(mod.order).padStart(2, '0')} · {mod.hours}h
                      </p>
                      <p className="font-display text-sm font-semibold text-[#020B1C] mt-0.5 leading-snug">
                        {mod.title}
                      </p>
                    </div>
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                    )}
                  </button>

                  {isOpen && (
                    <ul className="pb-2 px-2 space-y-1">
                      {mod.lessons.map((lesson) => {
                        const selected = lesson.id === activeLesson.id;
                        const done = state.completedLessonIds.includes(lesson.id);
                        return (
                          <li key={lesson.id}>
                            <button
                              type="button"
                              onClick={() => selectLesson(lesson.id, mod.id)}
                              className={`w-full rounded-xl px-3 py-2 text-left flex items-start gap-2.5 text-xs transition-colors ${
                                selected
                                  ? 'bg-[#020B1C] text-white'
                                  : 'text-[#020B1C] hover:bg-[#F5F8FF]'
                              }`}
                            >
                              {done ? (
                                <CheckCircle2
                                  className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                                    selected ? 'text-[#176BFF]' : 'text-emerald-600'
                                  }`}
                                />
                              ) : (
                                <BookOpen
                                  className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                                    selected ? 'text-slate-300' : 'text-slate-400'
                                  }`}
                                />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="font-medium leading-snug">
                                  {lesson.order}. {lesson.title}
                                </p>
                                <p
                                  className={`font-mono text-[10px] mt-0.5 tabular-nums ${
                                    selected ? 'text-slate-300' : 'text-slate-400'
                                  }`}
                                >
                                  {lesson.durationMinutes} min
                                </p>
                              </div>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Central Workspace */}
        <main className="lg:col-span-8 xl:col-span-9 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Sub-navigation Tabs + Reading Controls */}
          <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
            <div role="tablist" className="flex flex-wrap gap-1.5">
              {(
                [
                  { id: 'conteudo', label: 'Conteúdo da Aula' },
                  { id: 'exercicios', label: 'Exercícios (10 formatos)' },
                  { id: 'avaliacoes', label: 'Avaliações e Exames' },
                  { id: 'projectos', label: 'Projectos Práticos' },
                  { id: 'materiais', label: 'Materiais do Curso' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#020B1C] text-white'
                      : 'text-[#64748B] hover:text-[#020B1C] hover:bg-[#F5F8FF]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'conteudo' && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setComfortableReadingMode(!state.comfortableReadingMode)}
                  className={`min-h-[36px] px-3 py-1.5 rounded-lg border text-xs font-medium inline-flex items-center gap-1.5 transition-colors ${
                    state.comfortableReadingMode
                      ? 'border-[#176BFF] bg-[#F5F8FF] text-[#164E9B]'
                      : 'border-slate-200 text-[#64748B] hover:text-[#020B1C]'
                  }`}
                  title="Alternar modo de leitura confortável"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Leitura confortável</span>
                </button>

                <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white">
                  <button
                    type="button"
                    onClick={() => setReaderFontSize(Math.max(14, state.readerFontSize - 1))}
                    aria-label="Diminuir tamanho da letra"
                    className="p-2 text-[#64748B] hover:text-[#020B1C]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 font-mono text-xs text-[#020B1C] tabular-nums">
                    {state.readerFontSize}px
                  </span>
                  <button
                    type="button"
                    onClick={() => setReaderFontSize(Math.min(21, state.readerFontSize + 1))}
                    aria-label="Aumentar tamanho da letra"
                    className="p-2 text-[#64748B] hover:text-[#020B1C]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* TAB 1: FULL 17-ELEMENT ACADEMIC LESSON */}
          {activeTab === 'conteudo' && (
            <article
              className={`rounded-2xl border border-slate-200 ${readingContainerBg} p-6 sm:p-8 lg:p-10 space-y-10 academic-prose`}
              style={{ '--reader-font-size': `${state.readerFontSize}px` } as React.CSSProperties}
            >
              {/* Header */}
              <header className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-[#176BFF]">
                    Módulo {String(activeModule.order).padStart(2, '0')} · {activeModule.title} ·
                    Aula {activeLesson.order} ({activeLesson.durationMinutes} min)
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#020B1C] mt-2 leading-tight text-balance">
                    {fullLesson.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleFavoriteLesson(activeLesson.id)}
                    aria-pressed={isFavorite}
                    className={`min-h-[40px] px-3.5 py-2 rounded-xl border text-xs font-medium inline-flex items-center gap-1.5 transition-colors ${
                      isFavorite
                        ? 'border-[#176BFF] bg-[#F5F8FF] text-[#176BFF]'
                        : 'border-slate-200 text-[#64748B] hover:text-[#020B1C]'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                    {isFavorite ? 'Guardada' : 'Favorita'}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      markLessonCompleted(
                        course.id,
                        activeLesson.id,
                        activeLesson.durationMinutes
                      )
                    }
                    className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 transition-colors ${
                      isCompleted
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#020B1C] text-white hover:bg-[#176BFF]'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isCompleted ? 'Aula concluída' : 'Marcar como concluída'}
                  </button>
                </div>
              </header>

              {/* 1. Learning Objectives */}
              <section className="rounded-xl border border-slate-200 bg-[#F5F8FF] p-5 sm:p-6">
                <h3 className="font-display text-base font-semibold text-[#020B1C] mb-3">
                  1. Objectivos de Aprendizagem
                </h3>
                <ul className="space-y-2 text-sm text-[#020B1C]">
                  {fullLesson.learningObjectives.map((obj) => (
                    <li key={obj} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#176BFF] shrink-0 mt-1" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* 2. Introduction */}
              <section className="space-y-3">
                <h3 className="font-display text-xl font-semibold text-[#020B1C]">
                  2. Introdução
                </h3>
                <p className="text-[#334155]">{fullLesson.introduction}</p>
              </section>

              {/* 3. Historical Context */}
              <section className="space-y-3">
                <h3 className="font-display text-xl font-semibold text-[#020B1C]">
                  3. Contextualização Histórica e Evolução
                </h3>
                <p className="text-[#334155]">{fullLesson.historicalContext}</p>
              </section>

              {/* 4. Deep Explanation */}
              <section className="space-y-4">
                <h3 className="font-display text-xl font-semibold text-[#020B1C]">
                  4. Desenvolvimento Conceptual Aprofundado
                </h3>
                {fullLesson.deepExplanation.map((para, idx) => (
                  <p key={idx} className="text-[#334155]">
                    {para}
                  </p>
                ))}
              </section>

              {/* 5. Fundamental Concepts */}
              <section className="space-y-4">
                <h3 className="font-display text-xl font-semibold text-[#020B1C]">
                  5. Conceitos Fundamentais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {fullLesson.fundamentalConcepts.map((fc) => (
                    <div
                      key={fc.name}
                      className="rounded-xl border border-slate-200 bg-white p-4 space-y-2"
                    >
                      <h4 className="font-display text-base font-semibold text-[#164E9B]">
                        {fc.name}
                      </h4>
                      <p className="text-sm text-[#64748B] leading-relaxed">
                        {fc.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 6. Practical Examples */}
              <section className="space-y-4">
                <h3 className="font-display text-xl font-semibold text-[#020B1C]">
                  6. Exemplos Práticos Comentados
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {fullLesson.practicalExamples.map((ex) => (
                    <div
                      key={ex.title}
                      className="rounded-xl border border-slate-200 bg-white p-5 space-y-3"
                    >
                      <h4 className="font-display text-base font-semibold text-[#020B1C]">
                        {ex.title}
                      </h4>
                      <p className="text-sm text-[#64748B]">{ex.scenario}</p>
                      <ol className="list-decimal list-inside space-y-1.5 text-sm text-[#020B1C]">
                        {ex.steps.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ol>
                      <p className="text-xs text-[#164E9B] pt-2 border-t border-slate-100">
                        {ex.analysis}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 7. Real World Applications */}
              <section className="space-y-3">
                <h3 className="font-display text-xl font-semibold text-[#020B1C]">
                  7. Aplicações Reais no Mercado
                </h3>
                <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
                  {fullLesson.realWorldApplications.map((app) => (
                    <div key={app.sector} className="p-4 flex flex-col sm:flex-row gap-2 sm:gap-6">
                      <span className="sm:w-56 font-semibold text-sm text-[#020B1C] shrink-0">
                        {app.sector}
                      </span>
                      <span className="text-sm text-[#64748B]">{app.usage}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* 8. Case Study */}
              <section className="rounded-2xl border border-[#176BFF]/25 bg-[#F5F8FF] p-6 space-y-3">
                <p className="font-mono text-xs uppercase tracking-wider text-[#176BFF]">
                  8. Estudo de Caso
                </p>
                <h3 className="font-display text-xl font-semibold text-[#020B1C]">
                  {fullLesson.caseStudy.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-2">
                  <div>
                    <p className="font-semibold text-[#020B1C]">Contexto</p>
                    <p className="text-[#64748B] mt-1">{fullLesson.caseStudy.context}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#020B1C]">Desafio</p>
                    <p className="text-[#64748B] mt-1">{fullLesson.caseStudy.challenge}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#020B1C]">Aplicação Técnica</p>
                    <p className="text-[#64748B] mt-1">{fullLesson.caseStudy.application}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#020B1C]">Resultado Observado</p>
                    <p className="text-[#020B1C] font-medium mt-1">
                      {fullLesson.caseStudy.outcome}
                    </p>
                  </div>
                </div>
              </section>

              {/* 9. Illustrative Image */}
              <section className="space-y-3">
                <h3 className="font-display text-xl font-semibold text-[#020B1C]">
                  9. Enquadramento Visual da Unidade
                </h3>
                <figure className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
                  <CourseImage
                    src={course.coverImage}
                    alt={fullLesson.illustrationCaption}
                    title={course.shortTitle}
                    accentColor={course.accentColor}
                    aspectClassName="aspect-[21/9]"
                  />
                  <figcaption className="px-5 py-3 text-xs text-[#64748B] border-t border-slate-100">
                    {fullLesson.illustrationCaption}
                  </figcaption>
                </figure>
              </section>

              {/* 10. Structural Diagram */}
              <section className="space-y-3">
                <h3 className="font-display text-xl font-semibold text-[#020B1C]">
                  10. Diagrama Arquitectural
                </h3>
                <DiagramRenderer diagram={fullLesson.diagram} accentColor={course.accentColor} />
              </section>

              {/* 11. Technical Comparative Table */}
              <section className="space-y-3">
                <h3 className="font-display text-xl font-semibold text-[#020B1C]">
                  11. Quadro Técnico: {fullLesson.table.title}
                </h3>
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#020B1C] text-white">
                        {fullLesson.table.headers.map((h) => (
                          <th key={h} className="px-4 py-3 font-display font-semibold text-xs uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {fullLesson.table.rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-[#F5F8FF]/60">
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className={`px-4 py-3 align-top ${
                                cIdx === 0 ? 'font-semibold text-[#020B1C]' : 'text-[#64748B]'
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 12. Structured Summary */}
              <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 space-y-3">
                <h3 className="font-display text-lg font-semibold text-[#020B1C]">
                  12. Síntese Estruturada da Aula
                </h3>
                <ul className="space-y-2 text-sm text-[#334155] list-disc list-inside">
                  {fullLesson.summary.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              {/* 13. Technical Vocabulary */}
              <section className="space-y-3">
                <h3 className="font-display text-xl font-semibold text-[#020B1C]">
                  13. Vocabulário Técnico
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {fullLesson.technicalVocabulary.map((v) => (
                    <div
                      key={v.term}
                      className="rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <p className="font-mono text-xs font-semibold text-[#176BFF]">{v.term}</p>
                      <p className="text-sm text-[#64748B] mt-1">{v.definition}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 14. Embedded Exercises */}
              <section className="space-y-4">
                <h3 className="font-display text-xl font-semibold text-[#020B1C]">
                  14. Exercícios Práticos da Aula
                </h3>
                <div className="space-y-5">
                  {fullLesson.exercises.map((ex) => (
                    <ExerciseCard key={ex.id} exercise={ex} />
                  ))}
                </div>
              </section>

              {/* 15. Review Questions */}
              <section className="space-y-3">
                <h3 className="font-display text-xl font-semibold text-[#020B1C]">
                  15. Questões de Revisão Reflexiva
                </h3>
                <div className="space-y-3">
                  {fullLesson.reviewQuestions.map((rq, idx) => (
                    <div
                      key={rq.question}
                      className="rounded-xl border border-slate-200 bg-white p-4 space-y-2"
                    >
                      <p className="text-sm font-medium text-[#020B1C]">
                        {idx + 1}. {rq.question}
                      </p>
                      {revealedQuestions[idx] ? (
                        <p className="text-xs text-[#164E9B] bg-[#F5F8FF] p-3 rounded-lg">
                          <strong>Orientação de resposta:</strong> {rq.guidance}
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setRevealedQuestions((prev) => ({ ...prev, [idx]: true }))
                          }
                          className="text-xs font-medium text-[#176BFF] hover:underline"
                        >
                          Revelar orientação após reflexão própria
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* 16. References */}
              <section className="space-y-3">
                <h3 className="font-display text-xl font-semibold text-[#020B1C]">
                  16. Referências e Leituras Complementares
                </h3>
                <ul className="space-y-2 text-sm">
                  {fullLesson.references.map((ref) => (
                    <li
                      key={ref.title}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 flex flex-wrap items-baseline justify-between gap-2"
                    >
                      <div>
                        <span className="font-semibold text-[#020B1C]">{ref.title}</span>
                        <span className="text-xs text-[#64748B] block">{ref.note}</span>
                      </div>
                      <span className="font-mono text-xs text-[#164E9B]">{ref.type}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* 17. Personal Notes & Lesson Navigation */}
              <section className="rounded-2xl border border-slate-200 bg-[#F5F8FF] p-5 sm:p-6 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-base font-semibold text-[#020B1C]">
                    17. Anotações Pessoais da Aula
                  </h3>
                  {noteSavedToast && (
                    <span className="text-xs font-medium text-emerald-700">
                      Anotação guardada
                    </span>
                  )}
                </div>
                <textarea
                  rows={3}
                  value={currentNoteValue}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Registe sínteses, dúvidas ou ideias para o projecto final..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-[#020B1C] focus:border-[#176BFF] focus:outline-none"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveNote}
                    className="min-h-[40px] px-4 py-2 rounded-xl bg-[#020B1C] text-white text-xs font-medium hover:bg-[#176BFF] transition-colors"
                  >
                    Guardar anotação
                  </button>
                </div>
              </section>

              {/* Footer Prev / Complete / Next */}
              <footer className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                {prevItem ? (
                  <button
                    type="button"
                    onClick={() => selectLesson(prevItem.lesson.id, prevItem.module.id)}
                    className="min-h-[44px] inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#020B1C] hover:border-[#176BFF]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Aula anterior
                  </button>
                ) : (
                  <span />
                )}

                <div className="flex flex-wrap items-center gap-3">
                  {!isCompleted && (
                    <button
                      type="button"
                      onClick={() =>
                        markLessonCompleted(
                          course.id,
                          activeLesson.id,
                          activeLesson.durationMinutes
                        )
                      }
                      className="min-h-[44px] inline-flex items-center gap-2 rounded-xl border border-emerald-600 text-emerald-700 bg-white px-4 py-2 text-sm font-medium hover:bg-emerald-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Concluir esta aula
                    </button>
                  )}

                  {nextItem && (
                    <button
                      type="button"
                      onClick={() => {
                        if (!isCompleted) {
                          markLessonCompleted(
                            course.id,
                            activeLesson.id,
                            activeLesson.durationMinutes
                          );
                        }
                        selectLesson(nextItem.lesson.id, nextItem.module.id);
                      }}
                      className="min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-[#176BFF] px-5 py-2 text-sm font-medium text-white hover:bg-[#164E9B] transition-colors"
                    >
                      Concluir e avançar
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </footer>
            </article>
          )}

          {/* TAB 2: MODULE EXERCISES */}
          {activeTab === 'exercicios' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="font-mono text-xs uppercase tracking-wider text-[#176BFF]">
                  Prática Orientada · Módulo {activeModule.order}
                </p>
                <h2 className="font-display text-2xl font-semibold text-[#020B1C] mt-1">
                  Exercícios Diversificados de {activeModule.title}
                </h2>
                <p className="text-sm text-[#64748B] mt-2">
                  Cada módulo combina diferentes formatos de validação (escolha múltipla,
                  associação, preenchimento, resolução de problema, estudo de caso, simulação e
                  questões discursivas). O gabarito só é revelado após submissão.
                </p>
              </div>

              {moduleExercises.map((ex) => (
                <ExerciseCard key={ex.id} exercise={ex} />
              ))}
            </div>
          )}

          {/* TAB 3: ASSESSMENTS */}
          {activeTab === 'avaliacoes' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-[#176BFF]">
                    Sistema de Avaliação Académica
                  </p>
                  <h2 className="font-display text-2xl font-semibold text-[#020B1C] mt-1">
                    Quizzes, Provas Modulares e Exames do Curso
                  </h2>
                  <p className="text-sm text-[#64748B] mt-1">
                    Média actual no curso:{' '}
                    <strong className="font-mono text-[#020B1C] tabular-nums">
                      {diag.averageScore}%
                    </strong>{' '}
                    · Exame Final:{' '}
                    <strong>{diag.finalExamPassed ? 'Aprovado' : 'Pendente'}</strong>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {diag.certificate ? (
                    <button
                      type="button"
                      onClick={() => navigate({ page: 'journey', subtab: 'certificados' })}
                      className="min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-medium text-white"
                    >
                      <Award className="w-4 h-4" />
                      Ver Certificado ({diag.certificate.verificationCode})
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleIssueCertificate}
                      className="min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-[#020B1C] px-4 py-2 text-sm font-medium text-white hover:bg-[#176BFF]"
                    >
                      <Award className="w-4 h-4" />
                      Solicitar Certificado
                    </button>
                  )}
                </div>
              </div>

              {certFeedback && (
                <div className="rounded-xl border border-[#176BFF]/30 bg-white p-4 text-sm text-[#020B1C]">
                  {certFeedback}
                </div>
              )}

              <AssessmentRunner assessment={lessonQuiz} />
              <AssessmentRunner assessment={moduleEval} />
              <AssessmentRunner assessment={course.intermediateExam} />
              <AssessmentRunner assessment={course.finalExam} />
            </div>
          )}

          {/* TAB 4: PROJECTS */}
          {activeTab === 'projectos' && (
            <div className="space-y-6">
              {[course.finalProject, ...course.practicalProjects].map((proj) => {
                const submission = state.projectSubmissions[proj.id];
                const form = projectForms[proj.id] || {
                  text: submission?.submissionText || '',
                  artifact: submission?.artifactUrlOrNotes || '',
                };

                return (
                  <div
                    key={proj.id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-xs uppercase tracking-wider text-[#176BFF]">
                          {proj.isFinalCapstone
                            ? 'Projecto Profissional de Conclusão'
                            : 'Projecto Prático Intermédio'}
                        </p>
                        <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#020B1C] mt-1">
                          {proj.title}
                        </h3>
                      </div>
                      <span className="font-mono text-xs text-[#64748B] tabular-nums">
                        {proj.estimatedHours}h estimadas
                      </span>
                    </div>

                    <p className="text-sm text-[#334155] leading-relaxed">{proj.brief}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="rounded-xl border border-slate-200 bg-[#F5F8FF]/60 p-4">
                        <h4 className="font-display text-sm font-semibold text-[#020B1C] mb-2.5">
                          Entregáveis Obrigatórios
                        </h4>
                        <ul className="space-y-1.5 text-xs sm:text-sm text-[#334155]">
                          {proj.deliverables.map((d) => (
                            <li key={d} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-[#176BFF] shrink-0 mt-0.5" />
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-[#F5F8FF]/60 p-4">
                        <h4 className="font-display text-sm font-semibold text-[#020B1C] mb-2.5">
                          Rubrica de Avaliação
                        </h4>
                        <ul className="space-y-2 text-xs">
                          {proj.rubric.map((r) => (
                            <li key={r.criterion} className="flex justify-between gap-2">
                              <span className="text-[#020B1C] font-medium">
                                {r.criterion}{' '}
                                <span className="text-[#64748B] font-normal">
                                  — {r.description}
                                </span>
                              </span>
                              <span className="font-mono font-semibold text-[#164E9B] tabular-nums shrink-0">
                                {r.weight}%
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {submission && (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#020B1C]">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          Projecto submetido e avaliado ({submission.score}%)
                        </div>
                        <span className="font-mono text-xs text-[#64748B] tabular-nums">
                          {new Date(submission.submittedAt).toLocaleDateString('pt-PT')}
                        </span>
                      </div>
                    )}

                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <label className="block text-xs font-semibold text-[#020B1C]">
                        Relatório técnico / síntese dos entregáveis
                      </label>
                      <textarea
                        rows={4}
                        value={form.text}
                        onChange={(e) =>
                          setProjectForms((prev) => ({
                            ...prev,
                            [proj.id]: { ...form, text: e.target.value, error: undefined },
                          }))
                        }
                        placeholder="Descreva a metodologia aplicada, decisões técnicas tomadas e resultados alcançados..."
                        className="w-full rounded-xl border border-slate-200 p-3.5 text-sm text-[#020B1C] focus:border-[#176BFF] focus:outline-none"
                      />
                      <input
                        type="text"
                        value={form.artifact}
                        onChange={(e) =>
                          setProjectForms((prev) => ({
                            ...prev,
                            [proj.id]: { ...form, artifact: e.target.value },
                          }))
                        }
                        placeholder="Ligação de repositório, documento ou referência do artefacto (opcional)"
                        className="w-full min-h-[42px] rounded-xl border border-slate-200 px-3.5 text-sm text-[#020B1C] focus:border-[#176BFF] focus:outline-none"
                      />
                      {form.error && (
                        <p className="text-xs font-medium text-rose-600">{form.error}</p>
                      )}
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleProjectSubmit(proj)}
                          className="min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-[#020B1C] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#176BFF] transition-colors"
                        >
                          <Sparkles className="w-4 h-4" />
                          {submission ? 'Actualizar submissão' : 'Submeter projecto'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 5: COURSE LIBRARY MATERIALS */}
          {activeTab === 'materiais' && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-[#176BFF]">
                    Acervo do Curso
                  </p>
                  <h2 className="font-display text-2xl font-semibold text-[#020B1C] mt-1">
                    Apostilas, Glossários e Estudos de Caso
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'library', courseFilter: course.id })}
                  className="min-h-[40px] px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-[#020B1C] hover:border-[#176BFF]"
                >
                  Abrir na Biblioteca Completa
                </button>
              </div>

              {courseLibraryItems.map((res) => (
                <div
                  key={res.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <p className="font-mono text-xs text-[#164E9B]">
                        {res.type} · {res.subject} · {res.pagesOrDuration}
                      </p>
                      <h3 className="font-display text-lg font-semibold text-[#020B1C] mt-1">
                        {res.title}
                      </h3>
                      <p className="text-xs text-[#64748B]">{res.author}</p>
                    </div>
                    <FileText className="w-5 h-5 text-[#176BFF]" />
                  </div>
                  <p className="text-sm text-[#334155] leading-relaxed">{res.summary}</p>
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    {res.sections.map((sec) => (
                      <div key={sec.heading}>
                        <p className="font-display text-sm font-semibold text-[#020B1C]">
                          {sec.heading}
                        </p>
                        <p className="text-sm text-[#64748B] mt-0.5 leading-relaxed">{sec.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
