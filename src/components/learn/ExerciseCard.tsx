import React, { useMemo, useState } from 'react';
import { CheckCircle2, HelpCircle, RotateCcw, XCircle } from 'lucide-react';
import { useUniversity } from '../../context/UniversityContext';
import { Exercise, ExerciseType } from '../../types/university';

const TYPE_LABELS: Record<ExerciseType, string> = {
  'multiple-choice': 'Escolha Múltipla',
  'true-false': 'Verdadeiro ou Falso',
  matching: 'Associação',
  'fill-blank': 'Preenchimento',
  essay: 'Questão Discursiva',
  'problem-solving': 'Resolução de Problema',
  practical: 'Exercício Prático',
  'case-study': 'Estudo de Caso',
  simulation: 'Simulação',
  assignment: 'Trabalho Individual',
};

interface ExerciseCardProps {
  exercise: Exercise;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
  const { state, recordExerciseAttempt } = useUniversity();
  const existing = state.exerciseAttempts[exercise.id];

  const [selectedOption, setSelectedOption] = useState<string>(existing?.answer || '');
  const [textAnswer, setTextAnswer] = useState<string>(existing?.answer || '');
  const [matchingSelections, setMatchingSelections] = useState<Record<string, string>>({});
  const [checkedCriteria, setCheckedCriteria] = useState<Record<number, boolean>>({});
  const [validationError, setValidationError] = useState<string>('');
  const [retaking, setRetaking] = useState<boolean>(false);

  const rightChoices = useMemo(() => {
    if (!exercise.matchingPairs) return [];
    // Deterministic rotation so order isn't trivially 1:1
    const items = exercise.matchingPairs.map((p) => p.right);
    return items.length > 1 ? [...items.slice(1), items[0]] : items;
  }, [exercise.matchingPairs]);

  const showResult = Boolean(existing) && !retaking;

  const isChoiceType =
    exercise.type === 'multiple-choice' ||
    exercise.type === 'true-false' ||
    exercise.type === 'simulation';

  const isOpenWrittenType =
    exercise.type === 'essay' ||
    exercise.type === 'problem-solving' ||
    exercise.type === 'practical' ||
    exercise.type === 'case-study' ||
    exercise.type === 'assignment';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    let submittedAnswer = '';
    let isCorrect = false;
    let score = 0;

    if (isChoiceType) {
      if (!selectedOption) {
        setValidationError('Seleccione uma opção antes de submeter a resposta.');
        return;
      }
      submittedAnswer = selectedOption;
      isCorrect = selectedOption.trim() === exercise.correctAnswer.trim();
      score = isCorrect ? exercise.points : 0;
    } else if (exercise.type === 'matching' && exercise.matchingPairs) {
      const pairs = exercise.matchingPairs;
      const missing = pairs.some((p) => !matchingSelections[p.id]);
      if (missing) {
        setValidationError('Complete todas as associações antes de verificar.');
        return;
      }
      submittedAnswer = pairs
        .map((p) => `${p.left} -> ${matchingSelections[p.id]}`)
        .join(' | ');
      const correctCount = pairs.filter(
        (p) => matchingSelections[p.id]?.trim() === p.right.trim()
      ).length;
      isCorrect = correctCount === pairs.length;
      score = Math.round((correctCount / pairs.length) * exercise.points);
    } else if (exercise.type === 'fill-blank') {
      const cleaned = textAnswer.trim();
      if (cleaned.length < 2) {
        setValidationError('Escreva o termo técnico no campo de preenchimento.');
        return;
      }
      submittedAnswer = cleaned;
      const normUser = cleaned.toLowerCase();
      const normTarget = exercise.correctAnswer.toLowerCase();
      isCorrect =
        normUser === normTarget ||
        (normUser.length >= 5 && normTarget.includes(normUser)) ||
        (normTarget.length >= 5 && normUser.includes(normTarget));
      score = isCorrect ? exercise.points : 0;
    } else if (isOpenWrittenType) {
      const cleaned = textAnswer.trim();
      if (cleaned.length < 25) {
        setValidationError(
          'Desenvolva uma resposta estruturada (mínimo de 25 caracteres) antes de submeter.'
        );
        return;
      }
      submittedAnswer = cleaned;
      const criteriaCheckedCount = Object.values(checkedCriteria).filter(Boolean).length;
      const meetsLength = cleaned.length >= 60;
      isCorrect = meetsLength || criteriaCheckedCount >= Math.max(1, exercise.evaluationCriteria.length - 1);
      score = isCorrect
        ? exercise.points
        : Math.round(exercise.points * 0.7);
    }

    recordExerciseAttempt({
      exerciseId: exercise.id,
      courseId: exercise.courseId,
      answer: submittedAnswer,
      isCorrect,
      score,
    });
    setRetaking(false);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-5 py-4 bg-[#F5F8FF] border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-mono text-xs text-[#164E9B] uppercase tracking-wider">
            {TYPE_LABELS[exercise.type]} · {exercise.points} pts
          </p>
          <h4 className="font-display text-base font-semibold text-[#020B1C] mt-0.5">
            {exercise.title}
          </h4>
        </div>
        {showResult && existing && (
          <span
            className={`inline-flex items-center gap-1.5 font-mono text-xs font-semibold ${
              existing.isCorrect ? 'text-emerald-700' : 'text-amber-700'
            }`}
          >
            {existing.isCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Validado ({existing.score}/{exercise.points})
              </>
            ) : (
              <>
                <HelpCircle className="w-4 h-4" />
                Revisto ({existing.score}/{exercise.points})
              </>
            )}
          </span>
        )}
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        <p className="text-sm sm:text-base text-[#020B1C] leading-relaxed font-medium">
          {exercise.statement}
        </p>

