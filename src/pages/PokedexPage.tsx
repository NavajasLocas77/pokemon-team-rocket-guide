import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Sparkles, Search, Filter, ShieldCheck, ArrowUpDown, 
  X, Swords, MapPin, ChevronRight, Zap, RefreshCw, Info 
} from 'lucide-react';
import pokemonData from '../data/pokemon.json';
import levelsData from '../data/levels.json';
import { Pokemon, Battle } from '../types';
import { TypeBadge } from '../components/TypeBadge';
import { SourceButton } from '../components/SourceModal';

export const PokedexPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState<string>(() => searchParams.get('q') || '');
  const [selectedType, setSelectedType] = useState<string>(() => searchParams.get('type') || 'TODOS');
  const [selectedCategory, setSelectedCategory] = useState<string>(() => searchParams.get('category') || 'TODOS');
  const [selectedMethod, setSelectedMethod] = useState<string>(() => searchParams.get('method') || 'TODOS');
  const [sortBy, setSortBy] = useState<'dex' | 'name' | 'stat'>('dex');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  const pokemons = pokemonData as Pokemon[];
  const battles = levelsData as Battle[];

  // Sync route param :id to modal
  useEffect(() => {
    if (id) {
      const found = pokemons.find(p => p.id === id.toLowerCase());
      if (found) setSelectedPokemon(found);
    } else {
      setSelectedPokemon(null);
    }
  }, [id, pokemons]);

  const categories = [
    { id: 'TODOS', label: 'Todos los Pokémon' },
    { id: 'Experimento Rocket', label: '🧪 Experimentos Rocket' },
    { id: 'Fuerte Vínculo', label: '🤝 Fuertes Vínculo' },
    { id: 'Nueva Megaevolución', label: '⚡ Nuevas Megaevoluciones' },
    { id: 'Primigenio / Antiguo', label: '🏛️ Primigenios / Antiguos' },
    { id: 'Estándar', label: 'Estándar' },
  ];

  const typesList = [
    'TODOS', 'Acero', 'Agua', 'Bicho', 'Dragón', 'Eléctrico', 'Fantasma',
    'Fuego', 'Hada', 'Hielo', 'Lucha', 'Normal', 'Planta', 'Psíquico',
    'Roca', 'Siniestro', 'Tierra', 'Veneno', 'Volador'
  ];

  const methodsList = [
    'TODOS', 'Salvaje', 'Misión Secundaria', 'Regalo / Evento',
    'Evolución', 'Piedra Sagrada', 'Piedra Rocket', 'Compra / Casino', 'Intercambio'
  ];

  // Filter & Sort
  const filteredPokemon = useMemo(() => {
    return pokemons.filter(p => {
      // Type filter
      if (selectedType !== 'TODOS') {
        const hasType = p.types.some(t => t.toLowerCase() === selectedType.toLowerCase());
        if (!hasType) return false;
      }

      // Category filter
      if (selectedCategory !== 'TODOS' && p.category !== selectedCategory) {
        return false;
      }

      // Method filter
      if (selectedMethod !== 'TODOS' && !p.obtaining.method.toLowerCase().includes(selectedMethod.toLowerCase())) {
        return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchNum = String(p.dexNumber).toLowerCase().includes(q);
        const matchHab = p.abilities.some(a => a.toLowerCase().includes(q));
        const matchObt = p.obtaining.description.toLowerCase().includes(q);
        if (!matchName && !matchNum && !matchHab && !matchObt) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'stat') {
        const statA = a.statsHackrom?.total || a.statsOfficial?.total || 0;
        const statB = b.statsHackrom?.total || b.statsOfficial?.total || 0;
        return statB - statA;
      }
      // dex order
      const numA = typeof a.dexNumber === 'number' ? a.dexNumber : 9999;
      const numB = typeof b.dexNumber === 'number' ? b.dexNumber : 9999;
      return numA - numB;
    });
  }, [pokemons, selectedType, selectedCategory, selectedMethod, searchQuery, sortBy]);

  // Find boss battles where selected pokemon appears
  const trainersUsingPokemon = useMemo(() => {
    if (!selectedPokemon) return [];
    const pkName = selectedPokemon.name.toLowerCase();
    const result: { trainer: string; location: string; arc: string; battleId: string; level: number }[] = [];

    battles.forEach(b => {
      ['facil', 'dificil'].forEach(m => {
        const team = b.modes?.[m as 'facil' | 'dificil']?.team || [];
        team.forEach(p => {
          if (p.name.toLowerCase().includes(pkName) || pkName.includes(p.name.toLowerCase())) {
            const exists = result.some(r => r.battleId === b.id);
            if (!exists) {
              result.push({
                trainer: b.trainer,
                location: b.location,
                arc: b.arcName,
                battleId: b.id,
                level: p.level
              });
            }
          }
        });
      });
    });

    return result.slice(0, 10);
  }, [selectedPokemon, battles]);

  const openPokemon = (pk: Pokemon) => {
    setSelectedPokemon(pk);
    navigate(`/pokemon/${pk.id}`, { replace: true });
  };

  const closePokemon = () => {
    setSelectedPokemon(null);
    navigate('/pokemon', { replace: true });
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-950/30 via-[#13141c] to-slate-900 border border-rose-900/40 text-white shadow-xl">
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Pokédex Oficial del Hackrom</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Pokédex & Formas Especiales Rocket
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Base de datos completa con {pokemons.length} Pokémon y variantes registradas en los archivos del juego. Incluye métodos de obtención comprobados, evoluciones, estadísticas oficiales vs hackrom y formas de laboratorio exclusivas.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 p-2 bg-slate-100 dark:bg-[#13141c] rounded-2xl border border-slate-200 dark:border-slate-800">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat.id
                ? 'bg-rose-600 text-white shadow-md shadow-rose-900/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, número, habilidad..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-rose-500"
            />
          </div>

          {/* Type Select */}
          <div>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-rose-500 cursor-pointer"
            >
              {typesList.map(t => (
                <option key={t} value={t}>Tipo: {t}</option>
              ))}
            </select>
          </div>

          {/* Method Select */}
          <div>
            <select
              value={selectedMethod}
              onChange={e => setSelectedMethod(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-rose-500 cursor-pointer"
            >
              {methodsList.map(m => (
                <option key={m} value={m}>Obtención: {m}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-rose-500 cursor-pointer"
            >
              <option value="dex">Ordenar por N° Pokédex</option>
              <option value="name">Ordenar por Nombre</option>
              <option value="stat">Ordenar por Stats Totales</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/60">
          <span>Mostrando <strong className="text-rose-500">{filteredPokemon.length}</strong> Pokémon</span>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedType('TODOS');
              setSelectedCategory('TODOS');
              setSelectedMethod('TODOS');
            }}
            className="text-slate-500 hover:text-rose-500 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Limpiar filtros
          </button>
        </div>
      </div>

      {/* Pokemon Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPokemon.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800 text-slate-500">
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">No se encontraron Pokémon</p>
            <p className="text-xs text-slate-400 mt-1">Prueba con otros filtros o términos de búsqueda.</p>
          </div>
        ) : (
          filteredPokemon.map(p => {
            const stats = p.statsHackrom || p.statsOfficial;

            return (
              <div
                key={p.id}
                onClick={() => openPokemon(p)}
                className="group p-4 rounded-2xl bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800/80 hover:border-rose-500/50 dark:hover:border-rose-500/50 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      #{p.dexNumber}
                    </span>
                    <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                      p.category === 'Experimento Rocket' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                      p.category === 'Fuerte Vínculo' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      p.category === 'Nueva Megaevolución' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {p.category}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors">
                    {p.name}
                  </h3>

                  {/* Types */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.types.map(t => (
                      <TypeBadge key={t} type={t} size="sm" />
                    ))}
                  </div>

                  {/* Obtaining snippet */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-3 leading-relaxed">
                    {p.obtaining.description}
                  </p>
                </div>

                {/* Bottom stats summary */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    {p.obtaining.method}
                  </span>
                  {stats && (
                    <span className="font-mono font-bold text-rose-500">
                      Total {stats.total}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* POKÉMON DETAIL MODAL */}
      {selectedPokemon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
            
            {/* Close Button */}
            <button
              onClick={closePokemon}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-rose-500">
                  #{selectedPokemon.dexNumber}
                </span>
                <span className="text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {selectedPokemon.category}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {selectedPokemon.name}
              </h2>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedPokemon.types.map(t => (
                  <TypeBadge key={t} type={t} size="md" />
                ))}
              </div>
            </div>

            {/* Base Stats Section (Official vs Hackrom) */}
            {(selectedPokemon.statsOfficial || selectedPokemon.statsHackrom) && (
              <div className="space-y-3 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Estadísticas Base (Comparativa Oficial vs Hackrom)
                  </h4>
                  {selectedPokemon.statsHackrom && (
                    <span className="font-mono text-xs font-bold text-rose-500">
                      Total Hackrom: {selectedPokemon.statsHackrom.total}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {[
                    { key: 'hp', label: 'PS' },
                    { key: 'atk', label: 'Ataque' },
                    { key: 'def', label: 'Defensa' },
                    { key: 'spa', label: 'At. Especial' },
                    { key: 'spd', label: 'Def. Especial' },
                    { key: 'spe', label: 'Velocidad' },
                  ].map(st => {
                    const offVal = selectedPokemon.statsOfficial?.[st.key as keyof typeof selectedPokemon.statsOfficial] || 0;
                    const hackVal = selectedPokemon.statsHackrom?.[st.key as keyof typeof selectedPokemon.statsHackrom] || offVal;
                    const diff = hackVal - offVal;

                    return (
                      <div key={st.key} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-slate-700 dark:text-slate-300 w-24">{st.label}</span>
                          <div className="flex items-center gap-2 font-mono">
                            {offVal > 0 && offVal !== hackVal && (
                              <span className="text-slate-400 line-through text-[11px]">{offVal}</span>
                            )}
                            <span className="font-bold text-slate-900 dark:text-white">{hackVal}</span>
                            {diff !== 0 && offVal > 0 && (
                              <span className={`text-[10px] font-bold ${diff > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                ({diff > 0 ? `+${diff}` : diff})
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
                            style={{ width: `${Math.min(100, (hackVal / 200) * 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Abilities */}
            {selectedPokemon.abilities && selectedPokemon.abilities.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Habilidades en esta edición:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPokemon.abilities.map((ab, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold"
                    >
                      {ab}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Evolution Details */}
            {selectedPokemon.evolution?.text && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Método de Evolución:</span>
                </div>
                <p>{selectedPokemon.evolution.text}</p>
              </div>
            )}

            {/* Obtaining Method in full */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Dónde y cómo conseguirlo:
              </h4>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                <div className="font-bold text-rose-500 mb-1">
                  Método: {selectedPokemon.obtaining.method}
                </div>
                <p>{selectedPokemon.obtaining.description}</p>
              </div>
            </div>

            {/* Trainers Using Pokemon in Battles */}
            {trainersUsingPokemon.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5 text-rose-500" />
                  <span>Combates de Jefe donde aparece:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {trainersUsingPokemon.map((t, idx) => (
                    <Link
                      key={idx}
                      to={`/niveles?battle=${t.battleId}`}
                      className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-rose-500/10 border border-slate-200 dark:border-slate-700/60 text-xs flex items-center justify-between transition-colors"
                    >
                      <div className="truncate">
                        <div className="font-bold text-slate-900 dark:text-white truncate">{t.trainer}</div>
                        <div className="text-[11px] text-slate-500 truncate">{t.arc} • {t.location}</div>
                      </div>
                      <span className="font-mono text-rose-500 font-bold ml-2">Nv. {t.level}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Source Button */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">ID: <code className="font-mono text-rose-500">{selectedPokemon.id}</code></span>
              <SourceButton
                source={selectedPokemon.source}
                confidence={selectedPokemon.confidence}
                title={`Pokémon: ${selectedPokemon.name}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
