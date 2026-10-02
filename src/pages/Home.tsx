import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Swords, BookOpen, Sparkles, MapPin, Package, Zap, 
  HelpCircle, ShieldCheck, ArrowRight, CheckCircle2, ChevronRight, Award
} from 'lucide-react';
import metaData from '../data/game_meta.json';
import { GlobalSearchModal } from '../components/GlobalSearchModal';

export const Home: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [heroSearch, setHeroSearch] = useState('');
  const navigate = useNavigate();

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      setIsSearchOpen(true);
    }
  };

  const arcs = [
    {
      id: 'kanto',
      title: 'Temporada 1: Kanto',
      desc: 'El ascenso en la organización, asalto a Silph S.A., base de Azultepec y misiones clandestinas.',
      battles: '58 combates',
      levelRange: 'Nv. 7 - 50',
      to: '/niveles?arc=T1 - KANTO',
      color: 'from-red-600 to-rose-700'
    },
    {
      id: 'archi7',
      title: 'Temporada 2: Archi7 / Sevii',
      desc: 'Operaciones en las Islas Sete, Mt. Ascuas, Cueva Perdida y aparición de Prototipos Rocket.',
      battles: '28 combates',
      levelRange: 'Nv. 50 - 65',
      to: '/niveles?arc=T2 - ARCHI7',
      color: 'from-amber-600 to-orange-700'
    },
    {
      id: 'johto',
      title: 'Temporada 3: Johto',
      desc: 'Invasión a la región de Johto, Pozos Slowpoke, Torre Radio Lavanda e integración del mapa completo.',
      battles: '48 combates',
      levelRange: 'Nv. 65 - 85',
      to: '/niveles?arc=T3 - JOHTO',
      color: 'from-emerald-600 to-teal-700'
    },
    {
      id: 'dlc',
      title: 'Temporada 4: DLC Johto / Dun',
      desc: 'Misiones especiales del Lago Furia, Vías de Tren, Ruta 47, Torre Dun y secretos de Giovanni.',
      battles: '39 combates',
      levelRange: 'Nv. 85 - 100',
      to: '/niveles?arc=T4 - DLC',
      color: 'from-purple-600 to-indigo-700'
    },
    {
      id: 'hoenn',
      title: 'Temporada 5: Hoenn & Postgame',
      desc: 'Monte Cenizo, líderes de Hoenn, Frente de Batalla y combates legendarios de nivel extremo.',
      battles: '40 combates',
      levelRange: 'Nv. 100 - 130',
      to: '/niveles?arc=T5 - HOENN',
      color: 'from-rose-600 to-pink-700'
    },
  ];

  const features = [
    {
      icon: Swords,
      title: 'Niveles Normal vs Difícil',
      desc: 'Comparador exhaustivo de cada combate de jefe con EVs, IVs, objetos, movimientos y cambios reales.',
      to: '/niveles',
      badge: '213 Combates'
    },
    {
      icon: BookOpen,
      title: 'Misiones Secundarias (Checklist)',
      desc: 'Guía de todas las secundarias por región con checklist interactivo que guarda tu progreso en el navegador.',
      to: '/secundarias',
      badge: '27 Misiones'
    },
    {
      icon: Sparkles,
      title: 'Pokédex & Formas Especiales',
      desc: 'Experimentos Rocket (-X, -Y), Fuertes Vínculo (-&), Nuevas Megaevoluciones y Pokémon Antiguos.',
      to: '/pokemon',
      badge: '1,241 Pokémon'
    },
    {
      icon: Award,
      title: 'Guía 100% de Obtención',
      desc: 'Descubre cómo y dónde conseguir cada Pokémon sin información inventada ni genérica.',
      to: '/obtencion',
      badge: '100% Verificado'
    },
    {
      icon: MapPin,
      title: 'Mapas & Rutas',
      desc: 'Zonas de Kanto, Sevii, Johto y Hoenn con Pokémon salvajes, entrenadores, objetos y eventos asociados.',
      to: '/mapas',
      badge: '200 Ubicaciones'
    },
    {
      icon: Package,
      title: 'Objetos & Tiendas Rocket',
      desc: 'Piedras Sagradas, Piedras Rocket, Mega Piedras, cambios de balance y catálogo de bases.',
      to: '/objetos',
      badge: '402 Objetos'
    },
    {
      icon: Zap,
      title: 'Cambios en Movimientos',
      desc: 'Tabla comparativa de movimientos modificados con potencia, precisión, PP y efectos hackrom.',
      to: '/movimientos',
      badge: '46 Modificados'
    },
    {
      icon: HelpCircle,
      title: 'Farmeo & Guías QoL',
      desc: 'Métodos óptimos de farmeo de dinero, caramelos de experiencia, modificador de IVs y respuestas a dudas.',
      to: '/qol',
      badge: 'Guías Rápidas'
    }
  ];

  return (
    <div className="space-y-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-16 md:py-20 rounded-3xl bg-gradient-to-b from-slate-900 via-[#13141c] to-[#0d0e12] border border-slate-800 text-white shadow-2xl">
        {/* Decorative background lights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-rose-600/15 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-red-900/10 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs sm:text-sm font-semibold tracking-wide animate-pulse">
            <ShieldCheck className="w-4 h-4 text-rose-500" />
            <span>Datos 100% extraídos de los archivos oficiales del juego</span>
          </div>

          {/* Titles */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
              GUÍA 100% — <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-red-500 to-amber-500">Pokémon Edición Team Rocket</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
              Explora todos los datos, niveles, Pokémon, misiones y secretos encontrados directamente en los archivos del juego.
            </p>
          </div>

          {/* Hero Search Box */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleHeroSubmit} className="relative flex items-center">
              <input
                type="text"
                value={heroSearch}
                onChange={e => setHeroSearch(e.target.value)}
                onClick={() => setIsSearchOpen(true)}
                placeholder="Buscar por Pokémon, jefe, ruta, misión, objeto o movimiento..."
                className="w-full pl-12 pr-28 sm:pr-36 py-4 rounded-2xl bg-white/10 dark:bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:border-rose-500 shadow-xl transition-all cursor-pointer"
              />
              <Search className="absolute left-4 w-5 h-5 text-rose-400" />
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="absolute right-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Buscador</span>
                <ArrowRight className="w-4 h-4 hidden sm:inline" />
              </button>
            </form>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-400">
              <span className="text-slate-500">Búsquedas populares:</span>
              <button onClick={() => setIsSearchOpen(true)} className="hover:text-rose-400 underline decoration-slate-600">Pikachu</button>
              <span>•</span>
              <button onClick={() => setIsSearchOpen(true)} className="hover:text-rose-400 underline decoration-slate-600">Nidoking-X</button>
              <span>•</span>
              <button onClick={() => setIsSearchOpen(true)} className="hover:text-rose-400 underline decoration-slate-600">Giovanni</button>
              <span>•</span>
              <button onClick={() => setIsSearchOpen(true)} className="hover:text-rose-400 underline decoration-slate-600">Piedra Sagrada</button>
              <span>•</span>
              <button onClick={() => setIsSearchOpen(true)} className="hover:text-rose-400 underline decoration-slate-600">Lago Furia</button>
            </div>
          </div>

          {/* Live Metrics Counter */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-6 border-t border-slate-800/80">
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <div className="text-xl sm:text-2xl font-black text-rose-400">{metaData.counts.totalPokemon}</div>
              <div className="text-[11px] text-slate-400 font-medium">Pokémon</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <div className="text-xl sm:text-2xl font-black text-amber-400">{metaData.counts.totalBattles}</div>
              <div className="text-[11px] text-slate-400 font-medium">Combates de Jefe</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">{metaData.counts.totalSidequests}</div>
              <div className="text-[11px] text-slate-400 font-medium">Misiones Sec.</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <div className="text-xl sm:text-2xl font-black text-sky-400">{metaData.counts.totalLocations}</div>
              <div className="text-[11px] text-slate-400 font-medium">Ubicaciones</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <div className="text-xl sm:text-2xl font-black text-purple-400">{metaData.counts.totalItems}</div>
              <div className="text-[11px] text-slate-400 font-medium">Objetos</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <div className="text-xl sm:text-2xl font-black text-orange-400">{metaData.counts.totalMovesModified}</div>
              <div className="text-[11px] text-slate-400 font-medium">Mov. Balanceados</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 STORY ARCS SECTION */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Swords className="w-6 h-6 text-rose-500" />
              <span>Temporadas y Progresión de Historia</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Todos los combates de la aventura estructurados por temporadas con equipos exactos para Modo Normal y Difícil.
            </p>
          </div>
          <Link
            to="/niveles"
            className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300"
          >
            <span>Ver todos los combates</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {arcs.map(arc => (
            <Link
              key={arc.id}
              to={arc.to}
              className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 dark:hover:border-rose-500/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {arc.battles}
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                    {arc.levelRange}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors">
                  {arc.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {arc.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400 group-hover:translate-x-1 transition-transform">
                <span>Explorar combates</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CORE GUIDE FEATURES GRID */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-rose-500" />
            <span>Módulos de la Base de Datos</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Herramientas interactivas diseñadas para consultar cualquier aspecto del juego al instante.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, idx) => (
            <Link
              key={idx}
              to={f.to}
              className="group p-5 rounded-2xl bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {f.badge}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {f.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-rose-500">
                <span>Acceder</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ROCKET SPECIAL FORMS SHOWCASE */}
      <section className="p-8 rounded-3xl bg-gradient-to-r from-rose-900/20 via-red-950/20 to-slate-900/40 border border-rose-800/30">
        <div className="max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Novedades Exclusivas del Hackrom
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Experimentos Rocket, Fuertes Vínculo y Nuevas Megas
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Esta edición incluye creaciones científicas de la Corporación Silph y el Team Rocket como los prototipos <strong>Nidoking-X</strong>, <strong>Nidoqueen-Y</strong>, <strong>Electrode-Y</strong>, <strong>Tauros-X</strong> (+100 Stats Base), transformaciones por Fuerte Vínculo (<strong>Rhyperior-&</strong>, <strong>Hypno-&</strong>, <strong>Butterfree-&</strong>), nuevas Megaevoluciones (<strong>Mega Butterfree</strong>, <strong>Mega Starmie</strong>, <strong>Mega Flygon</strong>, <strong>Mega Milotic</strong>) y formas Antiguas/Beta como <strong>Maroghost</strong> y <strong>Guardia</strong>.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/pokemon?category=Experimento Rocket"
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-md"
            >
              Ver Experimentos Rocket
            </Link>
            <Link
              to="/pokemon?category=Fuerte Vínculo"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
            >
              Ver Fuertes Vínculo
            </Link>
            <Link
              to="/pokemon?category=Nueva Megaevolución"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
            >
              Ver Nuevas Megas
            </Link>
          </div>
        </div>
      </section>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};
