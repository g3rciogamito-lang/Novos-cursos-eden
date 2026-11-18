import React, { useMemo, useState } from 'react';
import { CheckCircle2, Play, ShieldAlert, ShieldCheck } from 'lucide-react';

/* ============================================================================
   1. AI PROMPT ENGINEERING & STRUCTURED EVALUATION LAB (Curso 01)
   ============================================================================ */
export const AiPromptLab: React.FC = () => {
  const [roleSpec, setRoleSpec] = useState(
    'És um analista sénior de dados operacionais. Responde apenas com base no excerto delimitado.'
  );
  const [userInput, setUserInput] = useState(
    'Resumo trimestral: Receita subiu 14%, taxa de cancelamento desceu para 2.1%, tempo médio de resposta baixou de 6h para 2h15.'
  );
  const [requireJson, setRequireJson] = useState(true);
  const [includeRefusalRule, setIncludeRefusalRule] = useState(true);
  const [temperature, setTemperature] = useState(0.2);

  const diagnostics = useMemo(() => {
    const checks = [
      {
        label: 'Definição explícita de papel técnico',
        passed: roleSpec.trim().length >= 20,
      },
      {
        label: 'Regra anti-alucinação / recusa perante ausência de dados',
        passed: includeRefusalRule || /apenas com base|não disponível|sem inventar/i.test(roleSpec),
      },
      {
        label: 'Esquema de saída estruturado (JSON)',
        passed: requireJson,
      },
      {
        label: 'Temperatura adequada à precisão analítica (<= 0.3)',
        passed: temperature <= 0.3,
      },
    ];
    const passedCount = checks.filter((c) => c.passed).length;
    const tokenEstimate = Math.round((roleSpec.length + userInput.length) / 3.8);
    return { checks, passedCount, tokenEstimate };
  }, [roleSpec, userInput, requireJson, includeRefusalRule, temperature]);

  const simulatedOutput = useMemo(() => {
    if (requireJson) {
      return JSON.stringify(
        {
          estado_extraccao: 'verificado',
          metricas_identificadas: [
            { indicador: 'Crescimento de receita', valor: '+14%' },
            { indicador: 'Taxa de cancelamento', valor: '2.1%' },
            { indicador: 'Tempo de resposta', valor: '2h15' },
          ],
          regra_grounding: includeRefusalRule
            ? 'Dados externos omitidos com segurança'
            : 'Aviso: adicione instrução explícita de recusa para dados omissos',
        },
        null,
        2
      );
    }
    return `Síntese estruturada (temperatura ${temperature.toFixed(1)}): Os indicadores extraídos do texto mostram aumento de 14% na receita, redução da taxa de cancelamento para 2.1% e melhoria no tempo médio de resposta para 2h15.`;
  }, [requireJson, includeRefusalRule, temperature]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#020B1C] mb-1.5">
              Instrução de Sistema (System Prompt)
            </label>
            <textarea
              rows={3}
              value={roleSpec}
              onChange={(e) => setRoleSpec(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm font-mono text-[#020B1C] focus:border-[#176BFF] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#020B1C] mb-1.5">
              Dados Delimitados de Entrada (&lt;contexto&gt;)
            </label>
            <textarea
              rows={3}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm text-[#020B1C] focus:border-[#176BFF] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-xl border border-slate-200 bg-[#F5F8FF] p-4">
            <label className="flex items-center gap-2 text-xs font-medium text-[#020B1C] cursor-pointer">
              <input
                type="checkbox"
                checked={requireJson}
                onChange={(e) => setRequireJson(e.target.checked)}
                className="accent-[#176BFF]"
              />
              Forçar saída JSON
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-[#020B1C] cursor-pointer">
              <input
                type="checkbox"
                checked={includeRefusalRule}
                onChange={(e) => setIncludeRefusalRule(e.target.checked)}
                className="accent-[#176BFF]"
              />
              Regra de recusa estrita
            </label>
            <div>
              <span className="block text-xs font-mono text-[#164E9B] tabular-nums">
                Temperatura: {temperature.toFixed(1)}
              </span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-[#176BFF] mt-1"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-semibold text-[#020B1C]">
                Auditoria Estrutural do Prompt
              </span>
              <span className="font-mono text-xs text-[#176BFF] tabular-nums">
                ~{diagnostics.tokenEstimate} tokens
              </span>
            </div>
            <ul className="space-y-2 text-xs">
              {diagnostics.checks.map((c) => (
                <li key={c.label} className="flex items-center gap-2">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${
                      c.passed ? 'text-emerald-600' : 'text-slate-300'
                    }`}
                  />
                  <span className={c.passed ? 'text-[#020B1C]' : 'text-slate-400'}>
                    {c.label}
                  </span>
                </li>
              ))}
            </ul>
            <p className="font-mono text-xs text-[#164E9B] pt-2 border-t border-slate-100 tabular-nums">
              Conformidade: {diagnostics.passedCount}/4 critérios cumpridos
            </p>
          </div>

          <div className="rounded-xl bg-[#020B1C] text-slate-200 p-4 font-mono text-xs overflow-x-auto">
            <p className="text-[#176BFF] mb-2">PREVISÃO ESTRUTURADA DA SAÍDA</p>
            <pre className="whitespace-pre-wrap leading-relaxed">{simulatedOutput}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   2. WEB CODE SANDBOX (Curso 03 — HTML/CSS/JS Live Preview)
   ============================================================================ */
const WEB_TEMPLATES: Record<string, { label: string; html: string; css: string; js: string }> = {
  card: {
    label: 'Componente Académico',
    html: `<main class="card">\n  <p class="eyebrow">PROGRAMA DE ENGENHARIA WEB</p>\n  <h1>Arquitectura Semântica e Acessível</h1>\n  <p id="status">Clique para validar a interacção DOM.</p>\n  <button id="btn">Executar verificação</button>\n</main>`,
    css: `body { font-family: system-ui, sans-serif; background: #F5F8FF; padding: 24px; color: #020B1C; }\n.card { background: #fff; border: 1px solid #cbd5e1; border-radius: 14px; padding: 24px; max-width: 460px; }\n.eyebrow { font-size: 11px; letter-spacing: 0.14em; color: #176BFF; font-weight: 700; }\nh1 { font-size: 20px; margin: 8px 0; }\nbutton { background: #020B1C; color: #fff; border: 0; border-radius: 10px; padding: 10px 16px; cursor: pointer; margin-top: 12px; }\nbutton:hover { background: #176BFF; }`,
    js: `document.getElementById('btn').addEventListener('click', () => {\n  const el = document.getElementById('status');\n  el.textContent = 'Evento DOM validado com sucesso às ' + new Date().toLocaleTimeString('pt-PT');\n});`,
  },
  grid: {
    label: 'Grelha CSS Responsiva',
    html: `<section class="grid">\n  <div class="box">Módulo 01 · HTML5</div>\n  <div class="box">Módulo 02 · CSS Grid</div>\n  <div class="box">Módulo 03 · TypeScript</div>\n</section>`,
    css: `body { font-family: system-ui, sans-serif; padding: 20px; background: #020B1C; }\n.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; }\n.box { background: rgba(255,255,255,0.08); color: #fff; border: 1px solid rgba(23,107,255,0.5); border-radius: 10px; padding: 16px; font-size: 13px; }`,
    js: `console.log('Grelha renderizada');`,
  },
};

export const WebCodeLab: React.FC = () => {
  const [html, setHtml] = useState(WEB_TEMPLATES.card.html);
  const [css, setCss] = useState(WEB_TEMPLATES.card.css);
  const [js, setJs] = useState(WEB_TEMPLATES.card.js);

  const srcDoc = useMemo(
    () =>
      `<!doctype html><html lang="pt"><head><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`,
    [html, css, js]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-medium text-[#64748B]">
          Modelos iniciais de experiência:
        </span>
        <div className="flex flex-wrap gap-2">
          {Object.entries(WEB_TEMPLATES).map(([key, tpl]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setHtml(tpl.html);
                setCss(tpl.css);
                setJs(tpl.js);
              }}
              className="min-h-[36px] px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-[#020B1C] hover:border-[#176BFF]"
            >
              {tpl.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-6 space-y-3">
          <div>
            <label className="block font-mono text-xs text-[#164E9B] mb-1">HTML</label>
            <textarea
              rows={5}
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-[#020B1C] text-slate-100 p-3 font-mono text-xs focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-mono text-xs text-[#164E9B] mb-1">CSS</label>
            <textarea
              rows={5}
              value={css}
              onChange={(e) => setCss(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-[#020B1C] text-slate-100 p-3 font-mono text-xs focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-mono text-xs text-[#164E9B] mb-1">JavaScript</label>
            <textarea
              rows={3}
              value={js}
              onChange={(e) => setJs(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-[#020B1C] text-slate-100 p-3 font-mono text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-xs text-[#164E9B]">PRÉ-VISUALIZAÇÃO EM TEMPO REAL</span>
            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
              <Play className="w-3 h-3" /> Sandbox activo
            </span>
          </div>
          <iframe
            title="Sandbox Web Meridiano"
            sandbox="allow-scripts"
            srcDoc={srcDoc}
            className="w-full flex-1 min-h-[340px] rounded-xl border border-slate-200 bg-white"
          />
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   3. CYBERSECURITY DEFENSIVE AUDIT SANDBOX (Curso 08)
   ============================================================================ */
export const CyberAuditLab: React.FC = () => {
  const [sqlInput, setSqlInput] = useState("' OR '1'='1");
  const [xssInput, setXssInput] = useState('<img src=x onerror="alert(1)">Olá');
  const [hashInput, setHashInput] = useState('Meridiano-2026-Audit');
  const [sha256Hex, setSha256Hex] = useState('');

  const sqlDetected = /('|--|;|union\s+select|or\s+1=1|\bor\b\s+'1'='1')/i.test(sqlInput);
  const sanitizedXss = xssInput
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const computeHash = async () => {
    if (!window.crypto?.subtle) return;
    const buf = new TextEncoder().encode(hashInput);
    const digest = await window.crypto.subtle.digest('SHA-256', buf);
    const hex = Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    setSha256Hex(hex);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-xl border border-slate-200 bg-[#F5F8FF] p-5 space-y-3">
        <h4 className="font-display text-base font-semibold text-[#020B1C]">
          1. Simulador SQL Injection vs. Prepared Statements
        </h4>
        <input
          type="text"
          value={sqlInput}
          onChange={(e) => setSqlInput(e.target.value)}
          className="w-full min-h-[42px] rounded-xl border border-slate-200 bg-white px-3.5 font-mono text-xs text-[#020B1C]"
        />
        <div className="rounded-xl bg-[#020B1C] text-slate-200 p-3.5 font-mono text-xs space-y-2">
          <p className="text-rose-400">
            Consulta Vulnerável (Concatenação): SELECT * FROM users WHERE email = &apos;{sqlInput}&apos;;
          </p>
          <p className="text-emerald-400">
            Consulta Segura (Parametrizada): db.query(&apos;SELECT * FROM users WHERE email = $1&apos;, [input]);
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium">
          {sqlDetected ? (
            <span className="inline-flex items-center gap-1.5 text-amber-700">
              <ShieldAlert className="w-4 h-4" /> Padrão de injecção neutralizado pela consulta parametrizada.
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-emerald-700">
              <ShieldCheck className="w-4 h-4" /> Entrada benigna validada.
            </span>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-[#F5F8FF] p-5 space-y-4">
        <div>
          <h4 className="font-display text-base font-semibold text-[#020B1C] mb-2">
            2. Neutralização de XSS (Output Encoding)
          </h4>
          <input
            type="text"
            value={xssInput}
            onChange={(e) => setXssInput(e.target.value)}
            className="w-full min-h-[40px] rounded-xl border border-slate-200 bg-white px-3.5 font-mono text-xs text-[#020B1C]"
          />
          <p className="font-mono text-xs text-[#164E9B] bg-white rounded-lg border border-slate-200 p-2.5 mt-2 break-all">
            Saída escapada: {sanitizedXss}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-200">
          <h4 className="font-display text-base font-semibold text-[#020B1C] mb-2">
            3. Integridade Criptográfica (SHA-256 Real)
          </h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              className="flex-1 min-h-[40px] rounded-xl border border-slate-200 bg-white px-3.5 font-mono text-xs text-[#020B1C]"
            />
            <button
              type="button"
              onClick={computeHash}
              className="min-h-[40px] px-4 rounded-xl bg-[#020B1C] text-white text-xs font-medium hover:bg-[#176BFF]"
            >
              Calcular Hash
            </button>
          </div>
          {sha256Hex && (
            <p className="font-mono text-[11px] text-[#020B1C] bg-white rounded-lg border border-slate-200 p-2.5 mt-2 break-all">
              {sha256Hex}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   4. EXCEL SPREADSHEET ENGINE + SVG CHART LAB (Curso 09)
   ============================================================================ */
type GridCells = Record<string, string>;

const INITIAL_GRID: GridCells = {
  A1: 'Trimestre', B1: 'Receita', C1: 'Custo', D1: 'Margem',
  A2: 'T1',        B2: '14200',   C2: '8900',  D2: '=B2-C2',
  A3: 'T2',        B3: '16800',   C3: '9400',  D3: '=B3-C3',
  A4: 'T3',        B4: '19500',   C4: '10200', D4: '=B4-C4',
  A5: 'T4',        B5: '22400',   C5: '11100', D5: '=B5-C5',
  A6: 'Total',     B6: '=SOMA(B2:B5)', C6: '=SOMA(C2:C5)', D6: '=SOMA(D2:D5)',
};

function colToIdx(col: string): number {
  return col.toUpperCase().charCodeAt(0) - 65;
}

function expandRange(rangeStr: string): string[] {
  const [start, end] = rangeStr.split(':').map((s) => s.trim().toUpperCase());
  if (!start || !end) return [];
  const c1 = colToIdx(start[0]);
  const r1 = Number(start.slice(1));
  const c2 = colToIdx(end[0]);
  const r2 = Number(end.slice(1));
  const ids: string[] = [];
  for (let c = Math.min(c1, c2); c <= Math.max(c1, c2); c++) {
    for (let r = Math.min(r1, r2); r <= Math.max(r1, r2); r++) {
      ids.push(`${String.fromCharCode(65 + c)}${r}`);
    }
  }
  return ids;
}

function evaluateCell(cellId: string, grid: GridCells, depth = 0): string | number {
  if (depth > 8) return '#CICLO';
  const raw = (grid[cellId] ?? '').trim();
  if (!raw.startsWith('=')) {
    const num = Number(raw);
    return raw !== '' && !Number.isNaN(num) ? num : raw;
  }

  const expr = raw.slice(1).trim();
  const fnMatch = expr.match(/^(SOMA|MÉDIA|MEDIA|MÁXIMO|MAXIMO|MÍNIMO|MINIMO|CONTAR)\(([^)]+)\)$/i);
  if (fnMatch) {
    const fn = fnMatch[1].toUpperCase();
    const cells = expandRange(fnMatch[2]);
    const nums = cells
      .map((id) => Number(evaluateCell(id, grid, depth + 1)))
      .filter((n) => !Number.isNaN(n));
    if (nums.length === 0) return 0;
    if (fn === 'SOMA') return nums.reduce((a, b) => a + b, 0);
    if (fn === 'MÉDIA' || fn === 'MEDIA')
      return Number((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1));
    if (fn === 'MÁXIMO' || fn === 'MAXIMO') return Math.max(...nums);
    if (fn === 'MÍNIMO' || fn === 'MINIMO') return Math.min(...nums);
    if (fn === 'CONTAR') return nums.length;
  }

  const arithMatch = expr.match(/^([A-D][1-6])\s*([+\-*/])\s*([A-D][1-6])$/i);
  if (arithMatch) {
    const left = Number(evaluateCell(arithMatch[1].toUpperCase(), grid, depth + 1)) || 0;
    const right = Number(evaluateCell(arithMatch[3].toUpperCase(), grid, depth + 1)) || 0;
    const op = arithMatch[2];
    if (op === '+') return left + right;
    if (op === '-') return left - right;
    if (op === '*') return left * right;
    if (op === '/') return right !== 0 ? Number((left / right).toFixed(2)) : '#DIV/0';
  }

  return '#ERRO';
}

export const ExcelSpreadsheetLab: React.FC = () => {
  const [grid, setGrid] = useState<GridCells>(INITIAL_GRID);
  const [selectedCell, setSelectedCell] = useState<string>('D6');

  const cols = ['A', 'B', 'C', 'D'];
  const rows = [1, 2, 3, 4, 5, 6];

  const chartData = [2, 3, 4, 5].map((r) => ({
    label: String(evaluateCell(`A${r}`, grid)),
    receita: Number(evaluateCell(`B${r}`, grid)) || 0,
    margem: Number(evaluateCell(`D${r}`, grid)) || 0,
  }));
  const maxVal = Math.max(1000, ...chartData.map((d) => d.receita));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-[#F5F8FF] px-4 py-2.5">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2 py-1 rounded bg-[#020B1C] text-white font-semibold">
            {selectedCell}
          </span>
          <span className="text-[#64748B]">fx</span>
          <input
            type="text"
            value={grid[selectedCell] ?? ''}
            onChange={(e) =>
              setGrid((prev) => ({ ...prev, [selectedCell]: e.target.value }))
            }
            aria-label="Barra de fórmulas"
            className="min-w-[220px] sm:min-w-[320px] rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-[#020B1C] focus:border-[#176BFF] focus:outline-none"
          />
        </div>
        <p className="text-xs text-[#64748B]">
          Suporta =SOMA(B2:B5), =MÉDIA(...), =MÁXIMO(...), =MÍNIMO(...), =B2-C2
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-[#020B1C] text-white">
                <th className="w-10 py-2 border-r border-white/10 text-center" />
                {cols.map((c) => (
                  <th key={c} className="py-2 px-3 border-r border-white/10 text-center">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r} className="border-t border-slate-200">
                  <td className="bg-slate-50 text-slate-500 text-center font-semibold border-r border-slate-200 py-2">
                    {r}
                  </td>
                  {cols.map((c) => {
                    const id = `${c}${r}`;
                    const evaluated = evaluateCell(id, grid);
                    const isSel = selectedCell === id;
                    return (
                      <td
                        key={id}
                        onClick={() => setSelectedCell(id)}
                        className={`p-0 border-r border-slate-200 cursor-pointer ${
                          isSel ? 'ring-2 ring-inset ring-[#176BFF] bg-[#F5F8FF]' : 'bg-white'
                        }`}
                      >
                        <input
                          type="text"
                          value={isSel ? grid[id] ?? '' : String(evaluated)}
                          onFocus={() => setSelectedCell(id)}
                          onChange={(e) =>
                            setGrid((prev) => ({ ...prev, [id]: e.target.value }))
                          }
                          aria-label={`Célula ${id}`}
                          className={`w-full px-3 py-2 text-xs bg-transparent focus:outline-none tabular-nums ${
                            r === 1 || r === 6 ? 'font-semibold text-[#020B1C]' : 'text-[#334155]'
                          }`}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5">
          <h4 className="font-display text-sm font-semibold text-[#020B1C] mb-4">
            Gráfico Dinâmico: Receita vs. Margem por Trimestre
          </h4>
          <svg viewBox="0 0 320 180" className="w-full h-44" role="img" aria-label="Gráfico de barras de receita e margem">
            {chartData.map((item, idx) => {
              const xBase = 24 + idx * 74;
              const hRec = Math.max(4, (item.receita / maxVal) * 120);
              const hMar = Math.max(4, (Math.max(0, item.margem) / maxVal) * 120);
              return (
                <g key={item.label}>
                  <rect
                    x={xBase}
                    y={140 - hRec}
                    width={22}
                    height={hRec}
                    rx={4}
                    fill="#020B1C"
                  />
                  <rect
                    x={xBase + 26}
                    y={140 - hMar}
                    width={22}
                    height={hMar}
                    rx={4}
                    fill="#176BFF"
                  />
                  <text
                    x={xBase + 24}
                    y={160}
                    textAnchor="middle"
                    className="fill-slate-600 text-[11px] font-mono"
                  >
                    {item.label}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="flex items-center gap-5 text-xs text-[#64748B] mt-2">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#020B1C]" /> Receita
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#176BFF]" /> Margem calculada
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
