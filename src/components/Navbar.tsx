import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Sun, Moon, Search, Menu, X, Swords, BookOpen, 
  MapPin, HelpCircle, Database, Info, Sparkles, Package, Zap 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { GlobalSearchModal } from './GlobalSearchModal';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { to: '/', label: 'Inicio', icon: null },
    { to: '/niveles', label: 'Niveles', icon: Swords },
    { to: '/secundarias', label: 'Secundarias', icon: BookOpen },
    { to: '/pokemon', label: 'Pokédex', icon: Sparkles },
    { to: '/obtencion', label: 'Obtención', icon: Sparkles },
    { to: '/mapas', label: 'Mapas', icon: MapPin },
    { to: '/objetos', label: 'Objetos', icon: Package },
    { to: '/movimientos', label: 'Movimientos', icon: Zap },
    { to: '/qol', label: 'QoL & Guías', icon: HelpCircle },
    { to: '/datos', label: 'Datos', icon: Database },
    { to: '/acerca-de', label: 'Acerca de', icon: Info },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-[#13141c]/90 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo / Brand */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-red-800 flex items-center justify-center text-white shadow-lg shadow-rose-900/30 group-hover:scale-105 transition-transform">
                <span className="font-black text-2xl tracking-tighter italic">R</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors">
                    Pokémon Team Rocket
                  </span>
                  <span className="px-1.5 py-0.2 text-[10px] font-black uppercase rounded bg-rose-600 text-white tracking-widest">
                    TRE 2026
                  </span>
                </div>
                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 tracking-wider">
                  GUÍA 100% OFICIAL
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Actions: Search Button + Theme Toggle + Mobile Menu Toggle */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quick Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition-colors shadow-sm"
                title="Buscador global (Ctrl + K)"
              >
                <Search className="w-4 h-4 text-rose-500" />
                <span className="hidden sm:inline font-medium">Buscar...</span>
                <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] bg-slate-200 dark:bg-slate-900 text-slate-500 rounded font-mono">
                  ⌘K
                </kbd>
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-700 hover:-rotate-12 transition-transform" />
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(prev => !prev)}
                className="xl:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Abrir menú"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#13141c] px-4 pt-2 pb-6 space-y-1 animate-fadeIn shadow-2xl">
            <div className="grid grid-cols-2 gap-1.5 pt-2">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-900/30'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 text-center">
              Pokémon Edición Team Rocket — Base de datos extraída 100% de archivos del juego.
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
