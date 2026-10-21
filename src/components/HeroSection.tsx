import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <section className="pt-6 pb-4 text-center max-w-3xl mx-auto px-4 flex flex-col items-center gap-3">
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium tracking-wide bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
        DATA STRUCTURES &bull; STACK VISUALIZER
      </div>

      {/* Main Heading */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
        Understand Expressions, One Stack at a Time.
      </h1>

      {/* Subtitle */}
      <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
        Convert infix expressions to postfix notation and visualize how a stack processes every operator, token, and operation in real time.
      </p>
    </section>
  );
};
