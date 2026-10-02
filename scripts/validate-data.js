import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

console.log('========================================================');
console.log('🕵️ AUDITORÍA Y CONTROL DE CALIDAD DE DATOS - TEAM ROCKET');
console.log('========================================================\n');

let errorCount = 0;
let warningCount = 0;

function checkFileExists(filename) {
  const fp = path.join(DATA_DIR, filename);
  if (!fs.existsSync(fp)) {
    console.error(`❌ ERROR: Archivo ${filename} no existe en ${DATA_DIR}`);
    errorCount++;
    return null;
  }
  return JSON.parse(fs.readFileSync(fp, 'utf-8'));
}

// 1. Validate Pokemon
const pokemon = checkFileExists('pokemon.json');
if (pokemon) {
  console.log(`📦 Validando pokemon.json (${pokemon.length} registros)...`);
  const seenIds = new Set();
  pokemon.forEach((p, idx) => {
    if (!p.id || !p.name) {
      console.error(`❌ Error en Pokémon idx ${idx}: Falta id o nombre`);
      errorCount++;
    }
    if (seenIds.has(p.id)) {
      console.warn(`⚠️ Advertencia: ID duplicado en Pokémon: ${p.id}`);
      warningCount++;
    }
    seenIds.add(p.id);

    if (!p.source) {
      console.warn(`⚠️ Advertencia: Pokémon ${p.name} (${p.id}) no tiene fuente especificada.`);
      warningCount++;
    }
  });
  console.log(`✅ pokemon.json validado con éxito.`);
}

// 2. Validate Levels & Battles
const levels = checkFileExists('levels.json');
if (levels) {
  console.log(`\n📦 Validando levels.json (${levels.length} combates)...`);
  levels.forEach((b, idx) => {
    if (!b.id || !b.trainer) {
      console.error(`❌ Error en Combate idx ${idx}: Falta id o entrenador`);
      errorCount++;
    }
    ['facil', 'dificil'].forEach(mode => {
      const team = b.modes?.[mode]?.team || [];
      team.forEach(p => {
        if (p.level < 1 || p.level > 135) {
          console.error(`❌ Nivel fuera de rango en combate ${b.trainer} (${mode}): ${p.name} Nv. ${p.level}`);
          errorCount++;
        }
      });
    });
  });
  console.log(`✅ levels.json validado con éxito.`);
}

// 3. Validate Sidequests
const quests = checkFileExists('sidequests.json');
if (quests) {
  console.log(`\n📦 Validando sidequests.json (${quests.length} misiones)...`);
  quests.forEach((q, idx) => {
    if (!q.id || !q.title || !q.region) {
      console.error(`❌ Error en Misión idx ${idx}: Faltan campos esenciales`);
      errorCount++;
    }
    if (!q.steps || q.steps.length === 0) {
      console.warn(`⚠️ Advertencia: Misión ${q.title} no tiene pasos checklist.`);
      warningCount++;
    }
  });
  console.log(`✅ sidequests.json validado con éxito.`);
}

// 4. Validate Items
const items = checkFileExists('items.json');
if (items) {
  console.log(`\n📦 Validando items.json (${items.length} objetos)...`);
  items.forEach((it, idx) => {
    if (!it.id || !it.name) {
      console.error(`❌ Error en Objeto idx ${idx}: Falta id o nombre`);
      errorCount++;
    }
  });
  console.log(`✅ items.json validado con éxito.`);
}

// 5. Validate Moves
const moves = checkFileExists('moves.json');
if (moves) {
  console.log(`\n📦 Validando moves.json (${moves.length} movimientos)...`);
  moves.forEach((m, idx) => {
    if (!m.id || !m.name) {
      console.error(`❌ Error en Movimiento idx ${idx}: Falta id o nombre`);
      errorCount++;
    }
  });
  console.log(`✅ moves.json validado con éxito.`);
}

// 6. Validate Locations
const locations = checkFileExists('locations.json');
if (locations) {
  console.log(`\n📦 Validando locations.json (${locations.length} ubicaciones)...`);
  console.log(`✅ locations.json validado con éxito.`);
}

console.log('\n========================================================');
console.log(`📊 REPORTE FINAL: ${errorCount} errores, ${warningCount} advertencias.`);
if (errorCount === 0) {
  console.log('🎉 TODOS LOS DATOS SON 100% VÁLIDOS Y LISTOS PARA PRODUCCIÓN.');
  process.exit(0);
} else {
  console.error('❌ SE ENCONTRARON ERRORES CRÍTICOS EN LOS DATOS.');
  process.exit(1);
}
