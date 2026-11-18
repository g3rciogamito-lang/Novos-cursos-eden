import React, { useState } from 'react';
import {
  Award,
  BookMarked,
  Compass,
  FlaskConical,
  Grid2x2,
  Home,
  Layers,
  Menu,
  Search,
  X,
} from 'lucide-react';
import { useUniversity } from '../../context/UniversityContext';
import { AppView } from '../../types/university';

interface HeaderProps {
  onOpenSearch: () => void;
}

interface NavItem {
  id: 'home' | 'courses' | 'categories' | 'library' | 'labs' | 'journey';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  target: AppView;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Início', icon: Home, target: { page: 'home' } },
  { id: 'courses', label: 'Cursos', icon: Layers, target: { page: 'courses', categoryFilter: 'all' } },
  { id: 'categories', label: 'Categorias', icon: Grid2x2, target: { page: 'categories' } },
  { id: 'library', label: 'Biblioteca', icon: BookMarked, target: { page: 'library' } },
  { id: 'labs', label: 'Laboratórios', icon: FlaskConical, target: { page: 'labs' } },
  { id: 'journey', label: 'Meu percurso', icon: Compass, target: { page: 'journey', subtab: 'progresso' } },
];

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const { view, navigate } = useUniversity();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isNavActive = (itemId: NavItem['id']): boolean => {
    if (view.page === itemId) return true;
    if (itemId === 'courses' && (view.page === 'course-detail' || view.page === 'learn')) return true;
    if (itemId === 'journey' && view.page === 'verify-certificate') return true;
    return false;
  };

  const handleSelect = (target: AppView) => {
    setMobileOpen(false);
    navigate(target);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#020B1C]/95 backdrop-blur-md border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleSelect({ page: 'home' })}
          className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 text-left focus:outline-none group"
        >
          <span className="w-8 h-8 rounded-lg bg-[#176BFF]/15 border border-[#176BFF]/40 flex items-center justify-center text-[#176BFF] group-hover:bg-[#176BFF] group-hover:text-white transition-colors">
            <Award className="w-4 h-4" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-white">
            Meridiano
          </span>
        </button>

        {/* Zone 2: Single-line Primary Navigation */}
        <nav aria-label="Menu principal" className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.target)}
                aria-current={active ? 'page' : undefined}
                className={`relative px-3.5 py-2 rounded-lg inline-flex items-center gap-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'text-white bg-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#176BFF]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-3.5 right-3.5 h-0.5 rounded-full bg-[#176BFF]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Drawer Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            className="min-h-[40px] inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-2 text-sm font-medium text-white hover:border-[#176BFF] hover:bg-[#176BFF]/15 transition-colors whitespace-nowrap shrink-0"
            aria-label="Abrir pesquisa global"
          >
            <Search className="w-4 h-4 text-[#176BFF]" />
            <span className="hidden sm:inline">Pesquisar</span>
            <kbd className="hidden md:inline-block font-mono text-[11px] text-slate-400 border border-white/15 rounded px-1.5 py-0.5">
              ⌘K
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] text-white hover:bg-white/10"
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#020B1C] px-4 py-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.target)}
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#176BFF]/20 text-white border border-[#176BFF]/40'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#176BFF]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
