import React, { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { COURSE_CATEGORIES } from '../../data/categories';
import { ALL_COURSES } from '../../data/courses';
import { useUniversity } from '../../context/UniversityContext';
import { CategoryId } from '../../types/university';
import { CourseCard } from '../common/CourseCard';

interface CoursesPageProps {
  initialCategory?: CategoryId | 'all';
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ initialCategory = 'all' }) => {
  const { navigate, enrollInCourse, state } = useUniversity();
  const [category, setCategory] = useState<CategoryId | 'all'>(initialCategory);
  const [level, setLevel] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'number' | 'hours-desc' | 'hours-asc'>('number');

  const levels = useMemo(
    () => Array.from(new Set(ALL_COURSES.map((c) => c.level))),
    []
  );

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = ALL_COURSES.filter((c) => {
      if (category !== 'all' && c.categoryId !== category) return false;
      if (level !== 'all' && c.level !== level) return false;
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.categoryName.toLowerCase().includes(q) ||
        c.competencies.some((comp) => comp.toLowerCase().includes(q))
      );
    });

    if (sortBy === 'hours-desc') return [...list].sort((a, b) => b.totalHours - a.totalHours);
    if (sortBy === 'hours-asc') return [...list].sort((a, b) => a.totalHours - b.totalHours);
    return list;
  }, [category, level, query, sortBy]);

  const handleStartCourse = (courseId: string) => {
    enrollInCourse(courseId);
    navigate({
      page: 'learn',
      courseId,
      lessonId: state.lastLessonByCourse[courseId],
    });
  };

  return (
    <div className="bg-[#F5F8FF] min-h-screen">
      <section className="navy-radial-glow text-white border-b border-white/10 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#176BFF]">
            Explorar Cursos
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white mt-2">
            Catálogo Completo de Formações Profissionais
          </h1>
          <p className="text-slate-300 mt-3 max-w-2xl text-base">
            Consulte os dez programas oficiais do Instituto Meridiano, filtre por área ou nível e
            aceda imediatamente às aulas, laboratórios e planos curriculares.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar por título, competência ou área..."
                aria-label="Pesquisar cursos"
                className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-[#F5F8FF]/60 pl-10 pr-4 text-sm text-[#020B1C] placeholder:text-slate-400 focus:border-[#176BFF] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                aria-label="Filtrar por nível"
                className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-[#020B1C] focus:border-[#176BFF] focus:outline-none"
              >
                <option value="all">Todos os níveis</option>
                {levels.map((lv) => (
                  <option key={lv} value={lv}>
                    {lv}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                aria-label="Ordenar cursos"
                className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-[#020B1C] focus:border-[#176BFF] focus:outline-none"
              >
                <option value="number">Ordem oficial (01 – 10)</option>
                <option value="hours-desc">Maior carga horária</option>
                <option value="hours-asc">Menor carga horária</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCategory('all')}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                category === 'all'
                  ? 'bg-[#020B1C] text-white'
                  : 'bg-[#F5F8FF] text-[#020B1C] hover:bg-slate-200/70'
              }`}
            >
              Todas ({ALL_COURSES.length})
            </button>
            {COURSE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  category === cat.id
                    ? 'bg-[#020B1C] text-white'
                    : 'bg-[#F5F8FF] text-[#020B1C] hover:bg-slate-200/70'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-[#64748B] mb-6 font-mono tabular-nums">
          {filteredCourses.length}{' '}
          {filteredCourses.length === 1 ? 'curso encontrado' : 'cursos encontrados'}
        </p>

        {filteredCourses.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <p className="font-display text-lg font-semibold text-[#020B1C]">
              Nenhum curso corresponde aos filtros seleccionados
            </p>
            <p className="text-sm text-[#64748B] mt-2">
              Limpe a pesquisa ou seleccione outra categoria para consultar todos os programas.
            </p>
            <button
              type="button"
              onClick={() => {
                setCategory('all');
                setLevel('all');
                setQuery('');
              }}
              className="mt-5 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#020B1C] text-white text-sm font-medium hover:bg-[#176BFF] transition-colors"
            >
              Repor filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onOpenDetail={(id) => navigate({ page: 'course-detail', courseId: id })}
                onStartLearning={handleStartCourse}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