        {exercise.blankTemplate && (
          <div className="rounded-xl border border-slate-200 bg-[#F5F8FF]/70 p-4 font-mono text-xs sm:text-sm text-[#020B1C]">
            {exercise.blankTemplate}
          </div>
        )}

        <p className="text-xs text-[#64748B]">{exercise.instructions}</p>

        {!showResult ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {isChoiceType && exercise.options && (
              <div className="space-y-2.5">
                {exercise.options.map((option) => {
                  const active = selectedOption === option;
                  return (
                    <label
                      key={option}
                      className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition-colors ${
                        active
                          ? 'border-[#176BFF] bg-[#F5F8FF]'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`ex-${exercise.id}`}
                        value={option}
                        checked={active}
                        onChange={() => setSelectedOption(option)}
                        className="mt-1 accent-[#176BFF]"
                      />
                      <span className="text-sm text-[#020B1C] leading-relaxed">{option}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {exercise.type === 'matching' && exercise.matchingPairs && (
              <div className="space-y-3">
                {exercise.matchingPairs.map((pair) => (
                  <div
                    key={pair.id}
                    className="rounded-xl border border-slate-200 p-3.5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
                  >
                    <div className="md:col-span-5 text-sm font-semibold text-[#020B1C]">
                      {pair.left}
                    </div>
                    <div className="md:col-span-7">
                      <select
                        value={matchingSelections[pair.id] || ''}
                        onChange={(e) =>
                          setMatchingSelections((prev) => ({
                            ...prev,
                            [pair.id]: e.target.value,
                          }))
                        }
                        aria-label={`Associação para ${pair.left}`}
                        className="w-full min-h-[42px] rounded-lg border border-slate-200 bg-[#F5F8FF]/60 px-3 text-xs sm:text-sm text-[#020B1C] focus:border-[#176BFF] focus:bg-white focus:outline-none"
                      >
                        <option value="">Seleccionar definição correspondente...</option>
                        {rightChoices.map((choice) => (
                          <option key={choice} value={choice}>
                            {choice}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {exercise.type === 'fill-blank' && (
              <input
                type="text"
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Escreva o conceito técnico exacto..."
                aria-label="Resposta de preenchimento"
                className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-white px-4 text-sm text-[#020B1C] focus:border-[#176BFF] focus:outline-none"
              />
            )}

            {isOpenWrittenType && (
              <div className="space-y-3">
                <textarea
                  rows={4}
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder="Redija a sua resposta técnica fundamentada..."
                  aria-label="Resposta aberta"
                  className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-[#020B1C] focus:border-[#176BFF] focus:outline-none"
                />
                <div className="rounded-xl border border-slate-200 bg-[#F5F8FF]/60 p-3.5 space-y-2">
                  <p className="text-xs font-semibold text-[#020B1C]">
                    Critérios de auto-verificação antes da submissão:
                  </p>
                  {exercise.evaluationCriteria.map((crit, idx) => (
                    <label
                      key={crit}
                      className="flex items-start gap-2.5 text-xs text-[#64748B] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(checkedCriteria[idx])}
                        onChange={(e) =>
                          setCheckedCriteria((prev) => ({
                            ...prev,
                            [idx]: e.target.checked,
                          }))
                        }
                        className="mt-0.5 accent-[#176BFF]"
                      />
                      <span>{crit}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {validationError && (
              <p className="text-xs font-medium text-rose-600" role="alert">
                {validationError}
              </p>
            )}

            <div className="pt-1 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                A resolução comentada é apresentada após a sua tentativa.
              </span>
              <button
                type="submit"
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#020B1C] text-white text-sm font-medium hover:bg-[#176BFF] transition-colors shrink-0"
              >
                Verificar resposta
              </button>
            </div>
          </form>
        ) : (
          /* Attempt-revealed pedagogical feedback */
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div
              className={`rounded-xl border p-4 ${
                existing?.isCorrect
                  ? 'border-emerald-200 bg-emerald-50/70'
                  : 'border-amber-200 bg-amber-50/70'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {existing?.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1.5 text-sm">
                  <p className="font-semibold text-[#020B1C]">
                    {existing?.isCorrect
                      ? 'Resposta confirmada com rigor técnico.'
                      : 'Tentativa registada — consulte a fundamentação recomendada.'}
                  </p>
                  <p className="text-xs text-[#64748B]">
                    <strong className="text-[#020B1C]">A sua submissão:</strong>{' '}
                    {existing?.answer}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-[#F5F8FF] p-4 space-y-2 text-sm">
              <p className="text-xs font-mono uppercase tracking-wider text-[#164E9B]">
                Gabarito e Fundamentação Pedagógica
              </p>
              <p className="text-[#020B1C]">
                <strong>Referência esperada:</strong> {exercise.correctAnswer}
              </p>
              <p className="text-[#64748B] leading-relaxed">{exercise.explanation}</p>
              <p className="text-xs text-[#164E9B] pt-1">{exercise.pedagogicalFeedback}</p>
            </div>

            <button
              type="button"
              onClick={() => setRetaking(true)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#164E9B] hover:text-[#176BFF]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Realizar nova tentativa
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
