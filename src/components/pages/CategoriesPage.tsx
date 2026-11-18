import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { COURSE_CATEGORIES } from '../../data/categories';
import { ALL_COURSES } from '../../data/courses';
import { useUniversity } from '../../context/UniversityContext';
import { CategoryId } from '../../types/university';
import { CourseCard } from '../common/CourseCard';

interface CategoriesPageProps {
  initialCategory?: CategoryId;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ initialCategory }) => {
  const { navigate, enrollInCourse, state } = useUniversity();
  const [selected, setSelected] = useState<CategoryId>(
    initialCategory || COURSE_CATEGORIES[0].id
  );

  const activeCat =
    COURSE_CATEGORIES.find((c) => c.id === selected) || COURSE_CATEGORIES[0];
  const categoryCourses = ALL_COURSES.filter((c) => c.categoryId === activeCat.id);

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
            Áreas Disciplinares
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white mt-2">
            Categorias Académicas
          </h1>
          <p className="text-slate-300 mt-3 max-w-2xl text-base">
            Explore cada faculdade temática do Instituto Meridiano, o respectivo foco metodológico
            e os cursos oficiais integrados.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {COURSE_CATEGORIES.map((cat, index) => {
            const isActive = cat.id === activeCat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelected(cat.id)}
                className={`text-left rounded-2xl border p-5 transition-all ${
                  isActive
                    ? 'bg-[#020B1C] border-[#176BFF] text-white shadow-[0_18px_40px_-24px_rgba(23,107,255,0.6)]'
                    : 'bg-white border-slate-200 text-[#020B1C] hover:border-[#176BFF]/50'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={isActive ? 'text-[#176BFF]' : 'text-[#164E9B]'}>
                    0{index + 1}
                  </span>
                  <span className={isActive ? 'text-slate-400' : 'text-slate-500'}>
                    {cat.courseCount} {cat.courseCount === 1 ? 'curso' : 'cursos'}
                  </span>
                </div>
                <h2 className="font-display text-lg font-semibold mt-2">{cat.name}</h2>
                <p
                  className={`text-xs leading-relaxed mt-1.5 ${
                    isActive ? 'text-slate-300' : 'text-[#64748B]'
                  }`}
                >
                  {cat.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Category Detail Band */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-[#176BFF]">
                Área Seleccionada
              </p>
              <h2 className="font-display text-2xl font-semibold text-[#020B1C] mt-1">
                {activeCat.name}
              </h2>
              <p className="text-sm text-[#64748B] mt-2 max-w-3xl">
                <strong className="text-[#020B1C]">Foco académico:</strong> {activeCat.academicFocus}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate({ page: 'courses', categoryFilter: activeCat.id })}
              className="self-start md:self-auto min-h-[44px] inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-[#020B1C] hover:border-[#176BFF] hover:text-[#176BFF] transition-colors shrink-0"
            >
              Filtrar no catálogo
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {categoryCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onOpenDetail={(id) => navigate({ page: 'course-detail', courseId: id })}
              onStartLearning={handleStartCourse}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
