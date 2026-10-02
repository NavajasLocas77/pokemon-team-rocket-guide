export interface Stats {
  hp?: number;
  atk?: number;
  def?: number;
  spa?: number;
  spd?: number;
  spe?: number;
  total?: number;
}

export interface PokemonObtaining {
  method: string;
  description: string;
  locations: string[];
  confirmed: boolean;
}

export interface PokemonEvolution {
  text: string;
  method: string;
  stone: string | null;
  level: number | null;
}

export interface Pokemon {
  id: string;
  dexNumber: number | string;
  name: string;
  formName?: string;
  category: string;
  types: string[];
  statsOfficial: Stats | null;
  statsHackrom: Stats | null;
  abilities: string[];
  obtaining: PokemonObtaining;
  evolution: PokemonEvolution;
  source: string;
  confidence: 'CONFIRMADO' | 'PARCIAL' | 'NO DISPONIBLE';
}

export interface BattlePokemon {
  name: string;
  level: number;
  item: string;
  nature: string;
  ability: string;
  moves: string[];
  ivs: string;
  evs: string;
}

export interface BattleModeData {
  name: string;
  team: BattlePokemon[];
}

export interface Battle {
  id: string;
  battleNumber: number;
  arc: string;
  arcName: string;
  category: 'PRINCIPAL' | 'SECUNDARIA';
  location: string;
  trainer: string;
  minLevel: number;
  maxLevel: number;
  modes: {
    facil: BattleModeData;
    dificil: BattleModeData;
  };
  differences: string[];
  notes?: string;
  source: string;
  confidence: 'CONFIRMADO' | 'PARCIAL' | 'NO DISPONIBLE';
}

export interface Sidequest {
  id: string;
  title: string;
  region: string;
  location: string;
  prerequisites: string;
  description: string;
  steps: string[];
  rewards: string[];
  videoTutorial?: string | null;
  source: string;
  confidence: 'CONFIRMADO' | 'PARCIAL' | 'NO DISPONIBLE';
}

export interface Item {
  id: string;
  name: string;
  category: string;
  description: string;
  obtaining: string;
  changes?: string | null;
  source: string;
  confidence: 'CONFIRMADO' | 'PARCIAL' | 'NO DISPONIBLE';
}

export interface MoveStats {
  type?: string;
  power?: string;
  accuracy?: string;
  pp?: string;
  effect?: string;
}

export interface Move {
  id: string;
  name: string;
  official: MoveStats;
  hackrom: MoveStats;
  source: string;
  confidence: 'CONFIRMADO' | 'PARCIAL' | 'NO DISPONIBLE';
}

export interface Location {
  id: string;
  name: string;
  region: string;
  pokemonAvailable: { pokemon: string; id: string; method: string }[];
  trainers: { trainer: string; battleId: string; category: string }[];
  sidequests: { questId: string; title: string }[];
  items: string[];
  source: string;
}

export interface GameMeta {
  version: string;
  author: string;
  engine: string;
  generatedDate: string;
  sourceDisclaimer: string;
  counts: {
    totalPokemon: number;
    totalBattles: number;
    totalSidequests: number;
    totalItems: number;
    totalMovesModified: number;
    totalLocations: number;
  };
  filesAudited: string[];
}

export interface QolSection {
  title: string;
  content: string;
  source: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  source: string;
}

export interface SearchResult {
  type: 'pokemon' | 'battle' | 'sidequest' | 'location' | 'item' | 'move';
  id: string;
  title: string;
  subtitle: string;
  url: string;
  badge: string;
}
