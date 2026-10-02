import React, { useState } from 'react';
import { HelpCircle, DollarSign, Sparkles, Zap, ShieldCheck, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import qolData from '../data/qol.json';
import { QolSection, FAQItem } from '../types';
import { SourceButton } from '../components/SourceModal';

export const QolPage: React.FC = () => {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const qolList = (qolData as any).qol as QolSection[];
  const faqs = (qolData as any).faqs as FAQItem[];

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-950/40 via-[#13141c] to-slate-900 border border-teal-900/40 text-white shadow-xl">
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-teal-500" />
            <span>Guías Rápidas, Farmeo & Preguntas Frecuentes</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Calidad de Vida (QoL) & Farmeo
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Mecánicas de conveniencia, farmeo de dinero, caramelos raros, modificador de IVs al máximo, cambios de naturalezas y resolución de dudas comunes extraídas directamente de los documentos del hackrom.
          </p>
        </div>
      </div>

      {/* QoL Sections */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-500" />
            <span>Mecánicas y Farmeo Eficiente</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {qolList.map((sec, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  <span>{sec.title}</span>
                </h3>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed border border-slate-100 dark:border-slate-800/80">
                  {sec.content}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <SourceButton source={sec.source} confidence="CONFIRMADO" title={`QoL: ${sec.title}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-rose-500" />
            <span>Preguntas Frecuentes (FAQ Oficial)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Respuestas a los bloqueos de historia y dudas más habituales de los jugadores.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, fIdx) => {
            const isOpen = openFaqIdx === fIdx;

            return (
              <div
                key={fIdx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#13141c] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : fIdx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left select-none"
                >
                  <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {faq.question}
                  </span>
                  <span className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 flex-shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800/80 space-y-3 animate-fadeIn text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    <p>{faq.answer}</p>
                    <div className="pt-2 flex justify-end">
                      <SourceButton source={faq.source} confidence="CONFIRMADO" title="FAQ" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
