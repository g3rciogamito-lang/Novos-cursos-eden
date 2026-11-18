import React, { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';

/* ============================================================================
   5. MARKETING FUNNEL & ROAS LAB (Curso 02)
   ============================================================================ */
export const MarketingFunnelLab: React.FC = () => {
  const [budget, setBudget] = useState(4000);
  const [cpc, setCpc] = useState(0.85);
  const [cvr, setCvr] = useState(3.2);
  const [ticket, setTicket] = useState(145);

  const clicks = Math.round(budget / Math.max(0.1, cpc));
  const conversions = Math.round(clicks * (cvr / 100));
  const revenue = Math.round(conversions * ticket);
  const cac = conversions > 0 ? budget / conversions : 0;
  const roas = budget > 0 ? revenue / budget : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-[#F5F8FF] p-5 space-y-4">
        <h4 className="font-display text-base font-semibold text-[#020B1C]">
          Parâmetros da Campanha
        </h4>
        <div>
          <label className="flex justify-between text-xs font-medium text-[#020B1C]">
            <span>Investimento em Mídia</span>
            <span className="font-mono tabular-nums">{budget} €</span>
          </label>
          <input
            type="range"
            min={500}
            max={20000}
            step={250}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-[#176BFF] mt-1"
          />
        </div>
        <div>
          <label className="flex justify-between text-xs font-medium text-[#020B1C]">
            <span>CPC Médio (Custo por Clique)</span>
            <span className="font-mono tabular-nums">{cpc.toFixed(2)} €</span>
          </label>
          <input
            type="range"
            min={0.2}
            max={5}
            step={0.05}
            value={cpc}
            onChange={(e) => setCpc(Number(e.target.value))}
            className="w-full accent-[#176BFF] mt-1"
          />
        </div>
        <div>
          <label className="flex justify-between text-xs font-medium text-[#020B1C]">
            <span>Taxa de Conversão (CVR)</span>
            <span className="font-mono tabular-nums">{cvr.toFixed(1)}%</span>
          </label>
          <input
            type="range"
            min={0.5}
            max={12}
            step={0.1}
            value={cvr}
            onChange={(e) => setCvr(Number(e.target.value))}
            className="w-full accent-[#176BFF] mt-1"
          />
        </div>
        <div>
          <label className="flex justify-between text-xs font-medium text-[#020B1C]">
            <span>Ticket Médio</span>
            <span className="font-mono tabular-nums">{ticket} €</span>
          </label>
          <input
            type="range"
            min={30}
            max={600}
            step={5}
            value={ticket}
            onChange={(e) => setTicket(Number(e.target.value))}
            className="w-full accent-[#176BFF] mt-1"
          />
        </div>
      </div>

      <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4 content-start">
        {[
          { label: 'Cliques Estimados', val: clicks.toLocaleString('pt-PT') },
          { label: 'Conversões', val: conversions.toLocaleString('pt-PT') },
          { label: 'Receita Bruta', val: `${revenue.toLocaleString('pt-PT')} €` },
          { label: 'CAC Efectivo', val: `${cac.toFixed(2)} €` },
          { label: 'ROAS', val: `${roas.toFixed(2)}x` },
          {
            label: 'Resultado Líquido (Mídia)',
            val: `${(revenue - budget).toLocaleString('pt-PT')} €`,
          },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-[#64748B]">{kpi.label}</p>
            <p className="font-mono text-xl font-semibold text-[#020B1C] tabular-nums mt-1">
              {kpi.val}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================================================================
   6. BUSINESS UNIT ECONOMICS & BREAK-EVEN LAB (Curso 05)
   ============================================================================ */
export const BusinessEconomicsLab: React.FC = () => {
  const [fixedCosts, setFixedCosts] = useState(6500);
  const [price, setPrice] = useState(95);
  const [variableCost, setVariableCost] = useState(38);
  const [monthlyUnits, setMonthlyUnits] = useState(180);

  const contributionMargin = price - variableCost;
  const breakEvenUnits =
    contributionMargin > 0 ? Math.ceil(fixedCosts / contributionMargin) : Infinity;
  const monthlyProfit = monthlyUnits * contributionMargin - fixedCosts;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-[#F5F8FF] p-5 space-y-4">
        <h4 className="font-display text-base font-semibold text-[#020B1C]">
          Estrutura de Custos e Preço
        </h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <label className="space-y-1">
            <span className="font-medium text-[#020B1C]">Custos Fixos Mensais (€)</span>
            <input
              type="number"
              value={fixedCosts}
              onChange={(e) => setFixedCosts(Math.max(0, Number(e.target.value)))}
              className="w-full min-h-[40px] rounded-lg border border-slate-200 bg-white px-3 font-mono"
            />
          </label>
          <label className="space-y-1">
            <span className="font-medium text-[#020B1C]">Preço Unitário (€)</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Math.max(1, Number(e.target.value)))}
              className="w-full min-h-[40px] rounded-lg border border-slate-200 bg-white px-3 font-mono"
            />
          </label>
          <label className="space-y-1">
            <span className="font-medium text-[#020B1C]">Custo Variável Unitário (€)</span>
            <input
              type="number"
              value={variableCost}
              onChange={(e) => setVariableCost(Math.max(0, Number(e.target.value)))}
              className="w-full min-h-[40px] rounded-lg border border-slate-200 bg-white px-3 font-mono"
            />
          </label>
          <label className="space-y-1">
            <span className="font-medium text-[#020B1C]">Volume Mensal (Unidades)</span>
            <input
              type="number"
              value={monthlyUnits}
              onChange={(e) => setMonthlyUnits(Math.max(0, Number(e.target.value)))}
              className="w-full min-h-[40px] rounded-lg border border-slate-200 bg-white px-3 font-mono"
            />
          </label>
        </div>
      </div>

      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 content-start">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-[#64748B]">Margem de Contribuição</p>
          <p className="font-mono text-xl font-semibold text-[#020B1C] tabular-nums mt-1">
            {contributionMargin} € / un.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-[#64748B]">Ponto de Equilíbrio</p>
          <p className="font-mono text-xl font-semibold text-[#176BFF] tabular-nums mt-1">
            {Number.isFinite(breakEvenUnits) ? `${breakEvenUnits} un.` : 'Inviável'}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-[#64748B]">Resultado Operacional</p>
          <p
            className={`font-mono text-xl font-semibold tabular-nums mt-1 ${
              monthlyProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {monthlyProfit.toLocaleString('pt-PT')} €
          </p>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   7. DESIGN COLOR, WCAG CONTRAST & TYPE SCALE LAB (Curso 06)
   ============================================================================ */
function hexToLuminance(hex: string): number {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return 0;
  const rgb = [0, 2, 4].map((idx) => {
    const c = parseInt(clean.slice(idx, idx + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

export const DesignStudioLab: React.FC = () => {
  const [bgHex, setBgHex] = useState('#020B1C');
  const [fgHex, setFgHex] = useState('#FFFFFF');
  const [baseSize, setBaseSize] = useState(16);
  const [scaleRatio, setScaleRatio] = useState(1.25);

  const contrast = useMemo(() => {
    const l1 = hexToLuminance(bgHex);
    const l2 = hexToLuminance(fgHex);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }, [bgHex, fgHex]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-4 rounded-xl border border-slate-200 bg-[#F5F8FF] p-5">
        <h4 className="font-display text-base font-semibold text-[#020B1C]">
          Verificador WCAG 2.1 e Escala Modular
        </h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <label className="space-y-1">
            <span className="font-medium text-[#020B1C]">Cor de Fundo</span>
            <input
              type="color"
              value={bgHex}
              onChange={(e) => setBgHex(e.target.value)}
              className="w-full h-10 rounded-lg border border-slate-200 cursor-pointer"
            />
          </label>
          <label className="space-y-1">
            <span className="font-medium text-[#020B1C]">Cor de Texto</span>
            <input
              type="color"
              value={fgHex}
              onChange={(e) => setFgHex(e.target.value)}
              className="w-full h-10 rounded-lg border border-slate-200 cursor-pointer"
            />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <label className="space-y-1">
            <span className="font-medium text-[#020B1C]">Base Tipográfica (px)</span>
            <input
              type="number"
              min={12}
              max={22}
              value={baseSize}
              onChange={(e) => setBaseSize(Number(e.target.value))}
              className="w-full min-h-[38px] rounded-lg border border-slate-200 bg-white px-3 font-mono"
            />
          </label>
          <label className="space-y-1">
            <span className="font-medium text-[#020B1C]">Razão de Escala</span>
            <select
              value={scaleRatio}
              onChange={(e) => setScaleRatio(Number(e.target.value))}
              className="w-full min-h-[38px] rounded-lg border border-slate-200 bg-white px-2.5 font-mono"
            >
              <option value={1.2}>1.200 · Minor Third</option>
              <option value={1.25}>1.250 · Major Third</option>
              <option value={1.333}>1.333 · Perfect Fourth</option>
            </select>
          </label>
        </div>
        <div className="pt-2 border-t border-slate-200 font-mono text-xs text-[#020B1C] space-y-1 tabular-nums">
          <p>Rácio de contraste: {contrast.toFixed(2)}:1</p>
          <p>
            WCAG AA Texto Normal:{' '}
            <strong>{contrast >= 4.5 ? 'Aprovado' : 'Insuficiente'}</strong> · AAA:{' '}
            <strong>{contrast >= 7 ? 'Aprovado' : 'Insuficiente'}</strong>
          </p>
        </div>
      </div>

      <div
        className="lg:col-span-7 rounded-xl border border-slate-200 p-6 flex flex-col justify-center space-y-3"
        style={{ backgroundColor: bgHex, color: fgHex }}
      >
        <p style={{ fontSize: `${Math.round(baseSize * Math.pow(scaleRatio, 3))}px` }} className="font-display font-semibold leading-tight">
          Título Principal de Sistema Editorial
        </p>
        <p style={{ fontSize: `${Math.round(baseSize * scaleRatio)}px` }} className="font-display font-medium opacity-90">
          Subtítulo hierárquico com proporção harmónica
        </p>
        <p style={{ fontSize: `${baseSize}px` }} className="leading-relaxed opacity-85">
          Corpo de texto calibrado para leitura confortável, respeitando contraste suficiente e
          espaçamento vertical consistente.
        </p>
      </div>
    </div>
  );
};

/* ============================================================================
   8. FINANCE COMPOUND INTEREST & BUDGET LAB (Curso 07)
   ============================================================================ */
export const FinanceCompoundLab: React.FC = () => {
  const [initial, setInitial] = useState(3000);
  const [monthly, setMonthly] = useState(350);
  const [annualRate, setAnnualRate] = useState(7.5);
  const [years, setYears] = useState(15);

  const series = useMemo(() => {
    const r = annualRate / 100 / 12;
    const points: { year: number; total: number; contributed: number }[] = [];
    for (let y = 0; y <= years; y++) {
      const m = y * 12;
      const fvInitial = initial * Math.pow(1 + r, m);
      const fvContrib = r > 0 ? monthly * ((Math.pow(1 + r, m) - 1) / r) : monthly * m;
      points.push({
        year: y,
        total: Math.round(fvInitial + fvContrib),
        contributed: Math.round(initial + monthly * m),
      });
    }
    return points;
  }, [initial, monthly, annualRate, years]);

  const finalPoint = series[series.length - 1];
  const maxVal = Math.max(1000, finalPoint.total);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-[#F5F8FF] p-5 space-y-3">
        <h4 className="font-display text-base font-semibold text-[#020B1C]">
          Capitalização Composta
        </h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <label className="space-y-1">
            <span>Capital Inicial (€)</span>
            <input
              type="number"
              value={initial}
              onChange={(e) => setInitial(Math.max(0, Number(e.target.value)))}
              className="w-full min-h-[38px] rounded-lg border border-slate-200 bg-white px-3 font-mono"
            />
          </label>
          <label className="space-y-1">
            <span>Aporte Mensal (€)</span>
            <input
              type="number"
              value={monthly}
              onChange={(e) => setMonthly(Math.max(0, Number(e.target.value)))}
              className="w-full min-h-[38px] rounded-lg border border-slate-200 bg-white px-3 font-mono"
            />
          </label>
          <label className="space-y-1">
            <span>Taxa Anual (%)</span>
            <input
              type="number"
              step={0.5}
              value={annualRate}
              onChange={(e) => setAnnualRate(Math.max(0, Number(e.target.value)))}
              className="w-full min-h-[38px] rounded-lg border border-slate-200 bg-white px-3 font-mono"
            />
          </label>
          <label className="space-y-1">
            <span>Horizonte (Anos)</span>
            <input
              type="number"
              min={1}
              max={40}
              value={years}
              onChange={(e) => setYears(Math.min(40, Math.max(1, Number(e.target.value))))}
              className="w-full min-h-[38px] rounded-lg border border-slate-200 bg-white px-3 font-mono"
            />
          </label>
        </div>

        <div className="pt-3 border-t border-slate-200 space-y-1.5 font-mono text-xs tabular-nums">
          <p className="flex justify-between">
            <span className="text-[#64748B]">Total investido:</span>
            <strong className="text-[#020B1C]">
              {finalPoint.contributed.toLocaleString('pt-PT')} €
            </strong>
          </p>
          <p className="flex justify-between">
            <span className="text-[#64748B]">Juros compostos:</span>
            <strong className="text-[#176BFF]">
              {(finalPoint.total - finalPoint.contributed).toLocaleString('pt-PT')} €
            </strong>
          </p>
          <p className="flex justify-between text-sm pt-1">
            <span className="font-semibold text-[#020B1C]">Património final:</span>
            <strong className="text-[#020B1C]">
              {finalPoint.total.toLocaleString('pt-PT')} €
            </strong>
          </p>
        </div>
      </div>

      <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5">
        <h4 className="font-display text-sm font-semibold text-[#020B1C] mb-3">
          Evolução do Património Acumulado vs. Capital Aportado
        </h4>
        <svg viewBox="0 0 420 190" className="w-full h-48" role="img" aria-label="Curva de juros compostos">
          <polyline
            fill="none"
            stroke="#94a3b8"
            strokeWidth={2}
            strokeDasharray="4 4"
            points={series
              .map((p, i) => {
                const x = 16 + (i / Math.max(1, series.length - 1)) * 388;
                const y = 165 - (p.contributed / maxVal) * 145;
                return `${x},${y}`;
              })
              .join(' ')}
          />
          <polyline
            fill="none"
            stroke="#176BFF"
            strokeWidth={3}
            points={series
              .map((p, i) => {
                const x = 16 + (i / Math.max(1, series.length - 1)) * 388;
                const y = 165 - (p.total / maxVal) * 145;
                return `${x},${y}`;
              })
              .join(' ')}
          />
        </svg>
        <div className="flex gap-5 text-xs text-[#64748B]">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-[#176BFF]" /> Capital + Juros
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-slate-400" /> Apenas aportes
          </span>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   9. ENGLISH SYNTAX & EXECUTIVE REGISTER LAB (Curso 04)
   ============================================================================ */
const ENGLISH_CASES = [
  {
    id: 'past-vs-present-perfect',
    title: 'Present Perfect vs. Past Simple',
    informal: 'We finished the report yesterday, and we already sent it to the board.',
    executive: 'We completed the report yesterday and have already submitted it to the Executive Board.',
    note: 'Use Past Simple ("completed") for finished time markers ("yesterday"), and Present Perfect ("have submitted") for present relevance with "already".',
  },
  {
    id: 'executive-request',
    title: 'Registo Executivo e Cortesia Formal',
    informal: 'Can you send me the numbers by Friday? We need them fast.',
    executive: 'Could you please share the updated figures by Friday? Having them ahead of the review would be greatly appreciated.',
    note: 'Modal "Could you please" e nominalização suave elevam o tom diplomático sem perder objectividade.',
  },
  {
    id: 'conditional-negotiation',
    title: 'Second Conditional em Negociação',
    informal: 'If we lower the price, maybe you sign today?',
    executive: 'Were we to offer a staged volume discount, would your team be in a position to formalize the agreement this week?',
    note: 'Inversão condicional ("Were we to...") é padrão clássico de escrita e negociação executiva B2–C2.',
  },
];

export const EnglishSyntaxLab: React.FC = () => {
  const [selectedId, setSelectedId] = useState(ENGLISH_CASES[0].id);
  const [draft, setDraft] = useState(ENGLISH_CASES[0].executive);
  const item = ENGLISH_CASES.find((c) => c.id === selectedId) || ENGLISH_CASES[0];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {ENGLISH_CASES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setSelectedId(c.id);
              setDraft(c.executive);
            }}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              selectedId === c.id
                ? 'bg-[#020B1C] text-white'
                : 'bg-[#F5F8FF] text-[#020B1C] hover:bg-slate-200/70'
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-[#F5F8FF] p-4 space-y-2">
          <p className="font-mono text-xs text-[#164E9B]">REGISTO BASE / COLOQUIAL</p>
          <p className="text-sm text-[#020B1C] font-medium">&ldquo;{item.informal}&rdquo;</p>
          <p className="text-xs text-[#64748B] pt-2 border-t border-slate-200">{item.note}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
          <p className="font-mono text-xs text-[#176BFF]">PRÁTICA DE REESCRITA EXECUTIVA</p>
          <textarea
            rows={3}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full rounded-lg border border-slate-200 p-2.5 text-sm text-[#020B1C] focus:border-[#176BFF] focus:outline-none"
          />
          <p className="text-xs text-[#64748B]">
            Referência académica: <span className="text-[#020B1C]">{item.executive}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   10. PROJECT MANAGEMENT KANBAN (WIP) & PERT ESTIMATOR LAB (Curso 10)
   ============================================================================ */
interface KanbanTask {
  id: string;
  title: string;
  col: 'backlog' | 'doing' | 'done';
}

export const ProjectKanbanLab: React.FC = () => {
  const [tasks, setTasks] = useState<KanbanTask[]>([
    { id: 't1', title: 'Definir Project Charter e Stakeholders', col: 'done' },
    { id: 't2', title: 'Estruturar WBS por entregáveis', col: 'doing' },
    { id: 't3', title: 'Mapear caminho crítico e riscos', col: 'backlog' },
  ]);
  const [newTask, setNewTask] = useState('');
  const [wipLimit, setWipLimit] = useState(2);
  const [opt, setOpt] = useState(4);
  const [likely, setLikely] = useState(6);
  const [pess, setPess] = useState(14);

  const doingCount = tasks.filter((t) => t.col === 'doing').length;
  const pertMean = ((opt + 4 * likely + pess) / 6).toFixed(1);
  const pertStd = ((pess - opt) / 6).toFixed(1);

  const moveTask = (id: string, nextCol: KanbanTask['col']) => {
    if (nextCol === 'doing' && doingCount >= wipLimit) return;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, col: nextCol } : t)));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks((prev) => [
      ...prev,
      { id: `t-${Date.now()}`, title: newTask.trim(), col: 'backlog' },
    ]);
    setNewTask('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center rounded-xl border border-slate-200 bg-[#F5F8FF] p-4">
        <form onSubmit={addTask} className="lg:col-span-6 flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Nova tarefa na WBS..."
            className="flex-1 min-h-[40px] rounded-lg border border-slate-200 bg-white px-3 text-xs sm:text-sm"
          />
          <button
            type="submit"
            className="min-h-[40px] px-3.5 rounded-lg bg-[#020B1C] text-white text-xs font-medium inline-flex items-center gap-1 hover:bg-[#176BFF]"
          >
            <Plus className="w-3.5 h-3.5" /> Adicionar
          </button>
        </form>
        <div className="lg:col-span-6 flex flex-wrap items-center justify-end gap-4 text-xs">
          <label className="flex items-center gap-2">
            <span>Limite WIP (Em Curso):</span>
            <input
              type="number"
              min={1}
              max={5}
              value={wipLimit}
              onChange={(e) => setWipLimit(Math.max(1, Number(e.target.value)))}
              className="w-14 rounded border border-slate-200 bg-white px-2 py-1 font-mono"
            />
          </label>
          <span className="font-mono text-[#164E9B] tabular-nums">
            WIP actual: {doingCount}/{wipLimit}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(
          [
            { id: 'backlog', label: 'Por Iniciar' },
            { id: 'doing', label: 'Em Curso (WIP controlado)' },
            { id: 'done', label: 'Concluído' },
          ] as const
        ).map((col) => (
          <div key={col.id} className="rounded-xl border border-slate-200 bg-white p-4 space-y-2.5">
            <h4 className="font-display text-sm font-semibold text-[#020B1C]">{col.label}</h4>
            {tasks
              .filter((t) => t.col === col.id)
              .map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg border border-slate-200 bg-[#F5F8FF]/70 p-3 space-y-2"
                >
                  <p className="text-xs font-medium text-[#020B1C]">{task.title}</p>
                  <div className="flex gap-1.5 text-[11px]">
                    {col.id !== 'backlog' && (
                      <button
                        type="button"
                        onClick={() => moveTask(task.id, 'backlog')}
                        className="px-2 py-0.5 rounded border border-slate-200 bg-white hover:border-[#176BFF]"
                      >
                        Por iniciar
                      </button>
                    )}
                    {col.id !== 'doing' && (
                      <button
                        type="button"
                        disabled={doingCount >= wipLimit}
                        onClick={() => moveTask(task.id, 'doing')}
                        className="px-2 py-0.5 rounded border border-slate-200 bg-white hover:border-[#176BFF] disabled:opacity-40"
                      >
                        Iniciar
                      </button>
                    )}
                    {col.id !== 'done' && (
                      <button
                        type="button"
                        onClick={() => moveTask(task.id, 'done')}
                        className="px-2 py-0.5 rounded border border-slate-200 bg-white hover:border-[#176BFF]"
                      >
                        Concluir
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* PERT Estimator */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-display font-semibold text-sm text-[#020B1C]">
            Estimativa PERT (dias):
          </span>
          <label className="flex items-center gap-1">
            Optimista
            <input
              type="number"
              value={opt}
              onChange={(e) => setOpt(Number(e.target.value))}
              className="w-14 rounded border border-slate-200 px-2 py-1 font-mono"
            />
          </label>
          <label className="flex items-center gap-1">
            Mais provável
            <input
              type="number"
              value={likely}
              onChange={(e) => setLikely(Number(e.target.value))}
              className="w-14 rounded border border-slate-200 px-2 py-1 font-mono"
            />
          </label>
          <label className="flex items-center gap-1">
            Pessimista
            <input
              type="number"
              value={pess}
              onChange={(e) => setPess(Number(e.target.value))}
              className="w-14 rounded border border-slate-200 px-2 py-1 font-mono"
            />
          </label>
        </div>
        <div className="font-mono text-[#164E9B] tabular-nums">
          Duração esperada: <strong>{pertMean}d</strong> (± {pertStd}d)
        </div>
      </div>
    </div>
  );
};
