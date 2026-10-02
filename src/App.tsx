import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { Home } from './pages/Home';
import { LevelsPage } from './pages/LevelsPage';
import { SidequestsPage } from './pages/SidequestsPage';
import { PokedexPage } from './pages/PokedexPage';
import { ObtainingPage } from './pages/ObtainingPage';
import { LocationsPage } from './pages/LocationsPage';
import { ItemsPage } from './pages/ItemsPage';
import { MovesPage } from './pages/MovesPage';
import { QolPage } from './pages/QolPage';
import { DataMetaPage } from './pages/DataMetaPage';
import { AboutPage } from './pages/AboutPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0d0e12] text-slate-900 dark:text-slate-100 transition-colors duration-200">
          <Navbar />
          
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16">
            <Routes>
              {/* Home */}
              <Route path="/" element={<Home />} />

              {/* Levels & Boss Battles */}
              <Route path="/niveles" element={<LevelsPage initialMode="ambos" />} />
              <Route path="/niveles/normal" element={<LevelsPage initialMode="facil" />} />
              <Route path="/niveles/dificil" element={<LevelsPage initialMode="dificil" />} />

              {/* Sidequests */}
              <Route path="/secundarias" element={<SidequestsPage />} />

              {/* Pokedex */}
              <Route path="/pokemon" element={<PokedexPage />} />
              <Route path="/pokemon/:id" element={<PokedexPage />} />

              {/* Obtaining Guide */}
              <Route path="/obtencion" element={<ObtainingPage />} />

              {/* Maps & Locations */}
              <Route path="/mapas" element={<LocationsPage />} />
              <Route path="/mapas/:id" element={<LocationsPage />} />

              {/* Items & Moves & QoL */}
              <Route path="/objetos" element={<ItemsPage />} />
              <Route path="/movimientos" element={<MovesPage />} />
              <Route path="/qol" element={<QolPage />} />

              {/* Technical Data & About */}
              <Route path="/datos" element={<DataMetaPage />} />
              <Route path="/acerca-de" element={<AboutPage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};
