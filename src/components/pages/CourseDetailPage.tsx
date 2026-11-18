import React, { useState } from 'react';
import {
  ArrowLeft,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  FlaskConical,
  Play,
} from 'lucide-react';
import { getCourseById, getCourseLessonCount } from '../../data/courses';
import { useUniversity } from '../../context/UniversityContext';
import { CourseImage } from '../common/CourseImage';

interface CourseDetailPageProps {
  courseId: string;
}

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ courseId }) => {
  const { navigate, enrollInCourse, getCourseDiagnostics, state } = useUniversity();
  const course = getCourseById(courseId);
  const [openModuleId, setOpenModuleId] = useState<string | null>(
    course?.modules[0]?.id || null
  );

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold text-[#020B1C]">
          Curso não encontrado
        </h1>
        <button
          type="button"
          onClick={() => navigate({ page: 'courses', categoryFilter: 'all' })}
          className="mt-6 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#020B1C] text-white text-sm font-medium"
        >
          Voltar ao catálogo
        </button>
      </div>
    );
  }

  const totalLessons = getCourseLessonCount(course);
  const diag = getCourseDiagnostics(course);

  const handleEnterCourse = (lessonId?: string) => {
    enrollInCourse(course.id);
    navigate({
      page: 'learn',
      courseId: course.id,
      lessonId: lessonId || state.lastLessonByCourse[course.id] || course.modules[0].lessons[0].id,
    });
  };

  return (
    <div className="bg-[#F5F8FF] min-h-screen">
      {/* Course Hero Header */}
      <section className="navy-radial-glow text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <button
            type="button"
            onClick={() => navigate({ page: 'courses', categoryFilter: 'all' })}
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar aos cursos
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#176BFF]">
                Programa {course.number} · {course.categoryName} · {course.level}
              </p>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-white mt-3 leading-tight text-balance">
                {course.title}
              </h1>
              <p className="text-lg text-slate-200 mt-3">{course.subtitle}</p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mt-4 max-w-2xl">
                {course.academicOverview}
              </p>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-y border-white/10">
                <div>
                  <p className="text-xs text-slate-400">Carga horária</p>
                  <p className="font-mono text-xl font-semibold text-white tabular-nums mt-0.5">
                    {course.totalHours}h
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Módulos</p>
                  <p className="font-mono text-xl font-semibold text-white tabular-nums mt-0.5">
                    {course.modules.length}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Aulas</p>
                  <p className="font-mono text-xl font-semibold text-white tabular-nums mt-0.5">
                    {totalLessons}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Projectos</p>
                  <p className="font-mono text-xl font-semibold text-white tabular-nums mt-0.5">
                    {course.practicalProjects.length + 1}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleEnterCourse()}
                  className="min-h-[48px] inline-flex items-center gap-2 rounded-xl bg-[#176BFF] px-6 py-3 text-sm sm:text-base font-medium text-white hover:bg-[#2576ff] transition-colors"
                >
                  <Play className="w-4 h-4 fill-current" />
                  {diag.enrolled ? 'Continuar aprendizagem' : 'Iniciar formação'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'labs', courseId: course.id })}
                  className="min-h-[48px] inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white hover:border-[#176BFF] hover:bg-white/10 transition-colors"
                >
                  <FlaskConical className="w-4 h-4 text-[#176BFF]" />
                  Abrir laboratório do curso
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="glass-navy rounded-2xl p-3">
                <CourseImage
                  src={course.coverImage}
                  alt={`Capa do programa ${course.title}`}
                  title={course.shortTitle}
                  accentColor={course.accentColor}
                  aspectClassName="aspect-[16/10] rounded-xl"
                />
                {diag.enrolled && (
                  <div className="p-4 mt-1">
                    <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                      <span>O seu progresso actual</span>
                      <span className="font-mono font-semibold text-white tabular-nums">
                        {diag.completedLessons}/{diag.totalLessons} aulas ({diag.completionPct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-[#176BFF]"
                        style={{ width: `${Math.max(4, diag.completionPct)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 columns: Syllabus Accordion */}
        <div className="lg:col-span-8 space-y-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-[#176BFF]">
                  Estrutura Curricular
                </p>
                <h2 className="font-display text-2xl font-semibold text-[#020B1C] mt-1">
                  Plano de Estudos Completo ({course.modules.length} módulos)
                </h2>
              </div>
              <span className="font-mono text-xs text-[#64748B] tabular-nums">
                {totalLessons} aulas · {course.totalHours} horas
              </span>
            </div>

            <div className="divide-y divide-slate-200 border-t border-slate-200">
              {course.modules.map((mod) => {
                const isOpen = openModuleId === mod.id;
                const completedInMod = mod.lessons.filter((l) =>
                  state.completedLessonIds.includes(l.id)
                ).length;

                return (
                  <div key={mod.id} className="py-1">
                    <button
                      type="button"
                      onClick={() => setOpenModuleId(isOpen ? null : mod.id)}
                      aria-expanded={isOpen}
                      className="w-full py-4 flex items-start justify-between gap-4 text-left group"
                    >
                      <div>
                        <p className="font-mono text-xs text-[#164E9B] tabular-nums">
                          MÓDULO {String(mod.order).padStart(2, '0')} · {mod.hours}h ·{' '}
                          {mod.lessons.length} aulas
                          {completedInMod > 0 && ` · ${completedInMod} concluídas`}
                        </p>
                        <h3 className="font-display text-base sm:text-lg font-semibold text-[#020B1C] mt-1 group-hover:text-[#176BFF] transition-colors">
                          {mod.title}
                        </h3>
                        <p className="text-sm text-[#64748B] mt-1">{mod.summary}</p>
                      </div>
                      <span className="mt-1 p-1.5 rounded-lg border border-slate-200 text-slate-500 shrink-0">
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="pb-5 pl-2 sm:pl-4 space-y-4">
                        <p className="text-xs text-[#64748B]">
                          <strong className="text-[#020B1C]">Conceitos nucleares:</strong>{' '}
                          {mod.coreConcepts.join(' · ')}
                        </p>
                        <ul className="space-y-2">
                          {mod.lessons.map((lesson) => {
                            const done = state.completedLessonIds.includes(lesson.id);
                            return (
                              <li key={lesson.id}>
                                <button
                                  type="button"
                                  onClick={() => handleEnterCourse(lesson.id)}
                                  className="w-full min-h-[44px] rounded-xl border border-slate-200/80 bg-[#F5F8FF]/60 px-4 py-2.5 flex items-center justify-between gap-3 text-left hover:border-[#176BFF] hover:bg-white transition-colors"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    {done ? (
                                      <CheckCircle2 className="w-4 h-4 text-[#176BFF] shrink-0" />
                                    ) : (
                                      <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                                    )}
                                    <span className="text-sm font-medium text-[#020B1C] truncate">
                                      Aula {lesson.order}: {lesson.title}
                                    </span>
                                  </div>
                                  <span className="font-mono text-xs text-slate-500 shrink-0 tabular-nums inline-flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {lesson.durationMinutes} min
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Capstone & Practical Projects */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-[#176BFF]">
                Prática e Portfólio
              </p>
              <h2 className="font-display text-2xl font-semibold text-[#020B1C] mt-1">
                Projecto Profissional de Conclusão
              </h2>
            </div>

            <div className="rounded-xl border border-[#176BFF]/25 bg-[#F5F8FF] p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-lg font-semibold text-[#020B1C]">
                  {course.finalProject.title}
                </h3>
                <span className="font-mono text-xs text-[#164E9B] tabular-nums">
                  {course.finalProject.estimatedHours}h estimadas
                </span>
              </div>
              <p className="text-sm text-[#64748B] leading-relaxed mt-2">
                {course.finalProject.brief}
              </p>
              <div className="mt-4">
                <p className="text-xs font-semibold text-[#020B1C] uppercase tracking-wider mb-2">
                  Entregáveis obrigatórios
                </p>
                <ul className="space-y-1.5 text-sm text-[#020B1C]">
                  {course.finalProject.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#176BFF] shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {course.practicalProjects.length > 0 && (
              <div>
                <h3 className="font-display text-base font-semibold text-[#020B1C] mb-3">
                  Projectos práticos intermédios
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {course.practicalProjects.map((proj) => (
                    <div
                      key={proj.id}
                      className="rounded-xl border border-slate-200 p-4 bg-white"
                    >
                      <p className="font-display text-sm font-semibold text-[#020B1C]">
                        {proj.title}
                      </p>
                      <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                        {proj.brief}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 4 columns: Competencies, Outcomes, Assessments */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-[#020B1C]">
              Competências desenvolvidas
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-[#020B1C]">
              {course.competencies.map((comp) => (
                <li key={comp} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#176BFF] shrink-0 mt-0.5" />
                  <span>{comp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2 text-[#020B1C]">
              <Briefcase className="w-4 h-4 text-[#176BFF]" />
              <h2 className="font-display text-lg font-semibold">Saídas profissionais</h2>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-[#64748B]">
              {course.careerOutcomes.map((out) => (
                <li key={out} className="pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                  {out}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#020B1C]">
              <Award className="w-4 h-4 text-[#176BFF]" />
              <h2 className="font-display text-lg font-semibold">Regime de Avaliação</h2>
            </div>
            <div className="text-sm text-[#64748B] space-y-2">
              <p>
                <strong className="text-[#020B1C]">Exame Intermédio:</strong>{' '}
                {course.intermediateExam.questions.length} questões · mínimo{' '}
                {course.intermediateExam.passingScore}%
              </p>
              <p>
                <strong className="text-[#020B1C]">Exame Final:</strong>{' '}
                {course.finalExam.questions.length} questões · mínimo{' '}
                {course.finalExam.passingScore}%
              </p>
              <p>
                <strong className="text-[#020B1C]">Certificação:</strong> Emitida após conclusão
                curricular e aprovação nas provas e projecto final.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
