import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  FlaskConical,
  Layers,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { COURSE_CATEGORIES } from '../../data/categories';
import { ALL_COURSES, getTotalPlatformMetrics } from '../../data/courses';
import { useUniversity } from '../../context/UniversityContext';
import { CategoryId } from '../../types/university';
import { CourseCard } from '../common/CourseCard';
import { CourseImage } from '../common/CourseImage';

const DIFFERENTIALS = [
  {
    icon: BookOpen,
    title: 'Formação aprofundada',
    description:
      'Programas extensos de 180 a 400 horas organizados em 16 a 20 módulos progressivos, com contextualização histórica, teoria estruturada e glossário técnico.',
  },
  {
    icon: FlaskConical,
    title: 'Aprendizagem prática',
    description:
      'Dez laboratórios interactivos dedicados onde o estudante testa código, prompts, folhas de cálculo, orçamentos financeiros, grelhas tipográficas e quadros Kanban.',
  },
  {
    icon: CheckCircle2,
    title: 'Exercícios interactivos',
    description:
      'Dez formatos pedagógicos distintos — da escolha múltipla à simulação e estudo de caso — com correcção e fundamentação reveladas apenas após a tentativa do aluno.',
  },
  {
    icon: ClipboardCheck,
    title: 'Avaliações',
    description:
      'Quizzes por aula, avaliações modulares, exame intermédio e exame final com critérios de aprovação configuráveis e registo histórico de pontuações.',
  },
  {
    icon: Briefcase,
    title: 'Projectos profissionais',
    description:
      'Projectos práticos intermédios e um projecto profissional de conclusão por curso com entregáveis reais, rubrica de avaliação e submissão registada.',
  },
  {
    icon: TrendingUp,
    title: 'Acompanhamento do progresso',
    description:
      'Painel analítico do estudante com registo de horas dedicadas, percentagem de conclusão por curso, notas médias, anotações pessoais e retomada imediata da última aula.',
  },
  {
    icon: Award,
    title: 'Certificação',
    description:
      'Emissão de certificado oficial do Instituto Meridiano exclusivamente mediante cumprimento integral dos requisitos académicos, com código único verificável.',
  },
];

