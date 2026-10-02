import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Swords, MapPin, CheckSquare, Package, Zap, ChevronRight } from 'lucide-react';
import pokemonData from '../data/pokemon.json';
import levelsData from '../data/levels.json';
import sidequestsData from '../data/sidequests.json';
import locationsData from '../data/locations.json';
import itemsData from '../data/items.json';
import movesData from '../data/moves.json';
import { SearchResult } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Index and search items
  const results: SearchResult[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const items: SearchResult[] = [];

    // 1. Pokemon (Name, number, category, obtaining)
    (pokemonData as any[]).forEach(p => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchNum = String(p.dexNumber).toLowerCase().includes(q);
      const matchCategory = (p.category || '').toLowerCase().includes(q);
      const matchObt = (p.obtaining?.description || '').toLowerCase().includes(q);
      if (matchName || matchNum || matchCategory || matchObt) {
        items.push({
          type: 'pokemon',
          id: p.id,
          title: p.name,
          subtitle: `#${p.dexNumber} • ${p.category || 'Estándar'} • ${p.obtaining?.method || ''}`,
          url: `/pokemon/${p.id}`,
          badge: 'Pokémon'
        });
      }
    });

    // 2. Boss Battles (Trainer, location, arc)
    (levelsData as any[]).forEach(b => {
      const matchTrainer = b.trainer.toLowerCase().includes(q);
      const matchLoc = b.location.toLowerCase().includes(q);
      const matchArc = b.arcName.toLowerCase().includes(q);
      if (matchTrainer || matchLoc || matchArc) {
        items.push({
          type: 'battle',
          id: b.id,
          title: b.trainer,
          subtitle: `${b.arcName} • ${b.location} (Nv. ${b.minLevel}-${b.maxLevel})`,
          url: `/niveles?battle=${b.id}`,
          badge: 'Combate'
        });
      }
    });

    // 3. Sidequests (Title, region, description, rewards)
    (sidequestsData as any[]).forEach(s => {
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchReg = s.region.toLowerCase().includes(q);
      const matchDesc = s.description.toLowerCase().includes(q);
      const matchRew = (s.rewards || []).some((r: string) => r.toLowerCase().includes(q));
      if (matchTitle || matchReg || matchDesc || matchRew) {
        items.push({
          type: 'sidequest',
          id: s.id,
          title: s.title,
          subtitle: `Región: ${s.region} • Recompensa: ${(s.rewards || []).join(', ')}`,
          url: `/secundarias?quest=${s.id}`,
          badge: 'Misión'
        });
      }
    });

    // 4. Locations
    (locationsData as any[]).forEach(l => {
      if (l.name.toLowerCase().includes(q)) {
        items.push({
          type: 'location',
          id: l.id,
          title: l.name,
          subtitle: `${l.region} • ${l.pokemonAvailable?.length || 0} Pokémon • ${l.trainers?.length || 0} Entrenadores`,
          url: `/mapas?loc=${l.id}`,
          badge: 'Ubicación'
        });
      }
    });

    // 5. Items
    (itemsData as any[]).forEach(it => {
      if (it.name.toLowerCase().includes(q) || (it.category || '').toLowerCase().includes(q)) {
        items.push({
          type: 'item',
          id: it.id,
          title: it.name,
          subtitle: `${it.category} • ${it.description?.slice(0, 70)}...`,
          url: `/objetos?item=${it.id}`,
          badge: 'Objeto'
        });
      }
    });

    // 6. Moves
    (movesData as any[]).forEach(m => {
      if (m.name.toLowerCase().includes(q)) {
        items.push({
          type: 'move',
          id: m.id,
          title: m.name,
          subtitle: `Tipo ${m.hackrom?.type || m.official?.type || 'Normal'} • Potencia: ${m.hackrom?.power || m.official?.power || '-'}`,
          url: `/movimientos?move=${m.id}`,
          badge: 'Movimiento'
        });
      }
    });

    return items.slice(0, 30);
  }, [query]);

  const handleSelect = (item: SearchResult) => {
    navigate(item.url);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'pokemon': return <span className="w-5 h-5 flex items-center justify-center font-bold text-rose-500">⚡</span>;
      case 'battle': return <Swords className="w-4 h-4 text-amber-500" />;
      case 'sidequest': return <CheckSquare className="w-4 h-4 text-emerald-500" />;
      case 'location': return <MapPin className="w-4 h-4 text-sky-500" />;
      case 'item': return <Package className="w-4 h-4 text-purple-500" />;
      case 'move': return <Zap className="w-4 h-4 text-orange-500" />;
      default: return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-rose-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Buscar Pokémon, jefe, entrenador, ruta, misión, objeto, movimiento..."
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm md:text-base outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/40">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-sm">
              <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Buscador Global del Team Rocket</p>
              <p className="text-xs">Escribe el nombre de un Pokémon (ej: Pikachu, Nidoking-X), jefe (ej: Giovanni, Andra), misión o ruta.</p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center text-xs">
                <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800/60 cursor-pointer hover:text-rose-500" onClick={() => setQuery('Pikachu')}>Pikachu</span>
                <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800/60 cursor-pointer hover:text-rose-500" onClick={() => setQuery('Giovanni')}>Giovanni</span>
                <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800/60 cursor-pointer hover:text-rose-500" onClick={() => setQuery('Experimento')}>Experimentos Rocket</span>
                <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800/60 cursor-pointer hover:text-rose-500" onClick={() => setQuery('Piedra Sagrada')}>Piedra Sagrada</span>
                <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800/60 cursor-pointer hover:text-rose-500" onClick={() => setQuery('Silph')}>Silph S.A.</span>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              <p className="font-medium text-slate-700 dark:text-slate-300">No se encontraron resultados para &quot;{query}&quot;</p>
              <p className="text-xs text-slate-400 mt-1">Prueba con otro término de búsqueda verificado en los archivos del juego.</p>
            </div>
          ) : (
            results.map((item, idx) => (
              <div
                key={`${item.type}-${item.id}-${idx}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                  selectedIndex === idx
                    ? 'bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex-shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                        {item.title}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex-shrink-0">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" />
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex justify-between items-center">
          <div className="flex gap-3">
            <span><kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">↑</kbd> <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">↓</kbd> Navegar</span>
            <span><kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">Enter</kbd> Seleccionar</span>
            <span><kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">Esc</kbd> Cerrar</span>
          </div>
          <span className="text-rose-500 font-semibold">{results.length} coincidencias</span>
        </div>
      </div>
    </div>
  );
};
