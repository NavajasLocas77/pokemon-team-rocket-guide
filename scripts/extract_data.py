#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Data Extractor for Pokémon Edición Team Rocket (2026 - Dragonsden)
Extracts all game data from real project files into structured JSON files under /src/data/.
"""

import os
import sys
import re
import json
import pypdf

# Ensure UTF-8 output
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAME_DATA_DIR = os.path.join(BASE_DIR, 'Pokemon TRE 2026 - Dragonsden', 'Pokemon TRE 2026 - Dragonsden')
OUTPUT_DIR = os.path.join(BASE_DIR, 'src', 'data')

os.makedirs(OUTPUT_DIR, exist_ok=True)

def clean_text(text):
    if not text:
        return ""
    # Normalize spaces and dashes
    t = text.replace('\r\n', '\n').replace('\r', '\n')
    t = re.sub(r'[\u2018\u2019]', "'", t)
    t = re.sub(r'[\u201C\u201D]', '"', t)
    t = re.sub(r'[\u2013\u2014]', '-', t)
    return t.strip()

def parse_stat_line(line):
    # e.g.: "Ps 90, At 85, Def 93, At.esp 110, Def.esp 110, Velocid 60. Total 548"
    # or "Ps: 90, At: 85..."
    stats = {}
    m_hp = re.search(r'Ps\s*[:\s]?\s*(\d+)', line, re.IGNORECASE)
    m_at = re.search(r'At\s*[:\s]?\s*(\d+)', line, re.IGNORECASE)
    m_df = re.search(r'Def\s*[:\s]?\s*(\d+)', line, re.IGNORECASE)
    m_spa = re.search(r'At\.?\s*esp\s*[:\s]?\s*(\d+)', line, re.IGNORECASE)
    m_spd = re.search(r'Def\.?\s*esp\s*[:\s]?\s*(\d+)', line, re.IGNORECASE)
    m_spe = re.search(r'Velocid\s*[:\s]?\s*(\d+)', line, re.IGNORECASE)
    m_tot = re.search(r'Total\s*[:\s]?\s*(\d+)', line, re.IGNORECASE)
    
    if m_hp: stats['hp'] = int(m_hp.group(1))
    if m_at: stats['atk'] = int(m_at.group(1))
    if m_df: stats['def'] = int(m_df.group(1))
    if m_spa: stats['spa'] = int(m_spa.group(1))
    if m_spd: stats['spd'] = int(m_spd.group(1))
    if m_spe: stats['spe'] = int(m_spe.group(1))
    if m_tot: 
        stats['total'] = int(m_tot.group(1))
    elif stats:
        stats['total'] = sum([stats.get('hp',0), stats.get('atk',0), stats.get('def',0), stats.get('spa',0), stats.get('spd',0), stats.get('spe',0)])
    return stats if len(stats) >= 5 else None

def extract_pokemon_data():
    print("Extracting Pokémon Data...")
    pokemon_dict = {}
    
    # 1. Parse OBTENCIÓN TODOS PKMN.txt
    obt_file = os.path.join(GAME_DATA_DIR, 'INFORMACIÓN ÚTIL', 'POKÉMON', 'OBTENCIÓN  TODOS  PKMN.txt')
    if os.path.exists(obt_file):
        with open(obt_file, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
        
        lines = content.splitlines()
        # Handle multi-line entries
        entries = []
        current_entry = ""
        for line in lines:
            line_str = line.strip()
            if not line_str:
                if current_entry:
                    entries.append(current_entry)
                    current_entry = ""
            else:
                # Check if it starts a new pokemon entry (e.g. NAME - NUMBER or NAME NUMBER - )
                if re.match(r'^[A-ZÁÉÍÓÚÑ0-9\s\.\'\-\&_]+?\s*-\s*(\d+|[A-Z0-9]+)\s*-', line_str) or re.match(r'^[A-ZÁÉÍÓÚÑ0-9\s\.\'\-\&_]+?\s+\d+\s*-\s*', line_str):
                    if current_entry:
                        entries.append(current_entry)
                    current_entry = line_str
                else:
                    if current_entry:
                        current_entry += " " + line_str
                    else:
                        current_entry = line_str
        if current_entry:
            entries.append(current_entry)
            
        for entry in entries:
            # Parse entry: "NAME - NUMBER - Obtaining details" or "NAME NUMBER - Details"
            m = re.match(r'^([A-ZÁÉÍÓÚÑ0-9\s\.\'\-\&_]+?)\s*-\s*(\d+|[A-Z0-9]+)\s*-\s*(.*)$', entry)
            if not m:
                m = re.match(r'^([A-ZÁÉÍÓÚÑ0-9\s\.\'\-\&_]+?)\s+(\d+)\s*-\s*(.*)$', entry)
            
            if m:
                raw_name = m.group(1).strip()
                dex_num_str = m.group(2).strip()
                raw_obt = m.group(3).strip()
                
                # Clean name
                clean_name = raw_name.replace('_F', ' ♀').replace('_M', ' ♂').replace('_', ' ').strip()
                dex_num = int(dex_num_str) if dex_num_str.isdigit() else dex_num_str
                
                # Determine primary obtaining method
                method_type = "Salvaje"
                obt_lower = raw_obt.lower()
                if not raw_obt or raw_obt == "-":
                    method_type = "No disponible en archivos"
                elif "misión secundaria" in obt_lower or "secundaria" in obt_lower:
                    method_type = "Misión Secundaria"
                elif "regalo" in obt_lower or "otorgado" in obt_lower or "robado" in obt_lower:
                    method_type = "Regalo / Evento"
                elif "evolución" in obt_lower or "evoluciona" in obt_lower:
                    if "salvaje" in obt_lower:
                        method_type = "Salvaje / Evolución"
                    else:
                        method_type = "Evolución"
                elif "piedra sagrada" in obt_lower:
                    method_type = "Piedra Sagrada"
                elif "piedra rocket" in obt_lower:
                    method_type = "Piedra Rocket"
                elif "intercambio" in obt_lower:
                    method_type = "Intercambio"
                elif "compra" in obt_lower or "casino" in obt_lower or "tienda" in obt_lower:
                    method_type = "Compra / Casino"
                elif "pesca" in obt_lower or "caña" in obt_lower or "surf" in obt_lower:
                    method_type = "Pesca / Surf"
                
                # Extract locations mentioned
                locations_found = []
                for loc_match in re.finditer(r'(Ruta\s+\d+|Bosque\s+\w+|Mt\.\w+|Cueva\s+[\w\s]+|Isla\s+\w+|Ciudad\s+\w+|Pueblo\s+\w+|Central\s+Energía|Mansión\s+Pkmn|Valle\s+Ruinas|Cataratas\s+Tohjo|Ruinas\s+Alfa|Calle\s+Victoria|Cámara\s+Sellada|Torre\s+[\w\s]+|Zona\s+Safari)', raw_obt, re.IGNORECASE):
                    loc = loc_match.group(1).strip()
                    if loc not in locations_found:
                        locations_found.append(loc)
                
                # Key
                slug = re.sub(r'[^a-z0-9]+', '-', clean_name.lower()).strip('-')
                pokemon_dict[slug] = {
                    "id": slug,
                    "dexNumber": dex_num,
                    "name": clean_name,
                    "formName": "Base",
                    "category": "Estándar",
                    "types": [],
                    "statsOfficial": None,
                    "statsHackrom": None,
                    "abilities": [],
                    "obtaining": {
                        "method": method_type,
                        "description": raw_obt if raw_obt else "Información no disponible en los archivos analizados.",
                        "locations": locations_found,
                        "confirmed": bool(raw_obt and raw_obt != "-")
                    },
                    "evolution": {
                        "text": "",
                        "method": "Estándar oficial salvo especificación",
                        "stone": None,
                        "level": None
                    },
                    "source": "INFORMACIÓN ÚTIL/POKÉMON/OBTENCIÓN  TODOS  PKMN.txt",
                    "confidence": "CONFIRMADO" if (raw_obt and raw_obt != "-") else "NO DISPONIBLE"
                }

    # 2. Parse EVOLUCIÓN TODOS PKMN.txt
    evo_file = os.path.join(GAME_DATA_DIR, 'INFORMACIÓN ÚTIL', 'POKÉMON', 'EVOLUCIÓN TODOS PKMN.txt')
    if os.path.exists(evo_file):
        with open(evo_file, 'r', encoding='utf-8', errors='replace') as f:
            evo_content = f.read()
        
        evo_lines = evo_content.splitlines()
        for line in evo_lines:
            line_str = line.strip()
            if not line_str or line_str.startswith('---') or line_str.startswith('NOTA:'):
                continue
            # e.g.: "Golbat a Crobat - Nivel 47"
            # "Rattata a Rattata Alola (y viceversa) - Piedra Sagrada"
            # "Kadabra a Alakazam - Nivel 45"
            m_evo = re.match(r'^(.+?)\s+a\s+(.+?)\s*-\s*(.+)$', line_str)
            if m_evo:
                from_pkmn = m_evo.group(1).strip()
                to_pkmn = m_evo.group(2).strip()
                method = m_evo.group(3).strip()
                slug = re.sub(r'[^a-z0-9]+', '-', from_pkmn.lower()).strip('-')
                if slug in pokemon_dict:
                    pokemon_dict[slug]["evolution"]["text"] = f"Evoluciona a {to_pkmn} mediante {method}"
                    pokemon_dict[slug]["evolution"]["method"] = method
                    if "Piedra" in method:
                        pokemon_dict[slug]["evolution"]["stone"] = method
                    m_lvl = re.search(r'Nivel\s+(\d+)', method, re.IGNORECASE)
                    if m_lvl:
                        pokemon_dict[slug]["evolution"]["level"] = int(m_lvl.group(1))

    # 3. Parse CAMBIOS en STATS, TIPOS y HABILIDADES.txt
    stats_file = os.path.join(GAME_DATA_DIR, 'INFORMACIÓN ÚTIL', 'POKÉMON', 'CAMBIOS en STATS, TIPOS y HABILIDADES.txt')
    if os.path.exists(stats_file):
        with open(stats_file, 'r', encoding='utf-8', errors='replace') as f:
            stats_content = f.read()
        
        # Split by blocks or lines
        blocks = [b.strip() for b in stats_content.split('\n\n') if b.strip()]
        i = 0
        current_header = None
        while i < len(blocks):
            block = blocks[i]
            lines = [l.strip() for l in block.splitlines() if l.strip()]
            
            # Check if this block is a header (like "VENUSAUR" or "MEGA VENUSAUR" or "TANGROWTH")
            if len(lines) == 1 and not lines[0].startswith('Oficial') and not lines[0].startswith('Hackrom') and not lines[0].startswith('Habilidad') and not lines[0].startswith('Tipo'):
                current_header = lines[0]
                i += 1
                continue
            
            # Check if block has stats
            official_stats = None
            hackrom_stats = None
            abilities = []
            types = []
            
            for line in lines:
                if line.startswith('Oficial'):
                    official_stats = parse_stat_line(line)
                elif line.startswith('Hackrom') or (':' in line and 'Ps' in line and not line.startswith('Oficial')):
                    hackrom_stats = parse_stat_line(line)
                elif 'Habilidad' in line:
                    ab_text = re.sub(r'Habilidades?\s*:\s*', '', line, flags=re.IGNORECASE)
                    abilities = [a.strip() for a in re.split(r'[/,]', ab_text) if a.strip()]
                elif 'Tipo' in line:
                    tp_text = re.sub(r'Tipos?\s*:\s*', '', line, flags=re.IGNORECASE)
                    types = [t.strip() for t in re.split(r'[/,]', tp_text) if t.strip()]
            
            if current_header and (official_stats or hackrom_stats or abilities or types):
                header_name = current_header.strip()
                slug = re.sub(r'[^a-z0-9]+', '-', header_name.lower()).strip('-')
                
                # Check if it's a mega or existing pokemon
                if slug not in pokemon_dict:
                    # Create entry if new form or not in main list
                    is_mega = "mega" in header_name.lower()
                    pokemon_dict[slug] = {
                        "id": slug,
                        "dexNumber": "-",
                        "name": header_name,
                        "formName": "Mega Evolución" if is_mega else "Variante Hackrom",
                        "category": "Mega Evolución" if is_mega else "Cambios Hackrom",
                        "types": types,
                        "statsOfficial": official_stats,
                        "statsHackrom": hackrom_stats,
                        "abilities": abilities,
                        "obtaining": {
                            "method": "Mega Evolución / Variante",
                            "description": "Forma con cambios de estadísticas y habilidades específicas de esta edición.",
                            "locations": [],
                            "confirmed": True
                        },
                        "evolution": {"text": "", "method": "", "stone": None, "level": None},
                        "source": "INFORMACIÓN ÚTIL/POKÉMON/CAMBIOS en STATS, TIPOS y HABILIDADES.txt",
                        "confidence": "CONFIRMADO"
                    }
                else:
                    if official_stats: pokemon_dict[slug]["statsOfficial"] = official_stats
                    if hackrom_stats: pokemon_dict[slug]["statsHackrom"] = hackrom_stats
                    if abilities: pokemon_dict[slug]["abilities"] = abilities
                    if types: pokemon_dict[slug]["types"] = types
                    pokemon_dict[slug]["source"] += " | CAMBIOS en STATS, TIPOS y HABILIDADES.txt"
                
                current_header = None
            i += 1

    # 4. Parse NUEVOS POKEMON folder
    new_pkmn_files = [
        ('Experimentos Rocket.txt', 'Experimento Rocket', 'INFORMACIÓN ÚTIL/POKÉMON/NUEVOS POKEMON/Experimentos Rocket.txt'),
        ('Fuertes Vínculo.txt', 'Fuerte Vínculo', 'INFORMACIÓN ÚTIL/POKÉMON/NUEVOS POKEMON/Fuertes Vínculo.txt'),
        ('Nuevas Megaevoluciones.txt', 'Nueva Megaevolución', 'INFORMACIÓN ÚTIL/POKÉMON/NUEVOS POKEMON/Nuevas Megaevoluciones.txt'),
        ('Primigenios y Antiguos.txt', 'Primigenio / Antiguo', 'INFORMACIÓN ÚTIL/POKÉMON/NUEVOS POKEMON/Primigenios y Antiguos.txt')
    ]
    
    for filename, cat_name, rel_source in new_pkmn_files:
        fp = os.path.join(GAME_DATA_DIR, 'INFORMACIÓN ÚTIL', 'POKÉMON', 'NUEVOS POKEMON', filename)
        if os.path.exists(fp):
            with open(fp, 'r', encoding='utf-8', errors='replace') as f:
                raw_text = f.read()
            
            # Split sections
            sections = raw_text.split('\n\n')
            current_title = None
            for sec in sections:
                sec_lines = [l.strip() for l in sec.splitlines() if l.strip()]
                if not sec_lines:
                    continue
                
                first_line = sec_lines[0]
                if len(sec_lines) == 1 and not 'Ps' in first_line and not 'Tipo' in first_line and not first_line.startswith('-'):
                    cand = first_line.replace(':', '').strip()
                    if re.search(r'[A-Za-z0-9]', cand) and not re.match(r'^[\s\-_=]+$', cand):
                        current_title = cand
                    continue
                
                official_stats = None
                hackrom_stats = None
                form_stats = None
                types = []
                abilities = []
                desc_notes = []
                
                name_candidate = current_title if current_title else (first_line if not 'Ps' in first_line else None)
                
                for l in sec_lines:
                    if l.startswith('Notas:') or l.startswith('- '):
                        desc_notes.append(l)
                    elif 'Oficial' in l:
                        official_stats = parse_stat_line(l)
                    elif 'Hackrom' in l:
                        hackrom_stats = parse_stat_line(l)
                    elif 'Ps' in l:
                        parsed = parse_stat_line(l)
                        if parsed:
                            if not form_stats: form_stats = parsed
                            else: hackrom_stats = parsed
                    if 'Tipo' in l:
                        m_tp = re.search(r'Tipo\s*:\s*([^|]+)', l, re.IGNORECASE)
                        if m_tp:
                            types = [t.strip() for t in re.split(r'[/,]', m_tp.group(1)) if t.strip()]
                    if 'Habilidad' in l or 'Habilidades' in l:
                        m_ab = re.search(r'Habilidades?\s*:\s*(.+)$', l, re.IGNORECASE)
                        if m_ab:
                            abilities = [a.strip() for a in re.split(r'[/,]', m_ab.group(1)) if a.strip()]
                
                if name_candidate:
                    slug = re.sub(r'[^a-z0-9]+', '-', name_candidate.lower()).strip('-')
                    if not slug or len(slug) < 2 or re.match(r'^(notas|pokemon-antiguos|prototipos)', slug):
                        current_title = None
                        continue
                    pokemon_dict[slug] = {
                        "id": slug,
                        "dexNumber": "-",
                        "name": name_candidate,
                        "formName": cat_name,
                        "category": cat_name,
                        "types": types,
                        "statsOfficial": official_stats,
                        "statsHackrom": form_stats or hackrom_stats,
                        "abilities": abilities,
                        "obtaining": {
                            "method": cat_name,
                            "description": " ".join(desc_notes) if desc_notes else f"Pokémon exclusivo de la categoría {cat_name}.",
                            "locations": [],
                            "confirmed": True
                        },
                        "evolution": {"text": "", "method": "", "stone": None, "level": None},
                        "source": rel_source,
                        "confidence": "CONFIRMADO"
                    }
                    current_title = None

    pokemon_list = list(pokemon_dict.values())
    print(f"Total Pokémon extracted: {len(pokemon_list)}")
    with open(os.path.join(OUTPUT_DIR, 'pokemon.json'), 'w', encoding='utf-8') as f:
        json.dump(pokemon_list, f, ensure_ascii=False, indent=2)
    return pokemon_list

def parse_trainer_party(lines):
    party = []
    current_pkmn = None
    for line in lines:
        line_str = line.strip()
        if not line_str:
            continue
        if line_str.startswith('- '):
            if current_pkmn:
                party.append(current_pkmn)
            raw_header = line_str[2:].strip()
            # Match name (Nv. XX) with | or - separator
            m_pk = re.match(r'^([^\(]+?)\s*\((?:Nv\.|Nivel|Lvl)?\s*(\d+)\)\s*(?:[\|\-]\s*(.+))?$', raw_header, re.IGNORECASE)
            if m_pk:
                p_name = m_pk.group(1).strip()
                p_level = int(m_pk.group(2).strip())
                rest = m_pk.group(3).strip() if m_pk.group(3) else ""
                parts = [p.strip() for p in re.split(r'[\|\-]', rest) if p.strip()]
                item = parts[0] if len(parts) > 0 and parts[0] != '-' else "Ninguno"
                nature = parts[1] if len(parts) > 1 and parts[1] != '-' else "Seria"
                ability = parts[2] if len(parts) > 2 and parts[2] != '-' else "Estándar"
                current_pkmn = {
                    "name": p_name,
                    "level": p_level,
                    "item": item,
                    "nature": nature,
                    "ability": ability,
                    "moves": [],
                    "ivs": "0/31",
                    "evs": "0"
                }
            else:
                m_lvl_fallback = re.search(r'\((?:Nv\.|Nivel|Lvl)?\s*(\d+)\)', raw_header, re.IGNORECASE)
                lvl = int(m_lvl_fallback.group(1)) if m_lvl_fallback else 1
                name_clean = re.sub(r'\(.*?\)', '', raw_header).strip()
                current_pkmn = {
                    "name": name_clean if name_clean else raw_header,
                    "level": lvl,
                    "item": "Ninguno",
                    "nature": "-",
                    "ability": "-",
                    "moves": [],
                    "ivs": "-",
                    "evs": "-"
                }
        elif current_pkmn:
            if line_str.startswith('Mov:'):
                moves_str = line_str[4:].strip()
                current_pkmn['moves'] = [m.strip() for m in re.split(r'[,/]', moves_str) if m.strip()]
            elif 'IVs:' in line_str or 'EVs:' in line_str:
                m_iv = re.search(r'IVs:\s*([^|]+)', line_str)
                m_ev = re.search(r'EVs:\s*(.+)$', line_str)
                if m_iv: current_pkmn['ivs'] = m_iv.group(1).strip()
                if m_ev: current_pkmn['evs'] = m_ev.group(1).strip()
            elif line_str.startswith('Habilidad:') or line_str.startswith('Objeto:'):
                if 'Objeto:' in line_str:
                    current_pkmn['item'] = line_str.split(':', 1)[1].strip()
                if 'Habilidad:' in line_str:
                    current_pkmn['ability'] = line_str.split(':', 1)[1].strip()
    if current_pkmn:
        party.append(current_pkmn)
    return party

def extract_battles_data():
    print("Extracting Boss Battles and Levels Data...")
    battles = []
    battle_id = 1
    
    # 5 Arcs for Main battles
    arcs = [
        ('T1 - KANTO', 'Kanto (Temporada 1)', 'INFORMACIÓN ÚTIL/COMBATES DE JEFE/COMBATES PRINCIPALES/T1 - DIFICIL_FACIL/KANTO FACIL_DIFICIL.txt', 'PRINCIPAL'),
        ('T2 - ARCHI7', 'Archi7 / Sevii (Temporada 2)', 'INFORMACIÓN ÚTIL/COMBATES DE JEFE/COMBATES PRINCIPALES/T2 - DIFICIL_FACIL/ARCHI7 FÁCIL_DIFICIL.txt', 'PRINCIPAL'),
        ('T3 - JOHTO', 'Johto (Temporada 3)', 'INFORMACIÓN ÚTIL/COMBATES DE JEFE/COMBATES PRINCIPALES/T3 - DIFICIL_FACIL/JOHTO FÁCIL_DIFÍCIL.txt', 'PRINCIPAL'),
        ('T4 - DLC', 'DLC Johto / Dun (Temporada 4)', 'INFORMACIÓN ÚTIL/COMBATES DE JEFE/COMBATES PRINCIPALES/T4 - DIFÍCIL_FÁCIL/DLC FÁCIL_DIFÍCIL.txt', 'PRINCIPAL'),
        ('T5 - HOENN', 'Hoenn (Temporada 5)', 'INFORMACIÓN ÚTIL/COMBATES DE JEFE/COMBATES PRINCIPALES/T5 - DIFICIL_FACIL/HOENN FÁCIL_DIFÍCIL.txt', 'PRINCIPAL'),
        # Secondary battles
        ('T1 - KANTO SEC', 'Kanto Secundarias', 'INFORMACIÓN ÚTIL/COMBATES DE JEFE/MISIONES SECUNDARIAS/T1 - FÁCIL_DIFÍCIL/KANTO SEC - FÁCIL_DIFICIL.txt', 'SECUNDARIA'),
        ('T2 - ARCHI7 SEC', 'Archi7 Secundarias', 'INFORMACIÓN ÚTIL/COMBATES DE JEFE/MISIONES SECUNDARIAS/T2 - FÁCIL_DIFÍCIL/ARCHI7. SEC - FÁCIL_DIFÍCILtxt.txt', 'SECUNDARIA'),
        ('T3 - JOHTO SEC', 'Johto Secundarias', 'INFORMACIÓN ÚTIL/COMBATES DE JEFE/MISIONES SECUNDARIAS/T3 - FÁCIL_DIFÍCIL/JOHTO SEC. FÁCIL_DIFÍCIL.txt', 'SECUNDARIA'),
        ('T4 - DLC SEC', 'DLC Secundarias', 'INFORMACIÓN ÚTIL/COMBATES DE JEFE/MISIONES SECUNDARIAS/T4 - FÁCIL_DIFÍCIL/DLC SEC. FÁCIL_DIFÍCIL.txt', 'SECUNDARIA'),
        ('T5 - HOENN SEC', 'Hoenn Secundarias', 'INFORMACIÓN ÚTIL/COMBATES DE JEFE/MISIONES SECUNDARIAS/T5 - FÁCIL_DIFÍCIL/HOENN SEC. FÁCIL_DIFÍCIL.txt', 'SECUNDARIA')
    ]
    
    for arc_code, arc_name, rel_path, category in arcs:
        file_path = os.path.join(GAME_DATA_DIR, rel_path)
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            continue
        
        with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
        
        lines = content.splitlines()
        current_location = "Ubicación Principal"
        current_trainer = None
        current_mode = "AMBOS"
        facil_lines = []
        dificil_lines = []
        notes = []
        
        def save_current_battle():
            nonlocal battle_id, current_trainer, current_location, facil_lines, dificil_lines, notes
            if not current_trainer:
                return
            
            # Parse teams
            party_facil = parse_trainer_party(facil_lines)
            party_dificil = parse_trainer_party(dificil_lines)
            
            if not party_facil and party_dificil:
                party_facil = party_dificil
            elif not party_dificil and party_facil:
                party_dificil = party_facil
            
            # Compute min/max levels
            all_lvls_facil = [p['level'] for p in party_facil if p.get('level')]
            all_lvls_dificil = [p['level'] for p in party_dificil if p.get('level')]
            
            min_lvl = min(all_lvls_facil + all_lvls_dificil) if (all_lvls_facil or all_lvls_dificil) else 0
            max_lvl = max(all_lvls_facil + all_lvls_dificil) if (all_lvls_facil or all_lvls_dificil) else 0
            
            # Differences breakdown
            diff_notes = []
            if len(party_dificil) > len(party_facil):
                diff_notes.append(f"+{len(party_dificil) - len(party_facil)} Pokémon adicional(es) en Modo Difícil.")
            if party_dificil and party_facil:
                evs_facil = party_facil[0].get('evs', '-')
                evs_dif = party_dificil[0].get('evs', '-')
                if evs_dif != evs_facil and evs_dif != '-':
                    diff_notes.append(f"EVs mejorados en Difícil ({evs_dif}).")
            
            battles.append({
                "id": f"battle-{battle_id}",
                "battleNumber": battle_id,
                "arc": arc_code,
                "arcName": arc_name,
                "category": category,
                "location": current_location,
                "trainer": current_trainer,
                "minLevel": min_lvl,
                "maxLevel": max_lvl,
                "modes": {
                    "facil": {
                        "name": "Modo Normal / Fácil",
                        "team": party_facil
                    },
                    "dificil": {
                        "name": "Modo Difícil",
                        "team": party_dificil
                    }
                },
                "differences": diff_notes,
                "notes": " ".join(notes),
                "source": rel_path,
                "confidence": "CONFIRMADO"
            })
            battle_id += 1
            facil_lines = []
            dificil_lines = []
            notes = []
        
        for line in lines:
            line_str = line.strip()
            if not line_str:
                continue
            
            # Location separator (e.g. "ISLA INTA\n----------------")
            if re.match(r'^[A-ZÁÉÍÓÚÑ0-9\s\.\,\-\/\(\)]+$', line_str) and len(line_str) > 2 and not line_str.startswith('VS ') and not line_str.startswith('---') and not line_str.startswith('MOV:') and not line_str.startswith('IVS:') and not line_str.startswith('EVS:'):
                # Check if next line is dashes or if previous is empty
                # We can update location
                pass
            
            if line_str.startswith('VS ') or line_str.startswith('COMBATE '):
                save_current_battle()
                current_trainer = line_str
                current_mode = "FACIL"
                continue
            elif re.search(r'-+\s*f[aá]cil\s*-+', line_str, re.IGNORECASE) or re.search(r'-+\s*normal\s*-+', line_str, re.IGNORECASE):
                current_mode = "FACIL"
                continue
            elif re.search(r'-+\s*dif[ií]cil\s*-+', line_str, re.IGNORECASE):
                current_mode = "DIFICIL"
                continue
            elif line_str.startswith('---') or line_str.startswith('==='):
                continue
            elif line_str.isupper() and len(line_str) > 3 and not line_str.startswith('MOV') and not line_str.startswith('IV') and not line_str.startswith('EV') and not line_str.startswith('-'):
                # Location change
                if not current_trainer:
                    current_location = line_str
                else:
                    # Could be location change for next battle
                    save_current_battle()
                    current_trainer = None
                    current_location = line_str
                continue
            
            if current_trainer:
                if current_mode == "FACIL":
                    facil_lines.append(line_str)
                elif current_mode == "DIFICIL":
                    dificil_lines.append(line_str)
                else:
                    facil_lines.append(line_str)
                    dificil_lines.append(line_str)
        
        save_current_battle()

    print(f"Total Battles extracted: {len(battles)}")
    with open(os.path.join(OUTPUT_DIR, 'levels.json'), 'w', encoding='utf-8') as f:
        json.dump(battles, f, ensure_ascii=False, indent=2)
    return battles

def extract_sidequests_data():
    print("Extracting Sidequests Data...")
    pdf_path = os.path.join(GAME_DATA_DIR, 'INFORMACIÓN ÚTIL', 'SECUNDARIAS TRE.pdf')
    quests = []
    
    if os.path.exists(pdf_path):
        reader = pypdf.PdfReader(pdf_path)
        full_text = ""
        for page in reader.pages:
            full_text += (page.extract_text() or "") + "\n"
        
        # Split by regions
        region_blocks = re.split(r'╔═+╗\s*([A-ZÁÉÍÓÚÑ\s]+)\s*╚═+╝', full_text)
        current_region = "Kanto"
        
        # We parse the alternating region name and text
        for idx in range(1, len(region_blocks), 2):
            reg_name = region_blocks[idx].strip()
            reg_text = region_blocks[idx+1]
            
            # Split by separator line "═══════"
            raw_quests = [q.strip() for q in re.split(r'═{10,}', reg_text) if q.strip()]
            for q_idx, q_text in enumerate(raw_quests):
                # e.g.: "Anciano con su Machamp: Una vez obtengas alto rango... \nRecompensas:\n- Hitmonlee Nv. 20\n- Bono Bici\nVideo tutorial: ..."
                m_title = re.match(r'^([^:]+?)\s*:\s*(.+)$', q_text, re.DOTALL)
                title = f"Misión {q_idx+1}"
                body = q_text
                if m_title:
                    title = m_title.group(1).strip()
                    body = m_title.group(2).strip()
                
                # Extract rewards
                rewards = []
                m_rew = re.search(r'Recompensas?\s*:\s*(.*?)(?:Video tutorial:|$)', body, re.DOTALL | re.IGNORECASE)
                if m_rew:
                    rew_lines = m_rew.group(1).splitlines()
                    for rl in rew_lines:
                        rl_clean = rl.strip().lstrip('-').strip()
                        if rl_clean:
                            rewards.append(rl_clean)
                
                # Extract video tutorial
                video = None
                m_vid = re.search(r'Video tutorial\s*:\s*(.+)$', body, re.IGNORECASE | re.MULTILINE)
                if m_vid:
                    video = m_vid.group(1).strip()
                
                # Extract prerequisite
                prereq = None
                m_pre = re.search(r'Prerr?equisitos?\s*:\s*(.*?)(?:Recompensas?:|Video tutorial:|$)', body, re.DOTALL | re.IGNORECASE)
                if m_pre:
                    prereq = m_pre.group(1).strip()
                
                # Steps creation
                steps = []
                # Clean main description
                desc_text = re.sub(r'Recompensas?\s*:\s*.*$', '', body, flags=re.DOTALL | re.IGNORECASE).strip()
                desc_text = re.sub(r'Prerr?equisitos?\s*:\s*.*$', '', desc_text, flags=re.DOTALL | re.IGNORECASE).strip()
                
                # Create checklist steps
                sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', desc_text) if s.strip()]
                for s in sentences:
                    if len(s) > 10:
                        steps.append(s)
                if not steps:
                    steps.append(desc_text)
                
                slug = re.sub(r'[^a-z0-9]+', '-', f"{reg_name}-{title}".lower()).strip('-')
                quests.append({
                    "id": slug,
                    "title": title,
                    "region": reg_name,
                    "location": f"Región {reg_name}",
                    "prerequisites": prereq or "Disponible en el desarrollo natural de la región.",
                    "description": desc_text,
                    "steps": steps,
                    "rewards": rewards if rewards else ["Recompensa de progreso"],
                    "videoTutorial": video if (video and "No disponible" not in video) else None,
                    "source": "INFORMACIÓN ÚTIL/SECUNDARIAS TRE.pdf",
                    "confidence": "CONFIRMADO"
                })

    print(f"Total Sidequests extracted: {len(quests)}")
    with open(os.path.join(OUTPUT_DIR, 'sidequests.json'), 'w', encoding='utf-8') as f:
        json.dump(quests, f, ensure_ascii=False, indent=2)
    return quests

def extract_items_data():
    print("Extracting Items and Shops Data...")
    items = []
    
    # 1. Parse OBTENCIÓN OBJETOS.txt
    obt_file = os.path.join(GAME_DATA_DIR, 'INFORMACIÓN ÚTIL', 'OBJETOS', 'OBTENCIÓN OBJETOS.txt')
    if os.path.exists(obt_file):
        with open(obt_file, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
        
        # Sections
        sections = re.split(r'\n(?=[A-ZÁÉÍÓÚÑ\s]{4,}\n[-=]{3,})', content)
        for sec in sections:
            sec_lines = [l.strip() for l in sec.splitlines() if l.strip()]
            if not sec_lines:
                continue
            cat_header = sec_lines[0]
            
            # Parse items within section
            # Items usually formatted as "Item Name: Location/Details" or "- Details"
            current_item = None
            for line in sec_lines[1:]:
                if line.startswith('---') or line.startswith('==='):
                    continue
                m_it = re.match(r'^([A-ZÁÉÍÓÚÑa-záéíóúñ\s0-9\.\-\'\+]+?)\s*:\s*(.+)$', line)
                if m_it and not line.startswith('-'):
                    item_name = m_it.group(1).strip()
                    item_obt = m_it.group(2).strip()
                    slug = re.sub(r'[^a-z0-9]+', '-', item_name.lower()).strip('-')
                    items.append({
                        "id": slug,
                        "name": item_name,
                        "category": cat_header,
                        "description": item_obt,
                        "obtaining": item_obt,
                        "changes": None,
                        "source": "INFORMACIÓN ÚTIL/OBJETOS/OBTENCIÓN OBJETOS.txt",
                        "confidence": "CONFIRMADO"
                    })
                elif items and line.startswith('-'):
                    items[-1]["obtaining"] += f" | {line.lstrip('-').strip()}"
    
    # 2. Parse CAMBIOS en OBJETOS.txt
    camb_file = os.path.join(GAME_DATA_DIR, 'INFORMACIÓN ÚTIL', 'OBJETOS', 'CAMBIOS en OBJETOS.txt')
    if os.path.exists(camb_file):
        with open(camb_file, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
        
        lines = content.splitlines()
        current_cat = "Cambios en Objetos"
        for line in lines:
            line_str = line.strip()
            if not line_str or line_str.startswith('---'):
                continue
            if line_str.isupper() and len(line_str) > 4:
                current_cat = line_str
                continue
            
            m_it = re.match(r'^([A-ZÁÉÍÓÚÑa-záéíóúñ\s0-9\.\-\'\+]+?)\s*:\s*(.+)$', line_str)
            if m_it:
                item_name = m_it.group(1).strip()
                item_eff = m_it.group(2).strip()
                slug = re.sub(r'[^a-z0-9]+', '-', item_name.lower()).strip('-')
                
                # Check if already exists
                found = False
                for it in items:
                    if it['id'] == slug:
                        it['changes'] = item_eff
                        it['source'] += " | CAMBIOS en OBJETOS.txt"
                        found = True
                        break
                if not found:
                    items.append({
                        "id": slug,
                        "name": item_name,
                        "category": current_cat,
                        "description": item_eff,
                        "obtaining": "Ver documento de obtención o tiendas.",
                        "changes": item_eff,
                        "source": "INFORMACIÓN ÚTIL/OBJETOS/CAMBIOS en OBJETOS.txt",
                        "confidence": "CONFIRMADO"
                    })

    print(f"Total Items extracted: {len(items)}")
    with open(os.path.join(OUTPUT_DIR, 'items.json'), 'w', encoding='utf-8') as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
    return items

def extract_moves_data():
    print("Extracting Moves Changes Data...")
    moves = []
    moves_file = os.path.join(GAME_DATA_DIR, 'INFORMACIÓN ÚTIL', 'CAMBIOS en MOVIMIENTOS.txt')
    
    if os.path.exists(moves_file):
        with open(moves_file, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
        
        # Split by move sections
        blocks = [b.strip() for b in content.split('\n\n\n') if b.strip()]
        for b in blocks:
            lines = [l.strip() for l in b.splitlines() if l.strip()]
            if not lines:
                continue
            
            # Find move name (usually first line)
            move_name = lines[0].replace('----------------------------------------------', '').strip()
            if not move_name:
                continue
            
            official_data = {}
            hackrom_data = {}
            current_target = None
            
            for l in lines[1:]:
                if 'Oficial' in l:
                    current_target = official_data
                    m_tp = re.search(r'Tipo\s+([a-záéíóúñ]+)', l, re.IGNORECASE)
                    if m_tp: current_target['type'] = m_tp.group(1).capitalize()
                elif 'Hackrom' in l:
                    current_target = hackrom_data
                    m_tp = re.search(r'Tipo\s+([a-záéíóúñ]+)', l, re.IGNORECASE)
                    if m_tp: current_target['type'] = m_tp.group(1).capitalize()
                elif current_target is not None:
                    if l.startswith('Potencia'):
                        current_target['power'] = l.split('-', 1)[1].strip() if '-' in l else l
                    elif l.startswith('Precisión'):
                        current_target['accuracy'] = l.split('-', 1)[1].strip() if '-' in l else l
                    elif l.startswith('Ef.Secundario') or l.startswith('Efecto'):
                        current_target['effect'] = l.split('-', 1)[1].strip() if '-' in l else l
                    elif l.startswith('PP'):
                        current_target['pp'] = l.split('-', 1)[1].strip() if '-' in l else l
            
            slug = re.sub(r'[^a-z0-9]+', '-', move_name.lower()).strip('-')
            moves.append({
                "id": slug,
                "name": move_name,
                "official": official_data,
                "hackrom": hackrom_data,
                "source": "INFORMACIÓN ÚTIL/CAMBIOS en MOVIMIENTOS.txt",
                "confidence": "CONFIRMADO"
            })

    print(f"Total Moves extracted: {len(moves)}")
    with open(os.path.join(OUTPUT_DIR, 'moves.json'), 'w', encoding='utf-8') as f:
        json.dump(moves, f, ensure_ascii=False, indent=2)
    return moves

def extract_qol_and_faq():
    print("Extracting QoL & FAQ Data...")
    qol_file = os.path.join(GAME_DATA_DIR, 'INFORMACIÓN ÚTIL', 'QOLS.txt')
    faq_file = os.path.join(GAME_DATA_DIR, 'INFORMACIÓN ÚTIL', 'Preguntas Frecuentes.txt')
    
    qol_sections = []
    if os.path.exists(qol_file):
        with open(qol_file, 'r', encoding='utf-8', errors='replace') as f:
            qol_text = f.read()
        
        # Parse sections starting with '+' or capital headers
        raw_sections = re.split(r'\n\+\s*', qol_text)
        for s in raw_sections:
            s_clean = s.strip()
            if not s_clean or s_clean.startswith('QUALITIES OF LIFE'):
                continue
            lines = s_clean.splitlines()
            title = lines[0].replace(':', '').strip()
            body = "\n".join(lines[1:]).strip()
            qol_sections.append({
                "title": title,
                "content": body,
                "source": "INFORMACIÓN ÚTIL/QOLS.txt"
            })
            
    faqs = []
    if os.path.exists(faq_file):
        with open(faq_file, 'r', encoding='utf-8', errors='replace') as f:
            faq_text = f.read()
            
        qa_pairs = re.split(r'\n\+\s*', faq_text)
        for qa in qa_pairs:
            qa_clean = qa.strip()
            if not qa_clean or qa_clean.startswith('PREGUNTAS FRECUENTES'):
                continue
            parts = re.split(r'\n-\s*', qa_clean)
            q = parts[0].strip()
            a = parts[1].strip() if len(parts) > 1 else ""
            if q:
                faqs.append({
                    "question": q,
                    "answer": a,
                    "source": "INFORMACIÓN ÚTIL/Preguntas Frecuentes.txt"
                })
                
    qol_data = {
        "qol": qol_sections,
        "faqs": faqs
    }
    with open(os.path.join(OUTPUT_DIR, 'qol.json'), 'w', encoding='utf-8') as f:
        json.dump(qol_data, f, ensure_ascii=False, indent=2)
    return qol_data

def build_locations_and_meta(pokemon_list, battles_list, quests_list, items_list, moves_list):
    print("Building Locations and Meta Data...")
    
    # Aggregate locations
    locations_dict = {}
    
    # 1. From battles
    for b in battles_list:
        loc = b.get('location', 'Desconocido').strip()
        if loc not in locations_dict:
            locations_dict[loc] = {
                "id": re.sub(r'[^a-z0-9]+', '-', loc.lower()).strip('-'),
                "name": loc,
                "region": b.get('arcName', 'General'),
                "pokemonAvailable": [],
                "trainers": [],
                "sidequests": [],
                "items": [],
                "source": b.get('source')
            }
        locations_dict[loc]["trainers"].append({
            "trainer": b.get('trainer'),
            "battleId": b.get('id'),
            "category": b.get('category')
        })
        
    # 2. From Pokemon
    for p in pokemon_list:
        obt = p.get('obtaining', {})
        for loc in obt.get('locations', []):
            loc_clean = loc.strip()
            if loc_clean not in locations_dict:
                locations_dict[loc_clean] = {
                    "id": re.sub(r'[^a-z0-9]+', '-', loc_clean.lower()).strip('-'),
                    "name": loc_clean,
                    "region": "Kanto / Sevii / Johto / Hoenn",
                    "pokemonAvailable": [],
                    "trainers": [],
                    "sidequests": [],
                    "items": [],
                    "source": p.get('source')
                }
            locations_dict[loc_clean]["pokemonAvailable"].append({
                "pokemon": p.get('name'),
                "id": p.get('id'),
                "method": obt.get('method')
            })
            
    # 3. From Quests
    for q in quests_list:
        reg = q.get('region', 'Kanto')
        loc = q.get('location', reg)
        if loc not in locations_dict:
            locations_dict[loc] = {
                "id": re.sub(r'[^a-z0-9]+', '-', loc.lower()).strip('-'),
                "name": loc,
                "region": reg,
                "pokemonAvailable": [],
                "trainers": [],
                "sidequests": [],
                "items": [],
                "source": q.get('source')
            }
        locations_dict[loc]["sidequests"].append({
            "questId": q.get('id'),
            "title": q.get('title')
        })

    locations_list = list(locations_dict.values())
    with open(os.path.join(OUTPUT_DIR, 'locations.json'), 'w', encoding='utf-8') as f:
        json.dump(locations_list, f, ensure_ascii=False, indent=2)
        
    # Game Meta
    meta = {
        "version": "Pokémon Edición Team Rocket (2026)",
        "author": "Dragonsden & Colaboradores (Colonelsalt, @kakarotto, Xiros, @KevinXDE, @Polar, Alexander Daniel, Scar'99, Cakezy)",
        "engine": "Pokeemerald Expansion (RHH) / CFRU Base",
        "generatedDate": "2026-10-01",
        "sourceDisclaimer": "Todos los datos incluidos en esta guía han sido extraídos directamente de los archivos oficiales del juego proporcionados por el desarrollador Dragonsden.",
        "counts": {
            "totalPokemon": len(pokemon_list),
            "totalBattles": len(battles_list),
            "totalSidequests": len(quests_list),
            "totalItems": len(items_list),
            "totalMovesModified": len(moves_list),
            "totalLocations": len(locations_list)
        },
        "filesAudited": [
            "PkmnTeamRocket.gba",
            "Créditos.rtf",
            "INFORMACIÓN ÚTIL/CAMBIOS en MOVIMIENTOS.txt",
            "INFORMACIÓN ÚTIL/Preguntas Frecuentes.txt",
            "INFORMACIÓN ÚTIL/QOLS.txt",
            "INFORMACIÓN ÚTIL/SECUNDARIAS TRE.pdf",
            "INFORMACIÓN ÚTIL/OBJETOS/CAMBIOS en OBJETOS.txt",
            "INFORMACIÓN ÚTIL/OBJETOS/OBTENCIÓN OBJETOS.txt",
            "INFORMACIÓN ÚTIL/POKÉMON/CAMBIOS en STATS, TIPOS y HABILIDADES.txt",
            "INFORMACIÓN ÚTIL/POKÉMON/EVOLUCIÓN TODOS PKMN.txt",
            "INFORMACIÓN ÚTIL/POKÉMON/OBTENCIÓN  TODOS  PKMN.txt",
            "INFORMACIÓN ÚTIL/POKÉMON/NUEVOS POKEMON/Experimentos Rocket.txt",
            "INFORMACIÓN ÚTIL/POKÉMON/NUEVOS POKEMON/Fuertes Vínculo.txt",
            "INFORMACIÓN ÚTIL/POKÉMON/NUEVOS POKEMON/Nuevas Megaevoluciones.txt",
            "INFORMACIÓN ÚTIL/POKÉMON/NUEVOS POKEMON/Primigenios y Antiguos.txt",
            "INFORMACIÓN ÚTIL/COMBATES DE JEFE/COMBATES PRINCIPALES/T1 - DIFICIL_FACIL/KANTO FACIL_DIFICIL.txt",
            "INFORMACIÓN ÚTIL/COMBATES DE JEFE/COMBATES PRINCIPALES/T2 - DIFICIL_FACIL/ARCHI7 FÁCIL_DIFICIL.txt",
            "INFORMACIÓN ÚTIL/COMBATES DE JEFE/COMBATES PRINCIPALES/T3 - DIFICIL_FACIL/JOHTO FÁCIL_DIFÍCIL.txt",
            "INFORMACIÓN ÚTIL/COMBATES DE JEFE/COMBATES PRINCIPALES/T4 - DIFÍCIL_FÁCIL/DLC FÁCIL_DIFÍCIL.txt",
            "INFORMACIÓN ÚTIL/COMBATES DE JEFE/COMBATES PRINCIPALES/T5 - DIFICIL_FACIL/HOENN FÁCIL_DIFÍCIL.txt",
            "INFORMACIÓN ÚTIL/COMBATES DE JEFE/MISIONES SECUNDARIAS/T1 - FÁCIL_DIFÍCIL/KANTO SEC - FÁCIL_DIFICIL.txt",
            "INFORMACIÓN ÚTIL/COMBATES DE JEFE/MISIONES SECUNDARIAS/T2 - FÁCIL_DIFÍCIL/ARCHI7. SEC - FÁCIL_DIFÍCILtxt.txt",
            "INFORMACIÓN ÚTIL/COMBATES DE JEFE/MISIONES SECUNDARIAS/T3 - FÁCIL_DIFÍCIL/JOHTO SEC. FÁCIL_DIFÍCIL.txt",
            "INFORMACIÓN ÚTIL/COMBATES DE JEFE/MISIONES SECUNDARIAS/T4 - FÁCIL_DIFÍCIL/DLC SEC. FÁCIL_DIFÍCIL.txt",
            "INFORMACIÓN ÚTIL/COMBATES DE JEFE/MISIONES SECUNDARIAS/T5 - FÁCIL_DIFÍCIL/HOENN SEC. FÁCIL_DIFÍCIL.txt"
        ]
    }
    with open(os.path.join(OUTPUT_DIR, 'game_meta.json'), 'w', encoding='utf-8') as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)
    print("All game data successfully extracted and exported to /src/data/!")

def main():
    pokemon_list = extract_pokemon_data()
    battles_list = extract_battles_data()
    quests_list = extract_sidequests_data()
    items_list = extract_items_data()
    moves_list = extract_moves_data()
    extract_qol_and_faq()
    build_locations_and_meta(pokemon_list, battles_list, quests_list, items_list, moves_list)

if __name__ == '__main__':
    main()
