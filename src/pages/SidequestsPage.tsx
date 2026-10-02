import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  BookOpen, CheckSquare, Square, Search, Filter, Gift, 
  Video, ShieldCheck, CheckCircle2, RotateCcw, ChevronDown, ChevronUp 
} from 'lucide-react';
import sidequestsData from '../data/sidequests.json';
import { Sidequest } from '../types';
import { SourceButton } from '../components/SourceModal';

export const SidequestsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedRegion, setSelectedRegion] = useState<string>('TODAS');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedQuestId, setExpandedQuestId] = useState<string | null>(() => searchParams.get('quest') || null);

  const quests = sidequestsData as Sidequest[];

  // LocalStorage for checklist progress
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('rocket_sidequests_progress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('rocket_sidequests_progress', JSON.stringify(completedSteps));
  }, [completedSteps]);

  const toggleStep = (stepKey: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepKey]: !prev[stepKey]
    }));
  };

  const isQuestFullyCompleted = (quest: Sidequest) => {
    if (!quest.steps || quest.steps.length === 0) return false;
    return quest.steps.every((_, idx) => completedSteps[`${quest.id}-step-${idx}`]);
  };

  const resetAllProgress = () => {
    if (window.confirm('¿Estás seguro de que deseas reiniciar el progreso de todas las misiones secundarias?')) {
      setCompletedSteps({});
    }
  };

  const regions = [
    { id: 'TODAS', label: 'Todas las Regiones' },
    { id: 'ISLA INTA', label: 'Isla Inta' },
    { id: 'KANTO', label: 'Kanto' },
    { id: 'SEVII', label: 'Sevii / Archi7' },
    { id: 'JOHTO', label: 'Johto' },
    { id: 'JOHTO DLC', label: 'Johto DLC' },
    { id: 'HOENN', label: 'Hoenn' },
  ];

  // Filtered quests
  const filteredQuests = useMemo(() => {
    return quests.filter(q => {
      if (selectedRegion !== 'TODAS' && !q.region.toUpperCase().includes(selectedRegion)) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = q.title.toLowerCase().includes(query);
        const matchDesc = q.description.toLowerCase().includes(query);
        const matchRew = (q.rewards || []).some(r => r.toLowerCase().includes(query));
        const matchReg = q.region.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchRew && !matchReg) return false;
      }
      return true;
    });
  }, [quests, selectedRegion, searchQuery]);

  // Overall progress stats
  const totalCompletedQuests = quests.filter(isQuestFullyCompleted).length;
  const progressPercent = Math.round((totalCompletedQuests / quests.length) * 100) || 0;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-[#13141c] to-slate-900 border border-emerald-900/40 text-white shadow-xl">
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
            <span>Guía 100% de Misiones Secundarias</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Misiones Secundarias & Recompensas
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Checklist interactivo de todas las misiones secundarias del juego extraídas de <code className="text-emerald-400 font-mono">SECUNDARIAS TRE.pdf</code>. Puedes marcar los pasos completados y tu progreso se guardará automáticamente en tu navegador.
          </p>

          {/* Progress Tracker Bar */}
          <div className="pt-4 max-w-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300">Progreso Total de Secundarias:</span>
              <span className="text-emerald-400 font-mono font-bold">
                {totalCompletedQuests} / {quests.length} completadas ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700/50">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, NPC, objeto, recompensa..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-emerald-500"
            />
          </div>

          {/* Region Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {regions.map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRegion(r.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedRegion === r.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Reset progress */}
          <button
            onClick={resetAllProgress}
            className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reiniciar checklist de misiones"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quests List */}
      <div className="space-y-4">
        {filteredQuests.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#13141c] border border-slate-200 dark:border-slate-800 text-slate-500">
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">No se encontraron misiones</p>
            <p className="text-xs text-slate-400 mt-1">Prueba a buscar otro término o selecciona otra región.</p>
          </div>
        ) : (
          filteredQuests.map((quest, qIdx) => {
            const isCompleted = isQuestFullyCompleted(quest);
            const isExpanded = expandedQuestId === quest.id;

            return (
              <div
                key={quest.id}
                id={quest.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isCompleted
                    ? 'bg-emerald-950/10 border-emerald-500/40 dark:border-emerald-500/30'
                    : 'bg-white dark:bg-[#13141c] border-slate-200 dark:border-slate-800/80'
                }`}
              >
                {/* Header */}
                <div
                  onClick={() => setExpandedQuestId(isExpanded ? null : quest.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-600 text-white font-mono">
                        {quest.region}
                      </span>
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          Completada
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      {quest.title}
                    </h3>

                    {quest.prerequisites && quest.prerequisites !== 'Disponible en el desarrollo natural de la región.' && (
                      <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                        ⚠️ Prerrequisito: {quest.prerequisites}
                      </div>
                    )}
                  </div>

                  {/* Rewards preview chip */}
                  <div className="flex items-center gap-3">
                    <div className="hidden md:flex flex-wrap gap-1 max-w-xs justify-end">
                      {quest.rewards.map((r, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200/40 dark:border-rose-900/30 font-medium">
                          🎁 {r}
                        </span>
                      ))}
                    </div>

                    <button className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details & Checklist */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-5 animate-fadeIn">
                    
                    {/* Description */}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Descripción & Objetivo:
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/80">
                        {quest.description}
                      </p>
                    </div>

                    {/* Interactive Checklist Steps */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Pasos de la Misión (Checklist):
                      </div>
                      <div className="space-y-1.5">
                        {quest.steps.map((step, sIdx) => {
                          const stepKey = `${quest.id}-step-${sIdx}`;
                          const isDone = !!completedSteps[stepKey];

                          return (
                            <div
                              key={sIdx}
                              onClick={() => toggleStep(stepKey)}
                              className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer border transition-all select-none ${
                                isDone
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-400 line-through'
                                  : 'bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 text-slate-800 dark:text-slate-200'
                              }`}
                            >
                              <div className="mt-0.5 text-emerald-500 flex-shrink-0">
                                {isDone ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                              </div>
                              <span className="text-xs font-medium leading-relaxed">
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Rewards List */}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                        <Gift className="w-4 h-4 text-rose-500" />
                        <span>Recompensas al Completar:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {quest.rewards.map((r, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500/10 to-red-500/10 border border-rose-500/20 text-xs font-bold text-rose-600 dark:text-rose-400 shadow-sm"
                          >
                            <span>⭐</span>
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Video Tutorial reference if present */}
                    {quest.videoTutorial && (
                      <div className="text-xs text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                        <Video className="w-4 h-4" />
                        <span>Video Tutorial de referencia: <strong>{quest.videoTutorial}</strong></span>
                      </div>
                    )}

                    {/* Footer / Source Button */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">ID Misión: <code className="font-mono text-rose-500">{quest.id}</code></span>
                      <SourceButton
                        source={quest.source}
                        confidence={quest.confidence}
                        title={`Misión: ${quest.title}`}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
