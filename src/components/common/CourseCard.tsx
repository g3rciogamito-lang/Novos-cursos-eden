import React from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import { getCourseLessonCount } from '../../data/courses';
import { useUniversity } from '../../context/UniversityContext';
import { Course } from '../../types/university';
import { CourseImage } from './CourseImage';

interface CourseCardProps {
  course: Course;
  onOpenDetail: (courseId: string) => void;
  onStartLearning: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onOpenDetail,
  onStartLearning,
}) => {
  const { getCourseDiagnostics } = useUniversity();
  const diag = getCourseDiagnostics(course);
  const lessonCount = getCourseLessonCount(course);

  return (
    <article className="group flex flex-col rounded-2xl border border-slate-200/90 bg-white overflow-hidden transition-all duration-300 hover:border-[#176BFF]/40 hover:shadow-[0_20px_50px_-24px_rgba(2,11,28,0.18)]">
      <button
        type="button"
        onClick={() => onOpenDetail(course.id)}
        className="text-left block focus:outline-none"
        aria-label={`Ver programa completo de ${course.title}`}
      >
        <div className="relative">
          <CourseImage
            src={course.coverImage}
            alt={`Capa do curso ${course.title}`}
            title={course.shortTitle}
            accentColor={course.accentColor}
            aspectClassName="aspect-[16/9]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020B1C]/85 via-[#020B1C]/20 to-transparent" />
          <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between gap-3">
            <span className="font-mono text-xs font-medium tracking-wider text-white/90 tabular-nums">
              PROGRAMA {course.number}
            </span>
            <span className="font-mono text-xs font-medium text-white/95 tabular-nums">
              {course.totalHours}h
            </span>
          </div>
        </div>
      </button>

      <div className="p-6 flex-1 flex flex-col">
        {/* Zero-pill unboxed metadata */}
        <p className="text-xs font-medium text-[#164E9B] tracking-wide">
          {course.categoryName} <span className="text-slate-300 mx-1">·</span> {course.level}
        </p>

        <h3 className="font-display text-xl font-semibold text-[#020B1C] mt-2 leading-snug text-balance">
          <button
            type="button"
            onClick={() => onOpenDetail(course.id)}
            className="text-left hover:text-[#176BFF] transition-colors"
          >
            {course.title}
          </button>
        </h3>

        <p className="text-sm text-[#64748B] leading-relaxed mt-2.5 line-clamp-3">
          {course.description}
        </p>

        {/* Academic density metrics */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-left">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400">Carga</p>
            <p className="font-mono text-sm font-semibold text-[#020B1C] tabular-nums mt-0.5">
              {course.totalHours}h
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400">Módulos</p>
            <p className="font-mono text-sm font-semibold text-[#020B1C] tabular-nums mt-0.5">
              {course.modules.length}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400">Aulas</p>
            <p className="font-mono text-sm font-semibold text-[#020B1C] tabular-nums mt-0.5">
              {lessonCount}
            </p>
          </div>
        </div>

        {/* Final project & competencies */}
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5 text-xs text-[#64748B]">
          <p className="leading-relaxed">
            <span className="font-semibold text-[#020B1C]">Projecto final:</span>{' '}
            {course.finalProject.title}
          </p>
          <p className="leading-relaxed">
            <span className="font-semibold text-[#020B1C]">Competências:</span>{' '}
            {course.competencies.slice(0, 3).join(' · ')}
          </p>
        </div>

        {diag.enrolled && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-[#164E9B]">Progresso no curso</span>
              <span className="font-mono font-semibold text-[#020B1C] tabular-nums">
                {diag.completionPct}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-[#176BFF] transition-all duration-300"
                style={{ width: `${Math.max(4, diag.completionPct)}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-auto pt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onOpenDetail(course.id)}
            className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-[#020B1C] hover:border-[#176BFF] hover:text-[#176BFF] transition-colors"
          >
            Ver programa
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onStartLearning(course.id)}
            className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#020B1C] px-3.5 py-2.5 text-sm font-medium text-white hover:bg-[#176BFF] transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {diag.enrolled ? 'Continuar' : 'Aceder'}
          </button>
        </div>
      </div>
    </article>
  );
};
