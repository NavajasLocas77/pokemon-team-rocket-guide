import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MapPin, Search, Swords, BookOpen, Sparkles, ChevronRight, Package } from 'lucide-react';
import locationsData from '../data/locations.json';
import { Location } from '../types';
import { SourceButton } from '../components/SourceModal';

export const LocationsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>(() => searchParams.get('q') || '');
  const [selectedLocId, setSelectedLocId] = useState<string | null>(() => searchParams.get('loc') || null);

  const locations = locationsData as Location[];

  const filteredLocations = useMemo(() => {
    return locations.filter(l => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = l.name.toLowerCase().includes(q);
        const matchPk = l.pokemonAvailable.some(p => p.pokemon.toLowerCase().includes(q));
        const matchTr = l.trainers.some(t => t.trainer.toLowerCase().includes(q));
        const matchSq = l.sidequests.some(s => s.title.toLowerCase().includes(q));
        if (!matchName && !matchPk && !matchTr && !matchSq) return false;
      }
      return true;
    });
  }, [locations, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-sky-950/40 via-[#13141c] to-slate-900 border border-sky-900/40 text-white shadow-xl">
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5 text-sky-500" />
            <span>Guía de Zonas, Rutas y Ciudades</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Mapas & Ubicaciones del Juego
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Explora las rutas y mapas de Kanto, Sevii, Johto y Hoenn con enlaces directos a sus Pokémon salvajes, entrenadores, misiones secundarias y objetos verificados.
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
            placeholder="Buscar por nombre de ruta, ciudad, cueva..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-sky-500"
          />
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Mostrando <strong className="text-sky-500">{filteredLocations.length}</strong> ubicaciones
        </div>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLocations.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800 text-slate-500">
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">No se encontraron ubicaciones</p>
            <p className="text-xs text-slate-400 mt-1">Prueba con otro nombre o término.</p>
          </div>
        ) : (
          filteredLocations.map(loc => {
            const isSelected = selectedLocId === loc.id;

            return (
              <div
                key={loc.id}
                id={loc.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-sky-950/20 border-sky-500/50 shadow-lg'
                    : 'bg-white dark:bg-[#13141c] border-slate-200 dark:border-slate-800/80 hover:border-sky-500/40 shadow-sm'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {loc.region}
                    </span>
                    <MapPin className="w-4 h-4 text-sky-500" />
                  </div>

                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {loc.name}
                  </h3>

                  {/* Wild Pokemon preview */}
                  {loc.pokemonAvailable.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Pokémon Disponibles ({loc.pokemonAvailable.length}):</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {loc.pokemonAvailable.slice(0, 6).map((p, i) => (
                          <Link
                            key={i}
                            to={`/pokemon/${p.id}`}
                            className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 hover:text-white transition-colors text-slate-700 dark:text-slate-300"
                          >
                            {p.pokemon}
                          </Link>
                        ))}
                        {loc.pokemonAvailable.length > 6 && (
                          <span className="text-[10px] text-slate-400 font-mono self-center">
                            +{loc.pokemonAvailable.length - 6} más
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Trainers preview */}
                  {loc.trainers.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Swords className="w-3 h-3 text-rose-500" />
                        <span>Combates Registrados ({loc.trainers.length}):</span>
                      </div>
                      <div className="space-y-1">
                        {loc.trainers.slice(0, 3).map((t, i) => (
                          <Link
                            key={i}
                            to={`/niveles?battle=${t.battleId}`}
                            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-rose-500 truncate"
                          >
                            • {t.trainer}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sidequests preview */}
                  {loc.sidequests.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-emerald-500" />
                        <span>Misiones Secundarias:</span>
                      </div>
                      <div className="space-y-1">
                        {loc.sidequests.map((s, i) => (
                          <Link
                            key={i}
                            to={`/secundarias?quest=${s.questId}`}
                            className="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline truncate"
                          >
                            • {s.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Source */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">ID: <code className="font-mono text-sky-500">{loc.id}</code></span>
                  <SourceButton
                    source={loc.source || 'INFORMACIÓN ÚTIL/POKÉMON/OBTENCIÓN  TODOS  PKMN.txt'}
                    confidence="CONFIRMADO"
                    title={`Ubicación: ${loc.name}`}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
