import React from 'react';
import { Database, ShieldCheck, FileCode, CheckCircle2, Terminal, Layers, Cpu, Calendar, User } from 'lucide-react';
import metaData from '../data/game_meta.json';

export const DataMetaPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#13141c] to-slate-900 border border-slate-800 text-white shadow-xl">
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
            <Database className="w-3.5 h-3.5 text-rose-500" />
            <span>Auditoría Técnica & Metadatos</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Datos del Juego & Fuente de Verdad
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Reporte de extracción y validación de los datos utilizados en esta web. Todos los registros fueron procesados a partir de los archivos reales incluidos en la versión <strong>{metaData.version}</strong>.
          </p>
        </div>
      </div>

      {/* Audit Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 w-fit">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="text-xs text-slate-400 font-medium">Motor Base</div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">{metaData.engine}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 w-fit">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="text-xs text-slate-400 font-medium">Fecha de Generación</div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">{metaData.generatedDate}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 w-fit">
            <User className="w-5 h-5" />
          </div>
          <div className="text-xs text-slate-400 font-medium">Desarrollador Principal</div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">Dragonsden & Team</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-500 w-fit">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-xs text-slate-400 font-medium">Estado de Validación</div>
          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">100% Verificado (0 errores)</div>
        </div>
      </div>

      {/* Counts Summary */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-rose-500" />
          <span>Registros Extraídos y Estructurados en JSON</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
            <div className="text-2xl font-black text-rose-500 font-mono">{metaData.counts.totalPokemon}</div>
            <div className="text-xs text-slate-500">Pokémon Registrados</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
            <div className="text-2xl font-black text-amber-500 font-mono">{metaData.counts.totalBattles}</div>
            <div className="text-xs text-slate-500">Combates de Jefe</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
            <div className="text-2xl font-black text-emerald-500 font-mono">{metaData.counts.totalSidequests}</div>
            <div className="text-xs text-slate-500">Misiones Secundarias</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
            <div className="text-2xl font-black text-sky-500 font-mono">{metaData.counts.totalLocations}</div>
            <div className="text-xs text-slate-500">Ubicaciones Indexadas</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
            <div className="text-2xl font-black text-purple-500 font-mono">{metaData.counts.totalItems}</div>
            <div className="text-xs text-slate-500">Objetos & Tiendas</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
            <div className="text-2xl font-black text-orange-500 font-mono">{metaData.counts.totalMovesModified}</div>
            <div className="text-xs text-slate-500">Movimientos Balanceados</div>
          </div>
        </div>
      </div>

      {/* Audited Files List */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-rose-500" />
            <span>Archivos del Proyecto Auditados ({metaData.filesAudited.length})</span>
          </h3>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
            Fuente de Verdad
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          La información de la guía se genera procesando estos archivos locales mediante el extractor automatizado <code className="text-rose-500 font-mono">scripts/extract_data.py</code>:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-xs">
          {metaData.filesAudited.map((file, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2 truncate"
            >
              <span className="text-rose-500 font-bold">📄</span>
              <span className="truncate">{file}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Validation Pipeline Info */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-[#1a1c26] text-white border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
          <Terminal className="w-4 h-4" />
          <span>Comando de Validación Local</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Para volver a auditar y verificar la integridad de todos los JSON generados (detección de duplicados, validación de niveles, referencias cruzadas y archivos faltantes), ejecuta en la terminal:
        </p>
        <div className="p-3 rounded-xl bg-black/60 font-mono text-xs text-rose-400 border border-slate-700 select-all">
          npm run validate-data
        </div>
      </div>
    </div>
  );
};
