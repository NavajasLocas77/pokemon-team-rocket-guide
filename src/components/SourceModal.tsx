import React, { useState } from 'react';
import { FileCode, CheckCircle2, AlertTriangle, X, ShieldCheck } from 'lucide-react';

interface SourceModalProps {
  source: string;
  confidence?: 'CONFIRMADO' | 'PARCIAL' | 'NO DISPONIBLE';
  details?: string;
  title?: string;
}

export const SourceButton: React.FC<SourceModalProps> = ({
  source,
  confidence = 'CONFIRMADO',
  details,
  title = 'Fuente del Dato'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono rounded bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-300/50 dark:border-slate-700/50"
        title="Ver archivo de origen y verificación de autenticidad"
      >
        <FileCode className="w-3 h-3 text-rose-500" />
        <span>Ver fuente</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-6 overflow-hidden">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Verificación de datos del proyecto</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Estado de Autenticidad:</span>
                <div className="mt-1 flex items-center gap-2">
                  {confidence === 'CONFIRMADO' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      CONFIRMADO en archivos del juego
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {confidence}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Archivo de Origen:</span>
                <div className="mt-1 p-2.5 rounded-lg bg-slate-100 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-300 break-all border border-slate-200 dark:border-slate-800">
                  {source}
                </div>
              </div>

              {details && (
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Notas de Extracción:</span>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700/50">
                    {details}
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                ℹ️ Esta información fue extraída y verificada directamente de la carpeta oficial del juego <code className="text-rose-500">Pokemon TRE 2026 - Dragonsden</code>.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
