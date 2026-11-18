import React, { useState } from 'react';
import { CheckCircle2, ClipboardCheck, Clock, RotateCcw, XCircle } from 'lucide-react';
import { useUniversity } from '../../context/UniversityContext';
import { Assessment } from '../../types/university';

interface AssessmentRunnerProps {
  assessment: Assessment;
}

export const AssessmentRunner: React.FC<AssessmentRunnerProps> = ({ assessment }) => {
  const { state, recordAssessmentResult } = useUniversity();
  const savedResult = state.assessmentResults[assessment.id];

  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const unanswered = assessment.questions.some((q) => answers[q.id] === undefined);
    if (unanswered) {
      setError('Responda a todas as questões antes de finalizar a avaliação.');
      return;
    }
    setError('');
    const correctCount = assessment.questions.filter(
      (q) => answers[q.id] === q.correctIndex
    ).length;
    const score = Math.round((correctCount / assessment.questions.length) * 100);
    recordAssessmentResult(assessment, score);
    setSubmittedAnswers({ ...answers });
    setStarted(false);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmittedAnswers(null);
    setError('');
    setStarted(true);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-[#176BFF]">
            {assessment.kind === 'final-exam' && 'Exame Final'}
            {assessment.kind === 'intermediate-exam' && 'Exame Intermédio'}
            {assessment.kind === 'module-eval' && 'Avaliação de Módulo'}
            {assessment.kind === 'lesson-quiz' && 'Quiz da Aula'}
          </p>
          <h3 className="font-display text-xl font-semibold text-[#020B1C] mt-1">
            {assessment.title}
          </h3>
          <p className="text-sm text-[#64748B] mt-1">{assessment.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 shrink-0">
          <div className="text-right font-mono text-xs text-[#64748B] tabular-nums">
            <p>{assessment.questions.length} questões</p>
            <p className="inline-flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5" />
              {assessment.durationMinutes} min · Mínimo {assessment.passingScore}%
            </p>
          </div>

          {!started && (
            <button
              type="button"
              onClick={handleReset}
              className="min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-[#020B1C] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#176BFF] transition-colors"
            >
              {savedResult ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  Repetir prova
                </>
              ) : (
                <>
                  <ClipboardCheck className="w-4 h-4" />
                  Iniciar avaliação
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {savedResult && !started && (
        <div
          className={`px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 ${
            savedResult.passed ? 'bg-emerald-50/70' : 'bg-amber-50/70'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {savedResult.passed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            ) : (
              <XCircle className="w-5 h-5 text-amber-700" />
            )}
            <span className="text-sm font-semibold text-[#020B1C]">
              {savedResult.passed ? 'Aprovado' : 'Abaixo da nota mínima'} — Pontuação registada:{' '}
              <span className="font-mono tabular-nums">{savedResult.score}%</span>
            </span>
          </div>
          <span className="font-mono text-xs text-[#64748B] tabular-nums">
            Concluído em {new Date(savedResult.completedAt).toLocaleDateString('pt-PT')}
          </span>
        </div>
      )}

      {started && (
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {assessment.questions.map((q, qIdx) => (
            <div
              key={q.id}
              className="rounded-xl border border-slate-200 p-5 space-y-3 bg-[#F5F8FF]/40"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-xs text-[#164E9B] tabular-nums">
                  Questão {qIdx + 1} de {assessment.questions.length}
                </span>
                <span className="text-xs text-slate-500">{q.competencyTag}</span>
              </div>
              <p className="text-sm sm:text-base font-medium text-[#020B1C] leading-relaxed">
                {q.prompt}
              </p>
              <div className="space-y-2 pt-1">
                {q.options.map((opt, oIdx) => {
                  const checked = answers[q.id] === oIdx;
                  return (
                    <label
                      key={opt}
                      className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${
                        checked
                          ? 'border-[#176BFF] bg-white'
                          : 'border-slate-200 bg-white/80 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        checked={checked}
                        onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: oIdx }))}
                        className="mt-1 accent-[#176BFF]"
                      />
                      <span className="text-sm text-[#020B1C]">{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          {error && (
            <p className="text-sm font-medium text-rose-600" role="alert">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setStarted(false)}
              className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-[#64748B] hover:text-[#020B1C]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#176BFF] text-white text-sm font-medium hover:bg-[#164E9B] transition-colors"
            >
              Submeter avaliação
            </button>
          </div>
        </form>
      )}

      {!started && submittedAnswers && (
        <div className="p-6 space-y-4">
          <h4 className="font-display text-base font-semibold text-[#020B1C]">
            Revisão detalhada das respostas
          </h4>
          {assessment.questions.map((q, idx) => {
            const chosen = submittedAnswers[q.id];
            const ok = chosen === q.correctIndex;
            return (
              <div
                key={q.id}
                className={`rounded-xl border p-4 text-sm space-y-1.5 ${
                  ok ? 'border-emerald-200 bg-emerald-50/50' : 'border-rose-200 bg-rose-50/50'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-[#020B1C]">
                  {ok ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-700 shrink-0" />
                  )}
                  <span>
                    {idx + 1}. {q.prompt}
                  </span>
                </div>
                <p className="text-xs text-[#64748B]">
                  <strong>Resposta correcta:</strong> {q.options[q.correctIndex]}
                </p>
                <p className="text-xs text-[#020B1C]">{q.explanation}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
