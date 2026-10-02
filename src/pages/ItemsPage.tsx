import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Package, Search, Filter, Sparkles, ShieldCheck, ShoppingBag, Zap, RefreshCw } from 'lucide-react';
import itemsData from '../data/items.json';
import { Item } from '../types';
import { SourceButton } from '../components/SourceModal';

export const ItemsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>(() => searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');

  const items = itemsData as Item[];

  const categories = [
    { id: 'TODAS', label: 'Todos los Objetos' },
    { id: 'PIEDRAS EVOLUTIVAS', label: '🔮 Piedras Evolutivas' },
    { id: 'OBJETOS POTENCIADORES DE CIERTOS PKMN', label: '⭐ Potenciadores de Pokémon' },
    { id: 'OBJETOS CUYO EFECTO COMPETITIVO SE HA MODIFICADO', label: '⚔️ Cambios Competitivos' },
    { id: 'TIENDAS ROCKET', label: '🏪 Tiendas & Catálogos Rocket' },
  ];

  const filteredItems = useMemo(() => {
    return items.filter(it => {
      if (selectedCategory !== 'TODAS') {
        if (!it.category.toUpperCase().includes(selectedCategory)) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = it.name.toLowerCase().includes(q);
        const matchDesc = it.description.toLowerCase().includes(q);
        const matchCat = it.category.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchCat) return false;
      }
      return true;
    });
  }, [items, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#13141c] to-slate-900 border border-purple-900/40 text-white shadow-xl">
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
            <Package className="w-3.5 h-3.5 text-purple-500" />
            <span>Guía de Objetos, Piedras y Tiendas</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Objetos, Piedras Evolutivas & Tiendas Rocket
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Catálogo completo de objetos, piedras sagradas/rocket, mega piedras, potenciadores exclusivos y catálogo de tiendas clandestinas de la organización.
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
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por objeto (ej: Piedra Sagrada, Mejora, Super Mineral)..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-purple-500"
          />
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Mostrando <strong className="text-purple-500">{filteredItems.length}</strong> de {items.length} objetos
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800 text-slate-500">
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">No se encontraron objetos</p>
            <p className="text-xs text-slate-400 mt-1">Prueba con otro término o selecciona otra categoría.</p>
          </div>
        ) : (
          filteredItems.map(it => (
            <div
              key={it.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800/80 hover:border-purple-500/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    {it.category.slice(0, 30)}
                  </span>
                  <Package className="w-4 h-4 text-purple-500" />
                </div>

                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {it.name}
                </h3>

                {/* Changes if any */}
                {it.changes && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 font-medium">
                    <span className="font-bold">Efecto Especial Hackrom: </span>
                    {it.changes}
                  </div>
                )}

                {/* Obtaining info */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold text-slate-500 dark:text-slate-400 block mb-1 text-[11px] uppercase tracking-wider">
                    Obtención / Ubicación:
                  </span>
                  <p>{it.obtaining || it.description}</p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">ID: <code className="font-mono text-purple-500">{it.id}</code></span>
                <SourceButton
                  source={it.source}
                  confidence={it.confidence}
                  title={`Objeto: ${it.name}`}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
