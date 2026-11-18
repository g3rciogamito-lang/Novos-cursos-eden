import React from 'react';
import { Award, ShieldCheck } from 'lucide-react';
import { useUniversity } from '../../context/UniversityContext';
import { getTotalPlatformMetrics } from '../../data/courses';

export const Footer: React.FC = () => {
  const { navigate } = useUniversity();
  const metrics = getTotalPlatformMetrics();

  return (
    <footer className="bg-[#020B1C] text-slate-300 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-[#176BFF]/20 border border-[#176BFF]/40 flex items-center justify-center text-[#176BFF]">
                <Award className="w-4 h-4" />
              </span>
              <span className="font-display text-lg font-semibold text-white">
                Instituto Meridiano
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Universidade digital independente dedicada à formação profissional aprofundada,
              com programas extensos, laboratórios interactivos, projectos avaliados e certificação verificável.
            </p>
            <p className="font-mono text-xs text-slate-400 tabular-nums">
              {metrics.totalCourses} cursos oficiais · {metrics.totalHours}h de formação · {metrics.totalModules} módulos · {metrics.totalLessons} aulas
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="font-display text-sm font-semibold text-white">Áreas Académicas</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'courses', categoryFilter: 'all' })}
                  className="hover:text-white transition-colors"
                >
                  Explorar todos os cursos
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'categories' })}
                  className="hover:text-white transition-colors"
                >
                  Categorias de formação
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'library' })}
                  className="hover:text-white transition-colors"
                >
                  Biblioteca de materiais
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'labs' })}
                  className="hover:text-white transition-colors"
                >
                  Laboratórios interactivos
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="font-display text-sm font-semibold text-white">Estudante e Certificação</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'journey', subtab: 'progresso' })}
                  className="hover:text-white transition-colors"
                >
                  Meu percurso e progresso
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'journey', subtab: 'certificados' })}
                  className="hover:text-white transition-colors"
                >
                  Meus certificados e critérios
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ page: 'verify-certificate' })}
                  className="inline-flex items-center gap-1.5 text-[#176BFF] hover:text-white transition-colors font-medium"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Verificar autenticidade de certificado
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <p>Instituto Meridiano — Plataforma Educacional Profissional Independente.</p>
          <p>Arquitectura preparada para persistência em base de dados e expansão curricular contínua.</p>
        </div>
      </div>
    </footer>
  );
};
