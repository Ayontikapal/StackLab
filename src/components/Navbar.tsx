import React from 'react';
import { Layers } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDark,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-[#0c0d0e]/90 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link
            to="/converter"
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm group-hover:bg-indigo-700 transition-colors">
              <Layers className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-base text-neutral-900 dark:text-neutral-100 tracking-tight">
                StackLab
              </span>
            </div>
          </Link>

          {/* Navigation Tabs */}
          <nav className="hidden sm:flex items-center gap-1">
            <NavLink
              to="/converter"
              id="nav-converter"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${isActive
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`
              }
            >
              Converter
            </NavLink>
            <NavLink
              to="/evaluator"
              id="nav-evaluator"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${isActive
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`
              }
            >
              Evaluator
            </NavLink>
            <NavLink
              to="/how-it-works"
              id="nav-how-it-works"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${isActive
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`
              }
            >
              How It Works
            </NavLink>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />

          {/* GitHub Repository */}
          <a
            href="https://github.com/Ayontikapal"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Repository"
            className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};
