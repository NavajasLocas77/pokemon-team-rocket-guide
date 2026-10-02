import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Award, Search, Filter, MapPin, Sparkles, ShieldCheck, 
  ChevronRight, RefreshCw, Layers 
} from 'lucide-react';
import pokemonData from '../data/pokemon.json';
import { Pokemon } from '../types';
import { TypeBadge } from '../components/TypeBadge';
import { SourceButton } from '../components/SourceModal';

export const ObtainingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedMethod, setSelectedMethod] = useState<string>(() => searchParams.get('method') || 'TODOS');
  const [searchQuery, setSearchQuery] = useState<string>(() => searchParams.get('q') || '');

  const pokemons = (pokemonData as Pokemon[]).filter(p => p.obtaining.confirmed);

  const methods = [
    { id: 'TODOS', label: 'Todos los Métodos', count: pokemons.length },
    { id: 'Salvaje', label: '🌿 Pokémon Salvaje', count: pokemons.filter(p => p.obtaining.method.includes('Salvaje')).length },
    { id: 'Misión Secundaria', label: '📜 Misión Secundaria', count: pokemons.filter(p => p.obtaining.method.includes('Misión')).length },
    { id: 'Regalo / Evento', label: '🎁 Regalo / Inicial / Evento', count: pokemons.filter(p => p.obtaining.method.includes('Regalo')).length },
    { id: 'Evolución', label: '⚡ Evolución', count: pokemons.filter(p => p.obtaining.method.includes('Evolución')).length },
    { id: 'Piedra Sagrada', label: '🔮 Piedra Sagrada (Alola/Hisui)', count: pokemons.filter(p => p.obtaining.method.includes('Piedra Sagrada')).length },
    { id: 'Piedra Rocket', label: '🚀 Piedra Rocket', count: pokemons.filter(p => p.obtaining.method.includes('Piedra Rocket')).length },
    { id: 'Compra / Casino', label: '🪙 Compra / Casino / Tienda', count: pokemons.filter(p => p.obtaining.method.includes('Compra')).length },
    { id: 'Intercambio', label: '🤝 Intercambio', count: pokemons.filter(p => p.obtaining.method.includes('Intercambio')).length },
  ];

  const filtered = useMemo(() => {
    return pokemons.filter(p => {
      if (selectedMethod !== 'TODOS') {
        if (!p.obtaining.method.toLowerCase().includes(selectedMethod.toLowerCase())) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchNum = String(p.dexNumber).toLowerCase().includes(q);
        const matchDesc = p.obtaining.description.toLowerCase().includes(q);
        const matchLoc = p.obtaining.locations.some(l => l.toLowerCase().includes(q));
        if (!matchName && !matchNum && !matchDesc && !matchLoc) return false;
      }
      return true;
    });
  }, [pokemons, selectedMethod, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/40 via-[#13141c] to-slate-900 border border-amber-900/40 text-white shadow-xl">
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Guía Oficial de Localizaciones y Capturas</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            ¿Cómo conseguir cada Pokémon?
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Directorio clasificado por método real de obtención. Sin datos inventados ni genéricos: cada entrada refleja exactamente la información de <code className="text-amber-400 font-mono">OBTENCIÓN TODOS PKMN.txt</code> y documentos del proyecto.
          </p>
        </div>
      </div>

      {/* Methods Filter Chips */}
      <div className="flex flex-wrap gap-2 p-2 bg-slate-100 dark:bg-[#13141c] rounded-2xl border border-slate-200 dark:border-slate-800">
        {methods.map(m => (
          <button
            key={m.id}
            onClick={() => setSelectedMethod(m.id)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              selectedMethod === m.id
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <span>{m.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              selectedMethod === m.id ? 'bg-amber-800 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
            }`}>
              {m.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Input Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por Pokémon, ruta, isla o condición..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-amber-500"
          />
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Mostrando <strong className="text-amber-500">{filtered.length}</strong> de {pokemons.length} Pokémon
        </div>
      </div>

      {/* Entries List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800 text-slate-500">
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">No se encontraron resultados</p>
            <p className="text-xs text-slate-400 mt-1">Prueba seleccionando otro método de obtención o cambiando el término.</p>
          </div>
        ) : (
          filtered.map(p => (
            <div
              key={p.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800/80 hover:border-amber-500/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      #{p.dexNumber}
                    </span>
                    <Link
                      to={`/pokemon/${p.id}`}
                      className="text-base font-black text-slate-900 dark:text-white hover:text-amber-500 transition-colors"
                    >
                      {p.name}
                    </Link>
                  </div>

                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    {p.obtaining.method}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {p.types.map(t => (
                    <TypeBadge key={t} type={t} size="sm" />
                  ))}
                </div>

                {/* Obtaining details block */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <div className="font-bold text-slate-500 dark:text-slate-400 mb-1 text-[11px] uppercase tracking-wider">
                    Ubicación & Método:
                  </div>
                  <p>{p.obtaining.description}</p>
                </div>

                {/* Locations tags */}
                {p.obtaining.locations.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {p.obtaining.locations.map((loc, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        {loc}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <Link
                  to={`/pokemon/${p.id}`}
                  className="font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1"
                >
                  <span>Ver ficha en Pokédex</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>

                <SourceButton
                  source={p.source}
                  confidence={p.confidence}
                  title={`Obtención: ${p.name}`}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
