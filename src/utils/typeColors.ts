export const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  acero: { bg: 'bg-slate-500', text: 'text-white', border: 'border-slate-400' },
  agua: { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-400' },
  bicho: { bg: 'bg-lime-600', text: 'text-white', border: 'border-lime-400' },
  dragon: { bg: 'bg-indigo-700', text: 'text-white', border: 'border-indigo-400' },
  dragón: { bg: 'bg-indigo-700', text: 'text-white', border: 'border-indigo-400' },
  electrico: { bg: 'bg-yellow-400', text: 'text-slate-900', border: 'border-yellow-300' },
  eléctrico: { bg: 'bg-yellow-400', text: 'text-slate-900', border: 'border-yellow-300' },
  fantasma: { bg: 'bg-purple-800', text: 'text-white', border: 'border-purple-400' },
  fuego: { bg: 'bg-amber-600', text: 'text-white', border: 'border-amber-400' },
  hada: { bg: 'bg-pink-400', text: 'text-slate-900', border: 'border-pink-300' },
  hielo: { bg: 'bg-cyan-400', text: 'text-slate-900', border: 'border-cyan-300' },
  lucha: { bg: 'bg-red-700', text: 'text-white', border: 'border-red-400' },
  normal: { bg: 'bg-zinc-500', text: 'text-white', border: 'border-zinc-400' },
  planta: { bg: 'bg-emerald-600', text: 'text-white', border: 'border-emerald-400' },
  psiquico: { bg: 'bg-rose-500', text: 'text-white', border: 'border-rose-300' },
  psíquico: { bg: 'bg-rose-500', text: 'text-white', border: 'border-rose-300' },
  roca: { bg: 'bg-stone-600', text: 'text-white', border: 'border-stone-400' },
  siniestro: { bg: 'bg-neutral-800', text: 'text-white', border: 'border-neutral-500' },
  tierra: { bg: 'bg-yellow-700', text: 'text-white', border: 'border-yellow-500' },
  veneno: { bg: 'bg-fuchsia-700', text: 'text-white', border: 'border-fuchsia-400' },
  volador: { bg: 'bg-sky-500', text: 'text-white', border: 'border-sky-300' },
};

export function getTypeStyle(typeName: string) {
  const normalized = (typeName || '').toLowerCase().trim();
  return TYPE_COLORS[normalized] || { bg: 'bg-slate-600', text: 'text-white', border: 'border-slate-400' };
}
