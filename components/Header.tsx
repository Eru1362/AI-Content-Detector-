
import React from 'react';
import { BrainCircuitIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          <BrainCircuitIcon className="h-8 w-8 text-indigo-500" />
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            AI Content Detector
          </h1>
        </div>
      </div>
    </header>
  );
};
