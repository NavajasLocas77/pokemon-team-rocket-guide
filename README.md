# 🚀 Pokémon Edición Team Rocket — Guía 100% Oficial & Base de Datos

Una aplicación web moderna, rápida y responsive diseñada para servir como la **Guía 100% Definitiva y Base de Datos Interactiva de Pokémon Edición Team Rocket (TRE 2026)**, creada por **Dragonsden** y colaboradores.

---

## 🎯 1. Filosofía y Fuente de Verdad

A diferencia de guías genéricas de internet, **toda la información de esta guía procede 100% de los archivos oficiales del juego** incluidos en el proyecto:
* `INFORMACIÓN ÚTIL/COMBATES DE JEFE/` (Temporadas 1 a 5, Fácil vs Difícil).
* `INFORMACIÓN ÚTIL/SECUNDARIAS TRE.pdf` (Misiones secundarias, recompensas y pasos).
* `INFORMACIÓN ÚTIL/POKÉMON/` (Obtención, estadísticas modificadas, evoluciones y nuevos Pokémon).
* `INFORMACIÓN ÚTIL/OBJETOS/` (Piedras evolutivas, cambios de balance, potenciadores y tiendas).
* `INFORMACIÓN ÚTIL/CAMBIOS en MOVIMIENTOS.txt` (Balance de movimientos).
* `INFORMACIÓN ÚTIL/QOLS.txt` y `Preguntas Frecuentes.txt` (Farmeo y FAQs).

> ⚠️ **Principio de exactitud:** Si un dato no se encuentra confirmado en los archivos del juego, se indica explícitamente como *"Información no disponible en los archivos analizados"* en lugar de inventar datos.

---

## ✨ 2. Características Principales

1. **⚖️ Combates de Jefe: Modo Normal vs Difícil**
   * Comparador lado a lado con equipos de 213 combates.
   * Niveles, objetos equipados, naturalezas, habilidades, movimientos, IVs y EVs reales.
   * Detección automática de diferencias (subida de nivel, nuevos movimientos, cambios de Pokémon).
   * Filtros por temporada (Kanto T1, Archi7 T2, Johto T3, DLC T4, Hoenn T5), tipo de combate y nivel.

2. **📜 Misiones Secundarias (Checklist Interactivo)**
   * Registro completo de las 27 misiones secundarias.
   * Sistema de checklist interactivo con guardado automático en `localStorage`.
   * Barra de progreso global (`X / 27 completadas`).
   * Pasos detallados, PNJs, ubicaciones, recompensas y prerrequisitos.

3. **🧬 Pokédex & Formas Especiales del Hackrom**
   * Base de datos de **1,241 Pokémon** y variantes.
   * Formas exclusivas: **Experimentos Rocket** (*Nidoking-X*, *Nidoqueen-Y*, *Electrode-Y*, *Tauros-X*), **Fuertes Vínculo** (*Rhyperior-&*, *Hypno-&*), **Nuevas Megaevoluciones** (*Mega Butterfree*, *Mega Flygon*, *Mega Milotic*) y **Pokémon Antiguos/Beta** (*Maroghost*, *Guardia*).
   * Comparativa visual de estadísticas base (Oficial vs Hackrom).

4. **🏆 Guía de Obtención de Pokémon**
   * Métodos reales: Salvaje, Misión Secundaria, Regalo/Inicial, Intercambio, Compra/Casino, Piedra Sagrada (Alola/Hisui), Piedra Rocket y Evoluciones modificadas.

5. **🗺️ Mapas & Ubicaciones**
   * 200 ubicaciones indexadas con sus Pokémon disponibles, combates registrados y misiones asociadas.

6. **🏪 Objetos, Piedras & Tiendas Rocket**
   * Catálogo de 402 objetos con piedras evolutivas, megas, objetos potenciadores y tiendas de bases clandestinas.

7. **🔍 Buscador Global Ultra-rápido (`Ctrl+K` / `Cmd+K`)**
   * Búsqueda instantánea de Pokémon, entrenadores, lugares, misiones, objetos y movimientos con navegación por teclado.

8. **🌓 Modo Oscuro / Claro**
   * Estética Rocket moderna con modo oscuro y modo claro persistente.

9. **🛡️ Botón "Ver Fuente"**
   * Cada dato técnico incluye un modal para consultar el archivo de origen y su estado de verificación.

---

## 🛠️ 3. Tecnologías Utilizadas

* **Framework:** React 18 + TypeScript
* **Bundler:** Vite 6
* **Estilos:** Tailwind CSS con tema personalizado Team Rocket
* **Iconos:** Lucide React
* **Enrutamiento:** React Router DOM v6
* **Extracción de Datos:** Python 3 + `pypdf`
* **Validación de Integridad:** Node.js (ES Modules)

---

## 📁 4. Estructura del Proyecto

