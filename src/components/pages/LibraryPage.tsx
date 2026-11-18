import React, { useMemo, useState } from 'react';
import { BookOpen, Download, Search, X } from 'lucide-react';
import { ALL_COURSES, getCourseById } from '../../data/courses';
import { ACADEMIC_LIBRARY } from '../../data/library';
import { LibraryResource, ResourceType } from '../../types/university';

const RESOURCE_TYPES: ResourceType[] = [
  'Livro',
  'Apostila',
  'Guia',
  'Documento PDF',
  'Glossário',
  'Estudo de Caso',
  'Artigo',
  'Referência Bibliográfica',
  'Material Complementar',
];

interface LibraryPageProps {
  initialCourseFilter?: string;
}

export const LibraryPage: React.FC<LibraryPageProps> = ({ initialCourseFilter = 'all' }) => {
  const [courseFilter, setCourseFilter] = useState<string>(initialCourseFilter);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [query, setQuery] = useState<string>('');
  const [activeResource, setActiveResource] = useState<LibraryResource | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ACADEMIC_LIBRARY.filter((item) => {
      if (courseFilter !== 'all' && item.courseId !== courseFilter) return false;
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q)
      );
    });
  }, [courseFilter, typeFilter, query]);

  const handleDownloadText = (resource: LibraryResource) => {
    const course = getCourseById(resource.courseId);
    const lines = [
      'INSTITUTO MERIDIANO — BIBLIOTECA ACADÉMICA',
      '==========================================',
      `Título: ${resource.title}`,
      `Tipo: ${resource.type} | Tema: ${resource.subject}`,
      `Curso: ${course?.title || resource.courseId}`,
      `Autoria: ${resource.author}`,
      `Extensão: ${resource.pagesOrDuration}`,
      '',
      'RESUMO:',
      resource.summary,
      '',
      'CONTEÚDO INTEGRAL:',
      ...resource.sections.flatMap((s) => ['', s.heading, '-'.repeat(s.heading.length), s.body]),
      '',
      'PONTOS-CHAVE:',
      ...resource.keyTakeaways.map((k, idx) => `${idx + 1}. ${k}`),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resource.id}-instituto-meridiano.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#F5F8FF] min-h-screen">
      <section className="navy-radial-glow text-white border-b border-white/10 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#176BFF]">
            Acervo Didáctico
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white mt-2">
            Biblioteca de Materiais Académicos
          </h1>
          <p className="text-slate-300 mt-3 max-w-2xl text-base">
            Consulte livros técnicos, apostilas, manuais, estudos de caso, glossários normalizados
            e referências bibliográficas associadas aos dez programas oficiais.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar título, tema ou autor..."
                aria-label="Pesquisar na biblioteca"
                className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-[#F5F8FF]/60 pl-10 pr-4 text-sm text-[#020B1C] focus:border-[#176BFF] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="md:col-span-4">
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                aria-label="Filtrar por curso"
                className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-[#020B1C] focus:border-[#176BFF] focus:outline-none"
              >
                <option value="all">Todos os cursos ({ALL_COURSES.length})</option>
                {ALL_COURSES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.number}. {c.shortTitle}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                aria-label="Filtrar por tipo de material"
                className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-[#020B1C] focus:border-[#176BFF] focus:outline-none"
              >
                <option value="all">Todos os formatos</option>
                {RESOURCE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <p className="font-mono text-xs text-[#64748B] mb-6 tabular-nums">
          {filtered.length} {filtered.length === 1 ? 'documento disponível' : 'documentos disponíveis'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const course = getCourseById(item.courseId);
            return (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between hover:border-[#176BFF]/50 transition-colors"
              >
                <div>
                  <p className="font-mono text-xs text-[#164E9B]">
                    {item.type} · {item.pagesOrDuration}
                  </p>
                  <h2 className="font-display text-lg font-semibold text-[#020B1C] mt-2 leading-snug">
                    {item.title}
                  </h2>
                  <p className="text-xs text-[#64748B] mt-1">
                    {course?.shortTitle} · {item.subject}
                  </p>
                  <p className="text-sm text-[#64748B] leading-relaxed mt-3 line-clamp-3">
                    {item.summary}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveResource(item)}
                    className="min-h-[40px] inline-flex items-center gap-1.5 rounded-xl bg-[#020B1C] px-4 py-2 text-xs font-medium text-white hover:bg-[#176BFF] transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Ler material
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadText(item)}
                    className="min-h-[40px] inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-[#020B1C] hover:border-[#176BFF]"
                    title="Descarregar caderno de estudo (.txt)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Exportar
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Academic Reader Modal */}
      {activeResource && (
        <div
          className="fixed inset-0 z-50 bg-[#020B1C]/75 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reader-title"
        >
          <div className="bg-white rounded-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-[#020B1C] text-white flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-[#176BFF]">
                  {activeResource.type} · {activeResource.subject} · {activeResource.pagesOrDuration}
                </p>
                <h2 id="reader-title" className="font-display text-xl font-semibold mt-1">
                  {activeResource.title}
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">{activeResource.author}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveResource(null)}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
                aria-label="Fechar leitor"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <p className="text-sm sm:text-base text-[#334155] leading-relaxed bg-[#F5F8FF] p-4 rounded-xl border border-slate-200">
                {activeResource.summary}
              </p>

              <div className="space-y-5">
                {activeResource.sections.map((sec) => (
                  <section key={sec.heading} className="space-y-1.5">
                    <h3 className="font-display text-lg font-semibold text-[#020B1C]">
                      {sec.heading}
                    </h3>
                    <p className="text-sm sm:text-base text-[#334155] leading-relaxed">
                      {sec.body}
                    </p>
                  </section>
                ))}
              </div>

              <div className="rounded-xl border border-[#176BFF]/25 bg-[#F5F8FF] p-5">
                <h4 className="font-display text-sm font-semibold text-[#020B1C] mb-2">
                  Síntese e Recomendações de Estudo
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-sm text-[#334155]">
                  {activeResource.keyTakeaways.map((kt) => (
                    <li key={kt}>{kt}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-[#F5F8FF] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleDownloadText(activeResource)}
                className="min-h-[40px] inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-[#020B1C] hover:border-[#176BFF]"
              >
                <Download className="w-4 h-4" />
                Descarregar exemplar (.txt)
              </button>
              <button
                type="button"
                onClick={() => setActiveResource(null)}
                className="min-h-[40px] px-5 py-2 rounded-xl bg-[#020B1C] text-white text-xs font-medium hover:bg-[#176BFF]"
              >
                Concluir leitura
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
