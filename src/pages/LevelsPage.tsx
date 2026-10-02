import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Swords, Search, Filter, ShieldAlert, Sparkles, ChevronDown, 
  ChevronUp, ArrowRight, Eye, ShieldCheck, RefreshCw 
} from 'lucide-react';
import levelsData from '../data/levels.json';
import { Battle, BattlePokemon } from '../types';
import { SourceButton } from '../components/SourceModal';

export const LevelsPage: React.FC<{ initialMode?: 'facil' | 'dificil' | 'ambos' }> = ({ initialMode = 'ambos' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<'ambos' | 'facil' | 'dificil'>(() => {
    const p = searchParams.get('mode');
    if (p === 'facil' || p === 'dificil' || p === 'ambos') return p;
    return initialMode;
  });
  const [selectedArc, setSelectedArc] = useState<string>(() => searchParams.get('arc') || 'TODOS');
  const [categoryFilter, setCategoryFilter] = useState<string>(() => searchParams.get('cat') || 'TODOS');
  const [searchQuery, setSearchQuery] = useState<string>(() => searchParams.get('q') || '');
  const [minLvl, setMinLvl] = useState<number>(0);
  const [maxLvl, setMaxLvl] = useState<number>(135);
  const [expandedBattleId, setExpandedBattleId] = useState<string | null>(() => searchParams.get('battle') || null);

  const battles = levelsData as Battle[];

  const arcs = [
    { id: 'TODOS', label: 'Todas las Temporadas' },
    { id: 'T1 - KANTO', label: 'T1 - Kanto' },
    { id: 'T2 - ARCHI7', label: 'T2 - Archi7 / Sevii' },
    { id: 'T3 - JOHTO', label: 'T3 - Johto' },
    { id: 'T4 - DLC', label: 'T4 - DLC Johto' },
    { id: 'T5 - HOENN', label: 'T5 - Hoenn' },
    { id: 'T1 - KANTO SEC', label: 'T1 Secundarias' },
    { id: 'T2 - ARCHI7 SEC', label: 'T2 Secundarias' },
    { id: 'T3 - JOHTO SEC', label: 'T3 Secundarias' },
    { id: 'T4 - DLC SEC', label: 'T4 Secundarias' },
    { id: 'T5 - HOENN SEC', label: 'T5 Secundarias' },
  ];

  // Filtered battles
  const filteredBattles = useMemo(() => {
    return battles.filter(b => {
      // Arc filter
      if (selectedArc !== 'TODOS' && b.arc !== selectedArc) return false;

      // Category filter
      if (categoryFilter !== 'TODOS' && b.category !== categoryFilter) return false;

      // Level range
      if (b.maxLevel > 0 && (b.maxLevel < minLvl || b.minLevel > maxLvl)) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTrainer = b.trainer.toLowerCase().includes(q);
        const matchLoc = b.location.toLowerCase().includes(q);
        const matchArc = b.arcName.toLowerCase().includes(q);
        const matchPkmn = (b.modes.facil?.team || []).some(p => p.name.toLowerCase().includes(q)) ||
                          (b.modes.dificil?.team || []).some(p => p.name.toLowerCase().includes(q));
        if (!matchTrainer && !matchLoc && !matchArc && !matchPkmn) return false;
      }

      return true;
    });
  }, [battles, selectedArc, categoryFilter, searchQuery, minLvl, maxLvl]);

  const resetFilters = () => {
    setSelectedArc('TODOS');
    setCategoryFilter('TODOS');
    setSearchQuery('');
    setMinLvl(0);
    setMaxLvl(135);
  };

  const renderPokemonCard = (p: BattlePokemon, isHard: boolean = false) => (
    <div
      key={p.name + p.level}
      className={`p-3 rounded-xl border text-xs transition-all ${
        isHard
          ? 'bg-rose-950/20 border-rose-900/40 text-slate-200'
          : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
      }`}
    >
      <div className="flex items-center justify-between font-bold mb-1">
        <span className="text-slate-900 dark:text-white font-extrabold">{p.name}</span>
        <span className="px-1.5 py-0.5 rounded bg-rose-600/20 text-rose-500 font-mono text-[11px]">
          Nv. {p.level}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-500 dark:text-slate-400 my-1">
        <div>
          <span className="font-semibold text-slate-600 dark:text-slate-300">Obj: </span>
          <span>{p.item || 'Ninguno'}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-600 dark:text-slate-300">Hab: </span>
          <span>{p.ability || '-'}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-600 dark:text-slate-300">Nat: </span>
          <span>{p.nature || 'Seria'}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-600 dark:text-slate-300">IVs: </span>
          <span className="font-mono">{p.ivs || '0/31'}</span>
        </div>
      </div>

      {p.evs && p.evs !== '-' && p.evs !== '0' && (
        <div className="text-[11px] text-amber-600 dark:text-amber-400 font-mono mb-1">
          <span className="font-semibold">EVs: </span>{p.evs}
        </div>
      )}

      {p.moves && p.moves.length > 0 && (
        <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Movimientos:</div>
          <div className="flex flex-wrap gap-1">
            {p.moves.map((m, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px]"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#13141c] to-slate-900 border border-slate-800 text-white shadow-xl">
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
            <Swords className="w-3.5 h-3.5 text-rose-500" />
            <span>Base de Datos de Combates de Jefe & Niveles</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Niveles & Combates: Normal vs Difícil
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Consulta los equipos exactos de cada combate de la historia y misiones secundarias. Comprueba las diferencias reales entre <strong>Modo Normal (Fácil)</strong> y <strong>Modo Difícil</strong> (objetos equipados, IVs, EVs, movimientos estratégicos y Pokémon adicionales).
          </p>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 bg-slate-100 dark:bg-[#13141c] rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setMode('ambos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'ambos'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-900/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ⚖️ Comparar Ambos Modos
          </button>
          <button
            onClick={() => setMode('facil')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'facil'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🟢 Modo Normal / Fácil
          </button>
          <button
            onClick={() => setMode('dificil')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'dificil'
                ? 'bg-red-700 text-white shadow-md shadow-red-900/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🔴 Modo Difícil
          </button>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium px-2">
          Mostrando <strong className="text-rose-500">{filteredBattles.length}</strong> de {battles.length} combates
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar entrenador, lugar, Pokémon..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-rose-500"
            />
          </div>

          {/* Arc Select */}
          <div>
            <select
              value={selectedArc}
              onChange={e => setSelectedArc(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-rose-500 cursor-pointer"
            >
              {arcs.map(a => (
                <option key={a.id} value={a.id}>{a.label}</option>
              ))}
            </select>
          </div>

          {/* Category Select */}
          <div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-rose-500 cursor-pointer"
            >
              <option value="TODOS">Todas las Categorías</option>
              <option value="PRINCIPAL">Historia Principal</option>
              <option value="SECUNDARIA">Misiones Secundarias</option>
            </select>
          </div>

          {/* Reset Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={resetFilters}
              className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Limpiar Filtros</span>
            </button>
          </div>
        </div>
      </div>

      {/* Battles List */}
      <div className="space-y-4">
        {filteredBattles.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800 text-slate-500">
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">No se encontraron combates</p>
            <p className="text-xs text-slate-400 mt-1">Prueba a cambiar los filtros o el término de búsqueda.</p>
          </div>
        ) : (
          filteredBattles.map(battle => {
            const isExpanded = expandedBattleId === battle.id;
            const partyFacil = battle.modes?.facil?.team || [];
            const partyDificil = battle.modes?.dificil?.team || [];

            return (
              <div
                key={battle.id}
                id={battle.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isExpanded
                    ? 'bg-white dark:bg-[#13141c] border-rose-500/50 shadow-lg'
                    : 'bg-white dark:bg-[#13141c] border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                }`}
              >
                {/* Battle Header Bar */}
                <div
                  onClick={() => setExpandedBattleId(isExpanded ? null : battle.id)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-600 text-white font-mono">
                        #{battle.battleNumber}
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {battle.arcName}
                      </span>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                        battle.category === 'PRINCIPAL'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                      }`}>
                        {battle.category}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      {battle.trainer}
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <span>📍 {battle.location}</span>
                      <span>•</span>
                      <span className="font-mono text-rose-500 font-bold">
                        Nv. {battle.minLevel}{battle.maxLevel !== battle.minLevel ? ` - ${battle.maxLevel}` : ''}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Pokemon Previews (small chips) */}
                    <div className="hidden md:flex items-center gap-1">
                      {partyFacil.slice(0, 4).map((p, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {p.name.split(' ')[0]}
                        </span>
                      ))}
                      {partyFacil.length > 4 && (
                        <span className="text-[10px] text-slate-400 font-mono">+{partyFacil.length - 4}</span>
                      )}
                    </div>

                    <button
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-500"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-5 animate-fadeIn">
                    
                    {/* Differences Alert */}
                    {battle.differences && battle.differences.length > 0 && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <ShieldAlert className="w-4 h-4" />
                          <span>Diferencias detectadas en Modo Difícil:</span>
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px]">
                          {battle.differences.map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Mode Teams Container */}
                    <div className={`grid gap-6 ${mode === 'ambos' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                      
                      {/* Modo Facil / Normal */}
                      {(mode === 'ambos' || mode === 'facil') && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full bg-emerald-500" />
                              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                                Modo Normal / Fácil
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 font-mono">
                              {partyFacil.length} Pokémon
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {partyFacil.map(p => renderPokemonCard(p, false))}
                          </div>
                        </div>
                      )}

                      {/* Modo Dificil */}
                      {(mode === 'ambos' || mode === 'dificil') && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full bg-red-600" />
                              <span className="font-extrabold text-sm text-rose-500">
                                Modo Difícil
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 font-mono">
                              {partyDificil.length} Pokémon
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {partyDificil.map(p => renderPokemonCard(p, true))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Battle Footer / Source */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="text-slate-400 text-[11px]">
                        ID Combate: <code className="font-mono text-rose-500">{battle.id}</code>
                      </div>
                      <SourceButton
                        source={battle.source}
                        confidence={battle.confidence}
                        title={`Combate: ${battle.trainer}`}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
