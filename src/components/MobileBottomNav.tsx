import React from 'react';
import { NavLink } from 'react-router-dom';
import { Binary, Calculator, BookOpen } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/92 dark:bg-[#0c0d0e]/92 backdrop-blur-xl border-t border-neutral-200/90 dark:border-neutral-800/90 pb-safe shadow-lg transition-colors"
    >
      <div className="flex items-center justify-around h-15 px-2">
        <NavLink
          to="/converter"
          id="mobile-nav-converter"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full py-1 px-2 rounded-xl transition-all select-none ${
              isActive
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`p-1 rounded-lg transition-all ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 scale-105'
                    : 'bg-transparent'
                }`}
              >
                <Binary className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium tracking-tight mt-0.5">
                Converter
              </span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/evaluator"
          id="mobile-nav-evaluator"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full py-1 px-2 rounded-xl transition-all select-none ${
              isActive
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`p-1 rounded-lg transition-all ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 scale-105'
                    : 'bg-transparent'
                }`}
              >
                <Calculator className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium tracking-tight mt-0.5">
                Evaluator
              </span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/how-it-works"
          id="mobile-nav-how-it-works"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full py-1 px-2 rounded-xl transition-all select-none ${
              isActive
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`p-1 rounded-lg transition-all ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 scale-105'
                    : 'bg-transparent'
                }`}
              >
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium tracking-tight mt-0.5">
                Guide
              </span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
};
