import React, { useState } from 'react';
import {
  Award,
  Bookmark,
  CheckCircle2,
  Compass,
  Play,
  Printer,
  Settings,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import { ALL_COURSES, getCourseById } from '../../data/courses';
import { useUniversity } from '../../context/UniversityContext';
import { ApprovalCriteria, Certificate } from '../../types/university';

interface JourneyPageProps {
  initialSubtab?: 'progresso' | 'perfil' | 'certificados' | 'criterios';
}

export const JourneyPage: React.FC<JourneyPageProps> = ({
  initialSubtab = 'progresso',
}) => {
  const {
    state,
    navigate,
    getCourseDiagnostics,
    updateProfile,
    updateApprovalCriteria,
    requestCertificate,
  } = useUniversity();

  const [subtab, setSubtab] = useState<typeof initialSubtab>(initialSubtab);
  const [profileName, setProfileName] = useState(state.user.name);
  const [profileEmail, setProfileEmail] = useState(state.user.email);
  const [profileUnit, setProfileUnit] = useState(state.user.institutionUnit);
  const [profileSaved, setProfileSaved] = useState(false);

  const [criteriaDraft, setCriteriaDraft] = useState<ApprovalCriteria>(state.approvalCriteria);
  const [criteriaSaved, setCriteriaSaved] = useState(false);

  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);
  const [certMessage, setCertMessage] = useState<string>('');

  const enrolledCourses = ALL_COURSES.filter((c) =>
    state.enrolledCourseIds.includes(c.id)
  );
  const totalMinutesAll = Object.values(state.studyMinutesByCourse).reduce(
    (a, b) => a + b,
    0
  );
  const totalHoursStudied = (totalMinutesAll / 60).toFixed(1);
  const maxDailyMin = Math.max(
    30,
    ...state.dailyStudyMinutes.map((d) => d.minutes)
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim() || !profileEmail.trim()) return;
    updateProfile({
      name: profileName.trim(),
      email: profileEmail.trim(),
      institutionUnit: profileUnit.trim() || 'Campus Digital Internacional',
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2200);
  };

  const handleSaveCriteria = (e: React.FormEvent) => {
    e.preventDefault();
    updateApprovalCriteria(criteriaDraft);
    setCriteriaSaved(true);
    setTimeout(() => setCriteriaSaved(false), 2200);
  };

  const handleRequestCert = async (courseId: string) => {
    const course = getCourseById(courseId);
    if (!course) return;
    setCertMessage('');
    const res = await requestCertificate(course);
    if (res.certificate) {
      setActiveCertificate(res.certificate);
      setCertMessage(`Certificado emitido com código ${res.certificate.verificationCode}.`);
    } else if (res.error) {
      setCertMessage(res.error);
    }
  };

  return (
    <div className="bg-[#F5F8FF] min-h-screen">
      {/* Header */}
      <section className="navy-radial-glow text-white border-b border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#176BFF]/25 border border-[#176BFF]/50 flex items-center justify-center font-display text-xl font-semibold text-white">
              {state.user.avatarInitials}
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#176BFF]">
                Meu Percurso Académico
              </p>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white mt-0.5">
                {state.user.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                {state.user.email} · {state.user.institutionUnit}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
            <div>
              <p className="text-xs text-slate-400">Cursos activos</p>
              <p className="font-mono text-xl font-semibold text-white tabular-nums mt-0.5">
                {enrolledCourses.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Horas estudadas</p>
              <p className="font-mono text-xl font-semibold text-white tabular-nums mt-0.5">
                {totalHoursStudied}h
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Certificados</p>
              <p className="font-mono text-xl font-semibold text-white tabular-nums mt-0.5">
                {state.certificates.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Subtabs */}
        <div role="tablist" className="flex flex-wrap gap-2">
          {(
            [
              { id: 'progresso', label: 'Progresso e Métricas', icon: Compass },
              { id: 'certificados', label: 'Certificados', icon: Award },
              { id: 'perfil', label: 'Perfil do Estudante', icon: User },
              { id: 'criterios', label: 'Critérios de Aprovação', icon: Settings },
            ] as const
          ).map((t) => {
            const Icon = t.icon;
            const active = subtab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSubtab(t.id)}
                className={`min-h-[42px] inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#020B1C] text-white'
                    : 'bg-white border border-slate-200 text-[#020B1C] hover:border-[#176BFF]'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#176BFF]' : 'text-slate-400'}`} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* SUBTAB 1: PROGRESS */}
        {subtab === 'progresso' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Weekly study SVG Chart */}
              <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="font-display text-lg font-semibold text-[#020B1C]">
                  Dedicação Semanal (minutos)
                </h2>
                <p className="text-xs text-[#64748B] mt-1">
                  Registo acumulado nas aulas concluídas e prática em laboratório.
                </p>
                <svg
                  viewBox="0 0 320 175"
                  className="w-full h-44 mt-4"
                  role="img"
                  aria-label="Gráfico semanal de minutos de estudo"
                >
                  {state.dailyStudyMinutes.map((d, idx) => {
                    const barH = Math.max(4, (d.minutes / maxDailyMin) * 115);
                    const x = 14 + idx * 44;
                    return (
                      <g key={d.day}>
                        <rect
                          x={x}
                          y={135 - barH}
                          width={24}
                          height={barH}
                          rx={5}
                          fill={d.minutes > 0 ? '#176BFF' : '#e2e8f0'}
                        />
                        <text
                          x={x + 12}
                          y={128 - barH}
                          textAnchor="middle"
                          className="fill-slate-600 text-[9px] font-mono"
                        >
                          {d.minutes > 0 ? d.minutes : ''}
                        </text>
                        <text
                          x={x + 12}
                          y={156}
                          textAnchor="middle"
                          className="fill-slate-500 text-[10px] font-mono"
                        >
                          {d.day}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Overall counters & favorites */}
              <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
                <h2 className="font-display text-lg font-semibold text-[#020B1C]">
                  Resumo do Desempenho Académico
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl border border-slate-200 bg-[#F5F8FF] p-4">
                    <p className="text-xs text-[#64748B]">Aulas concluídas</p>
                    <p className="font-mono text-2xl font-semibold text-[#020B1C] tabular-nums mt-1">
                      {state.completedLessonIds.length}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-[#F5F8FF] p-4">
                    <p className="text-xs text-[#64748B]">Exercícios resolvidos</p>
                    <p className="font-mono text-2xl font-semibold text-[#020B1C] tabular-nums mt-1">
                      {Object.keys(state.exerciseAttempts).length}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-[#F5F8FF] p-4">
                    <p className="text-xs text-[#64748B]">Provas realizadas</p>
                    <p className="font-mono text-2xl font-semibold text-[#020B1C] tabular-nums mt-1">
                      {Object.keys(state.assessmentResults).length}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-[#F5F8FF] p-4">
                    <p className="text-xs text-[#64748B]">Projectos submetidos</p>
                    <p className="font-mono text-2xl font-semibold text-[#020B1C] tabular-nums mt-1">
                      {Object.keys(state.projectSubmissions).length}
                    </p>
                  </div>
                </div>

                {state.favoriteLessonIds.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-xs font-semibold text-[#020B1C] inline-flex items-center gap-1.5 mb-2">
                      <Bookmark className="w-3.5 h-3.5 text-[#176BFF]" />
                      Aulas marcadas como favoritas ({state.favoriteLessonIds.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {state.favoriteLessonIds.slice(0, 6).map((lid) => {
                        const courseId = lid.split('-m')[0];
                        return (
                          <button
                            key={lid}
                            type="button"
                            onClick={() =>
                              navigate({ page: 'learn', courseId, lessonId: lid })
                            }
                            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#176BFF] text-[#020B1C]"
                          >
                            {lid}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Course Progress Breakdown */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-xl font-semibold text-[#020B1C]">
                  Cursos em Andamento e Progresso Detalhado
                </h2>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'courses', categoryFilter: 'all' })}
                  className="text-xs font-medium text-[#176BFF] hover:underline"
                >
                  Explorar mais formações
                </button>
              </div>

              {enrolledCourses.length === 0 ? (
                <div className="py-8 text-center text-sm text-[#64748B]">
                  Ainda não iniciou nenhum curso. Escolha uma formação no catálogo para começar o
                  seu percurso.
                </div>
              ) : (
                <div className="space-y-4">
                  {enrolledCourses.map((course) => {
                    const diag = getCourseDiagnostics(course);
                    const lastLesson = state.lastLessonByCourse[course.id];
                    return (
                      <div
                        key={course.id}
                        className="rounded-xl border border-slate-200 p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#164E9B]">
                            <span>CURSO {course.number}</span>
                            <span>·</span>
                            <span>{course.categoryName}</span>
                            <span>·</span>
                            <span>{course.totalHours}h totais</span>
                          </div>
                          <h3 className="font-display text-lg font-semibold text-[#020B1C]">
                            {course.title}
                          </h3>
                          <div className="max-w-xl">
                            <div className="flex justify-between text-xs text-[#64748B] mb-1 font-mono tabular-nums">
                              <span>
                                {diag.completedLessons}/{diag.totalLessons} aulas · Média:{' '}
                                {diag.averageScore}%
                              </span>
                              <span className="font-semibold text-[#020B1C]">
                                {diag.completionPct}%
                              </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full bg-[#176BFF]"
                                style={{ width: `${Math.max(3, diag.completionPct)}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              navigate({
                                page: 'learn',
                                courseId: course.id,
                                lessonId: lastLesson,
                              })
                            }
                            className="min-h-[42px] inline-flex items-center gap-1.5 rounded-xl bg-[#020B1C] px-4 py-2 text-xs font-medium text-white hover:bg-[#176BFF]"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            Retomar aula
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              navigate({ page: 'course-detail', courseId: course.id })
                            }
                            className="min-h-[42px] px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-[#020B1C] hover:border-[#176BFF]"
                          >
                            Ver programa
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUBTAB 2: CERTIFICATES */}
        {subtab === 'certificados' && (
          <div className="space-y-6">
            {certMessage && (
              <div className="rounded-xl border border-[#176BFF]/30 bg-white p-4 text-sm text-[#020B1C]">
                {certMessage}
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-semibold text-[#020B1C]">
                    Certificados Oficiais Emitidos
                  </h2>
                  <p className="text-sm text-[#64748B] mt-1">
                    Os certificados são emitidos exclusivamente após o cumprimento dos critérios de
                    conclusão, média mínima, exame final e projecto profissional.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'verify-certificate' })}
                  className="min-h-[40px] inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-[#020B1C] hover:border-[#176BFF]"
                >
                  <ShieldCheck className="w-4 h-4 text-[#176BFF]" />
                  Verificar código externo
                </button>
              </div>

              {state.certificates.length === 0 ? (
                <p className="text-sm text-[#64748B] py-4 border-t border-slate-100">
                  Ainda não existem certificados emitidos nesta conta. Conclua os requisitos de um
                  curso abaixo para solicitar a emissão oficial.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {state.certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="rounded-xl border border-[#176BFF]/30 bg-[#020B1C] text-white p-5 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-mono text-xs text-[#176BFF]">
                            {cert.verificationCode}
                          </p>
                          <h3 className="font-display text-lg font-semibold mt-1">
                            {cert.courseTitle}
                          </h3>
                        </div>
                        <Award className="w-6 h-6 text-[#176BFF] shrink-0" />
                      </div>
                      <p className="text-xs text-slate-300 font-mono tabular-nums">
                        {cert.totalHours}h · Nota final: {cert.finalScore}% · Emitido em{' '}
                        {new Date(cert.issuedAt).toLocaleDateString('pt-PT')}
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveCertificate(cert)}
                        className="min-h-[38px] px-4 py-1.5 rounded-lg bg-[#176BFF] text-white text-xs font-medium hover:bg-[#2576ff]"
                      >
                        Abrir diploma oficial
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Eligibility checklist per course */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
              <h2 className="font-display text-lg font-semibold text-[#020B1C]">
                Elegibilidade para Certificação por Curso
              </h2>
              <div className="divide-y divide-slate-100">
                {ALL_COURSES.map((course) => {
                  const diag = getCourseDiagnostics(course);
                  return (
                    <div
                      key={course.id}
                      className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div>
                        <p className="font-display text-base font-semibold text-[#020B1C]">
                          {course.number}. {course.title}
                        </p>
                        <p className="text-xs text-[#64748B] font-mono mt-1 tabular-nums">
                          Aulas: {diag.completionPct}% (mín.{' '}
                          {state.approvalCriteria.minLessonCompletionPct}%) · Média:{' '}
                          {diag.averageScore}% (mín. {state.approvalCriteria.minAverageScore}%) ·
                          Exame Final: {diag.finalExamPassed ? 'Aprovado' : 'Pendente'} · Projecto:{' '}
                          {diag.finalProjectSubmitted ? 'Submetido' : 'Pendente'}
                        </p>
                      </div>
                      <div className="shrink-0">
                        {diag.certificate ? (
                          <button
                            type="button"
                            onClick={() => setActiveCertificate(diag.certificate!)}
                            className="min-h-[40px] px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-medium"
                          >
                            Emitido ({diag.certificate.verificationCode})
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRequestCert(course.id)}
                            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
                              diag.eligibleForCertificate
                                ? 'bg-[#176BFF] text-white hover:bg-[#164E9B]'
                                : 'border border-slate-200 text-[#64748B] hover:border-[#020B1C]'
                            }`}
                          >
                            Solicitar certificado
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: PROFILE */}
        {subtab === 'perfil' && (
          <form
            onSubmit={handleSaveProfile}
            className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 max-w-2xl space-y-5"
          >
            <h2 className="font-display text-xl font-semibold text-[#020B1C]">
              Dados do Estudante
            </h2>
            <div className="space-y-4">
              <label className="block space-y-1.5 text-sm">
                <span className="font-medium text-[#020B1C]">Nome completo (usado nos certificados)</span>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full min-h-[44px] rounded-xl border border-slate-200 px-4 text-sm text-[#020B1C] focus:border-[#176BFF] focus:outline-none"
                />
              </label>
              <label className="block space-y-1.5 text-sm">
                <span className="font-medium text-[#020B1C]">Correio electrónico institucional</span>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full min-h-[44px] rounded-xl border border-slate-200 px-4 text-sm text-[#020B1C] focus:border-[#176BFF] focus:outline-none"
                />
              </label>
              <label className="block space-y-1.5 text-sm">
                <span className="font-medium text-[#020B1C]">Unidade académica / Polo</span>
                <input
                  type="text"
                  value={profileUnit}
                  onChange={(e) => setProfileUnit(e.target.value)}
                  className="w-full min-h-[44px] rounded-xl border border-slate-200 px-4 text-sm text-[#020B1C] focus:border-[#176BFF] focus:outline-none"
                />
              </label>
            </div>
            <div className="flex items-center justify-between pt-2">
              {profileSaved ? (
                <span className="text-xs font-medium text-emerald-700 inline-flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Perfil actualizado
                </span>
              ) : (
                <span />
              )}
              <button
                type="submit"
                className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#020B1C] text-white text-sm font-medium hover:bg-[#176BFF]"
              >
                Guardar alterações
              </button>
            </div>
          </form>
        )}

        {/* SUBTAB 4: CONFIGURABLE APPROVAL CRITERIA */}
        {subtab === 'criterios' && (
          <form
            onSubmit={handleSaveCriteria}
            className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 max-w-2xl space-y-5"
          >
            <div>
              <h2 className="font-display text-xl font-semibold text-[#020B1C]">
                Critérios Académicos de Aprovação e Certificação
              </h2>
              <p className="text-sm text-[#64748B] mt-1">
                Configure as regras mínimas exigidas para elegibilidade e emissão de certificados.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <label className="space-y-1.5">
                <span className="font-medium text-[#020B1C]">
                  Conclusão mínima de aulas (%)
                </span>
                <input
                  type="number"
                  min={10}
                  max={100}
                  value={criteriaDraft.minLessonCompletionPct}
                  onChange={(e) =>
                    setCriteriaDraft((p) => ({
                      ...p,
                      minLessonCompletionPct: Number(e.target.value),
                    }))
                  }
                  className="w-full min-h-[42px] rounded-xl border border-slate-200 px-3.5 font-mono"
                />
              </label>
              <label className="space-y-1.5">
                <span className="font-medium text-[#020B1C]">Nota média mínima (%)</span>
                <input
                  type="number"
                  min={50}
                  max={100}
                  value={criteriaDraft.minAverageScore}
                  onChange={(e) =>
                    setCriteriaDraft((p) => ({
                      ...p,
                      minAverageScore: Number(e.target.value),
                    }))
                  }
                  className="w-full min-h-[42px] rounded-xl border border-slate-200 px-3.5 font-mono"
                />
              </label>
            </div>

            <div className="space-y-2.5 text-sm">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={criteriaDraft.requireFinalExam}
                  onChange={(e) =>
                    setCriteriaDraft((p) => ({ ...p, requireFinalExam: e.target.checked }))
                  }
                  className="accent-[#176BFF]"
                />
                <span>Exigir aprovação no Exame Final do curso</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={criteriaDraft.requireFinalProject}
                  onChange={(e) =>
                    setCriteriaDraft((p) => ({ ...p, requireFinalProject: e.target.checked }))
                  }
                  className="accent-[#176BFF]"
                />
                <span>Exigir submissão avaliada do Projecto Profissional de Conclusão</span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-2">
              {criteriaSaved ? (
                <span className="text-xs font-medium text-emerald-700 inline-flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Critérios actualizados
                </span>
              ) : (
                <span />
              )}
              <button
                type="submit"
                className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#020B1C] text-white text-sm font-medium hover:bg-[#176BFF]"
              >
                Guardar critérios
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Certificate Preview Modal */}
      {activeCertificate && (
        <div
          className="fixed inset-0 z-50 bg-[#020B1C]/80 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden border border-slate-200 shadow-2xl">
            <div className="p-8 sm:p-10 bg-[#020B1C] text-white relative border-b-4 border-[#176BFF]">
              <button
                type="button"
                onClick={() => setActiveCertificate(null)}
                className="absolute top-4 right-4 p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
                aria-label="Fechar certificado"
              >
                <X className="w-5 h-5" />
              </button>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#176BFF]">
                {activeCertificate.issuerName} · Certificação Oficial
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold mt-4">
                Certificado de Conclusão Profissional
              </h2>
              <p className="text-sm text-slate-300 mt-4">
                Certifica-se que <strong className="text-white">{activeCertificate.studentName}</strong>{' '}
                concluiu com aproveitamento o programa completo de
              </p>
              <p className="font-display text-xl sm:text-2xl font-semibold text-[#176BFF] mt-2">
                {activeCertificate.courseTitle}
              </p>
              <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-3 gap-4 font-mono text-xs tabular-nums">
                <div>
                  <span className="text-slate-400 block">CARGA HORÁRIA</span>
                  <strong className="text-white">{activeCertificate.totalHours} horas</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">CLASSIFICAÇÃO</span>
                  <strong className="text-white">{activeCertificate.finalScore}%</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">CÓDIGO ÚNICO</span>
                  <strong className="text-[#176BFF]">{activeCertificate.verificationCode}</strong>
                </div>
              </div>
            </div>
            <div className="p-6 bg-[#F5F8FF] flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-[#64748B]">
                Emitido em {new Date(activeCertificate.issuedAt).toLocaleDateString('pt-PT')}
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="min-h-[40px] inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-[#020B1C] hover:border-[#176BFF]"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir / Guardar PDF
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCertificate(null)}
                  className="min-h-[40px] px-4 py-2 rounded-xl bg-[#020B1C] text-white text-xs font-medium"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
