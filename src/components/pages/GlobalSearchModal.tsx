import React, { useMemo, useState } from 'react';
import { BookOpen, FlaskConical, Layers, Search, X } from 'lucide-react';
import { ALL_COURSES } from '../../data/courses';
import { ACADEMIC_LIBRARY } from '../../data/library';
import { useUniversity } from '../../context/UniversityContext';

interface GlobalSearchModalProps {
  open: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ open, onClose }) => {
  const { navigate } = useUniversity();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) {
      return {
        courses: ALL_COURSES.slice(0, 4),
        lessons: [] as { courseId: string; courseTitle: string; moduleId: string; lessonId: string; title: string }[],
        library: ACADEMIC_LIBRARY.slice(0, 3),
        labs: ALL_COURSES.slice(0, 3),
      };
    }

    const courses = ALL_COURSES.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.categoryName.toLowerCase().includes(q)
    ).slice(0, 5);

    const lessons: {
      courseId: string;
      courseTitle: string;
      moduleId: string;
      lessonId: string;
      title: string;
    }[] = [];
    for (const c of ALL_COURSES) {
      for (const m of c.modules) {
        for (const l of m.lessons) {
          if (
            l.title.toLowerCase().includes(q) ||
            l.focusTopic.toLowerCase().includes(q)
          ) {
            lessons.push({
              courseId: c.id,
              courseTitle: c.shortTitle,
              moduleId: m.id,
              lessonId: l.id,
              title: l.title,
            });
            if (lessons.length >= 6) break;
          }
        }
        if (lessons.length >= 6) break;
      }
      if (lessons.length >= 6) break;
    }

    const library = ACADEMIC_LIBRARY.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.subject.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q)
    ).slice(0, 5);

    const labs = ALL_COURSES.filter(
      (c) =>
        c.labTitle.toLowerCase().includes(q) ||
        c.labDescription.toLowerCase().includes(q)
    ).slice(0, 4);

    return { courses, lessons, library, labs };
  }, [query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#020B1C]/75 backdrop-blur-sm flex items-start justify-center pt-16 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Pesquisa global na plataforma"
    >
      <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#176BFF] shrink-0" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar cursos, aulas, termos do glossário, materiais ou laboratórios..."
            className="flex-1 text-sm sm:text-base text-[#020B1C] placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#020B1C]"
            aria-label="Fechar pesquisa"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-4 space-y-5">
          {results.courses.length > 0 && (
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#164E9B] px-2 mb-1.5">
                Cursos Oficiais
              </p>
              <div className="space-y-1">
                {results.courses.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      navigate({ page: 'course-detail', courseId: c.id });
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F5F8FF] flex items-center justify-between gap-2"
                  >
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-[#020B1C]">
                      <Layers className="w-4 h-4 text-[#176BFF]" />
                      {c.number}. {c.title}
                    </span>
                    <span className="font-mono text-xs text-slate-500 tabular-nums">
                      {c.totalHours}h
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.lessons.length > 0 && (
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#164E9B] px-2 mb-1.5">
                Aulas Correspondentes
              </p>
              <div className="space-y-1">
                {results.lessons.map((l) => (
                  <button
                    key={l.lessonId}
                    type="button"
                    onClick={() => {
                      navigate({
                        page: 'learn',
                        courseId: l.courseId,
                        moduleId: l.moduleId,
                        lessonId: l.lessonId,
                      });
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F5F8FF] flex items-center justify-between gap-2"
                  >
                    <span className="inline-flex items-center gap-2 text-sm text-[#020B1C] truncate">
                      <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{l.title}</span>
                    </span>
                    <span className="text-xs text-[#64748B] shrink-0">{l.courseTitle}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.library.length > 0 && (
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#164E9B] px-2 mb-1.5">
                Biblioteca de Materiais
              </p>
              <div className="space-y-1">
                {results.library.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      navigate({ page: 'library', courseFilter: r.courseId });
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F5F8FF] flex items-center justify-between gap-2"
                  >
                    <span className="text-sm text-[#020B1C] truncate">{r.title}</span>
                    <span className="font-mono text-xs text-slate-500 shrink-0">{r.type}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.labs.length > 0 && (
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#164E9B] px-2 mb-1.5">
                Laboratórios Práticos
              </p>
              <div className="space-y-1">
                {results.labs.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      navigate({ page: 'labs', courseId: c.id });
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F5F8FF] flex items-center gap-2 text-sm text-[#020B1C]"
                  >
                    <FlaskConical className="w-4 h-4 text-[#176BFF] shrink-0" />
                    <span>{c.labTitle}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
