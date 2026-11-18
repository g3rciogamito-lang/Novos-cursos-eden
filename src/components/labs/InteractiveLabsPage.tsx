import React, { useState } from 'react';
import { ArrowRight, Clock, FlaskConical } from 'lucide-react';
import { ALL_COURSES, getCourseById } from '../../data/courses';
import { useUniversity } from '../../context/UniversityContext';
import {
  BusinessEconomicsLab,
  DesignStudioLab,
  EnglishSyntaxLab,
  FinanceCompoundLab,
  MarketingFunnelLab,
  ProjectKanbanLab,
} from './domains/BusinessCreativeLangLabs';
import {
  AiPromptLab,
  CyberAuditLab,
  ExcelSpreadsheetLab,
  WebCodeLab,
} from './domains/TechAndDataLabs';

interface InteractiveLabsPageProps {
  initialCourseId?: string;
}

export const InteractiveLabsPage: React.FC<InteractiveLabsPageProps> = ({
  initialCourseId,
}) => {
  const { navigate, logStudyMinutes } = useUniversity();
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    initialCourseId || ALL_COURSES[0].id
  );
  const [loggedToast, setLoggedToast] = useState(false);

  const course = getCourseById(selectedCourseId) || ALL_COURSES[0];

  const handleLogPractice = () => {
    logStudyMinutes(course.id, 15);
    setLoggedToast(true);
    setTimeout(() => setLoggedToast(false), 2200);
  };

  return (
    <div className="bg-[#F5F8FF] min-h-screen">
      <section className="navy-radial-glow text-white border-b border-white/10 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#176BFF]">
            Prática Aplicada
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white mt-2">
            Laboratórios Interactivos de Especialidade
          </h1>
          <p className="text-slate-300 mt-3 max-w-2xl text-base">
            Dez ambientes experimentais dedicados a cada curso oficial: simule campanhas, escreva
            código, teste fórmulas Excel em tempo real, valide contrastes WCAG e audite segurança.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Selector */}
        <div className="flex flex-wrap gap-2">
          {ALL_COURSES.map((c) => {
            const active = c.id === course.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCourseId(c.id)}
                className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                  active
                    ? 'bg-[#020B1C] text-white'
                    : 'bg-white border border-slate-200 text-[#020B1C] hover:border-[#176BFF]'
                }`}
              >
                {c.number}. {c.shortTitle}
              </button>
            );
          })}
        </div>

        {/* Active Lab Workspace */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-[#176BFF] inline-flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5" />
                Laboratório do Curso {course.number} · {course.title}
              </p>
              <h2 className="font-display text-2xl font-semibold text-[#020B1C] mt-1">
                {course.labTitle}
              </h2>
              <p className="text-sm text-[#64748B] mt-1 max-w-3xl">{course.labDescription}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleLogPractice}
                className="min-h-[40px] inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-[#020B1C] hover:border-[#176BFF]"
              >
                <Clock className="w-3.5 h-3.5 text-[#176BFF]" />
                {loggedToast ? '+15 min registados!' : 'Registar +15 min de prática'}
              </button>
              <button
                type="button"
                onClick={() => navigate({ page: 'learn', courseId: course.id })}
                className="min-h-[40px] inline-flex items-center gap-1.5 rounded-xl bg-[#020B1C] px-4 py-2 text-xs font-medium text-white hover:bg-[#176BFF]"
              >
                Ir para aulas do curso
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {course.labType === 'ai-prompt-lab' && <AiPromptLab />}
            {course.labType === 'marketing-campaign-lab' && <MarketingFunnelLab />}
            {course.labType === 'web-code-lab' && <WebCodeLab />}
            {course.labType === 'english-syntax-lab' && <EnglishSyntaxLab />}
            {course.labType === 'business-economics-lab' && <BusinessEconomicsLab />}
            {course.labType === 'design-color-grid-lab' && <DesignStudioLab />}
            {course.labType === 'finance-compound-lab' && <FinanceCompoundLab />}
            {course.labType === 'cyber-audit-lab' && <CyberAuditLab />}
            {course.labType === 'excel-spreadsheet-lab' && <ExcelSpreadsheetLab />}
            {course.labType === 'project-kanban-cpm-lab' && <ProjectKanbanLab />}
          </div>
        </div>
      </section>
    </div>
  );
};
