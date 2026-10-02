import React, { useState, useMemo } from 'react';
import { Zap, Search, ShieldCheck, ArrowRight } from 'lucide-react';
import movesData from '../data/moves.json';
import { Move } from '../types';
import { TypeBadge } from '../components/TypeBadge';
import { SourceButton } from '../components/SourceModal';

export const MovesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const moves = movesData as Move[];

  const filteredMoves = useMemo(() => {
    return moves.filter(m => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = m.name.toLowerCase().includes(q);
        const matchType = (m.hackrom.type || m.official.type || '').toLowerCase().includes(q);
        const matchEff = (m.hackrom.effect || m.official.effect || '').toLowerCase().includes(q);
        if (!matchName && !matchType && !matchEff) return false;
      }
      return true;
    });
  }, [moves, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-orange-950/40 via-[#13141c] to-slate-900 border border-orange-900/40 text-white shadow-xl">
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-orange-500" />
            <span>Balance & Movimientos Hackrom</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Cambios en Movimientos
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Lista completa de los {moves.length} movimientos cuyo tipo, potencia, precisión, PP o efectos secundarios fueron modificados en esta edición para mejorar el balance competitivo.
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar movimiento (ej: Guillotina, Corte, Viento Cortante)..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-orange-500"
          />
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Mostrando <strong className="text-orange-500">{filteredMoves.length}</strong> movimientos modificados
        </div>
      </div>

      {/* Moves Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMoves.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800 text-slate-500">
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">No se encontraron movimientos</p>
            <p className="text-xs text-slate-400 mt-1">Prueba con otro nombre o tipo.</p>
          </div>
        ) : (
          filteredMoves.map(m => (
            <div
              key={m.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800/80 hover:border-orange-500/40 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {m.name}
                </h3>
                {m.hackrom.type && (
                  <TypeBadge type={m.hackrom.type} size="sm" />
                )}
              </div>

              {/* Comparison Box */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Official */}
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 space-y-1">
                  <div className="font-bold text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Oficial
                  </div>
                  <div><span className="font-semibold">Tipo: </span>{m.official.type || 'Normal'}</div>
                  <div><span className="font-semibold">Potencia: </span>{m.official.power || '-'}</div>
                  <div><span className="font-semibold">Precisión: </span>{m.official.accuracy || '-'}</div>
                  <div><span className="font-semibold">PP: </span>{m.official.pp || '-'}</div>
                  {m.official.effect && <div><span className="font-semibold">Efecto: </span>{m.official.effect}</div>}
                </div>

                {/* Hackrom */}
                <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-950 dark:text-orange-200 space-y-1 font-medium">
                  <div className="font-extrabold text-[11px] uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1">
                    Hackrom TRE
                  </div>
                  <div><span className="font-bold text-slate-800 dark:text-white">Tipo: </span>{m.hackrom.type || m.official.type || 'Normal'}</div>
                  <div><span className="font-bold text-slate-800 dark:text-white">Potencia: </span>{m.hackrom.power || m.official.power || '-'}</div>
                  <div><span className="font-bold text-slate-800 dark:text-white">Precisión: </span>{m.hackrom.accuracy || m.official.accuracy || '-'}</div>
                  <div><span className="font-bold text-slate-800 dark:text-white">PP: </span>{m.hackrom.pp || m.official.pp || '-'}</div>
                  {m.hackrom.effect && <div><span className="font-bold text-slate-800 dark:text-white">Efecto: </span>{m.hackrom.effect}</div>}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">ID: <code className="font-mono text-orange-500">{m.id}</code></span>
                <SourceButton
                  source={m.source}
                  confidence={m.confidence}
                  title={`Movimiento: ${m.name}`}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