export const HomePage: React.FC = () => {
  const { navigate, enrollInCourse, state } = useUniversity();
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
  const metrics = getTotalPlatformMetrics();

  const visibleCourses =
    activeCategory === 'all'
      ? ALL_COURSES
      : ALL_COURSES.filter((c) => c.categoryId === activeCategory);

  const handleStartCourse = (courseId: string) => {
    enrollInCourse(courseId);
    const lastLessonId = state.lastLessonByCourse[courseId];
    navigate({ page: 'learn', courseId, lessonId: lastLessonId });
  };

  const handleStartLearningHero = () => {
    const firstEnrolledId = state.enrolledCourseIds[0] || ALL_COURSES[0].id;
    handleStartCourse(firstEnrolledId);
  };

  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <section className="navy-radial-glow text-white relative overflow-hidden border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12 lg:pt-20 lg:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-center">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#176BFF] mb-4">
                Instituto Meridiano · Universidade Digital
              </p>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.35rem] font-semibold tracking-tight leading-[1.08] text-white text-balance">
                Conhecimento que transforma possibilidades em competências.
              </h1>

              <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Descubra formações completas, desenvolva competências profissionais e
                prepare-se para as oportunidades do futuro.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate({ page: 'courses', categoryFilter: 'all' })}
                  className="min-h-[48px] inline-flex items-center gap-2 rounded-xl bg-[#176BFF] px-6 py-3 text-sm sm:text-base font-medium text-white shadow-[0_12px_32px_-8px_rgba(23,107,255,0.65)] hover:bg-[#2576ff] transition-all"
                >
                  Explorar cursos
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleStartLearningHero}
                  className="min-h-[48px] inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-6 py-3 text-sm sm:text-base font-medium text-white hover:border-[#176BFF] hover:bg-white/10 transition-all"
                >
                  Começar a aprender
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex">
              <div className="glass-navy rounded-2xl p-3 w-full flex flex-col justify-between">
                <CourseImage
                  src="/src/assets/images/hero_university_architecture_1795013020574.jpg"
                  alt="Arquitectura luminosa de conhecimento e sistemas digitais do Instituto Meridiano"
                  title="Instituto Meridiano"
                  aspectClassName="aspect-[4/3] lg:aspect-auto lg:h-full min-h-[260px] rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Full-width structural figures strip */}
          <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="font-mono text-2xl sm:text-3xl font-semibold text-white tabular-nums">
                {metrics.totalCourses}
              </p>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Cursos profissionais oficiais
              </p>
            </div>
            <div>
              <p className="font-mono text-2xl sm:text-3xl font-semibold text-white tabular-nums">
                {metrics.totalHours}h
              </p>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Carga horária académica acumulada
              </p>
            </div>
            <div>
              <p className="font-mono text-2xl sm:text-3xl font-semibold text-white tabular-nums">
                {metrics.totalModules}
              </p>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Módulos curriculares estruturados
              </p>
            </div>
            <div>
              <p className="font-mono text-2xl sm:text-3xl font-semibold text-white tabular-nums">
                {metrics.totalLessons}
              </p>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Aulas completas com exercícios e diagramas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED 10 COURSES SECTION */}
      <section className="py-16 lg:py-20 bg-[#F5F8FF] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#176BFF]">
                Catálogo Académico Oficial
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#020B1C] mt-2 text-balance">
                Dez formações completas em profundidade internacional
              </h2>
              <p className="text-base text-[#64748B] mt-3 max-w-2xl">
                Cada curso constitui um universo curricular autónomo, com bibliografia, casos de
                estudo, laboratório interactivo, avaliações e projecto profissional de conclusão.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate({ page: 'courses', categoryFilter: 'all' })}
              className="self-start lg:self-auto min-h-[44px] inline-flex items-center gap-2 text-sm font-semibold text-[#164E9B] hover:text-[#176BFF] transition-colors"
            >
              Ver catálogo completo
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive category filter controls */}
          <div
            role="tablist"
            aria-label="Filtrar cursos em destaque por categoria"
            className="flex flex-wrap gap-2 mb-8"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === 'all'}
              onClick={() => setActiveCategory('all')}
              className={`min-h-[40px] px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeCategory === 'all'
                  ? 'bg-[#020B1C] text-white'
                  : 'bg-white border border-slate-200 text-[#020B1C] hover:border-[#176BFF]'
              }`}
            >
              Todos os cursos ({ALL_COURSES.length})
            </button>
            {COURSE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`min-h-[40px] px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-[#020B1C] text-white'
                    : 'bg-white border border-slate-200 text-[#020B1C] hover:border-[#176BFF]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {visibleCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onOpenDetail={(id) => navigate({ page: 'course-detail', courseId: id })}
                onStartLearning={handleStartCourse}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SIX ACADEMIC CATEGORIES SECTION */}
      <section className="py-16 lg:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#176BFF]">
              Estrutura Departamental
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#020B1C] mt-2">
              Seis áreas do conhecimento
            </h2>
            <p className="text-base text-[#64748B] mt-3">
              Organização curricular desenhada para construir competências técnicas, analíticas,
              criativas e de liderança empresarial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSE_CATEGORIES.map((category, index) => (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  navigate({ page: 'categories', selectedCategory: category.id })
                }
                className="group text-left rounded-2xl border border-slate-200 bg-white p-6 hover:border-[#176BFF] hover:shadow-[0_16px_40px_-24px_rgba(23,107,255,0.35)] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-[#176BFF] tabular-nums">
                      ÁREA 0{index + 1}
                    </span>
                    <span className="font-mono text-xs text-slate-400 tabular-nums">
                      {category.courseCount}{' '}
                      {category.courseCount === 1 ? 'curso' : 'cursos'}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-[#020B1C] mt-3 group-hover:text-[#176BFF] transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed mt-2">
                    {category.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-[#164E9B]">
                  <span className="truncate pr-3">{category.academicFocus}</span>
                  <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* DIFFERENTIALS SECTION */}
      <section className="py-16 lg:py-20 bg-[#020B1C] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#176BFF]">
              Arquitectura Pedagógica
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mt-2">
              Diferenciais de uma universidade digital exigente
            </h2>
            <p className="text-base text-slate-300 mt-3">
              Cada componente da plataforma foi desenhado por especialistas curriculares para
              garantir domínio conceptual, prática real e avaliação transparente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DIFFERENTIALS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-[#176BFF]/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#176BFF]/15 border border-[#176BFF]/35 flex items-center justify-center text-[#176BFF]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white mt-4">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed mt-2">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Quick Institutional Portals */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-navy rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <Layers className="w-5 h-5 text-[#176BFF]" />
                <h3 className="font-display text-lg font-semibold text-white mt-3">
                  Biblioteca Académica
                </h3>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  Apostilas, livros técnicos, glossários normalizados, estudos de caso e guias de
                  referência filtráveis por curso e tema.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate({ page: 'library' })}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#176BFF] hover:text-white transition-colors"
              >
                Abrir biblioteca
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="glass-navy rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <Compass className="w-5 h-5 text-[#176BFF]" />
                <h3 className="font-display text-lg font-semibold text-white mt-3">
                  Laboratórios Práticos
                </h3>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  Ambiente interactivo com editor HTML/CSS/JS, motor de fórmulas Excel, simulador
                  financeiro, quadro Kanban/CPM e auditoria defensiva.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate({ page: 'labs' })}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#176BFF] hover:text-white transition-colors"
              >
                Aceder aos laboratórios
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="glass-navy rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <ShieldCheck className="w-5 h-5 text-[#176BFF]" />
                <h3 className="font-display text-lg font-semibold text-white mt-3">
                  Verificação de Certificados
                </h3>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  Valide instantaneamente qualquer código único emitido pelo Instituto Meridiano
                  para confirmar carga horária, nota final e competências certificadas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate({ page: 'verify-certificate' })}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#176BFF] hover:text-white transition-colors"
              >
                Verificar código
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
