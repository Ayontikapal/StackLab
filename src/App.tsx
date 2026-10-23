import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ConverterPage } from './pages/ConverterPage';
import { EvaluatorPage } from './pages/EvaluatorPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { sounds } from './components/SoundEffects';
import { Binary, Calculator, BookOpen } from 'lucide-react';
import { MobileBottomNav } from './components/MobileBottomNav';

const AppLayout: React.FC = () => {
  // Theme state: light by default
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('stacklab_theme');
      if (saved) return saved === 'dark';
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('stacklab_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('stacklab_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Sound & Reduced Motion Preferences
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('stacklab_sound') === 'true';
    }
    return false;
  });

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      sounds.setEnabled(next);
      localStorage.setItem('stacklab_sound', String(next));
      return next;
    });
  };

  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  const toggleReducedMotion = () => setReducedMotion((prev) => !prev);

  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0d0e] text-neutral-900 dark:text-neutral-100 flex flex-col transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar isDark={isDark} onToggleTheme={toggleTheme} />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 pt-3 sm:pt-6 pb-24 md:pb-8 flex flex-col gap-4 sm:gap-6">
        {/* Compact Hero Section */}
        <HeroSection />

        {/* Workspace Route Switcher Tabs */}
        <div className="flex items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800/80 pb-2.5 sm:pb-3">
          <div className="flex items-center gap-1 sm:gap-1.5 p-1 rounded-xl bg-neutral-100/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 w-full sm:w-auto overflow-x-auto no-scrollbar">
            <NavLink
              to="/converter"
              id="workspace-tab-converter"
              className={({ isActive }) =>
                `flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${isActive
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`
              }
            >
              <Binary className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="hidden xs:inline">Infix &rarr; Postfix</span>
              <span className="xs:hidden">Converter</span>
            </NavLink>

            <NavLink
              to="/evaluator"
              id="workspace-tab-evaluator"
              className={({ isActive }) =>
                `flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${isActive
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`
              }
            >
              <Calculator className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="hidden xs:inline">Postfix Evaluator</span>
              <span className="xs:hidden">Evaluator</span>
            </NavLink>

            <NavLink
              to="/how-it-works"
              id="workspace-tab-how-it-works"
              className={({ isActive }) =>
                `flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${isActive
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`
              }
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="hidden xs:inline">How It Works</span>
              <span className="xs:hidden">Guide</span>
            </NavLink>
          </div>

          <div className="text-[11px] font-mono text-neutral-500 hidden md:block">
            {location.pathname.startsWith('/evaluator')
              ? 'RPN Stack Machine'
              : location.pathname.startsWith('/how-it-works')
                ? 'Algorithm Guide & Complexity'
                : 'Shunting-Yard Algorithm'}
          </div>
        </div>

        {/* Separate Route Pages */}
        <Routes>
          <Route path="/" element={<Navigate to="/converter" replace />} />
          <Route
            path="/converter"
            element={
              <ConverterPage
                soundEnabled={soundEnabled}
                onToggleSound={toggleSound}
                reducedMotion={reducedMotion}
                onToggleReducedMotion={toggleReducedMotion}
              />
            }
          />
          <Route
            path="/evaluator"
            element={
              <EvaluatorPage
                soundEnabled={soundEnabled}
                onToggleSound={toggleSound}
                reducedMotion={reducedMotion}
                onToggleReducedMotion={toggleReducedMotion}
              />
            }
          />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="*" element={<Navigate to="/converter" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0c0d0e] py-6 px-4 mt-auto text-xs text-neutral-500 mb-16 md:mb-0">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">StackLab</span>
            <span>&bull;</span>
            <span>Stack-Based Expression Visualizer</span>
          </div>
          <div className="font-mono text-[11px] text-neutral-400">
            Built with &bull; React, TypeScript &amp; Motion
          </div>
        </div>
      </footer>

      {/* App-like Fixed Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;
