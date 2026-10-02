import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Terminal, ExternalLink } from 'lucide-react';
import metaData from '../data/game_meta.json';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d0e12] text-slate-600 dark:text-slate-400 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-black text-xl italic">
                R
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                Pokémon Edición Team Rocket
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-md">
              Guía técnica y base de datos 100% interactiva. Toda la información ha sido extraída y verificada directamente desde los archivos del proyecto <code className="text-rose-500 font-mono">Pokemon TRE 2026</code> desarrollado por <strong className="text-slate-800 dark:text-slate-200">Dragonsden</strong> y colaboradores.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>{metaData.counts.totalPokemon} Pokémon • {metaData.counts.totalBattles} Combates • {metaData.counts.totalSidequests} Misiones verificadas</span>
            </div>
          </div>

          {/* Direct Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Secciones
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/niveles" className="hover:text-rose-500 transition-colors">Niveles & Combates de Jefe</Link></li>
              <li><Link to="/secundarias" className="hover:text-rose-500 transition-colors">Misiones Secundarias (Checklist)</Link></li>
              <li><Link to="/pokemon" className="hover:text-rose-500 transition-colors">Pokédex Hackrom</Link></li>
              <li><Link to="/obtencion" className="hover:text-rose-500 transition-colors">Métodos de Obtención</Link></li>
              <li><Link to="/mapas" className="hover:text-rose-500 transition-colors">Mapas y Zonas</Link></li>
              <li><Link to="/objetos" className="hover:text-rose-500 transition-colors">Objetos & Piedras</Link></li>
              <li><Link to="/movimientos" className="hover:text-rose-500 transition-colors">Cambios en Movimientos</Link></li>
            </ul>
          </div>

          {/* Technical & Audit */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Auditoría & Créditos
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/datos" className="hover:text-rose-500 transition-colors flex items-center gap-1"><Terminal className="w-3.5 h-3.5 text-rose-500" /> Datos y Archivos Auditados</Link></li>
              <li><Link to="/qol" className="hover:text-rose-500 transition-colors">Guías QoL & Farmeo</Link></li>
              <li><Link to="/acerca-de" className="hover:text-rose-500 transition-colors">Créditos de Desarrolladores</Link></li>
            </ul>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500">
              Motor: {metaData.engine}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Pokémon Edición Team Rocket — Creado por y para la comunidad de Fans.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Diseñado con</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>para jugadores de Hackroms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
