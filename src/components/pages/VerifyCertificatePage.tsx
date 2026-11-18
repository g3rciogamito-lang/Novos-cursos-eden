import React, { useEffect, useState } from 'react';
import { Award, Search, ShieldAlert, ShieldCheck } from 'lucide-react';
import { universityRepository } from '../../services/repository';
import { Certificate } from '../../types/university';

interface VerifyCertificatePageProps {
  initialCode?: string;
}

export const VerifyCertificatePage: React.FC<VerifyCertificatePageProps> = ({
  initialCode = '',
}) => {
  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<Certificate | null>(null);

  const runVerification = async (targetCode: string) => {
    const cleaned = targetCode.trim().toUpperCase();
    if (!cleaned) return;
    setLoading(true);
    const res = await universityRepository.verifyCertificate(cleaned);
    setResult(res.valid && res.certificate ? res.certificate : null);
    setSearched(true);
    setLoading(false);
  };

  useEffect(() => {
    if (initialCode) {
      void runVerification(initialCode);
    }
  }, [initialCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void runVerification(code);
  };

  return (
    <div className="bg-[#F5F8FF] min-h-screen">
      <section className="navy-radial-glow text-white border-b border-white/10 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#176BFF]">
            Registo Académico Oficial
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white mt-2">
            Verificação de Autenticidade de Certificados
          </h1>
          <p className="text-slate-300 mt-3 text-base">
            Introduza o código único impresso no diploma (ex.: IM-2026-...) para validar a emissão,
            carga horária e competências certificadas pelo Instituto Meridiano.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Introduza o código único (ex.: IM-2026-XXXXXX)"
              aria-label="Código do certificado"
              className="w-full min-h-[46px] rounded-xl border border-slate-200 bg-[#F5F8FF]/60 pl-10 pr-4 font-mono text-sm uppercase text-[#020B1C] focus:border-[#176BFF] focus:bg-white focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="min-h-[46px] px-6 py-2.5 rounded-xl bg-[#020B1C] text-white text-sm font-medium hover:bg-[#176BFF] transition-colors shrink-0"
          >
            {loading ? 'A verificar...' : 'Validar código'}
          </button>
        </form>

        {searched && result && (
          <div className="rounded-2xl border border-emerald-300 bg-white p-6 sm:p-8 space-y-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-emerald-700">
                  Certificado Autêntico e Válido
                </p>
                <h2 className="font-display text-2xl font-semibold text-[#020B1C] mt-1">
                  {result.courseTitle}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-[#F5F8FF] p-5 text-sm">
              <div>
                <span className="text-xs text-[#64748B] block">Titular</span>
                <strong className="text-[#020B1C]">{result.studentName}</strong>
              </div>
              <div>
                <span className="text-xs text-[#64748B] block">Código de verificação</span>
                <strong className="font-mono text-[#176BFF]">{result.verificationCode}</strong>
              </div>
              <div>
                <span className="text-xs text-[#64748B] block">Carga horária</span>
                <strong className="font-mono text-[#020B1C] tabular-nums">
                  {result.totalHours} horas
                </strong>
              </div>
              <div>
                <span className="text-xs text-[#64748B] block">Data de emissão</span>
                <strong className="font-mono text-[#020B1C] tabular-nums">
                  {new Date(result.issuedAt).toLocaleDateString('pt-PT')}
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#64748B]">
              <Award className="w-4 h-4 text-[#176BFF]" />
              <span>Emitido por {result.issuerName}</span>
            </div>
          </div>
        )}

        {searched && !result && (
          <div className="rounded-2xl border border-rose-200 bg-white p-6 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-display text-base font-semibold text-[#020B1C]">
                Código não localizado nos registos oficiais
              </p>
              <p className="text-sm text-[#64748B] mt-1">
                Confirme o formato do código (IM-AAAA-XXXXXX) e tente novamente.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
