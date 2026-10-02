import React from 'react';
import { Info, Heart, ShieldCheck, Award, ExternalLink, Code2 } from 'lucide-react';
import metaData from '../data/game_meta.json';

export const AboutPage: React.FC = () => {
  const credits = [
    {
      name: 'Colonelsalt',
      role: 'Creador original de Pokémon Team Rocket Edition (Inglés)',
      desc: 'Inspirador del proyecto por expandir el potencial de la región de Kanto desde 2019.'
    },
    {
      name: 'Dragonsden',
      role: 'Creador & Director de Pokémon TRE 2026',
      desc: 'Desarrollador principal del hackrom, diseñador de niveles, historia, combates, prototipos y misiones.'
    },
    {
      name: '@kakarotto',
      role: 'Programador & Co-creador de Johto',
      desc: 'Desarrollo de mecánicas de IVs, ascensos de overworld, inserción del mapa completo de Johto con puntos de vuelo y cura.'
    },
    {
      name: 'Xiros',
      role: 'Desarrollo de Motor (Pokeemerald Expansion)',
      desc: 'Actualización técnica del proyecto al motor pokeemerald expansion más moderno, liberación de memoria y soporte.'
    },
    {
      name: '@KevinXDE & @Polar',
      role: 'Testers & Decompilación',
      desc: 'Testing exhaustivo de las temporadas de Johto y DLC, resolución de bugs de script y balance.'
    },
    {
      name: 'Alexander Daniel & Scar\'99',
      role: 'Sprites, Minis & Arte',
      desc: 'Creación de infinidad de recursos gráficos de personajes, overworlds y texturas.'
    },
    {
      name: 'Cakezy',
      role: 'Animación de Sprites',
      desc: 'Animación de Megaevoluciones, Fuertes Vínculo, Experimentos Rocket y Pokémon Antiguos.'
    },
    {
      name: 'Compumax',
      role: 'Expansión de Cajas del PC',
      desc: 'Ampliación de cajas del sistema de almacenamiento de 14 a 24 compartimentos.'
    }
  ];

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#13141c] to-slate-900 border border-slate-800 text-white shadow-xl">
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
            <Info className="w-3.5 h-3.5 text-rose-500" />
            <span>Acerca del Proyecto & Créditos Oficiales</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Pokémon Edición Team Rocket
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Esta guía interactiva es un tributo a la enorme labor comunitaria detrás de <strong>Pokémon TRE 2026</strong>. Todo el contenido ha sido organizado para ofrecer a los jugadores la herramienta más precisa, verídica y accesible posible.
          </p>
        </div>
      </div>

      {/* Philosophy Box */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800 space-y-3">
        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-rose-500" />
          <span>Filosofía de la Guía: 100% Datos Reales</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          A diferencia de otras páginas de internet que mezclan datos genéricos de Pokémon Rojo Fuego original o suposiciones, esta web utiliza una <strong>capa de datos desacoplada y auditada automáticamente</strong> extraída directamente de los archivos provistos por el creador del hackrom. Cada estadística, combate, método de obtención y recompensa cita su archivo fuente exacto.
        </p>
      </div>

      {/* Credits Team Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>Créditos de Desarrolladores & Colaboradores</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {credits.map((c, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {c.name}
                </h4>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  {c.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
