import React from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { LessonDiagram } from '../../types/university';

interface DiagramRendererProps {
  diagram: LessonDiagram;
  accentColor?: string;
}

export const DiagramRenderer: React.FC<DiagramRendererProps> = ({
  diagram,
  accentColor = '#176BFF',
}) => {
  const { title, kind, caption, nodes } = diagram;

  return (
    <figure className="rounded-2xl border border-slate-200 bg-[#020B1C] text-white overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-[#176BFF]">
            Esquema Conceptual
          </p>
          <h4 className="font-display text-base sm:text-lg font-semibold text-white mt-0.5">
            {title}
          </h4>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {kind === 'flow' && 'Fluxo Sequencial'}
          {kind === 'layers' && 'Arquitectura em Camadas'}
          {kind === 'matrix' && 'Matriz Estrutural'}
          {kind === 'cycle' && 'Ciclo Contínuo'}
        </span>
      </div>

      <div className="p-6">
        {kind === 'flow' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-stretch">
            {nodes.map((node, index) => (
              <div key={node.label} className="flex flex-col lg:flex-row items-stretch gap-2">
                <div className="flex-1 rounded-xl border border-white/12 bg-white/[0.04] p-4 flex flex-col justify-between">
                  <div>
                    <span
                      className="font-mono text-xs font-medium tabular-nums"
                      style={{ color: accentColor }}
                    >
                      0{index + 1}
                    </span>
                    <p className="font-display font-semibold text-sm text-white mt-1">
                      {node.label}
                    </p>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mt-2">{node.detail}</p>
                </div>
                {index < nodes.length - 1 && (
                  <div className="hidden lg:flex items-center justify-center text-[#176BFF]/80 shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {kind === 'layers' && (
          <div className="space-y-2.5 max-w-3xl mx-auto">
            {nodes.map((node, index) => (
              <div
                key={node.label}
                className="rounded-xl border border-white/12 bg-white/[0.04] px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                style={{
                  borderColor: index === 0 ? `${accentColor}66` : 'rgba(255,255,255,0.12)',
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[#176BFF] tabular-nums">
                    N{nodes.length - index}
                  </span>
                  <span className="font-display font-semibold text-sm text-white">
                    {node.label}
                  </span>
                </div>
                <p className="text-xs text-slate-300 sm:text-right max-w-md">{node.detail}</p>
              </div>
            ))}
          </div>
        )}

        {kind === 'matrix' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {nodes.map((node, index) => (
              <div
                key={node.label}
                className="rounded-xl border border-white/12 bg-white/[0.04] p-4"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-display font-semibold text-sm text-white">
                    {node.label}
                  </span>
                  <span className="font-mono text-xs text-slate-400 tabular-nums">
                    Q{index + 1}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{node.detail}</p>
              </div>
            ))}
          </div>
        )}

        {kind === 'cycle' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
            {nodes.map((node, index) => (
              <div
                key={node.label}
                className="rounded-xl border border-white/12 bg-white/[0.04] p-4 flex items-start gap-3"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-semibold text-white shrink-0 tabular-nums"
                  style={{ backgroundColor: `${accentColor}33`, border: `1px solid ${accentColor}77` }}
                >
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <p className="font-display font-semibold text-sm text-white">{node.label}</p>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">{node.detail}</p>
                </div>
                {index < nodes.length - 1 && (
                  <ArrowDown className="w-3.5 h-3.5 text-slate-500 sm:hidden ml-auto shrink-0" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <figcaption className="px-6 py-3 bg-[#030712] border-t border-white/10 text-xs text-slate-400 leading-relaxed">
        {caption}
      </figcaption>
    </figure>
  );
};