```
/
├── .gitignore                      # Excluye ROMs (*.gba), dist y node_modules
├── index.html                      # Entry HTML con SEO y Open Graph
├── netlify.toml                    # Configuración de despliegue en Netlify
├── package.json                    # Dependencias y scripts
├── tailwind.config.js              # Configuración y colores Rocket
├── tsconfig.json                   # Configuración de TypeScript
├── vite.config.ts                  # Configuración de Vite y code splitting
├── public/
│   ├── _redirects                  # Soporte SPA para Netlify Router
│   ├── favicon.svg                 # Logo oficial Team Rocket en SVG
│   └── robots.txt                  # Directivas de indexación SEO
├── scripts/
│   ├── extract_data.py             # Script extractor de los archivos del juego
│   └── validate-data.js            # Validador de integridad y calidad de datos
└── src/
    ├── components/                 # Componentes UI (Navbar, Footer, Modales, Badges)
    ├── context/                    # ThemeContext (Dark / Light)
    ├── data/                       # Capa de datos JSON desacoplada
    │   ├── pokemon.json            # 1,241 Pokémon estructurados
    │   ├── levels.json             # 213 Combates Fácil vs Difícil
    │   ├── sidequests.json         # 27 Misiones secundarias
    │   ├── locations.json          # 200 Ubicaciones
    │   ├── items.json              # 402 Objetos y tiendas
    │   ├── moves.json              # 46 Movimientos modificados
    │   ├── qol.json                # Guías de farmeo y FAQs
    │   └── game_meta.json          # Metadatos y auditoría
    ├── pages/                      # Vistas de la aplicación
    │   ├── Home.tsx
    │   ├── LevelsPage.tsx
    │   ├── SidequestsPage.tsx
    │   ├── PokedexPage.tsx
    │   ├── ObtainingPage.tsx
    │   ├── LocationsPage.tsx
    │   ├── ItemsPage.tsx
    │   ├── MovesPage.tsx
    │   ├── QolPage.tsx
    │   ├── DataMetaPage.tsx
    │   └── AboutPage.tsx
    ├── types/                      # Definición de interfaces TypeScript
    └── utils/                      # Utilidades de tipos y estilos
```

---

## 🚀 5. Instalación y Ejecución Local

### Prerrequisitos
* **Node.js:** v18 o superior
* **Python:** v3.9 o superior con `pypdf` (sólo necesario si deseas re-extraer datos).

### Paso 1: Clonar e instalar dependencias
```bash
# Instalar dependencias del proyecto
npm install
```

### Paso 2: Ejecutar en modo desarrollo
```bash
npm run dev
```
La aplicación se abrirá en `http://localhost:3000`.

---

## ⚙️ 6. Scripts de Extracción y Validación

### Re-extraer datos del juego
Si actualizas los archivos del juego bajo `Pokemon TRE 2026 - Dragonsden/`:
```bash
npm run extract
```
Este comando ejecuta `python scripts/extract_data.py`, leyendo los `.txt`, `.pdf` y `.rtf` y regenerando los archivos JSON en `src/data/`.

### Validar calidad e integridad de los datos
```bash
npm run validate-data
```
Verifica:
* Cero IDs duplicados.
* Niveles dentro de rangos válidos.
* Misiones con checklist estructurado.
* Objetos y movimientos con fuentes válidas.

---

## 📦 7. Compilación para Producción

Para generar el bundle estático optimizado:
```bash
npm run build
```
Los archivos compilados se guardarán en la carpeta `dist/`.

Para previsualizar el build de producción localmente:
```bash
npm run preview
```

---

## 🌐 8. Despliegue en Netlify

El proyecto está 100% preparado para Netlify con:
1. `netlify.toml` preconfigurado con `publish = "dist"` y comando `npm run build`.
2. `public/_redirects` para que las rutas SPA (`/pokemon/pikachu`, `/niveles/dificil`, `/secundarias`, etc.) no produzcan errores 404 al recargar el navegador.

### Pasos para conectar a Netlify:
1. Sube el proyecto a tu repositorio de **GitHub**.
2. Entra a [Netlify](https://app.netlify.com/) y selecciona **"Add new site" > "Import an existing project"**.
3. Conecta tu cuenta de GitHub y selecciona este repositorio.
4. Netlify detectará automáticamente:
   * **Build command:** `npm run build`
   * **Publish directory:** `dist`
5. Haz clic en **Deploy Site**.

---

## 🔒 9. Protección de Archivos del Juego (Propiedad Intelectual)

Por seguridad legal y respeto a los autores:
* **Ningún archivo ROM (`*.gba`, `*.bin`, `*.sav`) se incluye en el repositorio de GitHub.**
* El archivo `.gitignore` excluye automáticamente todos los binarios de ROM.
* Para re-ejecutar el extractor localmente, el usuario debe colocar la carpeta oficial `Pokemon TRE 2026 - Dragonsden/` en la raíz del proyecto.

---

## 👥 10. Créditos y Agradecimientos

* **Colonelsalt:** Creador original de Pokémon Team Rocket Edition (Inglés).
* **Dragonsden:** Director y creador de Pokémon TRE 2026.
* **@kakarotto & @Annatar:** Inserción de Johto, mecánicas de IVs y ascensos.
* **Xiros:** Migración a Pokeemerald Expansion (RHH) y optimización del motor.
* **@KevinXDE & @Polar:** Decompilación y testing.
* **Alexander Daniel, Scar'99 & Cakezy:** Sprites, minis y animaciones.
* **Compumax:** Expansión de cajas del PC.

---
© 2026 Pokémon Edición Team Rocket — Creado con ❤️ para la comunidad de Hackroms.
